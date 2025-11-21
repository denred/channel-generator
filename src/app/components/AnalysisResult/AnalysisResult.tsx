export default function AnalysisResult({ data }: { data: any }) {
  return (
    <section className="mt-6 space-y-3 rounded-xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Analysis Result</h2>
      <pre className="rounded-lg bg-gray-100 p-4 text-sm">{JSON.stringify(data, null, 2)}</pre>
    </section>
  );
}
