// src/stories/BodySelector3D.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import BodySelector3D from "@/components/BodySelector3D/BodySelector3D";
import { BODY_PARTS } from "@/data/bodyParts";

const meta: Meta<typeof BodySelector3D> = {
  title: "Components/BodySelector3D",
  component: BodySelector3D,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BodySelector3D>;

export const Default: Story = {
  args: {
    onSelect: (part) => {
      console.log("Selected body part:", part);
    },
  },
};

export const KneeSelected: Story = {
  args: {
    onSelect: (part) => {
      console.log("Selected body part:", part);
    },
  },
};
