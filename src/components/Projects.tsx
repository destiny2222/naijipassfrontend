import Image from "next/image";

interface ProjectCardProps {
  imageSrc: string;
  badge: string;
  title: string;
  description?: string;
  isLarge?: boolean;
}

function ProjectCard({ imageSrc, badge, title, description, isLarge = false }: ProjectCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white border border-zinc-100 shadow-sm transition-all duration-300 hover:shadow-lg flex flex-col h-full">
      {/* Image Container with Zoom effect */}
      <div className={`relative w-full overflow-hidden bg-zinc-100 ${isLarge ? "h-96 sm:h-[480px]" : "h-64 sm:h-72"}`}>
        <Image
          src={imageSrc}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101D2D]/90 via-[#101D2D]/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-95" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-lg bg-[#FF6B2B] px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm">
            {badge}
          </span>
        </div>

        {/* Text Content Overlay (for non-large cards or absolute positioned layout) */}
        {!isLarge && (
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-lg font-bold leading-tight text-white group-hover:text-[#FF6B2B] transition-colors duration-250">
              {title}
            </h3>
          </div>
        )}
      </div>

      {/* Text Content below image (for large featured card) */}
      {isLarge && (
        <div className="flex flex-1 flex-col justify-between p-6 bg-white">
          <div>
            <h3 className="text-2xl font-extrabold tracking-tight text-[#101D2D] group-hover:text-[#FF6B2B] transition-colors duration-250">
              {title}
            </h3>
            {description && (
              <p className="mt-3 text-sm leading-6 text-zinc-500">
                {description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function Projects() {
  return (
    <section id="projects" className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 rounded-md bg-[#FF6B2B]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#FF6B2B]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B2B]" />
            Projects
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-[#101D2D] sm:text-4xl">
            Most Recent Projects
          </h2>
        </div>

        {/* Asymmetric Project Grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-stretch">
          {/* Left Column - Featured Project */}
          <div className="lg:col-span-6 h-full">
            <ProjectCard
              imageSrc="/project-expressway.png"
              badge="Infrastructure"
              title="Lagos-Ibadan Expressway Expansion"
              description="Major arterial roadway development connecting key economic zones to facilitate smoother interstate commerce and logistics."
              isLarge={true}
            />
          </div>

          {/* Right Column - Secondary and Small Grid */}
          <div className="lg:col-span-6 flex flex-col gap-8 h-full">
            {/* Top Project */}
            <div className="flex-1">
              <ProjectCard
                imageSrc="/project-secretariat.png"
                badge="Facilities"
                title="Abuja Secretariat Modernization"
              />
            </div>
            
            {/* Bottom Row - Two Small Projects */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              <ProjectCard
                imageSrc="/project-grid.png"
                badge="Energy"
                title="National Grid Extension"
              />
              <ProjectCard
                imageSrc="/project-water.png"
                badge="Public Works"
                title="Water Sanitation Plant"
              />
            </div>
          </div>
        </div>

        {/* View Complete Portfolio Button */}
        <div className="mt-16 text-center">
          <a
            href="#portfolio"
            className="inline-flex h-12 items-center justify-center rounded-xl border-2 border-[#101D2D] px-6 text-sm font-semibold text-[#101D2D] transition-all hover:bg-[#101D2D] hover:text-white focus:outline-none hover:-translate-y-0.5 active:translate-y-0"
          >
            View Complete Portfolio
          </a>
        </div>
      </div>
    </section>
  );
}
