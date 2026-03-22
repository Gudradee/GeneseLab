"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function LeibmecLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <circle cx="30" cy="30" r="30" fill="#0d1b3e" />
      <circle cx="30" cy="30" r="28" fill="none" stroke="#1e3a6e" strokeWidth="1" />
      <text x="30" y="25" textAnchor="middle" fill="#ffffff" fontWeight="900" fontSize="12" fontFamily="Arial, sans-serif">LE</text>
      <text x="30" y="36" textAnchor="middle" fill="#e8a020" fontWeight="800" fontSize="10" fontFamily="Arial, sans-serif">ibmec</text>
      <text x="30" y="46" textAnchor="middle" fill="#6b7280" fontSize="4.5" fontFamily="Arial, sans-serif">Liga de Empreendedorismo</text>
    </svg>
  );
}

function LeTechLogo() {
  return (
    <svg width="38" height="38" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0a1628" />
          <stop offset="100%" stopColor="#060c18" />
        </radialGradient>
      </defs>
      <circle cx="30" cy="30" r="30" fill="url(#bgGrad)" />
      {/* Network nodes */}
      <circle cx="12" cy="14" r="2" fill="#4488ff" opacity="0.8" />
      <circle cx="48" cy="18" r="2" fill="#4488ff" opacity="0.8" />
      <circle cx="14" cy="46" r="1.5" fill="#4488ff" opacity="0.6" />
      <circle cx="47" cy="44" r="2" fill="#4488ff" opacity="0.7" />
      <circle cx="30" cy="8" r="1.5" fill="#4488ff" opacity="0.5" />
      <circle cx="52" cy="32" r="1.5" fill="#4488ff" opacity="0.5" />
      <circle cx="8" cy="30" r="1.5" fill="#4488ff" opacity="0.5" />
      {/* Network lines */}
      <line x1="12" y1="14" x2="30" y2="8" stroke="#4488ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="48" y1="18" x2="30" y2="8" stroke="#4488ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="12" y1="14" x2="8" y2="30" stroke="#4488ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="48" y1="18" x2="52" y2="32" stroke="#4488ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="8" y1="30" x2="14" y2="46" stroke="#4488ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="52" y1="32" x2="47" y2="44" stroke="#4488ff" strokeWidth="0.5" opacity="0.3" />
      <line x1="14" y1="46" x2="47" y2="44" stroke="#4488ff" strokeWidth="0.5" opacity="0.3" />
      {/* Text */}
      <text x="30" y="30" textAnchor="middle" fill="#e8c020" fontWeight="700" fontSize="9" fontFamily="monospace">{"{LE.tech}"}</text>
      <text x="30" y="40" textAnchor="middle" fill="#6b7280" fontSize="4.2" fontFamily="Arial, sans-serif">setor de inovação</text>
      <text x="30" y="46" textAnchor="middle" fill="#6b7280" fontSize="4.2" fontFamily="Arial, sans-serif">da LEibmec</text>
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Galeria" },
    { href: "/submit", label: "Submeter Projeto" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[#2a2a2a] bg-[#0f0f0f]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Left: Logos + Title */}
        <div className="flex items-center gap-3 shrink-0">
          <LeibmecLogo />
          <span className="text-[#2a2a2a] font-light text-lg select-none">+</span>
          <LeTechLogo />
          <span className="hidden sm:block text-white font-semibold text-base ml-1">
            Estudo de Campo
          </span>
        </div>

        {/* Right: Nav links */}
        <div className="flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white bg-[#1e1e1e]"
                    : "text-[#9ca3af] hover:text-white hover:bg-[#1a1a1a]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
