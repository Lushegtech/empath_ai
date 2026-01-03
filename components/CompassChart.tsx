import React from 'react';
import { motion } from 'framer-motion';
import { DimensionScore } from '../types';

interface CompassChartProps {
    dimensions: DimensionScore[];
    size?: number;
}

const CompassChart: React.FC<CompassChartProps> = ({ dimensions, size = 300 }) => {
    // Internal coordinate system (fixed) to ensure consistent padding/proportions
    const viewBoxSize = 500;
    const center = viewBoxSize / 2;
    // Radius leaving 110px padding for long labels (Information Processing)
    const radius = 140;
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
        // Push labels further out (radius + 20px padding)
        const r = radius + 25;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return { x, y, name: dim.name, angle };
    });

    // Grid levels (25%, 50%, 75%, 100%)
    const levels = [0.25, 0.5, 0.75, 1];

    return (
        <div className="relative flex items-center justify-center p-2 w-full max-w-[500px]">
            <svg
                viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
                className="w-full h-auto drop-shadow-sm"
                style={{ overflow: 'visible' }} // Ensure text doesn't clip if it barely touches edge
            >
                <defs>
                    <radialGradient id="compassGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                        <stop offset="0%" stopColor="#9C5B42" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#9C5B42" stopOpacity="0.05" />
                    </radialGradient>
                </defs>

                {/* Background Concentric Circles */}
                {levels.map((level, i) => (
                    <circle
                        key={i}
                        cx={center}
                        cy={center}
                        r={radius * level}
                        fill="none"
                        stroke="#10302A"
                        strokeOpacity={i === levels.length - 1 ? "0.15" : "0.05"}
                        strokeWidth="1"
                        strokeDasharray={i === levels.length - 1 ? "0" : "4 4"}
                    />
                ))}

                {/* Axis Lines & Ticks */}
                {dimensions.map((_, i) => {
                    const angle = (Math.PI * 2 * i) / numPoints - Math.PI / 2;
                    const x = center + radius * Math.cos(angle);
                    const y = center + radius * Math.sin(angle);
                    const tickStart = radius + 8;
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
                            <line
                                x1={x} y1={y}
                                x2={tx} y2={ty}
                                stroke="#10302A"
                                strokeOpacity="0.2"
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
                    strokeWidth="2"
                    strokeLinejoin="round"
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

                {/* Labels - Smart Positioning */}
                {labelPoints.map((p, i) => {
                    let anchor = 'middle';
                    let baseline = 'middle';
                    const xPos = p.x - center;
                    // Adjust tolerance for when to switch alignment
                    if (xPos > 10) anchor = 'start';
                    else if (xPos < -10) anchor = 'end';

                    return (
                        <text
                            key={i}
                            x={p.x}
                            y={p.y}
                            textAnchor={anchor}
                            dominantBaseline={baseline}
                            fill="#10302A"
                            style={{
                                fontSize: '11px', // Slightly larger for readability
                                fontFamily: '"Cormorant Garamond", serif',
                                letterSpacing: '0.08em',
                                textTransform: 'uppercase',
                                opacity: 0.7,
                                fontWeight: 600,
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
