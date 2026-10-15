/** Keep the professional title attached while preserving the invitation's hierarchy. */
export function DisplayName({ name }: { name: string }) {
  return <span className="display-name"><span className="doctor-title">Dr.</span>{" "}{name.replace(/^Dr\.\s*/, "")}</span>;
}
