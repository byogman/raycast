
export function abbreviateNames(names) {
  return names.map(({ full_name }) => {
    const [last, first] = full_name.split(", ");
    return `${first.charAt(0)}. ${last}`;
  }).join(", ");
}

export function displayCollaborations(collaborations) {
  return collaborations.map(obj => obj.value).join(', ');
}