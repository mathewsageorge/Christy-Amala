/** Keep professional titles proportionate within the large display names. */
export function CoupleName({ name }: { name: string }) {
  return name.startsWith("Dr. ") ? <><small className="doctor-title">Dr.</small>{" "}{name.slice(4)}</> : <>{name}</>;
}
