// src/data/bodyParts.ts
// Single source of truth for body part metadata.
// `id` must match the node name in human.glb AND data-part attr in SVG fallback.

export interface BodyPart {
  id: string;
  label: string;
  /** Short anatomical subtitle shown in slide-over header */
  subtitle: string;
  conditions: string[];
}

export const BODY_PARTS: BodyPart[] = [
  {
    id: "head",
    label: "Head",
    subtitle: "Skull, TMJ & Cervical Base",
    conditions: ["Migraine & Cluster Headache", "Tension Headache", "TMJ / Jaw Disorder", "Concussion Assessment"],
  },
  {
    id: "neck",
    label: "Neck",
    subtitle: "Cervical Spine",
    conditions: ["Cervical Spondylosis", "Whiplash Injury", "Cervical Disc Herniation", "Neck Muscle Strain"],
  },
  {
    id: "shoulder",
    label: "Shoulder",
    subtitle: "Glenohumeral & AC Joint",
    conditions: ["Rotator Cuff Tear", "Frozen Shoulder (Adhesive Capsulitis)", "AC Joint Sprain", "SLAP Labral Tear", "Shoulder Dislocation"],
  },
  {
    id: "elbow",
    label: "Elbow",
    subtitle: "Elbow Joint & Epicondyles",
    conditions: ["Lateral Epicondylitis (Tennis Elbow)", "Golfer's Elbow", "Olecranon Bursitis", "UCL / Tommy John Injury"],
  },
  {
    id: "wrist",
    label: "Wrist",
    subtitle: "Carpal & Radiocarpal Joint",
    conditions: ["Carpal Tunnel Syndrome", "TFCC Tear", "De Quervain's Tenosynovitis", "Wrist Fracture (Scaphoid)"],
  },
  {
    id: "spine",
    label: "Spine",
    subtitle: "Thoracic & Lumbar Spine",
    conditions: ["Lumbar Disc Herniation", "Sciatica", "Scoliosis", "Compression Fracture", "Sacroiliac Joint Pain"],
  },
  {
    id: "hip",
    label: "Hip",
    subtitle: "Hip Joint & Pelvis",
    conditions: ["Hip Labral Tear", "Femoroacetabular Impingement (FAI)", "Hip Bursitis", "Hip Osteoarthritis", "Iliotibial Band Syndrome"],
  },
  {
    id: "knee",
    label: "Knee",
    subtitle: "Tibiofemoral & Patellofemoral Joint",
    conditions: ["ACL / PCL Tear", "Meniscus Injury", "Patellar Tendinopathy", "Knee Osteoarthritis", "Patellofemoral Syndrome"],
  },
  {
    id: "ankle",
    label: "Ankle",
    subtitle: "Talocrural & Subtalar Joint",
    conditions: ["Ankle Sprain (ATFL/CFL)", "Achilles Tendon Rupture", "Ankle Impingement", "Plantar Fasciitis", "Ankle Instability"],
  },
];

/** Quick lookup by id */
export const getBodyPart = (id: string): BodyPart | undefined =>
  BODY_PARTS.find((p) => p.id === id);
