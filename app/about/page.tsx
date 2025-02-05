"use client";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        About AutoResumeAI
      </h1>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Mission Statement */}
        <section className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            We&apos;re on a mission to revolutionize the job search process by
            making it easier for everyone to create professional, ATS-optimized
            resumes using the power of AI.
          </p>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">
            Why Choose AutoResumeAI?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-blue-500 p-2 rounded-full mr-4 mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">AI-Powered Excellence</h3>
                <p className="text-gray-600">
                  Our advanced AI algorithms ensure your resume stands out while
                  maintaining professionalism.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-500 p-2 rounded-full mr-4 mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">User-Centric Design</h3>
                <p className="text-gray-600">
                  Built with user experience in mind, making resume creation
                  intuitive and stress-free.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-blue-500 p-2 rounded-full mr-4 mt-1">
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Continuous Innovation</h3>
                <p className="text-gray-600">
                  We constantly update our AI models and features to stay ahead
                  of industry trends.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section>
          <h2 className="text-2xl font-semibold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <h3 className="font-medium mb-2">Innovation</h3>
              <p className="text-gray-600">
                Pushing the boundaries of what&apos;s possible with AI and
                resume creation.
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="font-medium mb-2">Accessibility</h3>
              <p className="text-gray-600">
                Making professional resume building tools available to everyone.
              </p>
            </div>
            <div className="text-center p-4">
              <h3 className="font-medium mb-2">Quality</h3>
              <p className="text-gray-600">
                Ensuring every resume created meets the highest professional
                standards.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Info */}
        <section className="text-center bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-gray-600">
            Have questions or feedback? We&apos;d love to hear from you.
            <br />
            Email us at: support@autoresumeai.com
          </p>
        </section>
      </div>
    </div>
  );
}
