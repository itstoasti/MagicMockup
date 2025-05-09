import React, { useState, useEffect } from 'react';

interface DeviceFrameProps {
  image: string | null;
  deviceType: string;
  deviceColor: string;
  orientation: 'portrait' | 'landscape';
  shadow: boolean;
  rotation?: { x: number, y: number };
  isPro?: boolean;
}

const DeviceFrame = ({ 
  image, 
  deviceType, 
  deviceColor, 
  orientation, 
  shadow,
  rotation = { x: 0, y: 0 },
  isPro = false
}: DeviceFrameProps) => {
  
  // Define device frame styles based on type and color
  const getDeviceStyles = () => {
    const baseStyles = "relative transition-all duration-300 ease-in-out";
    
    // Enhanced shadow styles
    const shadowStyle = shadow 
      ? "drop-shadow-xl after:absolute after:inset-0 after:opacity-20 after:blur-xl after:-z-10 after:bg-black after:translate-y-2 after:scale-95 after:rounded-[40px]" 
      : "";

    // 3D transform for rotation
    const transform = rotation ? `transform-style-3d rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)` : "";
    
    // Device-specific styles
    switch (deviceType) {
      case 'iphone-pro':
        // iPhone 15 Pro with titanium finish, dynamic island, and realistic details
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} ${orientation === 'portrait' ? 'w-[280px] h-[570px]' : 'w-[570px] h-[280px]'}`,
          frame: `absolute inset-0 rounded-[40px] ${
            deviceColor === 'black-titanium' 
              ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 before:opacity-10' 
              : deviceColor === 'white-titanium' 
                ? 'bg-gradient-to-b from-gray-100 to-gray-200 before:opacity-20' 
                : deviceColor === 'blue-titanium' 
                  ? 'bg-gradient-to-b from-blue-300 via-blue-400 to-blue-300 before:opacity-30' 
                  : deviceColor === 'titanium' 
                    ? 'bg-gradient-to-b from-neutral-400 via-neutral-500 to-neutral-400 before:opacity-30'
                    : deviceColor === 'black'
                      ? 'bg-gradient-to-b from-zinc-800 to-zinc-900 before:opacity-10'
                      : deviceColor === 'white'
                        ? 'bg-gradient-to-b from-gray-100 to-gray-200 before:opacity-20'
                        : 'bg-gradient-to-b from-amber-100 to-amber-200 before:opacity-30'
            } 
            border border-opacity-20 ${deviceColor.includes('black') ? 'border-white/5' : 'border-black/10'} 
            before:absolute before:inset-0 before:rounded-[40px] before:bg-gradient-to-br before:from-white/30 before:to-transparent
            after:absolute after:inset-0 after:rounded-[40px] after:opacity-50 after:bg-gradient-to-tr after:via-transparent after:from-transparent after:to-white/10`,
          screen: `absolute ${orientation === 'portrait' ? 'top-12 bottom-12 left-3 right-3' : 'top-3 bottom-3 left-12 right-12'} 
                   bg-black rounded-3xl overflow-hidden
                   shadow-inner border border-gray-900
                   before:absolute before:inset-0 before:bg-gradient-to-br before:from-gray-800/20 before:to-transparent before:opacity-30`,
          dynamicIsland: `absolute ${orientation === 'portrait' ? 'top-[18px] left-1/2 -translate-x-1/2 w-[120px] h-[35px]' : 'top-1/2 left-[18px] -translate-y-1/2 h-[120px] w-[35px]'} 
                         bg-black rounded-[20px] z-20
                         flex items-center justify-center
                         before:absolute before:w-3 before:h-3 before:rounded-full before:right-6 before:bg-gray-800/50
                         after:absolute after:w-2 after:h-2 after:rounded-full after:left-10 after:bg-gray-800/30`,
          buttons: [
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-[130px] h-[65px] w-[3px]' : 'top-[-2px] right-[130px] w-[65px] h-[3px]'} ${
              deviceColor.includes('titanium') 
                ? deviceColor === 'black-titanium' 
                  ? 'bg-zinc-700' 
                  : deviceColor === 'white-titanium' 
                    ? 'bg-gray-300' 
                    : deviceColor === 'blue-titanium' 
                      ? 'bg-blue-400' 
                      : 'bg-neutral-500'
                : deviceColor === 'black' 
                  ? 'bg-zinc-700' 
                  : 'bg-neutral-400'
            } rounded-l-sm`,
            `absolute ${orientation === 'portrait' ? 'left-[-2px] top-[110px] h-[40px] w-[3px]' : 'bottom-[-2px] left-[110px] w-[40px] h-[3px]'} ${
              deviceColor.includes('titanium') 
                ? deviceColor === 'black-titanium' 
                  ? 'bg-zinc-700' 
                  : deviceColor === 'white-titanium' 
                    ? 'bg-gray-300' 
                    : deviceColor === 'blue-titanium' 
                      ? 'bg-blue-400' 
                      : 'bg-neutral-500'
                : deviceColor === 'black' 
                  ? 'bg-zinc-700' 
                  : 'bg-neutral-400'
            } rounded-r-sm`,
            `absolute ${orientation === 'portrait' ? 'left-[-2px] top-[170px] h-[40px] w-[3px]' : 'bottom-[-2px] left-[170px] w-[40px] h-[3px]'} ${
              deviceColor.includes('titanium') 
                ? deviceColor === 'black-titanium' 
                  ? 'bg-zinc-700' 
                  : deviceColor === 'white-titanium' 
                    ? 'bg-gray-300' 
                    : deviceColor === 'blue-titanium' 
                      ? 'bg-blue-400' 
                      : 'bg-neutral-500'
                : deviceColor === 'black' 
                  ? 'bg-zinc-700' 
                  : 'bg-neutral-400'
            } rounded-r-sm`,
            `absolute ${orientation === 'portrait' ? 'left-[-2px] top-[230px] h-[65px] w-[3px]' : 'bottom-[-2px] left-[230px] w-[65px] h-[3px]'} ${
              deviceColor.includes('titanium') 
                ? deviceColor === 'black-titanium' 
                  ? 'bg-zinc-700' 
                  : deviceColor === 'white-titanium' 
                    ? 'bg-gray-300' 
                    : deviceColor === 'blue-titanium' 
                      ? 'bg-blue-400' 
                      : 'bg-neutral-500'
                : deviceColor === 'black' 
                  ? 'bg-zinc-700' 
                  : 'bg-neutral-400'
            } rounded-r-sm`
          ],
          cameraModule: `absolute ${orientation === 'portrait' ? 'top-[18px] right-[18px]' : 'bottom-[18px] right-[18px]'} 
                         w-[48px] h-[48px] 
                         ${
                           deviceColor.includes('titanium') 
                             ? deviceColor === 'black-titanium' 
                               ? 'bg-zinc-800' 
                               : deviceColor === 'white-titanium' 
                                 ? 'bg-gray-200' 
                                 : deviceColor === 'blue-titanium' 
                                   ? 'bg-blue-400' 
                                   : 'bg-neutral-500'
                             : deviceColor === 'black' 
                               ? 'bg-zinc-800' 
                               : deviceColor === 'white' 
                                 ? 'bg-gray-200' 
                                 : 'bg-amber-200'
                         } 
                         rounded-[16px] z-10
                         flex flex-col items-center justify-center gap-0.5 p-1
                         shadow-md
                         after:absolute after:inset-1 after:rounded-[14px] after:bg-gradient-to-br after:from-black/20 after:to-transparent after:opacity-60`,
          cameras: [
            `relative w-[12px] h-[12px] rounded-full bg-black border border-gray-700 
             before:absolute before:w-[6px] before:h-[6px] before:rounded-full before:bg-blue-500/10 before:border before:border-blue-500/20 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
             after:absolute after:w-[3px] after:h-[3px] after:rounded-full after:bg-blue-500/30 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2
             shadow-inner`,
            `relative w-[12px] h-[12px] rounded-full bg-black border border-gray-700 
             before:absolute before:w-[6px] before:h-[6px] before:rounded-full before:bg-blue-500/10 before:border before:border-blue-500/20 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
             after:absolute after:w-[3px] after:h-[3px] after:rounded-full after:bg-blue-500/30 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2
             shadow-inner`,
            `relative w-[12px] h-[12px] rounded-full bg-black border border-gray-700 
             before:absolute before:w-[6px] before:h-[6px] before:rounded-full before:bg-blue-500/10 before:border before:border-blue-500/20 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
             after:absolute after:w-[3px] after:h-[3px] after:rounded-full after:bg-blue-500/30 after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2
             shadow-inner`
          ],
          flash: `absolute top-0.5 right-0.5 w-[6px] h-[6px] rounded-full bg-neutral-300 border border-neutral-400`,
          microphone: `absolute bottom-0.5 left-0.5 w-[4px] h-[4px] rounded-full bg-black/50`,
          proLabel: 'absolute bottom-6 right-0 rotate-90 text-[8px] text-gray-400 font-semibold tracking-wider'
        };
      case 'pixel-pro':
        // Google Pixel Pro with camera bar and realistic details
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} ${orientation === 'portrait' ? 'w-[260px] h-[550px]' : 'w-[550px] h-[260px]'}`,
          frame: `absolute inset-0 rounded-[28px] ${deviceColor === 'black' ? 'bg-neutral-900' : deviceColor === 'white' ? 'bg-neutral-100' : deviceColor === 'hazel' ? 'bg-amber-100' : 'bg-blue-100'}
                  before:absolute before:inset-0 before:rounded-[28px] before:opacity-30 before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  border border-opacity-10 ${deviceColor === 'black' ? 'border-white/10' : 'border-black/10'}`,
          screen: `absolute ${orientation === 'portrait' ? 'top-2 bottom-2 left-2 right-2' : 'top-2 bottom-2 left-2 right-2'} bg-gray-800 rounded-[24px] overflow-hidden
                   shadow-inner border border-gray-700`,
          notch: `absolute ${orientation === 'portrait' ? 'top-4 left-1/2 -translate-x-1/2 w-3 h-3' : 'top-1/2 left-4 -translate-y-1/2 w-3 h-3'} 
                  bg-gray-900 rounded-full z-10 flex items-center justify-center`,
          buttons: [
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-28 h-12 w-1' : 'top-[-2px] left-28 w-12 h-1'} bg-gray-600 rounded-l-sm`,
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-44 h-12 w-1' : 'top-[-2px] left-44 w-12 h-1'} bg-gray-600 rounded-l-sm`
          ],
          cameraBar: `absolute ${orientation === 'portrait' ? 'top-6 left-0 right-0 h-12' : 'top-0 bottom-0 left-6 w-12'} bg-neutral-800 z-5`,
          cameras: [
            `absolute ${orientation === 'portrait' ? 'top-9 left-12' : 'top-12 left-9'} w-6 h-6 rounded-full bg-neutral-700 border border-neutral-600 relative before:absolute before:w-3 before:h-3 before:rounded-full before:bg-blue-500/20 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2`,
            `absolute ${orientation === 'portrait' ? 'top-9 left-24' : 'top-24 left-9'} w-6 h-6 rounded-full bg-neutral-700 border border-neutral-600 relative before:absolute before:w-3 before:h-3 before:rounded-full before:bg-blue-500/20 before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2`
          ],
          proLabel: 'absolute bottom-6 right-0 rotate-90 text-xs text-gray-400 font-semibold'
        };
      case 'galaxy-fold':
        // Samsung Galaxy Fold with realistic fold details
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} ${orientation === 'portrait' ? 'w-[240px] h-[520px]' : 'w-[520px] h-[240px]'}`,
          frame: `absolute inset-0 rounded-[20px] ${deviceColor === 'black' ? 'bg-neutral-900' : deviceColor === 'white' ? 'bg-neutral-100' : deviceColor === 'silver' ? 'bg-gradient-to-b from-neutral-300 to-neutral-200' : 'bg-gray-100'}
                  before:absolute before:inset-0 before:rounded-[20px] before:opacity-30 before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  border border-opacity-10 ${deviceColor === 'black' ? 'border-white/10' : 'border-black/10'}`,
          screen: `absolute ${orientation === 'portrait' ? 'top-2 bottom-2 left-2 right-2' : 'top-2 bottom-2 left-2 right-2'} bg-gray-800 rounded-[16px] overflow-hidden
                   shadow-inner border border-gray-700`,
          fold: `absolute ${orientation === 'portrait' ? 'top-0 bottom-0 left-1/2 w-[2px] -translate-x-1/2' : 'left-0 right-0 top-1/2 h-[2px] -translate-y-1/2'} bg-neutral-700`,
          foldHighlight: `absolute ${orientation === 'portrait' ? 'top-0 bottom-0 left-1/2 w-[1px] -translate-x-[2px]' : 'left-0 right-0 top-1/2 h-[1px] -translate-y-[2px]'} bg-neutral-400 opacity-50`,
          notch: `absolute ${orientation === 'portrait' ? 'top-3 left-1/2 -translate-x-1/2 w-8 h-1' : 'top-1/2 left-3 -translate-y-1/2 w-1 h-8'} 
                  bg-gray-900 rounded-full z-10 flex items-center justify-center`,
          buttons: [
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-24 h-10 w-1' : 'top-[-2px] left-24 w-10 h-1'} bg-gray-600 rounded-l-sm`,
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-36 h-10 w-1' : 'top-[-2px] left-36 w-10 h-1'} bg-gray-600 rounded-l-sm`
          ],
          proLabel: 'absolute bottom-6 right-0 rotate-90 text-xs text-gray-400 font-semibold'
        };
      case 'iphone':
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} ${orientation === 'portrait' ? 'w-[280px] h-[570px]' : 'w-[570px] h-[280px]'}`,
          frame: `absolute inset-0 rounded-[40px] ${deviceColor === 'black' ? 'bg-black' : deviceColor === 'white' ? 'bg-white' : 'bg-gray-100'} 
                  border border-opacity-10 ${deviceColor === 'black' ? 'border-white/10' : 'border-black/10'} 
                  before:absolute before:inset-0 before:rounded-[40px] before:opacity-30 before:bg-gradient-to-br before:from-white/20 before:to-transparent`,
          screen: `absolute ${orientation === 'portrait' ? 'top-12 bottom-12 left-3 right-3' : 'top-3 bottom-3 left-12 right-12'} bg-gray-800 rounded-3xl overflow-hidden
                   shadow-inner border border-gray-700`,
          notch: `absolute ${orientation === 'portrait' ? 'top-4 left-1/2 -translate-x-1/2 w-20 h-6' : 'top-1/2 left-4 -translate-y-1/2 w-6 h-20'} bg-black rounded-full z-10
                  flex items-center justify-center before:absolute before:w-2 before:h-2 before:bg-gray-700 before:rounded-full before:opacity-80`,
          buttons: [
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-28 h-10 w-1' : 'top-[-2px] left-28 w-10 h-1'} bg-gray-600 rounded-l-sm`,
            `absolute ${orientation === 'portrait' ? 'left-[-2px] top-28 h-14 w-1' : 'bottom-[-2px] left-28 w-14 h-1'} bg-gray-600 rounded-r-sm`,
            `absolute ${orientation === 'portrait' ? 'left-[-2px] top-48 h-14 w-1' : 'bottom-[-2px] left-48 w-14 h-1'} bg-gray-600 rounded-r-sm`
          ]
        };
      case 'android':
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} ${orientation === 'portrait' ? 'w-[260px] h-[540px]' : 'w-[540px] h-[260px]'}`,
          frame: `absolute inset-0 rounded-[20px] ${deviceColor === 'black' ? 'bg-black' : deviceColor === 'white' ? 'bg-white' : 'bg-gray-100'}
                  before:absolute before:inset-0 before:rounded-[20px] before:opacity-30 before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  border border-opacity-10 ${deviceColor === 'black' ? 'border-white/10' : 'border-black/10'}`,
          screen: `absolute ${orientation === 'portrait' ? 'top-2 bottom-2 left-2 right-2' : 'top-2 bottom-2 left-2 right-2'} bg-gray-800 rounded-lg overflow-hidden
                   shadow-inner border border-gray-700`,
          notch: `absolute ${orientation === 'portrait' ? 'top-3 left-1/2 -translate-x-1/2 w-3 h-3' : 'top-1/2 left-3 -translate-y-1/2 w-3 h-3'} 
                  bg-gray-900 rounded-full z-10 flex items-center justify-center`,
          buttons: [
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-24 h-12 w-1' : 'top-[-2px] left-24 w-12 h-1'} bg-gray-600 rounded-l-sm`,
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-40 h-12 w-1' : 'top-[-2px] left-40 w-12 h-1'} bg-gray-600 rounded-l-sm`
          ]
        };
      case 'ipad':
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} ${orientation === 'portrait' ? 'w-[380px] h-[540px]' : 'w-[540px] h-[380px]'}`,
          frame: `absolute inset-0 rounded-[20px] ${deviceColor === 'black' ? 'bg-black' : deviceColor === 'white' ? 'bg-white' : 'bg-gray-100'}
                  before:absolute before:inset-0 before:rounded-[20px] before:opacity-30 before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  border border-opacity-10 ${deviceColor === 'black' ? 'border-white/10' : 'border-black/10'}`,
          screen: `absolute ${orientation === 'portrait' ? 'top-4 bottom-4 left-3 right-3' : 'top-3 bottom-3 left-4 right-4'} bg-gray-800 rounded-lg overflow-hidden
                   shadow-inner border border-gray-700`,
          notch: `absolute ${orientation === 'portrait' ? 'top-2 left-1/2 -translate-x-1/2 w-4 h-4' : 'top-1/2 left-2 -translate-y-1/2 w-4 h-4'} 
                  bg-gray-900 rounded-full z-10 flex items-center justify-center`,
          buttons: [
            `absolute ${orientation === 'portrait' ? 'right-[-2px] top-16 h-10 w-1' : 'top-[-2px] left-16 w-10 h-1'} bg-gray-600 rounded-l-sm`
          ]
        };
      case 'macbook':
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} w-[640px] h-[400px]`,
          frame: `absolute inset-0 rounded-[10px] ${deviceColor === 'black' ? 'bg-gray-800' : deviceColor === 'white' ? 'bg-gray-100' : 'bg-gray-200'}
                  before:absolute before:inset-0 before:rounded-t-lg before:opacity-30 before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  border border-opacity-10 ${deviceColor === 'black' ? 'border-white/10' : 'border-black/10'}`,
          screen: `absolute top-0 bottom-16 left-3 right-3 bg-gray-800 rounded-t-lg overflow-hidden
                   shadow-inner border border-gray-700`,
          keyboard: `absolute bottom-0 h-16 left-0 right-0 ${deviceColor === 'black' ? 'bg-gray-700' : 'bg-gray-200'} rounded-b-lg
                     before:absolute before:left-1/2 before:-translate-x-1/2 before:bottom-3 before:h-1 before:w-24 
                     before:rounded-full before:bg-gray-400 before:opacity-50`,
          touchpad: `absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 ${deviceColor === 'black' ? 'bg-gray-800' : 'bg-gray-300'} 
                     rounded-sm border ${deviceColor === 'black' ? 'border-gray-600' : 'border-gray-400'}`
        };
      case 'macbook-pro':
        // MacBook Pro with notch and more realistic details
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} w-[640px] h-[400px]`,
          frame: `absolute inset-0 rounded-[14px] ${deviceColor === 'black' ? 'bg-neutral-800' : deviceColor === 'white' ? 'bg-neutral-200' : deviceColor === 'silver' ? 'bg-gradient-to-b from-neutral-300 to-neutral-200' : 'bg-neutral-300'}
                  before:absolute before:inset-0 before:rounded-t-lg before:opacity-30 before:bg-gradient-to-br before:from-white/20 before:to-transparent
                  border border-opacity-10 ${deviceColor === 'black' ? 'border-white/10' : 'border-black/10'}`,
          screen: `absolute top-0 bottom-16 left-3 right-3 bg-gray-800 rounded-t-lg overflow-hidden
                   shadow-inner border border-gray-700`,
          notch: `absolute top-0 left-1/2 -translate-x-1/2 w-8 h-2 bg-neutral-800 rounded-b-md z-10`,
          keyboard: `absolute bottom-0 h-16 left-0 right-0 ${deviceColor === 'black' ? 'bg-neutral-700' : deviceColor === 'silver' ? 'bg-neutral-300' : 'bg-neutral-200'} rounded-b-lg
                     grid grid-cols-12 gap-1 p-2 opacity-80`,
          touchpad: `absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 ${deviceColor === 'black' ? 'bg-neutral-800' : 'bg-neutral-400'} 
                     rounded-sm border ${deviceColor === 'black' ? 'border-neutral-700' : 'border-neutral-500'}`,
          proLabel: 'absolute bottom-2 right-4 text-xs text-gray-400 font-semibold'
        };
      default:
        return {
          container: `${baseStyles} ${shadowStyle} ${transform} ${orientation === 'portrait' ? 'w-[280px] h-[570px]' : 'w-[570px] h-[280px]'}`,
          frame: `absolute inset-0 rounded-[40px] ${deviceColor === 'black' ? 'bg-black' : deviceColor === 'white' ? 'bg-white' : 'bg-gray-100'}`,
          screen: `absolute ${orientation === 'portrait' ? 'top-12 bottom-12 left-3 right-3' : 'top-3 bottom-3 left-12 right-12'} bg-gray-800 rounded-3xl overflow-hidden`,
          notch: `absolute ${orientation === 'portrait' ? 'top-4 left-1/2 -translate-x-1/2 w-20 h-6' : 'top-1/2 left-4 -translate-y-1/2 w-6 h-20'} bg-black rounded-full`
        };
    }
  };
  
  const styles = getDeviceStyles();
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [rotate, setRotate] = useState(rotation);
  
  // Update local rotation state when props change
  useEffect(() => {
    setRotate(rotation);
  }, [rotation.x, rotation.y]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPro) return;
    setDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !isPro) return;
    
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    
    setRotate({
      x: Math.min(Math.max(rotate.x - deltaY * 0.5, -30), 30),
      y: Math.min(Math.max(rotate.y + deltaX * 0.5, -30), 30)
    });
    
    setStartX(e.clientX);
    setStartY(e.clientY);
  };
  
  const handleMouseUp = () => {
    if (!isPro) return;
    setDragging(false);
  };
  
  const handleDoubleClick = () => {
    if (!isPro) return;
    // Reset rotation on double click
    setRotate({ x: 0, y: 0 });
  };
  
  return (
    <div 
      className={styles.container}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
      style={{
        transform: isPro ? `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)` : '',
        cursor: isPro ? 'grab' : 'default',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className={styles.frame} style={isPro && deviceType === 'iphone-pro' ? {
        transformStyle: 'preserve-3d',
        transform: 'translateZ(-2px)'
      } : {}}></div>
      
      {/* Dynamic Island (for iPhone Pro) replaces the notch */}
      {deviceType === 'iphone-pro' ? (
        <div className={styles.dynamicIsland} style={isPro ? {
          transformStyle: 'preserve-3d',
          transform: 'translateZ(1px)'
        } : {}}></div>
      ) : (
        <div className={styles.notch}></div>
      )}
      
      {/* Pro device specific elements */}
      {deviceType === 'iphone-pro' && (
        <div className={styles.cameraModule} style={isPro ? {
          transformStyle: 'preserve-3d',
          transform: 'translateZ(2px)'
        } : {}}>
          {styles.cameras && styles.cameras.map((cameraStyle, index) => (
            <div key={`camera-${index}`} className={cameraStyle}></div>
          ))}
          <div className={styles.flash}></div>
          <div className={styles.microphone}></div>
          {isPro && <div className={styles.proLabel}>PRO</div>}
        </div>
      )}
      
      {deviceType === 'pixel-pro' && (
        <>
          <div className={styles.cameraBar}></div>
          {styles.cameras && styles.cameras.map((cameraStyle, index) => (
            <div key={`camera-${index}`} className={cameraStyle}></div>
          ))}
          {isPro && <div className={styles.proLabel}>PRO</div>}
        </>
      )}
      
      {deviceType === 'galaxy-fold' && (
        <>
          <div className={styles.fold}></div>
          <div className={styles.foldHighlight}></div>
          {isPro && <div className={styles.proLabel}>PRO</div>}
        </>
      )}
      
      {(deviceType === 'macbook' || deviceType === 'macbook-pro') && (
        <>
          <div className={styles.keyboard}></div>
          <div className={styles.touchpad}></div>
          {deviceType === 'macbook-pro' && isPro && <div className={styles.proLabel}>PRO</div>}
        </>
      )}
      
      {styles.buttons && styles.buttons.map((buttonStyle, index) => (
        <div key={`button-${index}`} className={buttonStyle}></div>
      ))}
      
      <div className={styles.screen}>
        {image && (
          <img 
            src={image} 
            alt="Screenshot" 
            className="w-full h-full object-cover"
          />
        )}
        {!image && (
          <div className="w-full h-full flex items-center justify-center bg-gray-700">
            <p className="text-gray-400 text-sm text-center px-4">Upload a screenshot</p>
          </div>
        )}
      </div>
      
      {/* Only show the PRO badge for non-iPhone Pro devices when isPro is true */}
      {isPro && deviceType !== 'iphone-pro' && (
        <div className="absolute top-2 right-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-2 py-1 rounded-full z-20 opacity-80">
          PRO
        </div>
      )}
    </div>
  );
};

export default DeviceFrame;
