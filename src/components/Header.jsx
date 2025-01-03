import React from 'react';
import './Header.css';
import leftLogo from '../assets/NED_OLD_LOGO.png';
import rightLogo from '../assets/NED_NEW_LOGO.png';

const Header = () => {
    return (
        <header className="header">
            <img src={leftLogo} alt="Left Logo" className="header-logo left-logo" />
            <div className="header-content">
                <h1 className="header-title">SENSOR BASED WATER QUALITY
                    MONITORING USING IoT & REAL TIME</h1>
                <h2 className="header-sub-title">Batch 2021</h2>
            </div>
            <img src={rightLogo} alt="Right Logo" className="header-logo right-logo" />
        </header>
    );
};

export default Header;
