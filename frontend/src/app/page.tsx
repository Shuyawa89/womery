import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-black dark:to-zinc-900 font-sans">
      <main className="flex flex-col items-center justify-center px-8 py-16 max-w-2xl w-full">
        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 text-center">
          Womery
        </h1>

        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-12 text-center max-w-md">
          A simple and elegant app to capture your thoughts and ideas
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <Link
            href="/quick-input"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-lg shadow-blue-600/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Quick Input
          </Link>

          <Link
            href="/inbox"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-50 font-medium rounded-xl transition-colors border-2 border-zinc-200 dark:border-zinc-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            Inbox
          </Link>
        </div>

        {/* Features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg mb-3">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">Fast</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Capture thoughts instantly</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg mb-3">
              <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">Simple</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Minimal and focused</p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg mb-3">
              <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-50 mb-1">Private</h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Your data stays yours</p>
          </div>
        </div>
      </main>
    </div>
  );
}
