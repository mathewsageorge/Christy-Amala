import assert from "node:assert/strict";
import test from "node:test";
import { MusicController } from "../src/lib/music-controller";

class MemoryStorage {
  data = new Map<string,string>();
  getItem(key:string) { return this.data.get(key) ?? null; }
  setItem(key:string,value:string) { this.data.set(key,value); }
}
class FakeAudio extends EventTarget {
  static instances: FakeAudio[] = [];
  paused = true; currentTime = 17; volume = .35; muted = false; loop = false; preload = "none";
  fail = false; plays = 0;
  constructor(public src: string) { super(); FakeAudio.instances.push(this); }
  async play() { this.plays++; if(this.fail) throw new Error("NotAllowedError"); this.paused=false; this.dispatchEvent(new Event("playing")); }
  pause() { if(!this.paused) { this.paused=true; this.dispatchEvent(new Event("pause")); } }
  removeAttribute() {} load() {}
}
class FakeChannel {
  static channels = new Set<FakeChannel>();
  onmessage: ((event: {data: unknown}) => void) | null = null;
  constructor() { FakeChannel.channels.add(this); }
  postMessage(data: unknown) { for(const channel of FakeChannel.channels) if(channel !== this) channel.onmessage?.({data}); }
  close() { FakeChannel.channels.delete(this); }
}
const tick = () => new Promise<void>(resolve => setImmediate(resolve));
function setup(withLocks = false) {
  FakeAudio.instances=[]; FakeChannel.channels.clear();
  const document = Object.assign(new EventTarget(), {hidden:false});
  const window = new EventTarget();
  let queue = Promise.resolve();
  const locks = {request: (_name: string,_options: unknown, callback: () => Promise<void>) => {
    const task=queue.then(callback); queue=task.catch(()=>{}); return task;
  }};
  for(const [key,value] of Object.entries({document,window,Audio:FakeAudio,BroadcastChannel:FakeChannel,sessionStorage:new MemoryStorage(),localStorage:new MemoryStorage(),navigator:withLocks ? {locks} : {}})) Object.defineProperty(globalThis,key,{value,configurable:true,writable:true});
  return {document,window,hidden() { document.hidden=true; document.dispatchEvent(new Event("visibilitychange")); },visible() { document.hidden=false; document.dispatchEvent(new Event("visibilitychange")); }};
}

test("nothing autoplays before opening and no unavailable audio player is created", async () => {
  setup(); const absent=new MusicController(null); absent.open(); assert.equal(FakeAudio.instances.length,0); assert.equal(absent.getSnapshot(),"unavailable"); absent.dispose();
  const player=new MusicController("/licensed.mp3"); const audio=FakeAudio.instances[0]; assert.equal(audio.plays,0); player.open(); await tick(); assert.equal(player.getSnapshot(),"playing"); player.dispose();
});
test("hide, pagehide and freeze pause immediately; returning resumes the same position only once", async () => {
  const env=setup(); const player=new MusicController("/licensed.mp3"); player.open(); await tick(); const audio=FakeAudio.instances[0];
  env.hidden(); assert.equal(audio.paused,true); env.window.dispatchEvent(new Event("pagehide")); env.document.dispatchEvent(new Event("freeze"));
  env.visible(); env.window.dispatchEvent(new Event("pageshow")); env.document.dispatchEvent(new Event("resume")); await tick();
  assert.equal(audio.plays,2); assert.equal(audio.currentTime,17); assert.equal(player.getSnapshot(),"playing"); player.dispose();
});
test("manual pause and mute survive leaving, returning, and another opening", async () => {
  const env=setup(); const player=new MusicController("/licensed.mp3"); player.open(); await tick(); const audio=FakeAudio.instances[0];
  player.toggle(); env.hidden(); env.visible(); player.open(); await tick(); assert.equal(audio.plays,1); assert.equal(audio.paused,true);
  player.toggle(); await tick(); audio.muted=true; audio.dispatchEvent(new Event("volumechange")); env.hidden(); env.visible(); await tick(); assert.equal(audio.plays,2); assert.equal(audio.paused,true); player.dispose();
});
test("browser-blocked resume exposes a retry instead of claiming music is playing", async () => {
  const env=setup(); const player=new MusicController("/licensed.mp3"); player.open(); await tick(); const audio=FakeAudio.instances[0];
  env.hidden(); audio.fail=true; env.visible(); await tick(); assert.equal(player.getSnapshot(),"resume"); assert.equal(audio.paused,true);
  audio.fail=false; player.toggle(); await tick(); assert.equal(player.getSnapshot(),"playing"); player.dispose();
});
test("two invitations hand over playback, including with an exclusive Web Lock", async () => {
  for(const withLocks of [false,true]) {
    const env=setup(withLocks); const first=new MusicController("/licensed.mp3"); const second=new MusicController("/licensed.mp3");
    first.open(); await tick(); second.open(); await tick(); await tick();
    assert.equal(FakeAudio.instances.filter(audio=>!audio.paused).length,1); assert.equal(first.getSnapshot(),"resume"); assert.equal(second.getSnapshot(),"playing");
    env.hidden(); env.visible(); await tick(); assert.equal(FakeAudio.instances.filter(audio=>!audio.paused).length,1);
    first.dispose(); second.dispose();
  }
});
test("audio errors and teardown stop playback and leave no lifecycle listeners", async () => {
  const env=setup(); const player=new MusicController("/licensed.mp3"); player.open(); await tick(); const audio=FakeAudio.instances[0];
  audio.pause(); audio.dispatchEvent(new Event("error")); assert.equal(player.getSnapshot(),"unavailable"); player.dispose(); env.hidden(); env.visible(); assert.equal(audio.paused,true); assert.equal(audio.plays,1);
});
