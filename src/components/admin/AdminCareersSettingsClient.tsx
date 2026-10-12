"use client";

import { useState, useEffect, useCallback } from "react";

interface CareersSettings {
  pageSizeJobs: number;
  pageSizeApplications: number;
  pageSizeCandidates: number;
  pageSizeInterviews: number;
  pageSizeTeams: number;
  enablePublicCareers: boolean;
  defaultJobStatus: string;
  showApplicationCount: boolean;
  showInterviewCount: boolean;
}

const JOB_STATUSES = ["Draft", "Open", "Closed", "Paused"];

export default function AdminCareersSettingsClient() {
  const [settings, setSettings] = useState<CareersSettings | null>(null);
  const [original, setOriginal] = useState<CareersSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/admin/careers/settings");
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSettings(json.settings);
      setOriginal(json.settings);
      setLoading(false);
    } catch {
      setError(true);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await loadSettings();
    })();
  }, [loadSettings]);

  const handleSave = useCallback(async () => {
    if (!settings || saving) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/careers/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSettings(json.settings);
      setOriginal(json.settings);
      setMessage("Settings saved successfully.");
    } catch {
      setMessage("Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }, [settings, saving]);

  const handleReset = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/careers/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      if (!res.ok) throw new Error("Failed");
      const json = await res.json();
      setSettings(json.settings);
      setOriginal(json.settings);
      setMessage("Settings reset to defaults.");
    } catch {
      setMessage("Unable to reset settings.");
    } finally {
      setSaving(false);
    }
  }, [saving]);

  const hasChanges = settings && original
    ? JSON.stringify(settings) !== JSON.stringify(original)
    : false;

  const inputClass =
    "w-full text-sm border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-transparent bg-white";
  const labelClass = "block text-sm font-medium text-gray-700 mb-1";


  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to load Careers settings.</h2>
            <p className="text-gray-500 mb-6">Please try again.</p>
            <button
              type="button"
              onClick={() => void loadSettings()}
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
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <p className="text-xs font-semibold tracking-wider text-green-primary uppercase mb-1">
            CAREERS
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Careers Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage Careers module configuration and display preferences.
          </p>
        </div>

        {message && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {message}
          </div>
        )}

        {loading || !settings ? (
          <div className="animate-pulse space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 h-64" />
            <div className="bg-white rounded-xl border border-gray-200 h-64" />
          </div>
        ) : (
          <>
            {/* General */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">General</h2>
                <p className="text-sm text-gray-500 mt-0.5">Public access and default job behavior.</p>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <label htmlFor="enablePublicCareers" className="text-sm font-medium text-gray-900">
                      Enable Public Careers
                    </label>
                    <p className="text-sm text-gray-500 mt-0.5">Allow public access to /careers pages.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="enablePublicCareers"
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.enablePublicCareers}
                      onChange={(e) => setSettings({ ...settings, enablePublicCareers: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-primary"></div>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="defaultJobStatus" className={labelClass}>Default Job Status</label>
                    <select
                      id="defaultJobStatus"
                      className={inputClass}
                      value={settings.defaultJobStatus}
                      onChange={(e) => setSettings({ ...settings, defaultJobStatus: e.target.value })}
                    >
                      {JOB_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Used as default when creating jobs.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Preferences */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">Display Preferences</h2>
                <p className="text-sm text-gray-500 mt-0.5">Control list sizes and counters shown in admin views.</p>
              </div>
              <div className="px-6 py-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="pageSizeJobs" className={labelClass}>Jobs per page</label>
                    <input
                      id="pageSizeJobs"
                      type="number"
                      min={10}
                      max={100}
                      className={inputClass}
                      value={settings.pageSizeJobs}
                      onChange={(e) => setSettings({ ...settings, pageSizeJobs: parseInt(e.target.value || "20", 10) })}
                    />
                  </div>
                  <div>
                    <label htmlFor="pageSizeApplications" className={labelClass}>Applications per page</label>
                    <input
                      id="pageSizeApplications"
                      type="number"
                      min={10}
                      max={100}
                      className={inputClass}
                      value={settings.pageSizeApplications}
                      onChange={(e) => setSettings({ ...settings, pageSizeApplications: parseInt(e.target.value || "20", 10) })}
                    />
                  </div>
                  <div>
                    <label htmlFor="pageSizeCandidates" className={labelClass}>Candidates per page</label>
                    <input
                      id="pageSizeCandidates"
                      type="number"
                      min={10}
                      max={100}
                      className={inputClass}
                      value={settings.pageSizeCandidates}
                      onChange={(e) => setSettings({ ...settings, pageSizeCandidates: parseInt(e.target.value || "20", 10) })}
                    />
                  </div>
                  <div>
                    <label htmlFor="pageSizeInterviews" className={labelClass}>Interviews per page</label>
                    <input
                      id="pageSizeInterviews"
                      type="number"
                      min={10}
                      max={100}
                      className={inputClass}
                      value={settings.pageSizeInterviews}
                      onChange={(e) => setSettings({ ...settings, pageSizeInterviews: parseInt(e.target.value || "20", 10) })}
                    />
                  </div>
                  <div>
                    <label htmlFor="pageSizeTeams" className={labelClass}>Teams per page</label>
                    <input
                      id="pageSizeTeams"
                      type="number"
                      min={10}
                      max={100}
                      className={inputClass}
                      value={settings.pageSizeTeams}
                      onChange={(e) => setSettings({ ...settings, pageSizeTeams: parseInt(e.target.value || "20", 10) })}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label htmlFor="showApplicationCount" className="text-sm font-medium text-gray-900">Show Application Count</label>
                    <p className="text-sm text-gray-500 mt-0.5">Display application counts in relevant views.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="showApplicationCount"
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.showApplicationCount}
                      onChange={(e) => setSettings({ ...settings, showApplicationCount: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div>
                    <label htmlFor="showInterviewCount" className="text-sm font-medium text-gray-900">Show Interview Count</label>
                    <p className="text-sm text-gray-500 mt-0.5">Display interview counts in relevant views.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      id="showInterviewCount"
                      type="checkbox"
                      className="sr-only peer"
                      checked={settings.showInterviewCount}
                      onChange={(e) => setSettings({ ...settings, showInterviewCount: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-primary rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-primary"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-xl border border-gray-200 mb-6">
              <div className="px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">Careers Settings</p>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {hasChanges ? "You have unsaved changes." : "No unsaved changes."}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={saving}
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:border-gray-400 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50"
                  >
                    Reset to Defaults
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="inline-flex items-center justify-center px-4 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
