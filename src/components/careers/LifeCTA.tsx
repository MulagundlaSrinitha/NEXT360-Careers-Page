import Link from "next/link";

export default function LifeCTA() {
  return (
    <section className="bg-green-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready for your next chapter?
        </h2>
        <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
          Explore current opportunities and find a role at Next360.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/careers/jobs"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-green-primary bg-white hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-primary"
          >
            Explore Open Roles
          </Link>
          <Link
            href="/careers"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white hover:text-green-100 transition-colors"
          >
            Back to Careers
          </Link>
        </div>
      </div>
    </section>
  );
}
