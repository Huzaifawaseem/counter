import React from 'react';
import './Sub-header.css';

const SubHeader = () => {
    return (
        <div>
            <div className='top'></div>
            <div className="middle">
                <div className="header-content">
                    <h1 className="header-titles">Group Members</h1>
                    <h2 className="header-sub-titles">Sabahat Shoaib CE- 21302, Hajra Rehman CE- 21306, Umaima Waseem CE- 21309.</h2>
                    <h1 className="header-titles">Project Advisor </h1>
                    <h2 className="header-sub-titles">Dr. Abdul Ghaffar Memon</h2>
                </div>
            </div>
            <div className='buttom'></div>
        </div>
    );
};

export default SubHeader;