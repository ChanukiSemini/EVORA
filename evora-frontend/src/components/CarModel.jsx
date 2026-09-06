import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

/**
 * CarModel Component.
 * Loads and renders the GLTF 3D vehicle model with automatic floating and rotation animations.
 * Dynamically resolves modelPath, falling back to the existing tesla_model_3.glb to prevent 404 crashes.
 */
export default function CarModel({ autoRotate = true, modelPath = '/models/tesla_model_3.glb', ...props }) {
    const groupRef = useRef();

    // Safely resolve modelPath. Note: only tesla_model_3.glb currently exists in mock folders.
    const resolvedPath = useMemo(() => {
        if (!modelPath || !modelPath.includes('tesla_model_3')) {
            return '/models/tesla_model_3.glb';
        }
        return modelPath;
    }, [modelPath]);

    const { scene } = useGLTF(resolvedPath);
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    useFrame((state, delta) => {
        if (groupRef.current && autoRotate) {
            groupRef.current.rotation.y += delta * 0.35;
        }
        if (groupRef.current) {
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.02;
        }
    });

    return (
        <group ref={groupRef} {...props}>
            <primitive object={clonedScene} scale={1.4} position={[0, -0.9, 0]} />
        </group>
    );
}

useGLTF.preload('/models/tesla_model_3.glb');
