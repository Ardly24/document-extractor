import { useState } from 'react';
import { processDocument } from '/utils/extractor';

const initialFormState = {
  file: null,
  firstName: '',
  lastName: '',
  dob: '',
  processingMethod: 'standard',
};

export default function Home() {
  const [formState, setFormState] = useState(initialFormState);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormState((prevState) => ({ ...prevState, file: e.target.files?.[0] || null }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formState.file || !formState.firstName || !formState.lastName || !formState.dob) {
      setError('All fields are required, including the file.');
      return;
    }
    try {
      setLoading(true);
      const data = await processDocument(formState);
      localStorage.setItem('lastResult', JSON.stringify(data));
      window.location.href = '/results';
    } catch (err) {
      setError(err.message || 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow p-6 space-y-4 w-full max-w-md md:max-w-lg lg:max-w-xl">
        <div className="text-2xl font-bold mb-4">Document Extractor</div>
        <div>
          <label className="block text-sm font-medium mb-1">File *</label>
          <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">First Name *</label>
            <input
              name="firstName"
              className="w-full rounded-xl border px-3 py-2"
              value={formState.firstName}
              onChange={handleInputChange}
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last Name *</label>
            <input
              name="lastName"
              className="w-full rounded-xl border px-3 py-2"
              value={formState.lastName}
              onChange={handleInputChange}
              placeholder="Doe"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Date of Birth *</label>
          <input
            type="date"
            name="dob"
            className="w-full rounded-xl border px-3 py-2"
            value={formState.dob}
            onChange={handleInputChange}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Processing Method</label>
          <select
            name="method"
            className="w-full rounded-xl border px-3 py-2"
            value={formState.processingMethod}
            onChange={handleInputChange}
          >
            <option value="standard">Standard Extraction</option>
            <option value="ai">AI Extraction (Gemini)</option>
          </select>
        </div>
        <button type="submit" disabled={loading} className="rounded-2xl px-4 py-2 bg-black text-white hover:bg-gray-500 duration-200 disabled:opacity-50">
          {loading ? 'Processing…' : 'Upload & Process'}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}