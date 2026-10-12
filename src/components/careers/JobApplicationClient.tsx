"use client";

import { useState, useCallback, useRef, type FormEvent } from "react";
import Link from "next/link";
import type { Job } from "./types";
import { EXPERIENCE_LEVELS } from "./mock-jobs";
import {
  saveApplication,
  setCandidateEmail,
  hasAppliedToJob,
  APPLICATION_QUESTIONS,
} from "./mock-applications";
import CareersNavbar from "./CareersNavbar";
import CareersFooter from "./CareersFooter";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const ALLOWED_EXTENSIONS = ".pdf,.doc,.docx";

interface EducationEntry {
  id: string;
  qualification: string;
  institution: string;
  fieldOfStudy: string;
  graduationYear: string;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  currentLocation: string;
  country: string;
  currentJobTitle: string;
  currentCompany: string;
  experienceLevel: string;
  yearsOfExperience: string;
  education: EducationEntry[];
  resumeFile: File | null;
  resumeFileName: string;
  resumeFileSize: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  otherWebsite: string;
  additionalAnswers: Record<string, string>;
  consentAccuracy: boolean;
  consentPrivacy: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  experienceLevel?: string;
  resume?: string;
  consentAccuracy?: string;
  consentPrivacy?: string;
  [key: string]: string | undefined;
}

type SubmissionState = "idle" | "submitting" | "success" | "error" | "duplicate";

