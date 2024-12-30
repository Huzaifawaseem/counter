import React from 'react';
import './Sub-header.css';

const SubHeader = () => {
    return (
        <div>
            <div className='top'></div>
            <div className="middle">
                <div className="header-content">
                    <h1 className="header-title">WATER MONITORING SYSTEM</h1>
                    <h2 className="header-sub-title">FYP CIVIL</h2>
                </div>
            </div>
            <div className='buttom'></div>
        </div>
    );
};

export default SubHeader;