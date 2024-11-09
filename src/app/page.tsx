import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen gradient-bg">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Image
                src="/logos/logo-no-bg.png"
                alt="constructplan logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <h1 className="brand-text text-xl">
                <span className="text-black">construct</span>
                <span className="text-[#FFB800]">plan</span>
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </Link>
              <Link href="/dashboard" className="bg-[#FFB800] text-white px-6 py-2 rounded-lg hover:bg-[#E5A600] transition-colors">
                Try Now
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold leading-tight hero-text">
                <strong>SAVE TIME</strong>
                <br />
                <span className="brand-text">
                  <span className="text-black">construct</span>
                  <span className="text-[#FFB800]">plan</span>
                </span>
                <br />
              </h2>
              <p className="text-xl text-gray-600 max-w-lg">
                <strong>Time is a construct, but you can save it. </strong>Handle construction projects with <strong>intelligent planning</strong>. We leverage <strong>AI</strong> to <strong>streamline preparation</strong>, create <strong>timelines</strong>, and <strong>solve problems</strong>. <strong>Manage teams</strong>, <strong>equipment</strong>, <strong>and budget</strong>—all in one platform designed to <strong>minimize delays</strong> and <strong>optimize</strong> every project’s potential.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/dashboard"
                  className="bg-[#FFB800] text-white px-8 py-3 rounded-lg text-lg hover:bg-[#E5A600] transition-colors inline-flex items-center"
                >
                  Get Started
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link 
                  href="#features"
                  className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-lg text-lg hover:border-gray-400 transition-colors inline-flex items-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
            <div className="relative animate-fade-in">
              <Image
                src="/bgs/l1.webp"
                alt="Construction Planning"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent rounded-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-16 underline">
            Transform Construction Planning
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="p-6 rounded-xl border hover:shadow-lg transition-shadow animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <feature.icon className="w-12 h-12 text-[#FFB800] mb-4" />
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-16">
            Simple and Transparent Pricing
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <div className="p-6 rounded-xl border hover:shadow-lg transition-shadow">
              <h4 className="text-xl font-semibold mb-2">Free Tier</h4>
              <p className="text-gray-600 mb-4">
                Get access to our alpha version and start optimizing your projects today.
              </p>
              <button className="bg-gray-300 text-gray-500 px-8 py-3 rounded-lg text-lg cursor-not-allowed" disabled>
                Free
              </button>
            </div>
            {/* Additional tiers can be added here */}
          </div>
          <p className="text-center text-gray-600 mt-8">
            For custom enterprise solutions, <a href="mailto:contact@constructplan.com" className="text-[#FFB800] hover:underline">contact us</a>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logos/logo-no-bg.png"
                alt="constructplan logo"
                width={30}
                height={30}
                className="mr-2"
              />
              <span className="brand-text text-lg">
                <span className="text-black">construct</span>
                <span className="text-[#FFB800]">plan</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2024 constructplan. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const features = [
  {
    title: 'AI-Powered Planning',
    description: 'Leverage AI to generate project timelines, estimate costs, and allocate resources effectively.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Automated Scheduling',
    description: 'Create and manage detailed project schedules with automated task dependencies and milestones.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V5l12 7-12 7z" />
      </svg>
    ),
  },
  {
    title: 'Resource Management',
    description: 'Plan and track the allocation of your team, equipment, and materials throughout the project lifecycle.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6M9 8h6m-9 4h.01M4 12h.01" />
      </svg>
    ),
  },
  {
    title: 'AI-Driven Insights',
    description: 'Gain valuable insights into project progress, potential risks, and areas for optimization.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4h4M19 21v-4h-4M5 21l14-14" />
      </svg>
    ),
  },
  {
    title: 'Document Generation',
    description: 'Generate comprehensive project reports, documentation, and summaries with AI assistance.',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Risk Assessment',
    description: 'Identify and assess potential project risks to proactively implement mitigation strategies.', 
    icon: ({ className }: { className?: string }) => (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 13.255A8.969 8.969 0 0112 21a8.969 8.969 0 01-9-7.745V13a9 9 0 1118 0v.255z" />
      </svg>
    ),
  },
];