function createEmptyEducation(): EducationEntry {
  return {
    id: crypto.randomUUID(),
    qualification: "",
    institution: "",
    fieldOfStudy: "",
    graduationYear: "",
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUrl(url: string): boolean {
  if (!url) return true;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

interface JobApplicationClientProps {
  job: Job;
}

export default function JobApplicationClient({ job }: JobApplicationClientProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    currentLocation: "",
    country: "",
    currentJobTitle: "",
    currentCompany: "",
    experienceLevel: "",
    yearsOfExperience: "",
    education: [createEmptyEducation()],
    resumeFile: null,
    resumeFileName: "",
    resumeFileSize: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    otherWebsite: "",
    additionalAnswers: {},
    consentAccuracy: false,
    consentPrivacy: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isClosed = job.status === "Closed";

  const setField = useCallback(
    (field: keyof FormData, value: string | boolean | File | null) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setTouched((prev) => ({ ...prev, [field]: true }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    },
    []
  );

  const setEducationField = useCallback(
    (index: number, field: keyof EducationEntry, value: string) => {
      setFormData((prev) => {
        const updated = [...prev.education];
        updated[index] = { ...updated[index], [field]: value };
        return { ...prev, education: updated };
      });
      const key = `education_${index}_${field}`;
      setTouched((prev) => ({ ...prev, [key]: true }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    },
    []
  );

  const addEducation = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      education: [...prev.education, createEmptyEducation()],
    }));
  }, []);

  const removeEducation = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!ALLOWED_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          resume: "Please upload a PDF, DOC, or DOCX file.",
        }));
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setErrors((prev) => ({
          ...prev,
          resume: "File size exceeds the 10 MB limit.",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        resumeFile: file,
        resumeFileName: file.name,
        resumeFileSize: formatFileSize(file.size),
      }));
      setErrors((prev) => {
        const next = { ...prev };
        delete next.resume;
        return next;
      });
    },
    []
  );

  const removeResume = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      resumeFile: null,
      resumeFileName: "",
      resumeFileSize: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const validate = useCallback((): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Please enter your first name.";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Please enter your last name.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Please enter your email address.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Please enter your phone number.";
    }
    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Please select your experience level.";
    }
    if (!formData.resumeFile) {
      newErrors.resume = "Please upload your resume.";
    }
    if (!formData.consentAccuracy) {
      newErrors.consentAccuracy =
        "You must confirm that your information is accurate.";
    }
    if (!formData.consentPrivacy) {
      newErrors.consentPrivacy = "You must agree to the privacy policy.";
    }

    if (formData.linkedinUrl && !validateUrl(formData.linkedinUrl)) {
      newErrors.linkedinUrl = "Please enter a valid URL.";
    }
    if (formData.githubUrl && !validateUrl(formData.githubUrl)) {
      newErrors.githubUrl = "Please enter a valid URL.";
    }
    if (formData.portfolioUrl && !validateUrl(formData.portfolioUrl)) {
      newErrors.portfolioUrl = "Please enter a valid URL.";
    }
    if (formData.otherWebsite && !validateUrl(formData.otherWebsite)) {
      newErrors.otherWebsite = "Please enter a valid URL.";
    }

    return newErrors;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();

      const validationErrors = validate();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        const firstErrorField = Object.keys(validationErrors)[0];
        const el = document.querySelector<HTMLElement>(
          `[name="${firstErrorField}"]`
        );
        el?.scrollIntoView({ behavior: "smooth", block: "center" });
        el?.focus();
        return;
      }

      setSubmissionState("submitting");

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Check for duplicate application
      if (hasAppliedToJob(job.id, formData.email)) {
        setSubmissionState("duplicate");
        return;
      }

      // Mock: 5% chance of error
      const rand = Math.random();
      if (rand < 0.05) {
        setSubmissionState("error");
        return;
      }

      // Save application to store
      const savedApp = saveApplication({
        job,
        candidateEmail: formData.email,
        candidateFirstName: formData.firstName,
        candidateLastName: formData.lastName,
        phone: formData.phone,
        currentLocation: formData.currentLocation,
        country: formData.country,
        currentJobTitle: formData.currentJobTitle,
        currentCompany: formData.currentCompany,
        experienceLevel: formData.experienceLevel,
        yearsOfExperience: formData.yearsOfExperience,
        education: formData.education.map((e) => ({
          qualification: e.qualification,
          institution: e.institution,
          fieldOfStudy: e.fieldOfStudy,
          graduationYear: e.graduationYear,
        })),
        resumeFileName: formData.resumeFileName,
        resumeFileSize: formData.resumeFileSize,
        linkedinUrl: formData.linkedinUrl,
        githubUrl: formData.githubUrl,
        portfolioUrl: formData.portfolioUrl,
        otherWebsite: formData.otherWebsite,
        additionalAnswers: formData.additionalAnswers,
      });

      // Save candidate email for "My Applications" auth
      setCandidateEmail(formData.email);

      fetch("/api/careers/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: job.id,
          candidateEmail: formData.email,
          candidateFirstName: formData.firstName,
          candidateLastName: formData.lastName,
          phone: formData.phone,
          currentLocation: formData.currentLocation,
          country: formData.country,
          currentJobTitle: formData.currentJobTitle,
          currentCompany: formData.currentCompany,
          experienceLevel: formData.experienceLevel,
          yearsOfExperience: formData.yearsOfExperience,
          education: formData.education.map((e) => ({
            qualification: e.qualification,
            institution: e.institution,
            fieldOfStudy: e.fieldOfStudy,
            graduationYear: e.graduationYear,
          })),
          resumeFileName: formData.resumeFileName,
          resumeFileSize: formData.resumeFileSize,
          linkedinUrl: formData.linkedinUrl,
          githubUrl: formData.githubUrl,
          portfolioUrl: formData.portfolioUrl,
          otherWebsite: formData.otherWebsite,
          additionalAnswers: formData.additionalAnswers,
        }),
      }).catch(() => {});

      setApplicationId(savedApp.id);
      setSubmissionState("success");
    },
    [validate, job, formData]
  );

  const handleTryAgain = useCallback(() => {
    setSubmissionState("idle");
  }, []);

  if (isClosed) {
    return (
      <>
        <CareersNavbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Applications are closed
            </h1>
            <p className="text-gray-500 mb-6">
              This position is no longer accepting applications.
            </p>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Explore Other Jobs
            </Link>
          </div>
        </main>
        <CareersFooter />
      </>
    );
  }

  if (submissionState === "success") {
    return (
      <>
        <CareersNavbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-primary"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Application submitted
            </h1>
            <p className="text-gray-600 mb-1">
              Thank you for applying to Next360.
            </p>
            <p className="text-gray-500 text-sm mb-2">
              Your application for <span className="font-medium text-gray-700">{job.title}</span> has been received.
            </p>
            {applicationId && (
              <p className="text-sm text-gray-400 mb-6">
                Application ID: <span className="font-mono text-gray-600">{applicationId}</span>
              </p>
            )}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/careers/jobs"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
              >
                View Other Jobs
              </Link>
              <Link
                href="/careers"
                className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary"
              >
                Back to Careers
              </Link>
            </div>
          </div>
        </main>
        <CareersFooter />
      </>
    );
  }

  if (submissionState === "error") {
    return (
      <>
        <CareersNavbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to submit application
            </h1>
            <p className="text-gray-500 mb-6">
              We couldn&apos;t submit your application right now. Please try again.
            </p>
            <button
              type="button"
              onClick={handleTryAgain}
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Try Again
            </button>
          </div>
        </main>
        <CareersFooter />
      </>
    );
  }

  if (submissionState === "duplicate") {
    return (
      <>
        <CareersNavbar />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-amber-500"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              You&apos;ve already applied
            </h1>
            <p className="text-gray-500 mb-6">
              Our records show that you&apos;ve already submitted an application for this role.
            </p>
            <Link
              href="/careers/jobs"
              className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2"
            >
              Explore Other Jobs
            </Link>
          </div>
        </main>
        <CareersFooter />
      </>
    );
  }

  return (
    <>
      <CareersNavbar />
      <main className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
            <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
              <ol className="flex items-center gap-1.5">
                <li>
                  <Link
                    href="/careers"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Careers
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href="/careers/jobs"
                    className="hover:text-gray-600 transition-colors"
                  >
                    Jobs
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li>
                  <Link
                    href={`/careers/jobs/${job.id}`}
                    className="hover:text-gray-600 transition-colors truncate max-w-[150px] sm:max-w-none"
                  >
                    {job.title}
                  </Link>
                </li>
                <li aria-hidden="true">/</li>
                <li className="text-gray-600 font-medium">Apply</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Application Header */}
        <section className="bg-white border-b border-gray-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <Link
              href={`/careers/jobs/${job.id}`}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors mb-4"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to job details
            </Link>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
              Apply for this role
            </h1>
            <p className="text-xl text-gray-600 mb-4">{job.title}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-500">
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                  />
                </svg>
                {job.department}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                  />
                </svg>
                {job.employmentType}
              </span>
            </div>
          </div>
        </section>

        {/* Two-column layout */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left: Form */}
            <div className="flex-1 min-w-0">
              <form onSubmit={handleSubmit} noValidate>
                {/* Personal Information */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Personal information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        First name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={formData.firstName}
                        onChange={(e) => setField("firstName", e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.firstName && touched.firstName
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && touched.firstName && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Last name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        value={formData.lastName}
                        onChange={(e) => setField("lastName", e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.lastName && touched.lastName
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && touched.lastName && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.lastName}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={(e) => setField("email", e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.email && touched.email
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="you@example.com"
                      />
                      {errors.email && touched.email && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Phone number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        value={formData.phone}
                        onChange={(e) => setField("phone", e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.phone && touched.phone
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="+91 98765 43210"
                      />
                      {errors.phone && touched.phone && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="currentLocation"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current location
                      </label>
                      <input
                        id="currentLocation"
                        name="currentLocation"
                        type="text"
                        autoComplete="address-level2"
                        value={formData.currentLocation}
                        onChange={(e) =>
                          setField("currentLocation", e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                        placeholder="City"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Country
                      </label>
                      <input
                        id="country"
                        name="country"
                        type="text"
                        autoComplete="country-name"
                        value={formData.country}
                        onChange={(e) => setField("country", e.target.value)}
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </section>

                {/* Professional Information */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Professional information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="currentJobTitle"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current job title
                      </label>
                      <input
                        id="currentJobTitle"
                        name="currentJobTitle"
                        type="text"
                        value={formData.currentJobTitle}
                        onChange={(e) =>
                          setField("currentJobTitle", e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                        placeholder="e.g. Software Engineer"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="currentCompany"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current company
                      </label>
                      <input
                        id="currentCompany"
                        name="currentCompany"
                        type="text"
                        autoComplete="organization"
                        value={formData.currentCompany}
                        onChange={(e) =>
                          setField("currentCompany", e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="experienceLevel"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Experience level <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="experienceLevel"
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={(e) =>
                          setField("experienceLevel", e.target.value)
                        }
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.experienceLevel && touched.experienceLevel
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      >
                        <option value="">Select experience level</option>
                        {EXPERIENCE_LEVELS.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                      </select>
                      {errors.experienceLevel && touched.experienceLevel && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.experienceLevel}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="yearsOfExperience"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Years of experience
                      </label>
                      <input
                        id="yearsOfExperience"
                        name="yearsOfExperience"
                        type="text"
                        value={formData.yearsOfExperience}
                        onChange={(e) =>
                          setField("yearsOfExperience", e.target.value)
                        }
                        className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                        placeholder="e.g. 3"
                      />
                    </div>
                  </div>
                </section>

                {/* Education */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Education
                  </h2>
                  <div className="space-y-6">
                    {formData.education.map((edu, index) => (
                      <div
                        key={edu.id}
                        className="relative p-4 rounded-lg border border-gray-200 bg-gray-50/50"
                      >
                        {formData.education.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEducation(index)}
                            className="absolute top-3 right-3 inline-flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                            aria-label={`Remove education ${index + 1}`}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                              />
                            </svg>
                            Remove
                          </button>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`edu-qualification-${index}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Highest qualification
                            </label>
                            <input
                              id={`edu-qualification-${index}`}
                              type="text"
                              value={edu.qualification}
                              onChange={(e) =>
                                setEducationField(
                                  index,
                                  "qualification",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                              placeholder="e.g. Bachelor's Degree"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`edu-institution-${index}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Institution
                            </label>
                            <input
                              id={`edu-institution-${index}`}
                              type="text"
                              value={edu.institution}
                              onChange={(e) =>
                                setEducationField(
                                  index,
                                  "institution",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                              placeholder="University / College"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`edu-field-${index}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Field of study
                            </label>
                            <input
                              id={`edu-field-${index}`}
                              type="text"
                              value={edu.fieldOfStudy}
                              onChange={(e) =>
                                setEducationField(
                                  index,
                                  "fieldOfStudy",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                              placeholder="e.g. Computer Science"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`edu-year-${index}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Graduation year
                            </label>
                            <input
                              id={`edu-year-${index}`}
                              type="text"
                              value={edu.graduationYear}
                              onChange={(e) =>
                                setEducationField(
                                  index,
                                  "graduationYear",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                              placeholder="e.g. 2024"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-green-primary hover:text-green-dark transition-colors"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                      />
                    </svg>
                    Add education
                  </button>
                </section>

                {/* Resume Upload */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-1 pb-2 border-b border-gray-200">
                    Resume
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Upload your latest resume. Supported formats: PDF, DOC, DOCX. Maximum file size: 10 MB.
                  </p>

                  <input
                    ref={fileInputRef}
                    id="resume"
                    name="resume"
                    type="file"
                    accept={ALLOWED_EXTENSIONS}
                    onChange={handleFileChange}
                    className="sr-only"
                    aria-describedby="resume-error"
                  />

                  {formData.resumeFile ? (
                    <div className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-gray-50">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
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
                            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formData.resumeFileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formData.resumeFileSize}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <label
                          htmlFor="resume-replace"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182"
                            />
                          </svg>
                          Replace
                        </label>
                        <input
                          id="resume-replace"
                          type="file"
                          accept={ALLOWED_EXTENSIONS}
                          onChange={handleFileChange}
                          className="sr-only"
                        />
                        <button
                          type="button"
                          onClick={removeResume}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 bg-white border border-red-200 rounded-md hover:bg-red-50 transition-colors"
                          aria-label="Remove resume"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label
                      htmlFor="resume"
                      className="flex flex-col items-center justify-center w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:border-green-primary hover:bg-green-50/30 transition-colors cursor-pointer"
                    >
                      <svg
                        className="w-8 h-8 text-gray-400 mb-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                        />
                      </svg>
                      <span className="text-sm font-medium text-gray-600">
                        Upload Resume
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5">
                        PDF, DOC, or DOCX (max 10 MB)
                      </span>
                    </label>
                  )}
                  {errors.resume && (
                    <p
                      id="resume-error"
                      className="mt-1.5 text-sm text-red-600"
                      role="alert"
                    >
                      {errors.resume}
                    </p>
                  )}
                </section>

                {/* Professional Links */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Professional links
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="linkedinUrl"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        LinkedIn URL
                      </label>
                      <input
                        id="linkedinUrl"
                        name="linkedinUrl"
                        type="url"
                        value={formData.linkedinUrl}
                        onChange={(e) =>
                          setField("linkedinUrl", e.target.value)
                        }
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.linkedinUrl
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="https://linkedin.com/in/your-profile"
                      />
                      {errors.linkedinUrl && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.linkedinUrl}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="githubUrl"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        GitHub URL
                      </label>
                      <input
                        id="githubUrl"
                        name="githubUrl"
                        type="url"
                        value={formData.githubUrl}
                        onChange={(e) => setField("githubUrl", e.target.value)}
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.githubUrl
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="https://github.com/your-profile"
                      />
                      {errors.githubUrl && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.githubUrl}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="portfolioUrl"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Portfolio URL
                      </label>
                      <input
                        id="portfolioUrl"
                        name="portfolioUrl"
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          setField("portfolioUrl", e.target.value)
                        }
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.portfolioUrl
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="https://yourportfolio.com"
                      />
                      {errors.portfolioUrl && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.portfolioUrl}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="otherWebsite"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Other website
                      </label>
                      <input
                        id="otherWebsite"
                        name="otherWebsite"
                        type="url"
                        value={formData.otherWebsite}
                        onChange={(e) =>
                          setField("otherWebsite", e.target.value)
                        }
                        className={`w-full px-3 py-2.5 text-sm rounded-lg border bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary ${
                          errors.otherWebsite
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        placeholder="https://yourwebsite.com"
                      />
                      {errors.otherWebsite && (
                        <p className="mt-1 text-sm text-red-600" role="alert">
                          {errors.otherWebsite}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                {/* Additional Questions */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    A few more questions
                  </h2>
                  <div className="space-y-4">
                    {APPLICATION_QUESTIONS.map((q) => (
                      <div key={q.id}>
                        <label
                          htmlFor={`question-${q.id}`}
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          {q.question}
                        </label>
                        {q.type === "short" && (
                          <input
                            id={`question-${q.id}`}
                            type="text"
                            value={formData.additionalAnswers[q.id] || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                additionalAnswers: {
                                  ...prev.additionalAnswers,
                                  [q.id]: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                            placeholder="Your answer"
                          />
                        )}
                        {q.type === "long" && (
                          <textarea
                            id={`question-${q.id}`}
                            rows={3}
                            value={formData.additionalAnswers[q.id] || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                additionalAnswers: {
                                  ...prev.additionalAnswers,
                                  [q.id]: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary resize-none"
                            placeholder="Your answer"
                          />
                        )}
                        {q.type === "select" && (
                          <select
                            id={`question-${q.id}`}
                            value={formData.additionalAnswers[q.id] || ""}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                additionalAnswers: {
                                  ...prev.additionalAnswers,
                                  [q.id]: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:border-green-primary"
                          >
                            <option value="">Select an option</option>
                            {q.options?.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Consent */}
                <section className="mb-8">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                    Consent
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consentAccuracy}
                        onChange={(e) =>
                          setField("consentAccuracy", e.target.checked)
                        }
                        className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-green-primary focus:ring-green-primary ${
                          errors.consentAccuracy
                            ? "border-red-300"
                            : ""
                        }`}
                      />
                      <span className="text-sm text-gray-700">
                        I confirm that the information provided in this application is accurate.{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.consentAccuracy && (
                      <p className="text-sm text-red-600 ml-7" role="alert">
                        {errors.consentAccuracy}
                      </p>
                    )}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.consentPrivacy}
                        onChange={(e) =>
                          setField("consentPrivacy", e.target.checked)
                        }
                        className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-green-primary focus:ring-green-primary ${
                          errors.consentPrivacy
                            ? "border-red-300"
                            : ""
                        }`}
                      />
                      <span className="text-sm text-gray-700">
                        I agree to the processing of my information in accordance with the{" "}
                        <a
                          href="#"
                          className="text-green-primary hover:text-green-dark underline"
                        >
                          Privacy Policy
                        </a>
                        .{" "}
                        <span className="text-red-500">*</span>
                      </span>
                    </label>
                    {errors.consentPrivacy && (
                      <p className="text-sm text-red-600 ml-7" role="alert">
                        {errors.consentPrivacy}
                      </p>
                    )}
                  </div>
                </section>

                {/* Submit */}
                <div className="pt-4 pb-8">
                  <button
                    type="submit"
                    disabled={submissionState === "submitting"}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-green-primary hover:bg-green-dark rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-green-primary focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submissionState === "submitting" ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting application...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Right: Job Summary Sidebar */}
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-sm font-semibold text-gray-900 mb-4">
                    You&apos;re applying for
                  </h2>
                  <div className="space-y-3 mb-5">
                    <p className="text-base font-semibold text-gray-900">
                      {job.title}
                    </p>
                    <dl className="space-y-2.5">
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Department
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {job.department}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Location
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {job.location}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Employment type
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {job.employmentType}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                          Experience
                        </dt>
                        <dd className="text-sm text-gray-700">
                          {job.experience}
                        </dd>
                      </div>
                      {job.workMode && (
                        <div>
                          <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-0.5">
                            Work mode
                          </dt>
                          <dd className="text-sm text-gray-700">
                            {job.workMode}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                  <Link
                    href={`/careers/jobs/${job.id}`}
                    className="block w-full text-center px-4 py-2.5 text-sm font-medium text-green-primary bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                  >
                    View Job Details
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <CareersFooter />
    </>
  );
}
