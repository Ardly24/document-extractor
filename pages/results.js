import { useEffect, useState } from 'react';

export default function Results() {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem('lastResult');
    if (data) setResult(JSON.parse(data));
  }, []);

  if (!result) return <div className="p-6">No results found.</div>;

  return (
    <div className="bg-white rounded-2xl shadow p-6 space-y-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-2xl font-bold mb-2">Results</h2>
        <a href="/" className="rounded-2xl px-4 py-2 bg-black text-white disabled:opacity-50 hover:bg-gray-500 duration-200">
          Back
        </a>
      </div>
      <div><strong>Full Name:</strong> {result.fullName}</div>
      <div><strong>Age:</strong> {result.age}</div>
      {result.aiData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <strong>Raw Extracted Text:</strong>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{result.rawText}</pre>
          </div>
          <div>
            <strong>AI Extracted Data:</strong>
            <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{typeof result.aiData === 'string' ? result.aiData : JSON.stringify(result.aiData, null, 2)}</pre>
          </div>
        </div>
      ) : (
        <div>
          <strong>Raw Extracted Text:</strong>
          <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{result.rawText}</pre>
        </div>
      )}
    </div>
  );
}