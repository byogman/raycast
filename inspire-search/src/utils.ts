
export function abbreviateNames(names) {
  return names.map(({ full_name }) => {
    const [last, first] = full_name.split(", ");
    return `${first.charAt(0)}. ${last}`;
  }).join(", ");
}