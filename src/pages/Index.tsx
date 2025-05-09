import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import ToolsPanel from '@/components/ToolsPanel';
import DeviceFrame from '@/components/DeviceFrame';
import Footer from '@/components/Footer';
import MarketingPreview from '@/components/MarketingPreview';
import { Loader2, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
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

const Index = () => {
  const { toast } = useToast();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [deviceType, setDeviceType] = useState('iphone');
  const [deviceColor, setDeviceColor] = useState('black');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [shadow, setShadow] = useState(true);
  const [background, setBackground] = useState('white');
  const [marketingPreview, setMarketingPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedAssetUrl, setGeneratedAssetUrl] = useState<string | null>(null);
  const [revisedPrompt, setRevisedPrompt] = useState<string | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [activeTextId, setActiveTextId] = useState<string | null>(null);
  const [devices, setDevices] = useState<Device[]>([
    { id: '1', type: 'iphone', color: 'black', image: null, rotation: { x: 0, y: 0 } }
  ]);
  const [activeDeviceId, setActiveDeviceId] = useState<string>('1');
  const [multipleDevices, setMultipleDevices] = useState({
    enabled: false,
    layout: 'horizontal' as 'horizontal' | 'vertical',
    scale: 0.85
  });
  const [backgroundPattern, setBackgroundPattern] = useState('none');
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [customBackgroundColor, setCustomBackgroundColor] = useState<string | null>(null);
  const [customBackgroundImage, setCustomBackgroundImage] = useState<string | null>(null);

  const handleImageUpload = (image: string) => {
    // Update the active device's image
    setDevices(prev => 
      prev.map(device => 
        device.id === activeDeviceId ? { ...device, image } : device
      )
    );
    
    // Also keep the main uploadedImage state updated for backward compatibility
    setUploadedImage(image);
  };

  const handleDeviceTypeChange = (type: string) => {
    // Check if we need to mark as Pro device
    const isProDevice = ['iphone-pro', 'pixel-pro', 'galaxy-fold', 'macbook-pro'].includes(type);
    
    // Update the active device's type
    setDevices(prev => 
      prev.map(device => 
        device.id === activeDeviceId ? { ...device, type, isPro: isProDevice } : device
      )
    );
    
    // Also keep the main deviceType state updated for backward compatibility
    setDeviceType(type);
    
    // If selecting a Pro device but Pro mode is not enabled, enable it
    if (isProDevice && !isPro) {
      setIsPro(true);
      toast({
        title: "Pro Mode Activated",
        description: "You've selected a Pro device which has unlocked Pro features.",
      });
    }
  };

  const handleDeviceColorChange = (color: string) => {
    // Update the active device's color
    setDevices(prev => 
      prev.map(device => 
        device.id === activeDeviceId ? { ...device, color } : device
      )
    );
    
    // Also keep the main deviceColor state updated for backward compatibility
    setDeviceColor(color);
  };

  const handleOrientationChange = (orientation: 'portrait' | 'landscape') => {
    setOrientation(orientation);
  };

  const handleShadowChange = (shadow: boolean) => {
    setShadow(shadow);
  };

  const handleBackgroundChange = (color: string) => {
    setBackground(color);
    // Reset background pattern when changing background color
    setBackgroundPattern('none');
  };

  const handleProChange = (enabled: boolean) => {
    setIsPro(enabled);
    
    // If enabling Pro, update the active device to be a Pro device if it's not already
    if (enabled) {
      const activeDevice = devices.find(d => d.id === activeDeviceId);
      if (activeDevice && !['iphone-pro', 'pixel-pro', 'galaxy-fold', 'macbook-pro'].includes(activeDevice.type)) {
        // Convert the active device to its Pro version if available
        let proType = activeDevice.type;
        if (activeDevice.type === 'iphone') proType = 'iphone-pro';
        else if (activeDevice.type === 'macbook') proType = 'macbook-pro';
        
        handleDeviceTypeChange(proType);
      }
    }
  };
  
  const handleRotationChange = (id: string, rotation: { x: number, y: number }) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id ? { ...device, rotation } : device
      )
    );
  };

  const handleDownloadImage = () => {
    if (generatedAssetUrl) {
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a');
      a.href = generatedAssetUrl;
      a.download = `mockupmagic-${marketingPreview}-${new Date().getTime()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast({
        title: "Download started",
        description: `Your ${marketingPreview} mockup is being downloaded.`,
      });
    }
  };

  const generatePatternImage = (patternType: string, width: number, height: number, bgColor: string): string => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    
    // Fill with background color
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
    
    // Apply patterns that match CSS implementation
    switch(patternType) {
      case 'dots':
        // Draw dots pattern - match radial-gradient(black 1px, transparent 1px)
        const dotSize = 1;
        const dotSpacing = 20;
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        
        for (let x = 0; x < width; x += dotSpacing) {
          for (let y = 0; y < height; y += dotSpacing) {
            ctx.beginPath();
            ctx.arc(x, y, dotSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        break;
        
      case 'grid':
        // Draw grid pattern - match CSS grid pattern
        const gridSize = 20;
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        
        for (let x = 0; x < width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        
        for (let y = 0; y < height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        break;
        
      case 'lines':
        // Draw diagonal lines - match 45deg repeating linear gradient
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 8; // Slightly thinner lines
        
        // Save context to restore after rotation
        ctx.save();
        
        // Rotate 45 degrees 
        ctx.translate(width/2, height/2);
        ctx.rotate(Math.PI / 4); // 45 degrees in radians
        ctx.translate(-width/2, -height/2);
        
        // Draw horizontal lines that will appear at 45 degrees due to rotation
        const lineGap = 40; // Increased line spacing
        
        for (let y = -height; y < height * 2; y += lineGap) {
          ctx.beginPath();
          ctx.moveTo(-width, y);
          ctx.lineTo(width * 2, y);
          ctx.stroke();
        }
        
        // Restore the context
        ctx.restore();
        break;
        
      case 'zigzag':
        // Match repeating-linear-gradient(-45deg, rgba(0,0,0,0.1), rgba(0,0,0,0.1) 10px, transparent 10px, transparent 20px)
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 8; // Slightly thinner lines
        
        // Save context to restore after rotation
        ctx.save();
        
        // Rotate -45 degrees
        ctx.translate(width/2, height/2);
        ctx.rotate(-Math.PI / 4); // -45 degrees in radians
        ctx.translate(-width/2, -height/2);
        
        // Draw horizontal lines at -45 degrees due to rotation
        const zigGap = 40; // Increased line spacing
        
        for (let y = -height; y < height * 2; y += zigGap) {
          ctx.beginPath();
          ctx.moveTo(-width, y);
          ctx.lineTo(width * 2, y);
          ctx.stroke();
        }
        
        // Restore the context
        ctx.restore();
        break;
        
      case 'waves':
        // Approximate the repeating-radial-gradient style
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        
        // Calculate a fixed number of circles instead of using fixed radius increments
        // This scales better with different size canvases
        const maxRadius = Math.max(width, height) * 2;
        const circleCount = 40; // Fixed number of circles
        const radiusStep = maxRadius / circleCount; // Dynamic radius increment
        
        for (let radius = radiusStep; radius < maxRadius; radius += radiusStep) {
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
        break;
    }
    
    return canvas.toDataURL('image/png');
  };

  const handleExport = async (type: string) => {
    if (!uploadedImage) {
      toast({
        title: "No screenshot",
        description: "Please upload a screenshot first.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'mockup') {
      // Show a loading state
      setIsLoading(true);
      
      toast({
        title: "Preparing export",
        description: "Generating your mockup, please wait...",
      });
      
      // Save original background state
      const originalBackground = background;
      const originalCustomBackground = customBackgroundColor;
      const originalBackgroundPattern = backgroundPattern;
      const originalCustomBackgroundImage = customBackgroundImage;
      
      // Set all draggable elements to have non-draggable style temporarily for export
      const draggableElements = document.querySelectorAll('.react-draggable');
      draggableElements.forEach(el => {
        (el as HTMLElement).style.pointerEvents = 'none';
      });

      // Ensure text elements are visible during export
      const textElements = document.querySelectorAll('.text-element');
      textElements.forEach(el => {
        (el as HTMLElement).style.zIndex = '9999';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.visibility = 'visible';
      });

      // Save original container styling
      const mockupContainer = document.querySelector('#mockup-container') as HTMLElement;
      const originalContainerStyles = {
        width: mockupContainer.style.width,
        maxWidth: mockupContainer.style.maxWidth,
        height: mockupContainer.style.height,
        padding: mockupContainer.style.padding,
        display: mockupContainer.style.display,
        alignItems: mockupContainer.style.alignItems,
        justifyContent: mockupContainer.style.justifyContent,
        position: mockupContainer.style.position,
        overflow: mockupContainer.style.overflow,
        background: mockupContainer.style.background,
        backgroundImage: mockupContainer.style.backgroundImage,
        backgroundSize: mockupContainer.style.backgroundSize,
        backgroundColor: mockupContainer.style.backgroundColor
      };

      // Ensure the device container has the correct layout before capturing
      const deviceContainer = document.querySelector('.devices-container') as HTMLElement;
      const originalDeviceStyles = {
        flexDirection: deviceContainer.style.flexDirection,
        flexWrap: deviceContainer.style.flexWrap,
        width: deviceContainer.style.width,
        justifyContent: deviceContainer.style.justifyContent,
        gap: deviceContainer.style.gap,
        padding: deviceContainer.style.padding
      };
      
      // Remember if we added a temporary background
      let tempBgElement: HTMLElement | null = null;
      
      try {
        // Force all devices to use the same consistent scale
        const deviceElements = mockupContainer.querySelectorAll('.devices-container > div');
        deviceElements.forEach(el => {
          // Remove any selection rings
          (el as HTMLElement).classList.remove('ring-4', 'ring-blue-500', 'rounded-[60px]');
          (el as HTMLElement).style.padding = '0';
          (el as HTMLElement).style.margin = '16px'; // Consistent margin 
          (el as HTMLElement).style.transform = 'scale(1)'; // Reset to uniform scale
          // Fix z-index to prevent overlap
          (el as HTMLElement).style.zIndex = '10';
          (el as HTMLElement).style.position = 'relative';
          // Ensure visibility
          (el as HTMLElement).style.opacity = '1';
          (el as HTMLElement).style.visibility = 'visible';
          // Remove any selection indicators
          const innerRings = (el as HTMLElement).querySelectorAll('.ring');
          innerRings.forEach(ring => {
            (ring as HTMLElement).classList.remove('ring-4', 'ring-blue-500');
          });
        });

        // Apply export-specific styling
        if (multipleDevices.enabled) {
          // Set fixed container width for better export - increase width for many devices
          const devicesCount = devices.length;
          let containerWidth = '1200px';
          
          // Scale container width based on number of devices
          if (devicesCount <= 2) {
            containerWidth = '900px';
          } else if (devicesCount <= 3) {
            containerWidth = '1200px';
          } else if (devicesCount <= 4) {
            containerWidth = '1500px';
          } else {
            containerWidth = '1800px';
          }
          
          mockupContainer.style.width = containerWidth;
          mockupContainer.style.maxWidth = containerWidth;
          mockupContainer.style.height = 'auto';
          mockupContainer.style.minHeight = '800px';
          mockupContainer.style.padding = '40px';
          mockupContainer.style.display = 'flex';
          mockupContainer.style.alignItems = 'center';
          mockupContainer.style.justifyContent = 'center';
          mockupContainer.style.position = 'relative';
          mockupContainer.style.overflow = 'visible';
          
          // Force horizontal layout for devices
          deviceContainer.style.flexDirection = 'row';
          deviceContainer.style.flexWrap = 'wrap';
          deviceContainer.style.width = '100%';
          deviceContainer.style.justifyContent = 'center';
          deviceContainer.style.alignItems = 'center';
          deviceContainer.style.gap = '40px';
          deviceContainer.style.padding = '20px';
          deviceContainer.style.position = 'relative';
          
          // Add additional styling for wrapped layouts
          if (devicesCount > 3) {
            deviceContainer.style.rowGap = '60px';
          }
        }

        // Handle pattern - render it directly as a background image
        if (backgroundPattern !== 'none') {
          // Remove any existing pattern overlay
          const patternOverlay = mockupContainer.querySelector('.pattern-overlay') as HTMLElement;
          if (patternOverlay) {
            patternOverlay.style.display = 'none';
          }
          
          // Hide any SVG pattern elements
          const svgPatterns = mockupContainer.querySelectorAll('svg');
          svgPatterns.forEach(svg => {
            (svg as SVGElement).style.display = 'none';
          });
          
          // Get background color
          const computedStyle = window.getComputedStyle(mockupContainer);
          const bgColor = computedStyle.backgroundColor;
          
          // Generate pattern image with larger dimensions to reduce obvious repetition
          const patternWidth = 2000; // Increased size for better quality
          const patternHeight = 2000;
          const patternUrl = generatePatternImage(backgroundPattern, patternWidth, patternHeight, bgColor);
          
          // Create a temporary background element and insert it
          tempBgElement = document.createElement('div');
          tempBgElement.style.position = 'absolute';
          tempBgElement.style.inset = '0';
          tempBgElement.style.zIndex = '1'; // Lower z-index to ensure it's behind content
          tempBgElement.style.backgroundImage = `url(${patternUrl})`;
          tempBgElement.style.backgroundRepeat = 'repeat';
          tempBgElement.style.backgroundSize = backgroundPattern === 'waves' ? '100% 100%' : 'auto'; // Scale waves pattern to fill container
          tempBgElement.style.opacity = '1';
          tempBgElement.style.pointerEvents = 'none';
          
          // Insert as first child of mockup container
          mockupContainer.insertBefore(tempBgElement, mockupContainer.firstChild);
          
          // Give a moment for the browser to render the new background
          await new Promise(resolve => setTimeout(resolve, 500)); // Increased time for rendering
        }

        // Create a new canvas to render the mockup - with improved settings
        let canvas = await html2canvas(mockupContainer, {
          allowTaint: true,
          useCORS: true,
          scale: 2, // Higher resolution for better quality
          logging: true, // Enable logging for debugging
          foreignObjectRendering: false, // Try disabling this as it can cause issues
          removeContainer: false, // Don't remove the container
          backgroundColor: null, // Keep background transparency
          width: mockupContainer.offsetWidth,
          height: mockupContainer.offsetHeight,
          onclone: (clonedDoc) => {
            // Additional preparation for the cloned document that will be rendered
            const clonedContainer = clonedDoc.getElementById('mockup-container');
            if (clonedContainer) {
              // Ensure all content is visible in the clone
              clonedContainer.style.visibility = 'visible';
              clonedContainer.style.opacity = '1';
              
              // Fix cloned device elements
              const clonedDevices = clonedContainer.querySelectorAll('.devices-container > div');
              clonedDevices.forEach(el => {
                (el as HTMLElement).style.position = 'relative';
                (el as HTMLElement).style.opacity = '1';
                (el as HTMLElement).style.visibility = 'visible';
                (el as HTMLElement).style.zIndex = '10';
              });
            }
          }
        });

        // Create download link
        const imageUrl = canvas.toDataURL('image/png');

        // Create and click download link
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = `mockupmagic-${deviceType}-${new Date().getTime()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        toast({
          title: "Export successful",
          description: "Your mockup has been exported as PNG.",
        });
      } catch (err) {
        console.error("Error exporting mockup:", err);
        toast({
          title: "Export failed",
          description: "Could not export the mockup. Please try again.",
          variant: "destructive",
        });
      } finally {
        // Turn off loading state
        setIsLoading(false);
        
        // Remove temporary background if added
        if (tempBgElement && tempBgElement.parentNode) {
          tempBgElement.parentNode.removeChild(tempBgElement);
        }

        // Restore original background state
        setBackground(originalBackground);
        setCustomBackgroundColor(originalCustomBackground);
        setBackgroundPattern(originalBackgroundPattern);
        setCustomBackgroundImage(originalCustomBackgroundImage);
        
        // Restore original styles
        if (mockupContainer) {
          mockupContainer.style.width = originalContainerStyles.width;
          mockupContainer.style.maxWidth = originalContainerStyles.maxWidth;
          mockupContainer.style.height = originalContainerStyles.height;
          mockupContainer.style.padding = originalContainerStyles.padding;
          mockupContainer.style.display = originalContainerStyles.display;
          mockupContainer.style.alignItems = originalContainerStyles.alignItems;
          mockupContainer.style.justifyContent = originalContainerStyles.justifyContent;
          mockupContainer.style.position = originalContainerStyles.position;
          mockupContainer.style.overflow = originalContainerStyles.overflow;
          mockupContainer.style.background = originalContainerStyles.background;
          mockupContainer.style.backgroundImage = originalContainerStyles.backgroundImage;
          mockupContainer.style.backgroundSize = originalContainerStyles.backgroundSize;
          mockupContainer.style.backgroundColor = originalContainerStyles.backgroundColor;
        }
        
        if (deviceContainer) {
          deviceContainer.style.flexDirection = originalDeviceStyles.flexDirection;
          deviceContainer.style.flexWrap = originalDeviceStyles.flexWrap;
          deviceContainer.style.width = originalDeviceStyles.width;
          deviceContainer.style.justifyContent = originalDeviceStyles.justifyContent;
          deviceContainer.style.gap = originalDeviceStyles.gap;
          deviceContainer.style.padding = originalDeviceStyles.padding;
        }
        
        // Restore pattern overlay visibility
        const patternOverlay = document.querySelector('.pattern-overlay') as HTMLElement;
        if (patternOverlay) {
          patternOverlay.style.display = 'block';
        }
        
        // Restore SVG patterns
        const svgPatterns = mockupContainer.querySelectorAll('svg');
        svgPatterns.forEach(svg => {
          (svg as SVGElement).style.display = 'block';
        });
        
        // Restore device styles
        const deviceElements = mockupContainer.querySelectorAll('.devices-container > div');
        deviceElements.forEach((el, index) => {
          const device = devices[index];
          if (device) {
            // Restore selection ring for active device
            if (device.id === activeDeviceId) {
              (el as HTMLElement).classList.add('ring-4', 'ring-blue-500', 'rounded-[60px]');
              (el as HTMLElement).style.padding = '8px';
            }
            // Restore scaling from multipleDevices state
            if (multipleDevices.enabled) {
              (el as HTMLElement).style.transform = `scale(${multipleDevices.scale})`;
            }
          }
        });
        
        // Restore draggable style
        draggableElements.forEach(el => {
          (el as HTMLElement).style.pointerEvents = 'auto';
        });
      }
    } else {
      // Call backend to generate marketing asset
      setIsLoading(true);
      setGeneratedAssetUrl(null); // Reset previous asset
      setRevisedPrompt(null); // Reset previous prompt
      setMarketingPreview(type); // Open modal immediately

      try {
        // Replace localhost URL with Supabase Edge Function URL
        const functionUrl = 'https://ymeoglaoccsstbwbqicq.supabase.co/functions/v1/generate-marketing-asset';

        // Retrieve the Supabase anon key
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZW9nbGFvY2Nzc3Rid2JxaWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MjgxNDQsImV4cCI6MjA2MjAwNDE0NH0.08zMmn-gLm4-2_7odg5-gC25sSmyrP8iZKZu6qBqLAo';

        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add Supabase required headers
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey 
          },
          body: JSON.stringify({
            mockupImage: uploadedImage,
            deviceType: deviceType,
            outputType: type,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate marketing asset');
        }

        const data = await response.json();

        if (data.success && data.imageUrl) {
          setGeneratedAssetUrl(data.imageUrl);
          if (data.revisedPrompt) {
            setRevisedPrompt(data.revisedPrompt);
          }
          toast({
            title: "Asset Generated",
            description: `Your ${type} marketing asset is ready for preview.`,
          });
        } else {
          throw new Error('API response missing success or imageUrl');
        }

      } catch (error) {
        console.error("Error generating marketing asset:", error);
        toast({
          title: "Generation Failed",
          description: "Could not generate the marketing asset. Please try again.",
          variant: "destructive",
        });
        setMarketingPreview(null); // Close modal on error
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddTextElement = () => {
    const newId = `text-${Date.now()}`;
    const newElement: TextElement = {
      id: newId,
      text: 'Edit this text',
      color: 'black',
      fontSize: 18,
      fontFamily: 'Arial',
      position: { x: 0, y: 0 }
    };
    
    setTextElements(prev => [...prev, newElement]);
    setActiveTextId(newId);
  };

  const handleUpdateTextElement = (id: string, field: keyof TextElement, value: any) => {
    setTextElements(prev => 
      prev.map(element => 
        element.id === id ? { ...element, [field]: value } : element
      )
    );
  };

  const handleRemoveTextElement = (id: string) => {
    setTextElements(prev => prev.filter(element => element.id !== id));
    if (activeTextId === id) {
      setActiveTextId(null);
    }
  };

  const handleTextDragStop = (id: string, data: { x: number, y: number }) => {
    handleUpdateTextElement(id, 'position', { x: data.x, y: data.y });
  };

  const handleMultipleDevicesChange = (field: string, value: string | boolean | number) => {
    setMultipleDevices(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBackgroundPatternChange = (pattern: string) => {
    setBackgroundPattern(pattern);
  };

  const getBackgroundStyle = () => {
    // Get the base background color or gradient only
    // No need to handle patterns here anymore as we have a dedicated overlay element
    switch (background) {
      case 'white':
        return 'bg-white';
      case 'gray':
        return 'bg-mockup-gray-100';
      case 'blue':
        return 'bg-blue-100';
      case 'green':
        return 'bg-green-100';
      case 'purple':
        return 'bg-purple-100';
      case 'pink':
        return 'bg-pink-100';
      case 'yellow':
        return 'bg-yellow-100';
      case 'orange':
        return 'bg-orange-100';
      case 'gradient':
        return 'bg-gradient-to-br from-green-100 to-blue-100';
      case 'gradient-purple':
        return 'bg-gradient-to-br from-purple-100 to-pink-100';
      case 'custom-color':
        return ''; // Will use inline style for custom color
      case 'custom-image':
        return ''; // Will use inline style for custom image
      default:
        return 'bg-white';
    }
  };

  const handleAddDevice = () => {
    // Generate a new unique ID
    const newId = `${Date.now()}`;
    
    // Add a new device to the list - if Pro is enabled, make it a Pro device
    const newType = isPro ? 'iphone-pro' : 'iphone';
    
    setDevices(prev => [...prev, { 
      id: newId, 
      type: newType, 
      color: 'black', 
      image: uploadedImage, // use the main image as default
      isPro: isPro && ['iphone-pro', 'pixel-pro', 'galaxy-fold', 'macbook-pro'].includes(newType),
      rotation: { x: 0, y: 0 }
    }]);
    
    // Make the new device active
    setActiveDeviceId(newId);
    
    // Enable multiple devices mode if not already enabled
    if (!multipleDevices.enabled) {
      setMultipleDevices(prev => ({ ...prev, enabled: true }));
    }
  };

  const handleRemoveDevice = (id: string) => {
    // Don't allow removing the last device
    if (devices.length <= 1) return;
    
    // Remove the device
    setDevices(prev => prev.filter(device => device.id !== id));
    
    // If removing the active device, set another one as active
    if (activeDeviceId === id) {
      const remainingDevices = devices.filter(device => device.id !== id);
      setActiveDeviceId(remainingDevices[0].id);
    }
    
    // Disable multiple devices mode if only one device remains
    if (devices.length === 2) {
      setMultipleDevices(prev => ({ ...prev, enabled: false }));
    }
  };

  const handleSelectDevice = (id: string) => {
    setActiveDeviceId(id);
    
    // Update the main states to reflect the selected device
    const selectedDevice = devices.find(device => device.id === id);
    if (selectedDevice) {
      setDeviceType(selectedDevice.type);
      setDeviceColor(selectedDevice.color);
      setUploadedImage(selectedDevice.image);
    }
  };

  const handlePanelCollapseChange = (collapsed: boolean) => {
    setIsPanelCollapsed(collapsed);
    
    // Force a re-render of draggable elements when panel collapse state changes
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 300); // Match the duration of the transition
  };

  const handleCustomBackgroundColorChange = (color: string) => {
    setCustomBackgroundColor(color);
    // Reset other background options
    setBackground('custom-color');
    // Don't reset pattern when changing custom color
    // setBackgroundPattern('none');
    setCustomBackgroundImage(null);
  };

  const handleCustomBackgroundImageUpload = (image: string) => {
    setCustomBackgroundImage(image);
    // Reset other background options
    setBackground('custom-image');
    // Don't reset pattern when changing custom image
    // setBackgroundPattern('none');
    setCustomBackgroundColor(null);
    
    toast({
      title: "Background Image Set",
      description: "Your custom background image has been applied.",
    });
  };

  const getBackgroundInlineStyle = () => {
    // First handle custom color and custom image
    if (background === 'custom-color' && customBackgroundColor) {
      return { backgroundColor: customBackgroundColor };
    }
    if (background === 'custom-image' && customBackgroundImage) {
      return { 
        backgroundImage: `url(${customBackgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center' 
      };
    }

    // Now handle regular colors with direct background colors to ensure they always work
    switch (background) {
      case 'white':
        return { backgroundColor: '#FFFFFF' };
      case 'gray':
        return { backgroundColor: '#F3F4F6' }; // mockup-gray-100
      case 'blue':
        return { backgroundColor: '#DBEAFE' }; // blue-100
      case 'green':
        return { backgroundColor: '#D1FAE5' }; // green-100
      case 'purple':
        return { backgroundColor: '#EDE9FE' }; // purple-100
      case 'pink':
        return { backgroundColor: '#FCE7F3' }; // pink-100
      case 'yellow':
        return { backgroundColor: '#FEF3C7' }; // yellow-100
      case 'orange':
        return { backgroundColor: '#FFEDD5' }; // orange-100
      case 'gradient':
        return { 
          backgroundImage: 'linear-gradient(to bottom right, #D1FAE5, #DBEAFE)',
        };
      case 'gradient-purple':
        return { 
          backgroundImage: 'linear-gradient(to bottom right, #EDE9FE, #FCE7F3)',
        };
      default:
        return {};
    }
  };

  const getPatternStyle = () => {
    if (backgroundPattern === 'none') return {};
    
    switch (backgroundPattern) {
      case 'dots':
        return {
          backgroundImage: `radial-gradient(rgba(0, 0, 0, 0.3) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        };
      case 'grid':
        return {
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), 
                            linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        };
      case 'lines':
        return {
          backgroundImage: `linear-gradient(45deg, rgba(0, 0, 0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent)`,
          backgroundSize: '40px 40px'
        };
      case 'zigzag':
        return {
          backgroundImage: `linear-gradient(-45deg, rgba(0, 0, 0, 0.1) 25%, transparent 25%, transparent 50%, rgba(0, 0, 0, 0.1) 50%, rgba(0, 0, 0, 0.1) 75%, transparent 75%, transparent)`,
          backgroundSize: '40px 40px'
        };
      case 'waves':
        return {
          position: 'relative',
          overflow: 'hidden'
        };
      default:
        return {};
    }
  };

  // Adding specialized component for wave pattern that renders actual SVG waves
  const WavePatternOverlay = () => {
    if (backgroundPattern !== 'waves') return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden" style={{ pointerEvents: 'none' }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity: 0.1 }}>
          <circle cx="0" cy="0" r="10" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="20" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="30" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="40" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="50" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="60" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="70" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="80" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="90" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="100" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="110" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="120" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="130" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="140" fill="none" stroke="black" strokeWidth="0.5" />
          <circle cx="0" cy="0" r="150" fill="none" stroke="black" strokeWidth="0.5" />
        </svg>
      </div>
    );
  };

  const activeDevice = devices.find(d => d.id === activeDeviceId) || devices[0];

  // Inside the component, before the return statement
  // Add this to handle responsive layout adjustments when sidebar is collapsed
  useEffect(() => {
    // Force a layout recalculation when sidebar collapse state changes
    if (multipleDevices.enabled) {
      // Short delay to allow CSS transitions to complete
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 350);
    }
  }, [isPanelCollapsed, multipleDevices.enabled]);

  // Inside the component, before the return statement
  // Add this to handle responsive scaling
  useEffect(() => {
    const handleResize = () => {
      if (multipleDevices.enabled && devices.length >= 3) {
        // Get the container width
        const container = document.getElementById('mockup-container');
        if (container) {
          const containerWidth = container.offsetWidth;
          const deviceWidth = 280; // Approximate width of a device
          const deviceCount = devices.length;
          
          // Calculate how many devices can fit in a row with current scale
          const devicesPerRow = Math.floor(containerWidth / (deviceWidth * multipleDevices.scale));
          
          // If fewer devices fit than we have, and screen is small, adjust scale automatically
          if (devicesPerRow < deviceCount && containerWidth < 1200) {
            const newScale = Math.max(0.5, Math.min(0.9, (containerWidth * 0.9) / (deviceWidth * deviceCount)));
            setMultipleDevices(prev => ({
              ...prev,
              scale: parseFloat(newScale.toFixed(2))
            }));
          }
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    // Run once on mount and when devices change
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [devices.length, multipleDevices.enabled, isPanelCollapsed]);

  const getContainerClasses = () => {
    // When sidebar is collapsed and we have multiple devices, use more space
    if (isPanelCollapsed && multipleDevices.enabled) {
      // If we have 4+ devices, go full width always
      if (devices.length >= 4) {
        return 'w-full mx-auto px-2 py-4';
      }
      return 'max-w-full mx-auto px-4 py-8';
    }
    
    return 'container max-w-screen-xl mx-auto px-4 py-8';
  };

  return (
    <div className="min-h-screen flex flex-col bg-mockup-gray-50">
      <Header />
      
      <main className="flex-1">
        <div className={getContainerClasses()}>
          <div className={`grid grid-cols-1 ${isPanelCollapsed ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-6`}>
            <div className={`${isPanelCollapsed ? 'lg:col-span-1' : 'lg:col-span-2'} order-2 lg:order-1`}>
              {marketingPreview ? (
                <div className="bg-white rounded-lg border border-mockup-gray-200 p-6 relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 left-2 p-1 h-auto" 
                    onClick={() => setMarketingPreview(null)}
                  >
                    <ChevronLeft size={16} />
                    <span className="ml-1 text-xs">Back</span>
                  </Button>
                  
                  <div className="mt-6">
                    <MarketingPreview type={marketingPreview} imageUrl={generatedAssetUrl || ''} />
                  </div>
                  
                  {generatedAssetUrl && (
                    <div className="mt-4 flex justify-center">
                      <Button onClick={handleDownloadImage} className="flex items-center gap-2">
                        <Download size={16} />
                        Download Image
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  {isLoading && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-20 rounded-lg">
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-sm font-medium">Generating your mockup...</p>
                        {revisedPrompt && (
                          <p className="text-xs text-center max-w-xs text-gray-500 mt-2">
                            "{revisedPrompt}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div 
                    id="mockup-container"
                    className={`
                      min-h-[500px] bg-white rounded-lg border border-mockup-gray-200 
                      ${isPanelCollapsed ? 'p-2 lg:p-4' : 'p-6 lg:p-8'}
                      flex flex-col items-center justify-center relative
                      ${isPanelCollapsed && multipleDevices.enabled ? 'w-full max-w-none' : ''}
                    `}
                    style={{
                      ...getBackgroundInlineStyle(),
                      ...(isPanelCollapsed && multipleDevices.enabled ? { minHeight: '600px' } : {})
                    }}
                  >
                    {/* Pattern overlay - non-waves patterns use CSS */}
                    {backgroundPattern !== 'none' && backgroundPattern !== 'waves' && (
                      <div 
                        className="absolute inset-0 pattern-overlay"
                        style={getPatternStyle()}
                      ></div>
                    )}
                    
                    {/* Wave pattern uses SVG for better scaling */}
                    {backgroundPattern === 'waves' && (
                      <WavePatternOverlay />
                    )}
            
                    {/* Text elements */}
                    {textElements.map((element) => (
                      <Draggable
                        key={element.id}
                        position={element.position}
                        onStop={(e, data) => handleTextDragStop(element.id, data)}
                        bounds="parent"
                      >
                        <div 
                          className={`text-element absolute ${activeTextId === element.id ? 'ring-2 ring-blue-500' : ''}`}
                          style={{
                            color: element.color,
                            fontSize: `${element.fontSize}px`,
                            fontFamily: element.fontFamily,
                            cursor: 'move',
                            zIndex: activeTextId === element.id ? 100 : 10,
                            transform: `translate(${element.position.x}px, ${element.position.y}px)`
                          }}
                          onClick={() => setActiveTextId(element.id)}
                        >
                          {element.text}
                        </div>
                      </Draggable>
                    ))}
            
                    <div className={`
                      flex items-center justify-center
                      ${multipleDevices.enabled ? 
                        `gap-2 md:gap-4 ${multipleDevices.layout === 'horizontal' ? 'flex-row flex-wrap' : 'flex-col'} 
                         w-full overflow-hidden ${isPanelCollapsed ? 'p-2 lg:p-4 scale-100' : ''}` 
                        : ''
                      }
                      devices-container
                      ${isPanelCollapsed && multipleDevices.enabled ? 'collapsed-view' : ''}
                      ${devices.length >= 4 ? 'small-gap' : ''}
                    `}>
                      {devices.map((device, index) => (
                        <div 
                          key={device.id}
                          className={`
                            animate-float relative 
                            ${multipleDevices.enabled ? 
                              `transform origin-center` 
                              : ''
                            }
                            ${isPanelCollapsed && multipleDevices.enabled ? 'p-1 lg:p-2' : ''}
                            ${activeDeviceId === device.id ? 'ring-4 ring-blue-500 rounded-[60px] p-2' : ''}
                          `}
                          style={{ 
                            animationDelay: `${index * 0.2}s`,
                            // Apply direct transform scale for better precision
                            transform: multipleDevices.enabled ? `scale(${multipleDevices.scale})` : '',
                            margin: multipleDevices.enabled && devices.length >= 4 ? '4px' : undefined
                          }}
                          onClick={() => handleSelectDevice(device.id)}
                        >
                          <DeviceFrame 
                            image={device.image} 
                            deviceType={device.type}
                            deviceColor={device.color}
                            orientation={orientation}
                            shadow={shadow}
                            isPro={device.isPro}
                            rotation={device.rotation}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
          
                  {/* Toggle button for panel collapse */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden w-full mt-4"
                    onClick={() => handlePanelCollapseChange(!isPanelCollapsed)}
                  >
                    {isPanelCollapsed ? 'Show Settings' : 'Hide Settings'}
                  </Button>
                </div>
              )}
            </div>
            
            <div className={`lg:col-span-1 order-1 lg:order-2 ${isPanelCollapsed ? 'lg:absolute lg:right-4 lg:top-24 lg:z-10' : ''}`}>
              <div className={`${isPanelCollapsed ? 'hidden' : 'block'}`}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-mockup-gray-800">Mockup Settings</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePanelCollapseChange(!isPanelCollapsed)}
                    className="hidden lg:flex items-center gap-1"
                  >
                    <ChevronRight size={16} />
                    <span>Hide</span>
                  </Button>
                </div>
                <ToolsPanel 
                  onImageUpload={handleImageUpload}
                  onDeviceTypeChange={handleDeviceTypeChange}
                  onDeviceColorChange={handleDeviceColorChange}
                  onOrientationChange={handleOrientationChange}
                  onShadowChange={handleShadowChange}
                  onBackgroundChange={handleBackgroundChange}
                  deviceType={deviceType}
                  deviceColor={deviceColor}
                  orientation={orientation}
                  shadow={shadow}
                  background={background}
                  hasImage={!!uploadedImage}
                  onExport={handleExport}
                  textElements={textElements}
                  activeTextId={activeTextId}
                  onAddTextElement={handleAddTextElement}
                  onUpdateTextElement={handleUpdateTextElement}
                  onRemoveTextElement={handleRemoveTextElement}
                  onTextElementSelect={setActiveTextId}
                  multipleDevices={multipleDevices}
                  onMultipleDevicesChange={handleMultipleDevicesChange}
                  backgroundPattern={backgroundPattern}
                  onBackgroundPatternChange={handleBackgroundPatternChange}
                  devices={devices}
                  activeDeviceId={activeDeviceId}
                  onSelectDevice={handleSelectDevice}
                  onAddDevice={handleAddDevice}
                  onRemoveDevice={handleRemoveDevice}
                  collapsed={isPanelCollapsed}
                  onCollapseChange={handlePanelCollapseChange}
                  isPro={isPro}
                  onProChange={handleProChange}
                  onRotationChange={handleRotationChange}
                  customBackgroundImage={customBackgroundImage}
                  customBackgroundColor={customBackgroundColor}
                  onCustomBackgroundImageUpload={handleCustomBackgroundImageUpload}
                  onCustomBackgroundColorChange={handleCustomBackgroundColorChange}
                />
              </div>
              
              {/* Show button to expand panel when collapsed */}
              {isPanelCollapsed && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePanelCollapseChange(false)}
                  className="hidden lg:flex items-center gap-1 mt-2"
                >
                  <ChevronLeft size={16} />
                  <span>Show Settings</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Hidden elements for export */}
      <div id="capture-area" className="hidden"></div>
    </div>
  );
};

export default Index;