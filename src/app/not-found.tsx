export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">404 - Page Not Found</h2>
        <p className="mb-4">The page you are looking for does not exist.</p>
        <a href="/" className="text-blue-600 underline">
          Go back home
        </a>
      </div>
    </div>
  );
}