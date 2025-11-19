// src/components/ModelItem.jsx
import React, { Suspense } from 'react';
import { useGLTF } from '@react-three/drei';

function GLTFModel({ path, scale = 1 }) {
  const { scene } = useGLTF(path, true);
  return <primitive object={scene} scale={scale} />;
}

// Simple loader placeholder while GLB loads
function Loader() {
  return (
    <mesh>
      <sphereGeometry args={[0.2, 16, 16]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  );
}

const ModelItem = ({ path, scale }) => {
  return (
    <Suspense fallback={<Loader />}>
      <GLTFModel path={path} scale={scale} />
    </Suspense>
  );
};

export default ModelItem;

// Optional: preload models for snappier UX
useGLTF.preload('/models/Box_design.gltf');
useGLTF.preload('/models/ELIOT TFL.gltf');
useGLTF.preload('/models/ELIoT_stand_3.gltf');
