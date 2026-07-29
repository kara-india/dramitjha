"use client";
import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";

function Model() {
  const { scene } = useGLTF("/models/human-draco.glb") as any;
  return <primitive object={scene} />;
}

export default function LoadGlbTest() {
  return (
    <div style={{ width: "100%", height: 480, background: "#081211" }}>
      <Canvas camera={{ position: [0, 1.6, 3], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 4, 2]} intensity={1} />
        <Suspense fallback={<Html center><div className="text-white">Loading model…</div></Html>}>
          <Model />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}
