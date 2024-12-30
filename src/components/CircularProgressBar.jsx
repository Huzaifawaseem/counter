import React from 'react';
import './CircularProgressBar.css';

const CircularProgressBar = ({ percentage, title, unit, max_value, size = 150}) => {
    const radius = size / 2 - 10; // Radius depends on size minus stroke width
    const circumference = 2 * Math.PI * radius;

    return (
        <div className="progress-box" style={{ width: size + 60 }}>
            <h3 className="progress-title">{title}</h3>
            <div className="circular-progress" style={{ width: size, height: size }}>
                <svg className="progress-ring" width={size} height={size}>
                    <circle
                        className="progress-ring-bg"
                        stroke="#e0e0e0"
                        strokeWidth="10"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                    />
                    <circle
                        className="progress-ring-circle"
                        stroke="#fca91f"
                        strokeWidth="10"
                        fill="transparent"
                        r={radius}
                        cx={size / 2}
                        cy={size / 2}
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: circumference - (circumference * percentage) / max_value,
                        }}
                    />
                </svg>
                <div
                    className="progress-text"
                >
                    {percentage}
                    <p className='unit'>{unit}</p>
                </div>
            </div>
        </div>
    );
};

export default CircularProgressBar;
