import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProjectCardProps {
  imageSrc: string;
  badge: string;
  title: string;
  description?: string;
  isLarge?: boolean;
}

function ProjectCard({ imageSrc, badge, title, description, isLarge = false }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] bg-zinc-100 shadow-lg shadow-zinc-200/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#0088FF]/15 flex flex-col h-full cursor-pointer border border-zinc-200/50">
      
      {/* Background Image Container */}
      <div className={`relative w-full overflow-hidden ${isLarge ? "h-[500px] md:h-full min-h-[500px]" : "h-[350px]"}`}>
        {/* We use a fallback background color while the image loads */}
        <div className="absolute inset-0 bg-zinc-200 animate-pulse" />
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-in-out group-hover:scale-110 relative z-0"
        />
        {/* Subtle gradient overlay to ensure the bottom card pops and top badge is readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 transition-opacity duration-500 group-hover:opacity-60 z-0" />
      </div>
      
      {/* Top Floating Badge */}
      <div className="absolute top-6 left-6 z-10">
        <span className="inline-flex items-center rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#0088FF] shadow-sm">
          {badge}
        </span>
      </div>

      {/* Bottom Floating Info Card */}
      <div className="absolute bottom-6 left-6 right-6 z-10">
        <div className="flex flex-col justify-between rounded-2xl bg-white/90 backdrop-blur-xl p-5 md:p-6 shadow-xl border border-white/50 transition-all duration-300 group-hover:bg-white group-hover:shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className={`font-extrabold tracking-tight text-[#101D2D] transition-colors duration-250 group-hover:text-[#0088FF] ${isLarge ? "text-2xl" : "text-lg"}`}>
                {title}
              </h3>
              {description && isLarge && (
                <p className="mt-2 text-sm leading-6 text-zinc-500 line-clamp-2">
                  {description}
                </p>
              )}
            </div>
            
            {/* Animated Arrow Button */}
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 transition-all duration-300 group-hover:bg-[#0088FF] group-hover:text-white group-hover:-rotate-12 group-hover:shadow-md">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32 bg-white relative">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-[#0088FF]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center md:flex-row md:justify-between md:items-end mb-16">
          <div className="max-w-2xl text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#0088FF]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0088FF] mb-6">
              <span className="h-2 w-2 rounded-full bg-[#0088FF] animate-pulse" />
              Latest Work
            </div>
            <h2 className="text-4xl font-extrabold tracking-tight text-[#101D2D] sm:text-5xl">
              Featured Projects
            </h2>
            <p className="mt-4 text-lg text-zinc-600">
              Discover how we are building the future across Nigeria's 36 states with innovative, sustainable infrastructure.
            </p>
          </div>
          
          <div className="mt-8 md:mt-0">
            <button className="inline-flex items-center gap-2 rounded-full border-2 border-zinc-200 bg-white px-6 py-3 text-sm font-bold text-[#101D2D] transition-all hover:border-zinc-300 hover:bg-zinc-50 hover:-translate-y-1">
              View Complete Portfolio
              <ArrowUpRight className="h-4 w-4 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Asymmetric Modern Project Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8 items-stretch">
          
          {/* Left Column - Featured Project */}
          <div className="lg:col-span-7 h-full flex">
            <div className="w-full h-full">
              <ProjectCard
                imageSrc="/project-expressway.png"
                badge="Infrastructure"
                title="Lagos-Ibadan Expressway Expansion"
                description="Major arterial roadway development connecting key economic zones to facilitate smoother interstate commerce and logistics."
                isLarge={true}
              />
            </div>
          </div>

          {/* Right Column - Secondary and Small Grid */}
          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-8 h-full">
            {/* Top Project */}
            <div className="flex-1 min-h-[350px]">
              <ProjectCard
                imageSrc="/project-secretariat.png"
                badge="Facilities"
                title="Abuja Secretariat Modernization"
              />
            </div>
            
            {/* Bottom Row - Two Small Projects */}
            <div className="grid grid-cols-1 gap-6 lg:gap-8 sm:grid-cols-2 flex-1">
              <div className="min-h-[350px]">
                <ProjectCard
                  imageSrc="/project-grid.png"
                  badge="Energy"
                  title="National Grid Extension"
                />
              </div>
              <div className="min-h-[350px]">
                <ProjectCard
                  imageSrc="/project-water.png"
                  badge="Public Works"
                  title="Water Sanitation Plant"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
