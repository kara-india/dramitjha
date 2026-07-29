export interface BodyPart {
  id: string;         // must match GLB node name
  label: string;
  short: string;
  subtitle: string;
  conditions: string[];
  services: string[];
}

export const BODY_PARTS: BodyPart[] = [
  { id: "head", label: "Head", short: "Head & face issues", subtitle: "Skull, TMJ & Cervical Base", conditions: ["Migraine", "Tension headache", "TMJ disorder"], services: ["Neurology consult", "TMJ physio"] },
  { id: "neck", label: "Neck", short: "Cervical pain and stiffness", subtitle: "Cervical Spine", conditions: ["Cervical spondylosis", "Whiplash", "Radiculopathy"], services: ["Spine assessment", "Injection therapy"] },
  { id: "shoulder", label: "Shoulder", short: "Shoulder pain & limited motion", subtitle: "Glenohumeral & AC Joint", conditions: ["Rotator cuff tear", "Frozen shoulder", "Impingement"], services: ["Arthroscopy", "Physiotherapy"] },
  { id: "elbow", label: "Elbow", short: "Elbow pain and overuse", subtitle: "Elbow Joint & Epicondyles", conditions: ["Tennis elbow", "Golfer's elbow", "Bursitis"], services: ["Injection", "Rehab"] },
  { id: "wrist", label: "Wrist/Hand", short: "Wrist & hand conditions", subtitle: "Carpal & Radiocarpal Joint", conditions: ["Carpal tunnel", "Tendonitis", "Fracture"], services: ["Splinting", "Hand therapy"] },
  { id: "spine", label: "Spine", short: "Back pain & spinal conditions", subtitle: "Thoracic & Lumbar Spine", conditions: ["Disc herniation", "Degenerative disc", "Sciatica"], services: ["Spine clinic", "Epidural injection"] },
  { id: "hip", label: "Hip", short: "Hip joint problems", subtitle: "Hip Joint & Pelvis", conditions: ["Osteoarthritis", "Labral tear", "Bursitis"], services: ["Hip replacement consult", "Injections"] },
  { id: "knee", label: "Knee", short: "Knee pain & instability", subtitle: "Tibiofemoral & Patellofemoral Joint", conditions: ["ACL tear", "Meniscus injury", "Patellofemoral pain"], services: ["Arthroscopy", "Knee rehab"] },
  { id: "ankle", label: "Ankle/Foot", short: "Ankle injuries & foot pain", subtitle: "Talocrural & Subtalar Joint", conditions: ["Sprain", "Achilles tendinopathy", "Plantar fasciitis"], services: ["Casting/boot", "Physio"] },
];
export default BODY_PARTS;
