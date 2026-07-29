export interface BodyPart {
  id: string;
  label: string;
  short: string;
  subtitle: string;
  procedures: string[];
  conditions: string[];
  services: string[];
  /** Percent of the body figure container (aligned to SVG viewBox 0 0 200 500) */
  hotspotPos: { x: string; y: string };
}

/**
 * Hotspot coords calibrated to BodySelector3D stick figure:
 * SVG viewBox 0 0 200 500 — torso centered at x≈100, arms ~x36–62 / 138–162.
 */
export const BODY_PARTS: BodyPart[] = [
  {
    id: "head",
    label: "Head & TMJ",
    short: "TMJ Disorders & Cervical Base Pain",
    subtitle: "Maxillofacial & Cervical Junction",
    procedures: ["TMJ Arthrocentesis", "Cervical Nerve Blocks", "Occlusal Adjustment Protocol"],
    conditions: ["TMJ Dysfunction", "Migraine & Cervicogenic Headaches", "Jaw Lock & Click"],
    services: ["TMJ Physiotherapy", "Neurology Consultation", "Custom Occlusal Splints"],
    hotspotPos: { x: "50%", y: "7%" },
  },
  {
    id: "neck",
    label: "Cervical Spine (Neck)",
    short: "Cervical Spondylosis & Nerve Pain",
    subtitle: "Cervical Spine C1-C7",
    procedures: ["Cervical Epidural Steroid Injection", "Facet Joint Injection", "Physio Traction Protocol"],
    conditions: ["Cervical Spondylosis", "Whiplash Injury", "Cervical Radiculopathy (Nerve Pain)"],
    services: ["Spine Diagnostics", "Targeted Spinal Physiotherapy", "Non-Surgical Pain Management"],
    hotspotPos: { x: "50%", y: "14%" },
  },
  {
    id: "shoulder",
    label: "Shoulder Joint",
    short: "Keyhole Rotator Cuff & Bankart Repair",
    subtitle: "Glenohumeral & AC Joint",
    procedures: [
      "Arthroscopic Rotator Cuff Repair",
      "Bankart Repair (Shoulder Dislocation)",
      "Subacromial Decompression",
      "Frozen Shoulder Hydrodilatation",
    ],
    conditions: [
      "Rotator Cuff Tears",
      "Repeated Shoulder Dislocation",
      "Frozen Shoulder (Adhesive Capsulitis)",
      "AC Joint Sprain",
    ],
    services: ["Keyhole Shoulder Arthroscopy", "PRP Injections", "Sports Shoulder Rehab"],
    hotspotPos: { x: "28%", y: "20%" },
  },
  {
    id: "elbow",
    label: "Elbow Joint",
    short: "Tennis Elbow & Tendon Debridement",
    subtitle: "Lateral & Medial Epicondyles",
    procedures: ["Tennis Elbow PRP Injection", "Cubital Tunnel Release", "Olecranon Debridement"],
    conditions: ["Tennis Elbow (Lateral Epicondylitis)", "Golfer's Elbow", "Elbow Stiffness & Bursitis"],
    services: ["Regenerative PRP Therapy", "Elbow Arthroscopy", "Custom Bracing"],
    hotspotPos: { x: "24%", y: "33%" },
  },
  {
    id: "wrist",
    label: "Wrist & Hand",
    short: "Endoscopic Carpal Tunnel & TFCC Repair",
    subtitle: "Carpal & Radiocarpal Joint",
    procedures: ["Endoscopic Carpal Tunnel Release", "TFCC Repair", "De Quervain's Release"],
    conditions: ["Carpal Tunnel Syndrome", "TFCC Ligament Tears", "Wrist Tendonitis", "Scaphoid Fractures"],
    services: ["Minimally Invasive Hand Surgery", "Custom Splinting", "Occupational Hand Therapy"],
    hotspotPos: { x: "24%", y: "45%" },
  },
  {
    id: "spine",
    label: "Thoracic & Lumbar Spine",
    short: "Sciatica & Herniated Disc Therapy",
    subtitle: "Lumbar Spine L1-S1",
    procedures: [
      "Transforaminal Epidural Injection",
      "Microdiscectomy Evaluation",
      "Core Stabilization Protocol",
    ],
    conditions: ["Slipped Disc (Lumbar Herniation)", "Sciatica & Leg Radiculopathy", "Spondylolisthesis"],
    services: ["Spine OPD Clinic", "Non-Surgical Disc Rehab", "Lumbar Epidural Therapy"],
    hotspotPos: { x: "50%", y: "32%" },
  },
  {
    id: "hip",
    label: "Hip Joint & Pelvis",
    subtitle: "Acetabulofemoral Joint",
    short: "Hip Preservation & Replacement Consult",
    procedures: ["Hip Arthroscopy (FAI Repair)", "Labral Tear Debridement", "Total Hip Replacement (THR)"],
    conditions: [
      "Femoroacetabular Impingement (FAI)",
      "Hip Labral Tears",
      "AVN (Avascular Necrosis)",
      "Hip Osteoarthritis",
    ],
    services: [
      "Joint Preservation Clinic",
      "Hip Replacement Consultation",
      "Intra-Articular Hyaluronic Acid Injections",
    ],
    hotspotPos: { x: "50%", y: "48%" },
  },
  {
    id: "knee",
    label: "Knee Joint (Specialist Focus)",
    short: "Anatomic ACL Reconstruction & Meniscus Repair",
    subtitle: "Tibiofemoral & Patellofemoral Joint",
    procedures: [
      "Anatomic ACL Reconstruction",
      "PCL & Multiligament Repair",
      "Arthroscopic Meniscus Repair / Partial Meniscectomy",
      "Patellar Tendon Repair",
      "Total & Partial Knee Replacement (TKR)",
    ],
    conditions: [
      "ACL & PCL Ligament Ruptures",
      "Meniscus Tears",
      "Patellofemoral Pain Syndrome",
      "Knee Osteoarthritis",
    ],
    services: [
      "FNB Sports Medicine Knee Protocol",
      "Keyhole Knee Arthroscopy",
      "Post-Op Return-to-Sport Rehab",
    ],
    hotspotPos: { x: "42%", y: "62%" },
  },
  {
    id: "ankle",
    label: "Ankle & Foot",
    short: "Achilles Tendon & Ligament Repair",
    subtitle: "Talocrural Joint & Achilles",
    procedures: [
      "Achilles Tendon Minimally Invasive Repair",
      "Ankle Arthroscopy",
      "ATFL Ligament Reconstruction (Broström Procedure)",
    ],
    conditions: [
      "Severe Ankle Sprains",
      "Achilles Tendon Ruptures",
      "Ankle Impingement Syndrome",
      "Plantar Fasciitis",
    ],
    services: ["Ankle Instability Clinic", "Custom Orthotic Insoles", "PRP Achilles Therapy"],
    hotspotPos: { x: "41%", y: "76%" },
  },
];

export const getBodyPart = (id: string): BodyPart | undefined =>
  BODY_PARTS.find((p) => p.id === id);

export default BODY_PARTS;
