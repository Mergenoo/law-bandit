import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h1 className="text-6xl font-bold text-gray-900 mb-6">Law Bandit</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Streamline your legal practice with our comprehensive case management
          platform. Organize cases, manage clients, and boost your productivity.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/login"
            className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}
