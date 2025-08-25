// Utility functions
export function buildFullName(first, last) {
return `${String(first || '').trim()} ${String(last || '').trim()}`.trim();
}

export function calculateAge(dob) {
  // dob expected as yyyy-mm-dd from the form
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age <= 0) return "0";
  return age === 1 ? "1 year" : `${age} years`;
}