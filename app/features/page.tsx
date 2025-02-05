"use client";

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Features</h1>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* AI Resume Builder */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">AI Resume Builder</h2>
          <p className="text-gray-600">
            Our advanced AI helps you craft the perfect resume by suggesting
            improvements, optimizing content, and ensuring your skills stand
            out.
          </p>
        </div>

        {/* Smart Templates */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Smart Templates</h2>
          <p className="text-gray-600">
            Choose from a variety of ATS-friendly templates designed to maximize
            your chances of getting through applicant tracking systems.
          </p>
        </div>

        {/* Job Tracking */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Job Application Tracking
          </h2>
          <p className="text-gray-600">
            Keep track of all your job applications, interviews, and follow-ups
            in one centralized dashboard.
          </p>
        </div>

        {/* Real-time Editing */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Real-time Editing</h2>
          <p className="text-gray-600">
            See changes instantly as you edit your resume, with real-time
            formatting and layout updates.
          </p>
        </div>

        {/* Multiple Formats */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">
            Multiple Export Formats
          </h2>
          <p className="text-gray-600">
            Export your resume in multiple formats including PDF, Word, and
            plain text to meet any application requirement.
          </p>
        </div>

        {/* Version Control */}
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Version Control</h2>
          <p className="text-gray-600">
            Maintain different versions of your resume for different job types
            and track changes over time.
          </p>
        </div>
      </div>
    </div>
  );
}
