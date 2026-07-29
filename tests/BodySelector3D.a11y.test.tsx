/**
 * Basic jest-axe skeleton for hotspot keyboard + a11y checks.
 * Install: npm i -D @testing-library/react jest-axe
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { toHaveNoViolations } from "jest-axe";
import { axe } from "jest-axe";
import BodySelector3D from "@/components/BodySelector3D/BodySelector3D";
import { BODY_PARTS } from "@/data/bodyParts";

expect.extend(toHaveNoViolations);

describe("BodySelector3D accessibility", () => {
  test("hotspots are keyboard focusable and accessible", async () => {
    const onSelect = jest.fn();
    const { container } = render(<BodySelector3D onSelect={onSelect} />);
    const btn = await screen.findByRole("button", { name: /Select/i }, { timeout: 3000 }).catch(() => null);
    expect(btn).toBeTruthy();
    if (btn) {
      btn.focus();
      fireEvent.keyDown(btn, { key: "Enter", code: "Enter" });
    }
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
