// src/components/LocateUs/LocateUsWidget.tsx
"use client";

import { useState } from "react";
import { MapPin, X, ExternalLink, Navigation } from "lucide-react";

const MAPS_URL = "https://maps.app.goo.gl/MNrbv5xXaSqmSh9n6";

/** Embed uses a place search for Apex Super Specialty / Sigra Varanasi — opens full Google Maps via the short link. */
const EMBED_SRC =
  "https://www.google.com/maps?q=Apex+Super+Specialty+Hospital+Sigra+Varanasi&output=embed";

export function LocateUsWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40 font-sans">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#c89b2a]/50 text-stone-900 font-bold text-xs shadow-2xl hover:scale-105 hover:border-[#c89b2a] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#c89b2a]"
          aria-label="Locate us on the map"
        >
          <MapPin className="h-4 w-4 text-[#c89b2a]" />
          Locate Us
        </button>
      ) : (
        <div
          className="w-[min(100vw-2rem,22rem)] sm:w-96 bg-white border border-[#c89b2a]/40 rounded-2xl shadow-2xl text-stone-800 overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="locate-us-title"
        >
          <div className="flex items-center justify-between border-b border-stone-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#c89b2a]" />
              <h3 id="locate-us-title" className="text-sm font-bold text-stone-900 font-heading">
                Locate Us
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-stone-900 p-1 rounded-lg hover:bg-stone-100"
              aria-label="Close map"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-4 pt-3 pb-2 space-y-1">
            <p className="text-xs font-semibold text-stone-900">Dr. Amit Jha Sports Medicine Clinic</p>
            <p className="text-[11px] text-stone-600 leading-relaxed">
              Sigra &amp; Apex Super Specialty Hospital, Varanasi, Uttar Pradesh
            </p>
            <p className="text-[10px] font-mono text-stone-500">OPD: 11:00 AM – 1:30 PM &amp; 3:30 PM – 8:30 PM IST</p>
          </div>

          <div className="px-3 pb-3">
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-[#c89b2a]/25 bg-stone-100">
              <iframe
                title="Clinic location map — Apex Super Specialty Hospital, Sigra, Varanasi"
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
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold gold-gradient-btn"
            >
              <Navigation className="h-3.5 w-3.5" />
              Open in Google Maps
            </a>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl py-2.5 px-3 text-xs font-bold border border-[#c89b2a]/40 text-stone-800 hover:bg-[#f5e8c7]/40 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Directions
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default LocateUsWidget;
