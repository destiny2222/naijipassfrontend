import Link from "next/link";

interface ServiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

function ServiceCard({ title, description, href, icon }: ServiceCardProps) {
  return (
    <div className="hover-lift flex flex-col justify-between rounded-2xl border border-zinc-100 bg-white p-8 shadow-sm transition-all duration-300 hover:border-[#0088FF]/30 hover:shadow-lg hover:shadow-[#0088FF]/5">
      <div>
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0088FF]/10 text-[#0088FF]">
          {icon}
        </div>
        <h3 className="text-xl font-bold tracking-tight text-[#101D2D]">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-zinc-500">{description}</p>
      </div>
      <div className="mt-6">
        <Link 
          href={href}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#0088FF] hover:text-[#0070D1] transition-colors"
        >
          Learn more
          <svg 
            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function Services() {
  const services = [
    {
      title: "State Intelligence",
      description: "Deep-dive analytics and geographical data mapping for all 36 states, identifying high-yield sectors and infrastructural gaps.",
      href: "#intelligence",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      )
    },
    {
      title: "AI Chatbot",
      description: "Instant, automated guidance through compliance regulations, bidding procedures, and state-specific legal frameworks.",
      href: "#chatbot",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      )
    },
    {
      title: "Verified Directory",
      description: "Access a curated network of accredited vendors, government agencies, and verified sub-contractors ready for collaboration.",
      href: "#directory",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-5l-2-2z" />
        </svg>
      )
    },
    {
      title: "Procurement Hub",
      description: "End-to-end management of the bidding lifecycle. Transparent, efficient, and aligned with national public procurement standards.",
      href: "#procurement",
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    }
  ];

  return (
    <section id="services" className="bg-zinc-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
          {/* Left Side Content */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="inline-flex items-center gap-2 rounded-md bg-[#0088FF]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#0088FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0088FF]" />
              Services
            </div>
            <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[#101D2D] sm:text-4xl">
              What we do
            </h2>
            <p className="mt-6 text-base leading-8 text-zinc-600">
              Provide comprehensive Bidding and Intelligence Services for government and the people, 
              establishing a transparent bridge for economic development.
            </p>
            <div className="mt-8">
              <a
                href="#all-services"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-[#101D2D] px-6 text-sm font-semibold text-white shadow-md shadow-[#101D2D]/10 transition-all hover:bg-[#1a2e45] hover:-translate-y-0.5 active:translate-y-0"
              >
                View All Services
              </a>
            </div>
          </div>

          {/* Right Side Cards Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {services.map((service, index) => (
                <ServiceCard
                  key={index}
                  title={service.title}
                  description={service.description}
                  href={service.href}
                  icon={service.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
