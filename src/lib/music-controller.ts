export type MusicStatus = "unavailable" | "off" | "loading" | "playing" | "paused" | "resume";
type Claim = { owner: string; at: number };
const STORAGE_KEY = "ca-music-owner";
const PREFERENCE_KEY = "ca-music-preference";

/** One controller and one HTMLAudioElement per invitation. No audio is loaded before intent. */
export class MusicController {
  private status: MusicStatus;
  private listeners = new Set<() => void>();
  private audio: HTMLAudioElement | null;
  private desired = false;
  private interrupted = false;
  private disposed = false;
  private request = 0;
  private lastClaim: Claim | null = null;
  private channel: BroadcastChannel | null = null;
  private owner = "";
  private releaseLock: (() => void) | null = null;
  private cleanups: (() => void)[] = [];

  constructor(src: string | null, volume = 0.35) {
    this.audio = src ? new Audio(src) : null;
    this.status = src ? "off" : "unavailable";
    if (!this.audio) return;
    this.owner = crypto.randomUUID();
    this.audio.preload = "none";
    this.audio.loop = true;
    this.audio.volume = Math.max(0, Math.min(1, volume));
    const listen = (target: EventTarget, event: string, fn: EventListener) => {
      target.addEventListener(event, fn);
      this.cleanups.push(() => target.removeEventListener(event, fn));
    };
    listen(this.audio, "playing", () => {
      if (!this.desired || document.hidden || this.disposed) this.audio?.pause();
      else this.setStatus("playing");
    });
    listen(this.audio, "pause", () => {
      this.unlock();
      if (this.status !== "unavailable") this.setStatus(this.desired ? "resume" : "paused");
    });
    listen(this.audio, "waiting", () => this.setStatus(this.desired ? "loading" : "paused"));
    listen(this.audio, "error", () => { this.desired = false; this.interrupted = false; this.unlock(); this.setStatus("unavailable"); });
    listen(this.audio, "volumechange", () => {
      if (this.audio?.muted || this.audio?.volume === 0) this.pauseManually();
    });
    listen(document, "visibilitychange", () => document.hidden ? this.suspend() : this.restore());
    listen(window, "pagehide", () => this.suspend());
    listen(window, "pageshow", () => { if (!document.hidden) this.restore(); });
    listen(document, "freeze", () => this.suspend());
    listen(document, "resume", () => { if (!document.hidden) this.restore(); });
    listen(window, "storage", (event) => {
      const e = event as StorageEvent;
      if (e.key === STORAGE_KEY && e.newValue) { try { this.receiveClaim(JSON.parse(e.newValue)); } catch { /* Private storage may be unavailable. */ } }
    });
    try {
      this.channel = new BroadcastChannel("ca-invitation-music");
      this.channel.onmessage = e => this.receiveClaim(e.data);
    } catch { /* The storage-event fallback still coordinates supported browsers. */ }
  }

  getSnapshot = () => this.status;
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  private setStatus(status: MusicStatus) { if (status !== this.status) { this.status = status; this.listeners.forEach(fn => fn()); } }
  private preference(value?: string) {
    try { if (value) sessionStorage.setItem(PREFERENCE_KEY, value); return sessionStorage.getItem(PREFERENCE_KEY); } catch { return null; }
  }
  open = () => { if (this.preference() !== "paused") void this.play(); };
  toggle = () => { if (this.desired && (this.status === "playing" || this.status === "loading")) this.pauseManually(); else { this.preference("on"); void this.play(); } };

  private unlock() { this.releaseLock?.(); this.releaseLock = null; }
  private receiveClaim(claim: Claim) {
    if (!claim || typeof claim.owner !== "string" || !Number.isFinite(claim.at) || claim.owner === this.owner) return;
    const newer = !this.lastClaim || claim.at > this.lastClaim.at || (claim.at === this.lastClaim.at && claim.owner > this.lastClaim.owner);
    if (!newer) return;
    this.lastClaim = claim;
    if (this.desired) {
      this.desired = false;
      this.interrupted = false;
      this.request++;
      this.audio?.pause();
      this.unlock();
      this.setStatus("resume");
    }
  }
  private announce() {
    const claim = { owner: this.owner, at: Math.max(Date.now(), (this.lastClaim?.at ?? 0) + 1) };
    this.lastClaim = claim;
    this.channel?.postMessage(claim);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(claim)); } catch { /* BroadcastChannel remains available. */ }
  }
  private async play() {
    if (!this.audio || this.disposed || this.status === "unavailable") return;
    this.desired = true;
    this.interrupted = false;
    const request = ++this.request;
    if (document.hidden) { this.desired = false; this.setStatus("resume"); return; }
    this.setStatus("loading");
    this.announce();
    const start = async () => {
      if (request !== this.request || !this.desired || this.disposed || document.hidden) return;
      try {
        await this.audio!.play();
        if (request !== this.request || !this.desired || document.hidden || this.disposed) this.audio?.pause();
      } catch {
        if (request === this.request && !this.disposed) { this.unlock(); this.setStatus("resume"); }
      }
    };
    // Web Locks holds exclusive playback across tabs. BroadcastChannel requests handoff;
    // storage events provide a fallback where BroadcastChannel is unavailable.
    if (navigator.locks) {
      void navigator.locks.request("ca-invitation-audio", { mode: "exclusive" }, async () => {
        if (request !== this.request || !this.desired || this.disposed || document.hidden) return;
        await new Promise<void>(resolve => {
          this.releaseLock = resolve;
          void start().then(() => { if (this.status !== "playing") this.unlock(); });
        });
      }).catch(() => { if (request === this.request) void start(); });
    } else await start();
  }
  pauseManually = () => {
    this.preference("paused"); this.desired = false; this.interrupted = false; this.request++;
    this.audio?.pause(); this.unlock(); this.setStatus(this.audio ? "paused" : "unavailable");
  };
  suspend = () => {
    // Duplicate visibility/pagehide/freeze events must not erase the first interruption.
    this.interrupted = this.interrupted || (this.desired && this.status === "playing");
    this.request++;
    this.audio?.pause(); this.unlock();
    if (this.desired && this.audio) this.setStatus("resume");
  };
  restore = () => {
    if (!document.hidden && this.interrupted && this.desired && !this.disposed) {
      this.interrupted = false; void this.play();
    }
  };
  dispose = () => {
    this.disposed = true; this.desired = false; this.request++;
    this.audio?.pause(); this.unlock();
    this.cleanups.forEach(fn => fn()); this.channel?.close(); this.listeners.clear();
    this.audio?.removeAttribute("src"); this.audio?.load();
  };
}
