// tests/BodySelector3D.a11y.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import BodySelector3D from "@/components/BodySelector3D/BodySelector3D";
import { BODY_PARTS } from "@/data/bodyParts";

expect.extend(toHaveNoViolations);

describe("BodySelector3D Accessibility & Keyboard Flow", () => {
  it("should have zero accessibility violations in SVG fallback mode", async () => {
    const handleSelect = jest.fn();
    const { container } = render(<BodySelector3D onSelect={handleSelect} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("should support keyboard focus and click trigger on hotspots", () => {
    const handleSelect = jest.fn();
    render(<BodySelector3D onSelect={handleSelect} />);

    // Find hotspot button for Knee
    const kneeButton = screen.getByRole("button", { name: /Knee/i });
    expect(kneeButton).toBeInTheDocument();

    // Focus and click
    kneeButton.focus();
    expect(kneeButton).toHaveFocus();
    fireEvent.click(kneeButton);

    expect(handleSelect).toHaveBeenCalledWith(
      expect.objectContaining({ id: "knee" })
    );
  });
});
