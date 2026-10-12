import { galleryImages } from "./life-at-next360-data";

export default function LifeGallery() {
  return (
    <section className="bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-green-primary uppercase mb-3">
            Inside Next360
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Moments from everyday life
          </h2>
          <p className="text-lg text-gray-600">
            A look at the people, places, and moments that make up everyday
            life at Next360.
          </p>
        </div>

        {/* Desktop: Asymmetric grid */}
        <div className="hidden md:block">
          <div className="grid grid-cols-3 gap-4">
            {/* Large image - spans 2 rows */}
            <div className="row-span-2">
              <div className="h-full rounded-xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-8">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-xl bg-green-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="w-7 h-7 text-green-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21"
                      />
                    </svg>
                  </div>
                  {/* Replace with approved Next360 image */}
                  <p className="text-xs font-medium text-gray-500">
                    {galleryImages[0].caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Top right */}
            <div>
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="w-6 h-6 text-green-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5"
                      />
                    </svg>
                  </div>
                  {/* Replace with approved Next360 image */}
                  <p className="text-xs font-medium text-gray-500">
                    {galleryImages[1].caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Middle right */}
            <div>
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="w-6 h-6 text-green-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                      />
                    </svg>
                  </div>
                  {/* Replace with approved Next360 image */}
                  <p className="text-xs font-medium text-gray-500">
                    {galleryImages[2].caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom left */}
            <div>
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="w-6 h-6 text-green-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                      />
                    </svg>
                  </div>
                  {/* Replace with approved Next360 image */}
                  <p className="text-xs font-medium text-gray-500">
                    {galleryImages[3].caption}
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom right */}
            <div>
              <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden group">
                <div className="text-center p-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-primary/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <svg
                      className="w-6 h-6 text-green-primary"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
                      />
                    </svg>
                  </div>
                  {/* Replace with approved Next360 image */}
                  <p className="text-xs font-medium text-gray-500">
                    {galleryImages[4].caption}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: Simple 2-column grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {galleryImages.map((image, index) => (
              <div
                key={image.caption}
                className={`${index === 0 ? "col-span-2" : ""}`}
              >
                <div
                  className={`${
                    index === 0 ? "aspect-[16/9]" : "aspect-square"
                  } rounded-xl bg-gradient-to-br from-green-50 to-gray-100 border border-gray-200 flex items-center justify-center`}
                >
                  <div className="text-center p-4">
                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-green-primary/10 flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3H21m-3.75 3H21"
                        />
                      </svg>
                    </div>
                    {/* Replace with approved Next360 image */}
                    <p className="text-[10px] font-medium text-gray-500">
                      {image.caption}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
