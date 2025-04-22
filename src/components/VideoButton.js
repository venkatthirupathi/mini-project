// src/components/VideoButton.js
import React from 'react';
import { FaVideo } from 'react-icons/fa';

const VideoButton = ({ onClick, isInCall }) => {
    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: isInCall ? '#e63946' : '#2a9d8f',
                color: 'white',
                border: 'none',
                padding: '10px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 'bold',
                fontSize: '14px',
            }}
        >
            <FaVideo />
            {isInCall ? 'End Call' : 'Start Video Call'}
        </button>
    );
};

export default VideoButton;
