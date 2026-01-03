import React from 'react';
import { motion } from 'framer-motion';
import { DimensionScore } from '../types';

interface CompassChartProps {
    dimensions: DimensionScore[];
    size?: number;
}

const CompassChart: React.FC<CompassChartProps> = ({ dimensions, size = 300 }) => {
    const center = size / 2;
    const radius = (size / 2) - 40; // Leave room for labels
    const numPoints = dimensions.length;

    // Calculate points for the data polygon
    const points = dimensions.map((dim, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2; // Start at top
        // Scale score (0-100) to radius
        const r = (dim.score / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Calculate points for text labels
    const labelPoints = dimensions.map((dim, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const r = radius + 25; // Push out a bit
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y, name: dim.name, angle };
    });

    // Calculate points for grid polygon (100% value)
    const outerPoints = dimensions.map((_, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Grid levels (25%, 50%, 75%)
    const levels = [0.25, 0.5, 0.75].map(level => {
        return dimensions.map((_, i) => {
            const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
            const r = radius * level;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    });

    return (
        <div className="relative flex items-center justify-center p-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                {/* Background Grid - Circular or Polygon? Polygon fits the data shape better */}
                <path d={`M ${outerPoints} Z`} fill="none" stroke="#10302A" strokeOpacity="0.1" strokeWidth="1" />
                {levels.map((path, i) => (
                    <path key={i} d={`M ${path} Z`} fill="none" stroke="#10302A" strokeOpacity="0.05" strokeWidth="1" strokeDasharray="4 4" />
                ))}

                {/* Axis Lines */}
                {dimensions.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    return (
                        <line
                            key={i}
                            x1={center} y1={center}
                            x2={x} y2={y}
                            stroke="#10302A"
                            strokeOpacity="0.05"
                            strokeWidth="1"
                        />
                    );
                })}

                {/* Data Polygon */}
                <motion.path
                    initial={{ d: dimensions.map(() => `${center},${center}`).join(' ') + ' Z', opacity: 0 }}
                    animate={{ d: `M ${points} Z`, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    fill="#9C5B42"
                    fillOpacity="0.2"
                    stroke="#9C5B42"
                    strokeWidth="2"
                />

                {/* Data Points */}
                {dimensions.map((dim, i) => {
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    const r = (dim.score / 100) * radius;
                    const x = center + r * Math.cos(angle);
                    const y = center + r * Math.sin(angle);
                    return (
                        <motion.circle
                            key={i}
                            initial={{ cx: center, cy: center, r: 0 }}
                            animate={{ cx: x, cy: y, r: 4 }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                            fill="#F1ECE2"
                            stroke="#9C5B42"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Labels - ForeignObject for easier text styling? Or plain SVG text */}
                {labelPoints.map((p, i) => (
                    <text
                        key={i}
                        x={p.x}
                        y={p.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="#10302A"
                        style={{
                            fontSize: '10px',
                            fontFamily: 'monospace',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            opacity: 0.6
                        }}
                    >
                        {p.name}
                    </text>
                ))}
            </svg>
        </div>
    );
};

export default CompassChart;
