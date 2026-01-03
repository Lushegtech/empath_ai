import React from 'react';
import { motion } from 'framer-motion';
import { DimensionScore } from '../types';

interface CompassChartProps {
    dimensions: DimensionScore[];
    size?: number;
}

const CompassChart: React.FC<CompassChartProps> = ({ dimensions, size = 300 }) => {
    const center = size / 2;
    // Increased padding for labels (60px instead of 40px)
    const radius = (size / 2) - 60;
    const numPoints = dimensions.length;

    // Calculate points for the data polygon
    const points = dimensions.map((dim, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        const r = (dim.score / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x},${y}`;
    }).join(' ');

    // Calculate points for text labels
    const labelPoints = dimensions.map((dim, i) => {
        const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
        // Push labels further out
        const r = radius + 35;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y, name: dim.name, angle };
    });

    // Grid levels (25%, 50%, 75%, 100%) - Using Circles for Compass feel
    const levels = [0.25, 0.5, 0.75, 1];

    return (
        <div className="relative flex items-center justify-center p-4">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <defs>
                    <radialGradient id="compassGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#9C5B42" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#9C5B42" stopOpacity="0.1" />
                    </radialGradient>
                </defs>

                {/* Background Concentric Circles (The "Compass" Grid) */}
                {levels.map((level, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={radius * level}
                        fill="none"
                        stroke="#10302A"
                        strokeOpacity={i === levels.length - 1 ? "0.2" : "0.05"}
                        strokeWidth="1"
                        strokeDasharray={i === levels.length - 1 ? "0" : "4 4"}
                    />
                ))}

                {/* Axis Lines & Ticks */}
                {dimensions.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    // Tick mark start/end
                    const tickStart = radius + 5;
                    const tx = center + tickStart * Math.cos(angle);
                    const ty = center + tickStart * Math.sin(angle);

                    return (
                        <g key={i}>
                            <line
                                x1={center} y1={center}
                                x2={x} y2={y}
                                stroke="#10302A"
                                strokeOpacity="0.05"
                                strokeWidth="1"
                            />
                            {/* Outer Tick Mark */}
                            <line
                                x1={x} y1={y}
                                x2={tx} y2={ty}
                                stroke="#10302A"
                                strokeOpacity="0.3"
                                strokeWidth="1"
                            />
                        </g>
                    );
                })}

                {/* Data Polygon */}
                <motion.path
                    initial={{ d: dimensions.map(() => `${center},${center}`).join(' ') + ' Z', opacity: 0 }}
                    animate={{ d: `M ${points} Z`, opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                    fill="url(#compassGradient)"
                    stroke="#9C5B42"
                    strokeWidth="1.5"
                />

                {/* Data Points - Hollow Rings */}
                {dimensions.map((dim, i) => {
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    const r = (dim.score / 100) * radius;
                    const x = center + r * Math.cos(angle);
                    const y = center + r * Math.sin(angle);
                    return (
                        <motion.circle
                            key={i}
                            initial={{ cx: center, cy: center, r: 0 }}
                            animate={{ cx: x, cy: y, r: 3 }}
                            transition={{ duration: 1.5, ease: 'easeOut', delay: 0.2 }}
                            fill="#F1ECE2"
                            stroke="#9C5B42"
                            strokeWidth="2"
                        />
                    );
                })}

                {/* Labels - Serif Font, smart positioning */}
                {labelPoints.map((p, i) => {
                    // Dynamic Text Anchoring to prevent cutoff
                    // Angles are in radians. -PI/2 is top.
                    // Right side: angle > -PI/2 && angle < PI/2
                    // Left side: angle > PI/2 || angle < -PI/2

                    // Normalized angle 0 to 2PI (start from top clockwise)
                    // Angle in map is: (Math.PI * 2 * i) / numPoints - Math.PI / 2
                    // i=0: -PI/2 (Top) -> Middle
                    // i=1: ~ -18deg (Top Right) -> Start
                    // i=2: ~ 54deg (Bottom Right) -> Start
                    // i=3: ~ 126deg (Bottom Left) -> End
                    // i=4: ~ 198deg (-162) (Top Left) -> End

                    let anchor = 'middle';
                    let baseline = 'middle';

                    const xPos = p.x - center; // relative to center
                    const yPos = p.y - center;

                    // Side padding tolerance
                    const tolerance = 10;

                    if (xPos > tolerance) anchor = 'start';
                    else if (xPos < -tolerance) anchor = 'end';

                    // Vertical adjust if needed (mostly fine with dominant-baseline="middle")
                    // but can tweak for top/bottom exact

                    return (
                        <text
                            key={i}
                            x={p.x}
                            y={p.y}
                            textAnchor={anchor}
                            dominantBaseline={baseline}
                            fill="#10302A"
                            style={{
                                fontSize: '9px',
                                fontFamily: '"Cormorant Garamond", serif',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase',
                                opacity: 0.8,
                                fontWeight: 600
                            }}
                        >
                            {p.name}
                        </text>
                    );
                })}
            </svg>
        </div>
    );
};

export default CompassChart;
