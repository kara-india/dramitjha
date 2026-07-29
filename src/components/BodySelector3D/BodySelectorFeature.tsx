"use client";

import React, { useCallback, useState } from "react";
import BodySelector3D from "@/components/BodySelector3D/BodySelector3D";
import BookingModal from "@/components/Booking/BookingModal";
import type { BodyPart } from "@/data/bodyParts";
import { bookAppointment } from "@/lib/booking";

export default function BodySelectorFeature() {
  const [selectedPart, setSelectedPart] = useState<BodyPart | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleSelect = useCallback((part: BodyPart) => {
    setSelectedPart(part);
  }, []);

  const handleOpenBooking = useCallback((partId?: string) => {
    setBookingOpen(true);
  }, []);

  const handleCloseBooking = useCallback(() => {
    setBookingOpen(false);
  }, []);

  const handleBook = useCallback(
    async (partId: string, data: { name: string; phone: string; date: string; time: string }) => {
      try {
        await bookAppointment(partId, data);
        setBookingOpen(false);
      } catch (err) {
        console.error("Booking failed", err);
      }
    },
    []
  );

  return (
    <>
      <BodySelector3D onSelect={handleSelect} onBook={handleOpenBooking} />
      <BookingModal
        isOpen={bookingOpen}
        initialPartId={selectedPart?.id ?? null}
        onClose={handleCloseBooking}
        onBook={handleBook}
      />
    </>
  );
}
