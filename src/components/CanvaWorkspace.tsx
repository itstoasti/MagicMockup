import React, { useState, useRef } from 'react';
import DeviceFrame from './DeviceFrame';
import Draggable from 'react-draggable';

interface TextElement {
  id: string;
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  position: { x: number, y: number };
}

interface Device {
  id: string;
  type: string;
  color: string;
  image: string | null;
  isPro?: boolean;
  rotation?: { x: number, y: number };
}

interface CanvaWorkspaceProps {
  devices: Device[];
  textElements: TextElement[];
  orientation: 'portrait' | 'landscape';
  shadow: boolean;
  background: string;
  backgroundPattern: string;
  onTextElementSelect: (id: string | null) => void;
  onTextDragStop: (id: string, position: { x: number, y: number }) => void;
  onDeviceSelect: (id: string) => void;
  activeDeviceId: string | null;
  activeTextId: string | null;
  multipleDevices: {
    enabled: boolean;
    layout: 'horizontal' | 'vertical';
    scale: number;
  };
  customBackgroundColor?: string | null;
  customBackgroundImage?: string | null;
}

const CanvaWorkspace = ({
  devices,
  textElements,
  orientation,
  shadow,
  background,
  backgroundPattern,
  onTextElementSelect,
  onTextDragStop,
  onDeviceSelect,
  activeDeviceId,
  activeTextId,
  multipleDevices,
  customBackgroundColor = null,
  customBackgroundImage = null
}: CanvaWorkspaceProps) => {
  const workspaceRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Background patterns
  const getBackgroundStyle = () => {
    // Custom background color takes precedence if set
    if (customBackgroundColor) {
      return { backgroundColor: customBackgroundColor };
    }
    
    // If custom background image is set, use it
    if (customBackgroundImage) {
      return { 
        backgroundImage: `url(${customBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      };
    }
    
    // Default background color
    const bgColor = background === 'transparent' ? 'transparent' : background;
    
    // Apply patterns only if a regular background color is selected
    if (backgroundPattern !== 'none' && background !== 'transparent') {
      switch (backgroundPattern) {
        case 'dots':
          return {
            backgroundColor: bgColor,
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.1) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          };
        case 'grid':
          return {
            backgroundColor: bgColor,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          };
        case 'lines':
          return {
            backgroundColor: bgColor,
            backgroundImage: `repeating-linear-gradient(
              45deg, 
              rgba(0,0,0,0.05), 
              rgba(0,0,0,0.05) 10px, 
              transparent 10px, 
              transparent 20px
            )`
          };
        case 'zigzag':
          return {
            backgroundColor: bgColor,
            backgroundImage: `
              linear-gradient(135deg, rgba(0,0,0,0.05) 25%, transparent 25%),
              linear-gradient(225deg, rgba(0,0,0,0.05) 25%, transparent 25%),
              linear-gradient(315deg, rgba(0,0,0,0.05) 25%, transparent 25%),
              linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%)
            `,
            backgroundSize: '20px 20px',
            backgroundPosition: '0 0, 10px 0, 10px -10px, 0px 10px'
          };
        case 'waves':
          return {
            backgroundColor: bgColor,
            position: 'relative'
          };
        default:
          return { backgroundColor: bgColor };
      }
    }
    
    return { backgroundColor: bgColor };
  };
  
  // Grid styles for canvas (Canva-like grid)
  const getCanvasGridStyle = () => {
    return {
      backgroundImage: `
        linear-gradient(rgba(50,50,50,0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(50,50,50,0.05) 1px, transparent 1px)
      `,
      backgroundSize: '20px 20px',
      backgroundColor: 'transparent'
    };
  };
  
  // Layout for multiple devices
  const getDevicesLayout = () => {
    if (!multipleDevices.enabled || devices.length <= 1) {
      return {};
    }
    
    return {
      display: 'flex',
      flexDirection: multipleDevices.layout === 'horizontal' ? 'row' : 'column',
      gap: '20px',
      transform: `scale(${multipleDevices.scale})`,
      transformOrigin: 'center center'
    };
  };
  
  // Waves pattern overlay (for dynamic wave background)
  const WavePatternOverlay = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0 left-0 w-full">
        <path
          fill="rgba(0,0,0,0.2)"
          d="M0,128L48,144C96,160,192,192,288,176C384,160,480,96,576,64C672,32,768,32,864,64C960,96,1056,160,1152,176C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
    </div>
  );
  
  return (
    <div 
      className="relative h-full w-full overflow-auto p-6 bg-gray-100"
      style={getCanvasGridStyle()}
      ref={workspaceRef}
    >
      <div 
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-w-80 min-h-80"
        onClick={() => onTextElementSelect(null)}
      >
        <div 
          className="p-16 rounded-lg shadow-sm relative"
          style={{
            ...getBackgroundStyle(),
            transition: 'all 0.3s ease'
          }}
        >
          {backgroundPattern === 'waves' && <WavePatternOverlay />}
          
          <div 
            className="relative"
            style={getDevicesLayout() as React.CSSProperties}
          >
            {devices.map((device) => (
              <div 
                key={device.id}
                className={`relative cursor-pointer transition-all duration-300 ease-in-out ${device.id === activeDeviceId ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeviceSelect(device.id);
                }}
              >
                <DeviceFrame 
                  image={device.image}
                  deviceType={device.type}
                  deviceColor={device.color}
                  orientation={orientation}
                  shadow={shadow}
                  rotation={device.rotation}
                  isPro={device.isPro}
                />
              </div>
            ))}
            
            {textElements.map((text) => (
              <Draggable
                key={text.id}
                position={text.position}
                onStop={(e, data) => onTextDragStop(text.id, { x: data.x, y: data.y })}
                onStart={() => setIsDragging(true)}
                onDrag={() => setIsDragging(true)}
                bounds="parent"
              >
                <div
                  className={`absolute cursor-move p-2 ${text.id === activeTextId ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}`}
                  style={{
                    color: text.color,
                    fontSize: `${text.fontSize}px`,
                    fontFamily: text.fontFamily,
                    userSelect: 'none'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDragging) {
                      onTextElementSelect(text.id);
                    }
                    setIsDragging(false);
                  }}
                >
                  {text.text}
                </div>
              </Draggable>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvaWorkspace; 