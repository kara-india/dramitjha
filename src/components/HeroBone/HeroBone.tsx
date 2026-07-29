// src/components/HeroBone/HeroBone.tsx
"use client";

import { FC, Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Calendar, Stethoscope, Star, Award } from "lucide-react";

interface HeroBoneProps {
  onBook: () => void;
}

type MarkerId = "book" | "services" | "stories" | "credentials";

const MARKERS: {
  id: MarkerId;
  label: string;
  position: [number, number, number];
  icon: typeof Calendar;
}[] = [
  { id: "book", label: "Book", position: [0.55, 1.15, 0.35], icon: Calendar },
  { id: "services", label: "Services", position: [-0.6, 0.35, 0.4], icon: Stethoscope },
  { id: "stories", label: "Stories", position: [0.55, -0.45, 0.35], icon: Star },
  { id: "credentials", label: "Credentials", position: [-0.55, -1.05, 0.3], icon: Award },
];

/** Procedural anatomical femur — gold metallic, no phallic ambiguity */
function FemurBone({
  onMarkerClick,
  hovered,
  setHovered,
}: {
  onMarkerClick: (id: MarkerId) => void;
  hovered: MarkerId | null;
  setHovered: (id: MarkerId | null) => void;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.25;
    }
  });

  const gold = "#c89b2a";
  const goldDark = "#96721b";

  return (
    <group ref={group} rotation={[0.15, 0.4, 0.05]} scale={1.15}>
      {/* Proximal epiphysis (head + neck) */}
      <mesh position={[0, 1.35, 0]} castShadow>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color={gold} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0.22, 1.15, 0]} rotation={[0, 0, -0.55]} castShadow>
        <cylinderGeometry args={[0.14, 0.18, 0.35, 16]} />
        <meshStandardMaterial color={goldDark} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Greater trochanter-ish bulge */}
      <mesh position={[-0.28, 1.05, 0.05]} castShadow>
        <sphereGeometry args={[0.18, 20, 20]} />
        <meshStandardMaterial color={gold} metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Diaphysis (shaft) — slightly tapered */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.19, 1.9, 24]} />
        <meshStandardMaterial color={gold} metalness={0.5} roughness={0.38} />
      </mesh>

      {/* Distal condyles */}
      <mesh position={[-0.2, -0.95, 0.05]} castShadow>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color={gold} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0.2, -0.95, 0.05]} castShadow>
        <sphereGeometry args={[0.26, 24, 24]} />
        <meshStandardMaterial color={gold} metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, -0.85, 0]} castShadow>
        <boxGeometry args={[0.55, 0.22, 0.32]} />
        <meshStandardMaterial color={goldDark} metalness={0.45} roughness={0.42} />
      </mesh>

      {/* Surface markers */}
      {MARKERS.map((m) => {
        const isH = hovered === m.id;
        return (
          <group key={m.id} position={m.position}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(m.id);
                document.body.style.cursor = "pointer";
              }}
              onPointerOut={() => {
                setHovered(null);
                document.body.style.cursor = "auto";
              }}
              onClick={(e) => {
                e.stopPropagation();
                onMarkerClick(m.id);
              }}
            >
              <sphereGeometry args={[isH ? 0.09 : 0.07, 16, 16]} />
              <meshStandardMaterial
                color={isH ? "#d4af37" : "#f5e8c7"}
                emissive={isH ? "#c89b2a" : "#000000"}
                emissiveIntensity={isH ? 0.6 : 0}
                metalness={0.3}
                roughness={0.4}
              />
            </mesh>
            <Html distanceFactor={6} position={[0.15, 0.12, 0]} style={{ pointerEvents: "none" }}>
              <div
                className={`whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold shadow-md border transition-opacity ${
                  isH
                    ? "bg-white border-[#c89b2a] text-stone-900 opacity-100"
                    : "bg-white/90 border-[#c89b2a]/40 text-stone-700 opacity-80"
                }`}
              >
                {m.label}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

function BoneScene({ onMarkerClick }: { onMarkerClick: (id: MarkerId) => void }) {
  const [hovered, setHovered] = useState<MarkerId | null>(null);

  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} castShadow />
      <pointLight position={[-3, 2, 2]} intensity={0.4} color="#d4af37" />
      <Suspense fallback={null}>
        <FemurBone
          onMarkerClick={onMarkerClick}
          hovered={hovered}
          setHovered={setHovered}
        />
        <Environment preset="city" />
      </Suspense>
      <ContactShadows position={[0, -1.35, 0]} opacity={0.35} scale={6} blur={2.5} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 1.7}
        autoRotate={false}
      />
    </>
  );
}

export const HeroBone: FC<HeroBoneProps> = ({ onBook }) => {
  const router = useRouter();

  const handleMarker = (id: MarkerId) => {
    switch (id) {
      case "book":
        onBook();
        break;
      case "services":
        router.push("/services");
        break;
      case "stories":
        router.push("/#testimonials-heading");
        // scroll after navigation
        setTimeout(() => {
          document.getElementById("testimonials-heading")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
      case "credentials":
        router.push("/#doctor-signature");
        setTimeout(() => {
          document.getElementById("doctor-signature")?.scrollIntoView({ behavior: "smooth" });
        }, 100);
        break;
    }
  };

  return (
    <section
      aria-labelledby="hero-bone-heading"
      className="relative flex flex-col items-center justify-center min-h-[52vh] bg-gradient-to-b from-[#ffffff] via-[#fcfbf8] to-[#f5f2eb] text-[#1c1917] px-4 py-8 rounded-3xl border border-[#c89b2a]/30 shadow-[0_10px_35px_rgba(200,155,42,0.1)] overflow-hidden"
    >
      <div className="absolute inset-0 bg-radial from-[#d4af37]/15 via-transparent to-transparent opacity-70 pointer-events-none" />

      {/* 3D Canvas */}
      <div className="relative w-full h-[280px] sm:h-[320px] mb-2">
        <Canvas
          camera={{ position: [0, 0.2, 4.2], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 1.75]}
          className="!absolute inset-0"
        >
          <BoneScene onMarkerClick={handleMarker} />
        </Canvas>
      </div>

      <Badge className="bg-[#f5e8c7] text-[#96721b] border-[#c89b2a]/40 px-3.5 py-1 text-xs font-mono uppercase tracking-widest mb-3 font-semibold z-10">
        // GOLD STANDARD CARE // VARANASI OPD
      </Badge>

      <h2
        id="hero-bone-heading"
        className="text-3xl sm:text-4xl font-black text-center leading-tight mb-2 font-heading text-[#1c1917] z-10"
      >
        Move Without <span className="gold-text-gradient">Pain.</span>
      </h2>

      <p className="text-stone-600 text-xs sm:text-sm text-center max-w-md mb-5 leading-relaxed font-medium z-10">
        Fellowship-trained orthopaedic care by Dr. Amit Kumar Jha — keyhole arthroscopy, ACL
        reconstruction, and joint preservation.
      </p>

      {/* Single primary CTA — no duplicate module buttons */}
      <button
        type="button"
        onClick={onBook}
        aria-label="Book OPD Appointment"
        className="rounded-xl px-6 py-2.5 text-sm font-bold gold-gradient-btn flex items-center gap-2 z-10"
      >
        <Calendar className="h-4 w-4" />
        Book Appointment
      </button>

      <p className="mt-3 text-[10px] text-stone-500 font-mono z-10">
        Click markers on the bone · drag to rotate
      </p>
    </section>
  );
};

export default HeroBone;
