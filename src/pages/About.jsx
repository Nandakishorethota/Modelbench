import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 px-4 sm:px-6 py-12">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-white">About this bench</h1>
        <p className="text-zinc-400 leading-relaxed">
          This site helps you compare how two AI assistants might answer the same
          search-style prompt. The default experience uses deterministic demo text
          so designers and developers can ship the layout first, then connect real
          models behind a server you control.
        </p>
        <p className="text-zinc-400 leading-relaxed">
          For production, keep API keys on the server and handle user data according
          to your privacy policy.
        </p>
        <Link
          to="/compare"
          className="inline-flex text-sm font-semibold text-emerald-400 hover:text-emerald-300"
        >
          Open the compare tool →
        </Link>
      </div>
    </div>
  );
}
