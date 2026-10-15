/** Render the title and name as one typographic line. */
export function DisplayName({ name }: { name: string }) {
  return <span className="display-name">{name}</span>;
}
