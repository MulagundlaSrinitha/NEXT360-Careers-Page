"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface StatusBreakdown {
  status: string;
  label: string;
  count: number;
  color: string;
  dotColor: string;
}

interface RecentApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  candidateEmail: string;
  candidateFirstName: string;
  candidateLastName: string;
  status: string;
  appliedAt: string;
}

interface AttentionItem {
  id: string;
  title: string;
  reason: string;
}

interface DashboardData {
  openJobs: number;
  totalApplications: number;
  newApplications: number;
  interviewCount: number;
  statusBreakdown: StatusBreakdown[];
  recentApplications: RecentApplication[];
  jobsNeedingAttention: AttentionItem[];
}

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  applied: { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-400" },
  under_review: { bg: "bg-blue-50", text: "text-blue-700", dot: "bg-blue-500" },
  interview: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-500" },
  selected: { bg: "bg-green-50", text: "text-green-700", dot: "bg-green-600" },
  rejected: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
  withdrawn: { bg: "bg-gray-50", text: "text-gray-500", dot: "bg-gray-300" },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.applied;
  const label = status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} aria-hidden="true" />
      {label}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
      <div className="h-3 bg-gray-200 rounded w-20 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-16 mb-2" />
      <div className="h-3 bg-gray-100 rounded w-24" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 animate-pulse">
      <div className="p-6 border-b border-gray-100">
        <div className="h-5 bg-gray-200 rounded w-40" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="px-6 py-4 flex items-center gap-4">
            <div className="h-4 bg-gray-200 rounded w-32" />
            <div className="h-4 bg-gray-200 rounded w-40 hidden sm:block" />
            <div className="h-6 bg-gray-200 rounded-full w-20" />
            <div className="h-4 bg-gray-200 rounded w-24 ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminCareersDashboardClient() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function fetchDashboard() {
      try {
        const res = await fetch("/api/admin/careers/dashboard");
        if (!res.ok) throw new Error("Failed to load");
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }
    fetchDashboard();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load careers data</h2>
            <p className="text-gray-500 mb-6">Please try again.</p>
            <button
              type="button"
              onClick={() => { setError(false); setLoading(true); window.location.reload(); }}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-wider text-green-primary uppercase mb-1">
              CAREERS
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Careers Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage jobs, applications, candidates, interviews, and recruitment activity from one place.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/careers/applications"
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              View Applications
            </Link>
            <Link
              href="/admin/careers/jobs/create"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Job
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Open Jobs</p>
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-primary" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{data.openJobs}</p>
              <p className="text-xs text-gray-400 mt-1">Currently active</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Total Applications</p>
                <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{data.totalApplications}</p>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">New Applications</p>
                <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{data.newApplications}</p>
              <p className="text-xs text-gray-400 mt-1">Last 7 days</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-medium text-gray-500">Interviews</p>
                <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900">{data.interviewCount}</p>
              <p className="text-xs text-gray-400 mt-1">In progress</p>
            </div>
          </div>
        ) : null}

        {/* Applications Overview + Jobs Needing Attention */}
        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-48 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-3 bg-gray-200 rounded w-24" />
                    <div className="flex-1 h-3 bg-gray-100 rounded" />
                    <div className="h-5 bg-gray-200 rounded w-8" />
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-44 mb-6" />
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-gray-100 rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {/* Applications by Status */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Applications by Status</h2>
              <div className="space-y-3">
                {data.statusBreakdown.map((item) => {
                  const maxCount = Math.max(...data.statusBreakdown.map((s) => s.count), 1);
                  const pct = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                  return (
                    <div key={item.status} className="flex items-center gap-3">
                      <span className="text-sm text-gray-600 w-28 flex-shrink-0">{item.label}</span>
                      <div className="flex-1 h-6 bg-gray-100 rounded-md overflow-hidden">
                        <div
                          className={`h-full rounded-md transition-all duration-500 ${item.dotColor}`}
                          style={{ width: `${Math.max(pct, item.count > 0 ? 8 : 0)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Jobs Needing Attention */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Jobs Needing Attention</h2>
              {data.jobsNeedingAttention.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-10 h-10 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-gray-500">All jobs are up to date.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.jobsNeedingAttention.map((job) => (
                    <div key={job.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{job.title}</p>
                        <p className="text-xs text-gray-500">{job.reason}</p>
                      </div>
                      <Link
                        href={`/admin/careers/jobs/${job.id}`}
                        className="ml-3 flex-shrink-0 text-xs font-medium text-green-primary hover:text-green-dark transition-colors"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}

        {/* Recent Applications */}
        {loading ? (
          <SkeletonTable />
        ) : data ? (
          <div className="bg-white rounded-xl border border-gray-200 mb-8">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Recent Applications</h2>
              <Link
                href="/admin/careers/applications"
                className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
              >
                View all
              </Link>
            </div>
            {data.recentApplications.length === 0 ? (
              <div className="text-center py-12">
                <svg className="w-12 h-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <p className="text-sm text-gray-500">No applications yet.</p>
              </div>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Candidate</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Applied</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {data.recentApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-3.5">
                            <p className="text-sm font-medium text-gray-900">
                              {app.candidateFirstName} {app.candidateLastName}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{app.candidateEmail}</p>
                          </td>
                          <td className="px-6 py-3.5">
                            <p className="text-sm text-gray-700">{app.jobTitle}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{app.department}</p>
                          </td>
                          <td className="px-6 py-3.5">
                            <StatusBadge status={app.status} />
                          </td>
                          <td className="px-6 py-3.5 text-sm text-gray-500">
                            {formatDate(app.appliedAt)}
                          </td>
                          <td className="px-6 py-3.5 text-right">
                            <Link
                              href={`/admin/careers/applications/${app.id}`}
                              className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="md:hidden divide-y divide-gray-100">
                  {data.recentApplications.map((app) => (
                    <div key={app.id} className="px-6 py-4">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {app.candidateFirstName} {app.candidateLastName}
                          </p>
                          <p className="text-xs text-gray-400">{app.jobTitle}</p>
                        </div>
                        <StatusBadge status={app.status} />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">{formatDate(app.appliedAt)}</p>
                        <Link
                          href={`/admin/careers/applications/${app.id}`}
                          className="text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ) : null}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/careers/jobs/create"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Create Job
            </Link>
            <Link
              href="/admin/careers/jobs"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              View Jobs
            </Link>
            <Link
              href="/admin/careers/applications"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              View Applications
            </Link>
            <Link
              href="/admin/careers/candidates"
              className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              View Candidates
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
