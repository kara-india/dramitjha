// src/components/LocateUs/LocateUsWidget.tsx
"use client";

import { useState } from "react";
import { X, ExternalLink, Navigation } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/MNrbv5xXaSqmSh9n6";
const EMBED_SRC =
  "https://www.google.com/maps?q=Apex+Super+Specialty+Hospital+Sigra+Varanasi&output=embed";

/** Google Maps–style pin mark */
function MapsPinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"
      />
    </svg>
  );
}

export function LocateUsWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 pl-3 pr-5 py-3 rounded-full bg-[#4285F4] text-white font-bold text-sm shadow-[0_8px_28px_rgba(66,133,244,0.45)] hover:scale-105 hover:bg-[#3367d6] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4285F4] focus-visible:outline-offset-2"
          aria-label="Locate us on Google Maps"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#EA4335] shadow-inner">
            <MapsPinIcon className="h-6 w-6" />
          </span>
          Locate Us
        </button>
      ) : (
        <div
          className="w-[min(100vw-2rem,24rem)] sm:w-[26rem] bg-white border border-stone-200 rounded-2xl shadow-2xl text-stone-800 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="locate-us-title"
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3 bg-[#f8f9fa]">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white border border-stone-200 text-[#EA4335]">
                <MapsPinIcon className="h-5 w-5" />
              </span>
              <h3 id="locate-us-title" className="text-sm font-bold text-stone-900 font-heading">
                Locate Us
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-900 p-1.5 rounded-lg hover:bg-stone-100"
              aria-label="Close map"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-4 pt-3 pb-2 space-y-1">
            <p className="text-sm font-semibold text-stone-900">Dr. Amit Jha Sports Medicine Clinic</p>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sigra &amp; Apex Super Specialty Hospital, Varanasi, Uttar Pradesh
            </p>
            <p className="text-[11px] font-mono text-stone-500">
              OPD: 11:00 AM – 1:30 PM &amp; 3:30 PM – 8:30 PM IST
            </p>
          </div>

          <div className="px-3 pb-3">
            <div className="relative w-full h-52 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
              <iframe
                title="Clinic location — Apex Super Specialty Hospital, Sigra, Varanasi"
                src={EMBED_SRC}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <div className="px-4 pb-4 flex flex-col sm:flex-row gap-2">
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold bg-[#4285F4] text-white hover:bg-[#3367d6] transition-colors shadow-md"
            >
              <Navigation className="h-4 w-4" />
              Open in Google Maps
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-3 px-4 text-sm font-bold border border-stone-300 text-stone-800 hover:bg-stone-50 transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              Directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocateUsWidget;
