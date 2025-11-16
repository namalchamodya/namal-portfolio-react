// src/components/BlackHoleBackground/BlackHoleBackground.jsx
import React, { useEffect, useRef, useState } from 'react';
import { BlackHoleScene } from './BlackHoleScene.js';
import '../../styles/blackhole.css'; // Import your CSS file

const BlackHoleBackground = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const [infoVisible, setInfoVisible] = useState(true);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // 1. Create the scene instance
        const scene = new BlackHoleScene(mount);
        scene.init();
        
        // 2. Modify camera position and orientation
        if (scene.camera) {
            // Change camera position (x, y, z)
            scene.camera.position.set(2, 6, 8); // Move camera up and back
            

            
            // Alternative: Set rotation directly
            // scene.camera.rotation.set(-0.1, 0, 0); // Slight downward tilt
        }
        

        
        // 4. Update controls target if they exist
        if (scene.controls) {
            scene.controls.target.set(-10, -7, -1); // Match black hole position
            scene.controls.update();
        }
        
        scene.start();
        sceneRef.current = scene; // Store instance for later

        // 5. Setup info box timer
        const infoTimer = setTimeout(() => setInfoVisible(false), 5000);

        // 6. Return the cleanup function
        return () => {
            clearTimeout(infoTimer);
            if (sceneRef.current) {
                sceneRef.current.stop(); // This calls the internal cleanup
            }
            sceneRef.current = null;
        };
    }, []); // Run only once on mount

    // This handler now directly calls the method on the scene instance
    const handleToggleAutoRotate = () => {
        if (sceneRef.current && sceneRef.current.controls) {
            const newAutoRotateState = !sceneRef.current.controls.autoRotate;
            sceneRef.current.setAutoRotate(newAutoRotateState);
        }
    };

    return (
        <div className="blackhole-wrapper">
            <div ref={mountRef} />
        </div>
    );
};

export default BlackHoleBackground;