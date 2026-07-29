"use client";

import React, { useCallback, useState } from "react";
import BodySelector3D from "@/components/BodySelector3D/BodySelector3D";
import PartDetailsPanel from "@/components/BodySelector3D/PartDetailsPanel";
import BookingModal from "@/components/Booking/BookingModal";
import type { BodyPart } from "@/data/bodyParts";
import { bookAppointment } from "@/lib/booking";

/**
 * Composition component: keeps local UI state and wires selection -> panel -> booking flow.
 * Drop this into a page (e.g., src/app/page.tsx) where you want the interactive selector.
 */
export default function BodySelectorFeature() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleSelect = useCallback((part: BodyPart) => {
    setSelectedPart(part);
    setPanelOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setPanelOpen(false);
    // keep selectedPart for potential booking prefill
  }, []);

  const handleOpenBooking = useCallback((partId?: string) => {
    // From panel's Book CTA -> open booking modal
    setPanelOpen(false);
    setBookingOpen(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setBookingOpen(false);
  }, []);

  const handleBook = useCallback(
    async (partId: string, data: { name: string; phone: string; date: string; time: string }) => {
      try {
        // Integration point: replace booking service with your API call
        await bookAppointment(partId, data);
        // On success: close modal and optionally show toast / confirmation screen
        setBookingOpen(false);
        // PROGRESSION: show success state, add calendar invite / email
        console.log("Booking confirmed", partId, data);
      } catch (err) {
        console.error("Booking failed", err);
        // PROGRESSION: show error to user
      }
    },
    []
  );

  return (
    <>
      <BodySelector3D onSelect={handleSelect} />
      <PartDetailsPanel open={panelOpen} part={selectedPart} onClose={handleClosePanel} onBook={(id) => handleOpenBooking(id)} />
      <BookingModal open={bookingOpen} partId={selectedPart?.id ?? null} onClose={handleCloseBooking} onBook={handleBook} />
    </>
  );
}
