import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import BodySelector3D from "@/components/BodySelector3D/BodySelector3D";
import PartDetailsPanel from "@/components/BodySelector3D/PartDetailsPanel";
import BookingModal from "@/components/Booking/BookingModal";
import { BODY_PARTS } from "@/data/bodyParts";

const meta: Meta<typeof BodySelector3D> = {
  title: "Components/BodySelector3D",
  component: BodySelector3D,
};

export default meta;

export const Interactive = () => {
  const [selected, setSelected] = useState<any>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  const handleSelect = (part: any) => {
    setSelected(part);
    setPanelOpen(true);
  };

  return (
    <div style={{ padding: 20 }}>
      <BodySelector3D onSelect={handleSelect} />
      <PartDetailsPanel open={panelOpen} part={selected} onClose={() => setPanelOpen(false)} onBook={() => { setPanelOpen(false); setBookingOpen(true); }} />
      <BookingModal open={bookingOpen} partId={selected?.id ?? null} onClose={() => setBookingOpen(false)} onBook={(id, data) => { console.log("book", id, data); setBookingOpen(false); }} />
    </div>
  );
};
