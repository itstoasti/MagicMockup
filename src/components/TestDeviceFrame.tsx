import React from 'react';

const TestDeviceFrame = () => {
  return (
    <div style={{
      position: 'relative',
      width: '280px',
      height: '570px',
      backgroundColor: '#000',
      borderRadius: '40px',
      boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
      margin: '20px auto',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '12px',
        bottom: '12px',
        left: '3px',
        right: '3px',
        backgroundColor: '#1a1a1a',
        borderRadius: '30px',
        overflow: 'hidden',
        border: '1px solid #333'
      }}>
        {/* Screen content would go here */}
      </div>
      <div style={{
        position: 'absolute',
        top: '4px',
        left: '50%',
        width: '80px',
        height: '6px',
        backgroundColor: 'black',
        borderRadius: '20px',
        transform: 'translateX(-50%)'
      }}></div>
    </div>
  );
};

export default TestDeviceFrame; 