import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 flex items-center justify-center">
            <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-4xl">404</span>
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Page not found
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
          >
            Go back home
          </Link>
          
          <div className="text-sm text-gray-500">
            Or try these helpful links:
          </div>
          
          <div className="flex flex-col space-y-2">
            <Link href="/about" className="text-blue-600 hover:text-blue-800">
              Learn about EntreHive
            </Link>
            <Link href="/services" className="text-blue-600 hover:text-blue-800">
              Explore our services
            </Link>
            <Link href="/signup" className="text-blue-600 hover:text-blue-800">
              Join the community
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
