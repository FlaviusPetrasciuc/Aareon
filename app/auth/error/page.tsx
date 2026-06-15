export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
      <p className="text-gray-600 mb-8">
        There was an error during the authentication process. Please try again.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Return Home
      </a>
    </div>
  )
}
