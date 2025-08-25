// Client-side helper to call the /api/process endpoint.
export async function processDocument({ file, firstName, lastName, dob, method }) {
const formData = new FormData();
formData.append('file', file);
formData.append('firstName', firstName);
formData.append('lastName', lastName);
formData.append('dob', dob);
formData.append('method', method);


const res = await fetch('/api/process', {
method: 'POST',
body: formData
});


if (!res.ok) { 
const err = await res.json().catch(() => ({}));
throw new Error(err?.error || `Server error (${res.status})`);
}

return res.json();
}