"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function JobSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Connect to backend API when available
    // Build query params from state and navigate to /careers/jobs
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    if (department) params.set("department", department);
    if (experience) params.set("experience", experience);
    router.push(`/careers/jobs?${params.toString()}`);
  };

  return (
    <section className="relative z-10 -mt-8 sm:-mt-12 pb-16" id="job-search">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Find your next opportunity
            </h2>
            <p className="text-gray-600">
              Search open roles across Next360.
            </p>
          </div>

          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Keyword Input */}
              <div className="lg:col-span-2">
                <label htmlFor="keyword" className="sr-only">
                  Search by job title, skill or keyword
                </label>
                <input
                  id="keyword"
                  type="text"
                  placeholder="Search by job title, skill or keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent placeholder:text-gray-400"
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="sr-only">
                  Location
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent text-gray-700 bg-white appearance-none"
                >
                  <option value="">Location</option>
                  <option value="bangalore">Bangalore</option>
                  <option value="delhi">Delhi NCR</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="hyderabad">Hyderabad</option>
                  <option value="remote">Remote</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label htmlFor="department" className="sr-only">
                  Department
                </label>
                <select
                  id="department"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent text-gray-700 bg-white appearance-none"
                >
                  <option value="">Department</option>
                  <option value="technology">Technology</option>
                  <option value="product">Product</option>
                  <option value="operations">Operations</option>
                  <option value="business">Business</option>
                </select>
              </div>

              {/* Experience */}
              <div>
                <label htmlFor="experience" className="sr-only">
                  Experience
                </label>
                <select
                  id="experience"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent text-gray-700 bg-white appearance-none"
                >
                  <option value="">Experience</option>
                  <option value="fresher">Fresher</option>
                  <option value="0-2">0-2 years</option>
                  <option value="2-5">2-5 years</option>
                  <option value="5-10">5-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <button
                type="submit"
                className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                Search Jobs
              </button>
              <Link
                href="/careers/jobs"
                className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
              >
                View all jobs →
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
