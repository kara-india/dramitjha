"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Menu } from "lucide-react";

const NAV_LINKS = [
  { href: "#about", label: "About", external: false },
  { href: "#navigator", label: "Body Navigator", external: false },
  { href: "#sports", label: "Sports We Treat", external: false },
  { href: "/services", label: "Services", external: true },
  { href: "#booking", label: "Book OPD", external: false },
];

export function MobileNavIsland() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        className="lg:hidden p-2 text-stone-700 hover:text-stone-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          className="lg:hidden bg-[#fcfbf8]/98 backdrop-blur-xl border-t border-[#c89b2a]/25 px-6 py-4 flex flex-col gap-4 text-sm font-semibold absolute top-full left-0 right-0 z-40 shadow-lg"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map(({ href, label, external }) =>
            external ? (
              <Link
                key={href}
                href={href}
                className="text-stone-700 hover:text-[#c89b2a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm py-1"
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ) : (
              <a
                key={href}
                href={href}
                className="text-stone-700 hover:text-[#c89b2a] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a] rounded-sm py-1"
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            )
          )}
        </nav>
      )}
    </>
  );
}
