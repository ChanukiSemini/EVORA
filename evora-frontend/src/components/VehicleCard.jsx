import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import CarModel from '../models/CarModel.jsx';
import teslaModel_3 from '../assets/models/tesla_model_3.glb';

const VEHICLE_DATABASE = {
    brands: ['Tesla', 'BMW', 'Nissan'],
    models: {
        'Tesla': [
            { name: 'Tesla Model 3', type: 'Sedan', connector: 'Type 2 / CCS', battery: '75 kWh', range: '405 km', modelPath: teslaModel_3 },
            { name: 'Tesla Model Y', type: 'SUV', connector: 'Type 2 / CCS', battery: '82 kWh', range: '533 km', modelPath: teslaModel_3 },
            { name: 'Tesla Model S', type: 'Sedan', connector: 'Type 2 / CCS', battery: '100 kWh', range: '634 km', modelPath: teslaModel_3 }
        ],
        'BMW': [
            { name: 'BMW i4', type: 'Gran Coupe', connector: 'CCS', battery: '83.9 kWh', range: '590 km', modelPath: teslaModel_3 },
            { name: 'BMW iX', type: 'SUV', connector: 'CCS', battery: '111.5 kWh', range: '630 km', modelPath: teslaModel_3 }
        ],
        'Nissan': [
            { name: 'Nissan Leaf', type: 'Hatchback', connector: 'CHAdeMO', battery: '40 kWh', range: '270 km', modelPath: teslaModel_3 },
            { name: 'Nissan Ariya', type: 'SUV', connector: 'CCS', battery: '87 kWh', range: '500 km', modelPath: teslaModel_3 }
        ]
    }
};

/**
 * VehicleCard Component.
 * Displays a summarized card view of a vehicle with a 3D preview on top, nickname/model below, and specs at the bottom.
 */
export default function VehicleCard({ vehicle }) {
    // Dynamically retrieve model path from mock database
    const modelPath = useMemo(() => {
        if (!vehicle || !vehicle.model) return teslaModel_3;
        for (const brand in VEHICLE_DATABASE.models) {
            const match = VEHICLE_DATABASE.models[brand].find((m) => m.name === vehicle.model);
            if (match) return match.modelPath;
        }
        return teslaModel_3;
    }, [vehicle]);

    return (
        <article className="card vehicle-card" style={{ flexDirection: 'column', gap: '0.8rem' }}>
            <div className="vehicle-visual" style={{ width: '100%', height: '180px' }}>
                <Canvas camera={{ position: [0, 0.8, 4.2], fov: 35 }} dpr={[1, 1.8]}>
                    <ambientLight intensity={0.7} />
                    <directionalLight position={[5, 7, 5]} intensity={1.3} color="#84ffb4" />
                    <pointLight position={[-3, 2, -3]} intensity={2} color="#4fd1ff" />
                    <Environment preset="city" />
                    <CarModel autoRotate modelPath={modelPath} />
                    <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
                </Canvas>
            </div>

            <div className="vehicle-card__top" style={{ width: '100%' }}>
                <div>
                    <div className="vehicle-card__title">{vehicle.name}</div>
                    <div className="vehicle-card__model">{vehicle.model}</div>
                </div>
                <div className="vehicle-actions">
                    <button className="btn-ghost" type="button" aria-label={`Edit ${vehicle.name}`}>
                        ✎
                    </button>
                    <button className="btn-danger" type="button" aria-label={`Delete ${vehicle.name}`}>
                        🗑
                    </button>
                </div>
            </div>

            <div className="vehicle-badges" style={{ width: '100%', marginTop: 'auto' }}>
                <span className="chip soft">{vehicle.type}</span>
                <span className="chip soft">{vehicle.connector}</span>
                <span className="chip soft">{vehicle.battery}</span>
            </div>
        </article>
    );
}
