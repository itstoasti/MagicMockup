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
  const [openAIPrompt, setOpenAIPrompt] = useState<string>('');
  const [showOpenAIPromptModal, setShowOpenAIPromptModal] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });

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

  // Helper to get the readable device type name
  const getDeviceTypeName = (type: string) => {
    switch(type) {
      case 'iphone': return 'iPhone 14 Pro';
      case 'iphone-pro': return 'iPhone 15 Pro';
      case 'pixel-pro': return 'Pixel Pro';
      case 'galaxy-fold': return 'Galaxy Fold';
      case 'android': return 'Android Phone';
      case 'ipad': return 'iPad Pro';
      case 'macbook': return 'MacBook';
      case 'macbook-pro': return 'MacBook Pro';
      default: return type;
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

    if (type === 'openai-mockup') {
      // Show the OpenAI prompt modal
      setOpenAIPrompt('');
      setShowOpenAIPromptModal(true);
      return;
    }

    if (type === 'openai-mockup-confirmed') {
      // User has confirmed the prompt, proceed with OpenAI image generation
      setIsLoading(true);
      setGeneratedAssetUrl(null); // Reset previous asset
      setRevisedPrompt(null); // Reset previous prompt
      setMarketingPreview('openai-mockup'); // Open marketing preview modal

      try {
        // Export the current mockup to use as a reference image
        const mockupContainer = document.querySelector('#mockup-container') as HTMLElement;
        if (!mockupContainer) {
          throw new Error('Mockup container not found');
        }

        const canvas = await html2canvas(mockupContainer, {
          allowTaint: true,
          useCORS: true,
          scale: 2,
          backgroundColor: null,
        });
        
        const mockupImageBase64 = canvas.toDataURL('image/png');
        
        // Call Supabase Edge function to handle the OpenAI API call (security)
        const functionUrl = 'https://ymeoglaoccsstbwbqicq.supabase.co/functions/v1/generate-openai-mockup';
        const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InltZW9nbGFvY2Nzc3Rid2JxaWNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0MjgxNDQsImV4cCI6MjA2MjAwNDE0NH0.08zMmn-gLm4-2_7odg5-gC25sSmyrP8iZKZu6qBqLAo';

        // Get active device type for better prompts
        const activeDevice = devices.find(d => d.id === activeDeviceId);
        const deviceTypeName = activeDevice 
          ? getDeviceTypeName(activeDevice.type) 
          : 'smartphone';

        const response = await fetch(functionUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseAnonKey}`,
            'apikey': supabaseAnonKey
          },
          body: JSON.stringify({
            mockupImage: mockupImageBase64,
            deviceType: deviceTypeName,
            userPrompt: openAIPrompt,
            model: 'gpt-image-1' // Use OpenAI Images API with gpt-image-1 model
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate AI mockup scene');
        }

        const data = await response.json();

        if (data.success && data.imageUrl) {
          setGeneratedAssetUrl(data.imageUrl);
          if (data.revisedPrompt) {
            setRevisedPrompt(data.revisedPrompt);
          }
          toast({
            title: "AI Scene Generated",
            description: "Your custom scene mockup is ready for preview.",
          });
        } else {
          throw new Error('API response missing success or imageUrl');
        }

      } catch (error) {
        console.error("Error generating AI scene mockup:", error);
        toast({
          title: "Generation Failed",
          description: "Could not generate the AI scene. Please try again.",
          variant: "destructive",
        });
        setMarketingPreview(null); // Close modal on error
      } finally {
        setIsLoading(false);
      }
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
        (el as HTMLElement).style.position = 'static'; // Ensure draggable wrapper doesn't interfere
      });

      // Ensure text elements are visible during export
      const textElements = document.querySelectorAll('.text-element');
      textElements.forEach(el => {
        (el as HTMLElement).style.zIndex = '9999';
        (el as HTMLElement).style.opacity = '1';
        (el as HTMLElement).style.visibility = 'visible';
        (el as HTMLElement).style.position = 'absolute';
        (el as HTMLElement).style.pointerEvents = 'none'; // Prevent interaction during capture
      });

      // Save original container styling
      let mockupContainer = document.querySelector('#mockup-container') as HTMLElement;
      const originalContainerStyles = {
        width: mockupContainer.style.width,
        maxWidth: mockupContainer.style.maxWidth,
        height: mockupContainer.style.height,
        padding: mockupContainer.style.padding,
        margin: mockupContainer.style.margin,
        minWidth: mockupContainer.style.minWidth,
        minHeight: mockupContainer.style.minHeight,
        maxHeight: mockupContainer.style.maxHeight,
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
      
      // Browser screenshot handling removed - using canvas approach now
      
      try {
        // Clean up device elements for export (remove UI artifacts only)
        const deviceElements = mockupContainer.querySelectorAll('.devices-container > div');
        deviceElements.forEach(el => {
          // Only remove selection rings and UI artifacts - don't change layout
          (el as HTMLElement).classList.remove('ring-4', 'ring-blue-500', 'rounded-[60px]');
          
          // Remove any selection indicators
          const innerRings = (el as HTMLElement).querySelectorAll('.ring');
          innerRings.forEach(ring => {
            (ring as HTMLElement).classList.remove('ring-4', 'ring-blue-500');
          });
        });

        // Keep the devices container layout as-is for export
        // Don't modify positioning or layout - capture exactly what's displayed

        // Minimal export preparation - ensure visibility and proper sizing
        mockupContainer.style.overflow = 'visible'; // Allow any rotated content to be captured
        mockupContainer.style.position = 'relative'; // Ensure proper positioning context
        
        // Reset any scroll positions that might affect capture
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        // Wait a moment for scroll to complete
        await new Promise(resolve => setTimeout(resolve, 100));

        if (multipleDevices.enabled) {
          const devicesCount = devices.length;
          let containerWidth = '1200px';
          
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
          mockupContainer.style.maxWidth = containerWidth; // Keep this for multi-device structure
          mockupContainer.style.height = 'auto';
          mockupContainer.style.minHeight = '800px'; // Keep a min height for multi-device
          
          // Apply asymmetric padding for multiple devices export too
          const currentPadding = parseInt(window.getComputedStyle(mockupContainer).padding) || 0;
          const topPadding = Math.max(400, currentPadding); // Same generous top padding to prevent cutoff
          const bottomPadding = Math.max(150, currentPadding); // Less bottom padding for better centering
          const sidePadding = Math.max(200, currentPadding); // Slightly less side padding for multi-device
          
          mockupContainer.style.padding = `${topPadding}px ${sidePadding}px ${bottomPadding}px ${sidePadding}px`;
          mockupContainer.style.display = 'flex';
          mockupContainer.style.alignItems = 'center';
          mockupContainer.style.justifyContent = 'center';
          
          const backgroundStyles = getBackgroundInlineStyle();
          if (backgroundStyles.backgroundColor) {
            mockupContainer.style.backgroundColor = backgroundStyles.backgroundColor;
          }
          if (backgroundStyles.backgroundImage) {
            mockupContainer.style.backgroundImage = backgroundStyles.backgroundImage;
            mockupContainer.style.backgroundSize = backgroundStyles.backgroundSize || 'cover';
            mockupContainer.style.backgroundPosition = backgroundStyles.backgroundPosition || 'center';
          }
          
          deviceContainer.style.flexDirection = multipleDevices.layout === 'horizontal' ? 'row' : 'column';
          deviceContainer.style.flexWrap = multipleDevices.layout === 'horizontal' ? 'wrap' : 'nowrap';
          deviceContainer.style.width = '100%';
          deviceContainer.style.justifyContent = 'center';
          deviceContainer.style.alignItems = 'center';
          deviceContainer.style.gap = multipleDevices.layout === 'horizontal' ? '40px' : '40px';
          deviceContainer.style.padding = '20px';
          deviceContainer.style.position = 'relative';
          
          // For horizontal layout, ensure container is wide enough to fit devices side by side
          if (multipleDevices.layout === 'horizontal' && devicesCount <= 3) {
            // Remove flex-wrap for small number of devices to ensure they stay on same line
            deviceContainer.style.flexWrap = 'nowrap';
            // Increase container width to ensure devices fit side by side
            if (devicesCount === 2) {
              mockupContainer.style.width = '1000px';
              mockupContainer.style.maxWidth = '1000px';
            }
          }
          
          // Add row gap for horizontal layouts with many devices that need to wrap
          if (multipleDevices.layout === 'horizontal' && devicesCount > 3) {
            deviceContainer.style.rowGap = '60px';
          }
        } else {
          // Single device export - use asymmetric padding to center device properly
          const currentPadding = parseInt(window.getComputedStyle(mockupContainer).padding) || 0;
          const topPadding = Math.max(400, currentPadding); // Keep generous top padding to prevent cutoff
          const bottomPadding = Math.max(150, currentPadding); // Reduced bottom padding for better centering
          const sidePadding = Math.max(300, currentPadding); // Moderate side padding
          
          mockupContainer.style.padding = `${topPadding}px ${sidePadding}px ${bottomPadding}px ${sidePadding}px`;
          
          // Apply background styles 
          const backgroundStyles = getBackgroundInlineStyle();
          if (backgroundStyles.backgroundColor) {
            mockupContainer.style.backgroundColor = backgroundStyles.backgroundColor;
          }
          if (backgroundStyles.backgroundImage) {
            mockupContainer.style.backgroundImage = backgroundStyles.backgroundImage;
            mockupContainer.style.backgroundSize = backgroundStyles.backgroundSize || 'cover';
            mockupContainer.style.backgroundPosition = backgroundStyles.backgroundPosition || 'center';
          }
        }

        // Handle pattern - render it directly as a background image
        if (backgroundPattern !== 'none') {
          // First, apply the background color to the container (important for both single and multiple devices)
          const backgroundStyles = getBackgroundInlineStyle();
          
          // Debug logging to see what's happening
          console.log('Export debug - background state:', background);
          console.log('Export debug - customBackgroundColor:', customBackgroundColor);
          console.log('Export debug - backgroundStyles:', backgroundStyles);
          
          if (backgroundStyles.backgroundColor) {
            mockupContainer.style.backgroundColor = backgroundStyles.backgroundColor;
          }
          if (backgroundStyles.backgroundImage) {
            mockupContainer.style.backgroundImage = backgroundStyles.backgroundImage;
            mockupContainer.style.backgroundSize = backgroundStyles.backgroundSize || 'cover';
            mockupContainer.style.backgroundPosition = backgroundStyles.backgroundPosition || 'center';
          }
          
          // Force a style recomputation before getting computed styles
          mockupContainer.offsetHeight;
          await new Promise(resolve => setTimeout(resolve, 100));
          
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
          
          // Get background color after we've applied it - ensure we have a valid color
          const computedStyle = window.getComputedStyle(mockupContainer);
          let bgColor = backgroundStyles.backgroundColor || computedStyle.backgroundColor || '#ffffff';
          
          // Handle gradients - extract a representative color from the gradient
          if (!backgroundStyles.backgroundColor && backgroundStyles.backgroundImage && backgroundStyles.backgroundImage.includes('gradient')) {
            // Extract first color from gradient for pattern generation
            if (background === 'gradient') {
              bgColor = '#D1FAE5'; // Use the first gradient color (green-100)
            } else if (background === 'gradient-purple') {
              bgColor = '#EDE9FE'; // Use the first gradient color (purple-100)
            }
          }
          
          console.log('Export debug - computed backgroundColor:', computedStyle.backgroundColor);
          console.log('Export debug - final bgColor before conversion:', bgColor);
          
          // Convert RGB format to hex if needed for better compatibility
          if (bgColor.startsWith('rgb')) {
            const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
            if (rgbMatch) {
              const r = parseInt(rgbMatch[1]).toString(16).padStart(2, '0');
              const g = parseInt(rgbMatch[2]).toString(16).padStart(2, '0');
              const b = parseInt(rgbMatch[3]).toString(16).padStart(2, '0');
              bgColor = `#${r}${g}${b}`;
            }
          }
          
          // Ensure bgColor is valid RGB format for canvas
          if (bgColor === 'transparent' || !bgColor || bgColor === 'rgba(0, 0, 0, 0)') {
            bgColor = '#ffffff';
          }
          
          console.log('Pattern generation - using bgColor:', bgColor); // Debug log
          
          // Generate pattern image with larger dimensions to reduce obvious repetition
          const patternWidth = 2000; // Increased size for better quality
          const patternHeight = 2000;
          const patternUrl = generatePatternImage(backgroundPattern, patternWidth, patternHeight, bgColor);
          
          // Create a temporary background element and insert it
          tempBgElement = document.createElement('div');
          tempBgElement.style.position = 'absolute';
          tempBgElement.style.inset = '0';
          tempBgElement.style.zIndex = '1'; // Lower z-index to ensure it's behind content
          tempBgElement.style.backgroundColor = bgColor; // Ensure background color is on the pattern element too
          tempBgElement.style.backgroundImage = `url(${patternUrl})`;
          tempBgElement.style.backgroundRepeat = 'repeat';
          tempBgElement.style.backgroundSize = backgroundPattern === 'waves' ? '100% 100%' : 'auto'; // Scale waves pattern to fill container
          tempBgElement.style.opacity = '1';
          tempBgElement.style.pointerEvents = 'none';
          
          // Insert as first child of mockup container
          mockupContainer.insertBefore(tempBgElement, mockupContainer.firstChild);
          
          // Ensure device elements have higher z-index than pattern background
          const deviceElements = mockupContainer.querySelectorAll('.devices-container, .devices-container > div');
          deviceElements.forEach(el => {
            (el as HTMLElement).style.zIndex = '10';
            (el as HTMLElement).style.position = 'relative';
          });
          
          // Also ensure text elements are above pattern - very important for multiple devices
          const textElements = mockupContainer.querySelectorAll('.text-element');
          textElements.forEach(el => {
            (el as HTMLElement).style.zIndex = '9999'; // Higher z-index to ensure visibility
            (el as HTMLElement).style.position = 'absolute';
            (el as HTMLElement).style.opacity = '1';
            (el as HTMLElement).style.visibility = 'visible';
            (el as HTMLElement).style.pointerEvents = 'none';
          });
          
          // Give a moment for the browser to render the new background
          await new Promise(resolve => setTimeout(resolve, 500)); // Increased time for rendering
        }

        // Give a moment for styles to apply and layout to settle
        await new Promise(resolve => setTimeout(resolve, 100)); 

        // Prepare the document for better 3D rendering
        // Force a reflow to ensure all styles are computed correctly AFTER our dynamic changes
        mockupContainer.getBoundingClientRect();
        
        // Removed browser wrapper constraint handling - no longer needed with canvas approach
        
        // Wait for layout to settle before capturing (longer wait for large containers)
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Force a reflow to ensure all styles are applied
        mockupContainer.offsetHeight;
        
        // CANVAS SIZE APPROACH: Create export with user-specified canvas dimensions
        
        console.log('Starting html2canvas capture...', {
          containerSize: { width: mockupContainer.offsetWidth, height: mockupContainer.offsetHeight }
        });

        // Create a simplified export container with correct background
        const exportContainer = document.createElement('div');
        exportContainer.id = 'export-container';
        exportContainer.style.position = 'fixed';
        exportContainer.style.top = '0';
        exportContainer.style.left = '0';
        exportContainer.style.visibility = 'visible';
        exportContainer.style.zIndex = '-9999'; // Behind everything
        exportContainer.style.pointerEvents = 'none'; // Don't interfere with UI
        exportContainer.style.width = `${canvasSize.width}px`;
        exportContainer.style.height = `${canvasSize.height}px`;
        exportContainer.style.display = 'flex';
        exportContainer.style.alignItems = 'center';
        exportContainer.style.justifyContent = 'center';
        exportContainer.style.flexWrap = 'wrap';
        exportContainer.style.gap = '20px';
        exportContainer.style.padding = '40px';
        
        // Apply the correct background to match user's choice
        const backgroundStyles = getBackgroundInlineStyle();
        if (backgroundStyles.backgroundColor) {
          exportContainer.style.backgroundColor = backgroundStyles.backgroundColor;
        } else if (backgroundStyles.backgroundImage) {
          exportContainer.style.backgroundImage = backgroundStyles.backgroundImage;
          exportContainer.style.backgroundSize = 'cover';
          exportContainer.style.backgroundPosition = 'center';
        } else {
          exportContainer.style.backgroundColor = '#ffffff';
        }
        
        // Don't apply pattern here - it will be applied later as an overlay
        
        // Add to body temporarily
        document.body.appendChild(exportContainer);
        
        // Create simplified device frames for export
        let modifiedCount = 0;
        
        devices.forEach(device => {
          if (!device.image) return;
          
          console.log('Exporting device:', {
            type: device.type,
            color: device.color,
            isPro: device.isPro,
            rotation: device.rotation
          });
          
          const deviceWrapper = document.createElement('div');
          deviceWrapper.style.display = 'inline-block';
          deviceWrapper.style.margin = '10px';
          
          if (device.type === 'browser') {
            // Simple browser frame
            const browserFrame = document.createElement('div');
            browserFrame.style.border = '2px solid #d1d5db';
            browserFrame.style.borderRadius = '8px';
            browserFrame.style.overflow = 'hidden';
            browserFrame.style.boxShadow = shadow ? '0 10px 25px rgba(0,0,0,0.1)' : 'none';
            
            // Apply 3D rotation if it exists for browser frames too
            if (device.rotation) {
              browserFrame.style.transform = `perspective(1000px) rotateX(${device.rotation.x}deg) rotateY(${device.rotation.y}deg)`;
              browserFrame.style.transformStyle = 'preserve-3d';
            }
            
            const img = document.createElement('img');
            img.src = device.image;
            img.style.display = 'block';
            img.style.maxWidth = '600px';
            img.style.maxHeight = '400px';
            img.style.width = 'auto';
            img.style.height = 'auto';
            img.crossOrigin = 'anonymous'; // Handle CORS
            
            // Add load event listener for debugging
            img.onload = () => console.log('Browser image loaded:', device.image);
            img.onerror = (e) => console.error('Browser image failed to load:', device.image, e);
            
            browserFrame.appendChild(img);
            deviceWrapper.appendChild(browserFrame);
          } else {
            // Create device frame that matches DeviceFrame.tsx styling
            const deviceFrame = document.createElement('div');
            const isPortrait = orientation === 'portrait';
            
            // Device-specific dimensions and styling based on DeviceFrame.tsx
            let frameWidth = 280, frameHeight = 570;
            let borderRadius = '40px';
            let screenInset = { top: 48, bottom: 48, left: 12, right: 12 }; // iPhone default
            
            if (device.type === 'iphone-pro') {
              frameWidth = isPortrait ? 280 : 570;
              frameHeight = isPortrait ? 570 : 280;
              borderRadius = '40px';
              screenInset = { top: 48, bottom: 48, left: 12, right: 12 };
            } else if (device.type === 'iphone') {
              frameWidth = isPortrait ? 280 : 570;
              frameHeight = isPortrait ? 570 : 280;
              borderRadius = '40px';
              screenInset = { top: 24, bottom: 24, left: 8, right: 8 };
            } else if (device.type === 'ipad') {
              frameWidth = isPortrait ? 380 : 540;
              frameHeight = isPortrait ? 540 : 380;
              borderRadius = '20px';
              screenInset = { top: 16, bottom: 16, left: 12, right: 12 };
            } else if (device.type === 'android') {
              frameWidth = isPortrait ? 260 : 540;
              frameHeight = isPortrait ? 540 : 260;
              borderRadius = '20px';
              screenInset = { top: 8, bottom: 8, left: 8, right: 8 };
            } else if (device.type === 'pixel-pro') {
              frameWidth = isPortrait ? 260 : 550;
              frameHeight = isPortrait ? 550 : 260;
              borderRadius = '28px';
              screenInset = { top: 8, bottom: 8, left: 8, right: 8 };
            } else if (device.type.includes('macbook')) {
              frameWidth = 640;
              frameHeight = 400;
              borderRadius = device.type === 'macbook-pro' ? '14px' : '10px';
              screenInset = { top: 0, bottom: 64, left: 12, right: 12 };
            }
            
            // Scale device to fit within export container
            const maxDeviceWidth = canvasSize.width - 120;
            const maxDeviceHeight = canvasSize.height - 120;
            const scaleToFit = Math.min(maxDeviceWidth / frameWidth, maxDeviceHeight / frameHeight, 1);
            frameWidth *= scaleToFit;
            frameHeight *= scaleToFit;
            
            // Scale insets proportionally
            Object.keys(screenInset).forEach(key => {
              screenInset[key] *= scaleToFit;
            });
            
            deviceFrame.style.width = `${frameWidth}px`;
            deviceFrame.style.height = `${frameHeight}px`;
            deviceFrame.style.position = 'relative';
            deviceFrame.style.borderRadius = borderRadius;
            
            // Enhanced device colors matching DeviceFrame.tsx
            if (device.type.includes('pro')) {
              if (device.color === 'black' || device.color === 'black-titanium') {
                deviceFrame.style.background = 'linear-gradient(to bottom, #27272a, #18181b)';
                deviceFrame.style.border = '1px solid rgba(255,255,255,0.05)';
              } else if (device.color === 'white' || device.color === 'white-titanium') {
                deviceFrame.style.background = 'linear-gradient(to bottom, #f4f4f5, #e4e4e7)';
                deviceFrame.style.border = '1px solid rgba(0,0,0,0.1)';
              } else if (device.color === 'titanium') {
                deviceFrame.style.background = 'linear-gradient(to bottom, #a3a3a3, #737373, #a3a3a3)';
                deviceFrame.style.border = '1px solid rgba(0,0,0,0.2)';
              } else if (device.color === 'blue-titanium') {
                deviceFrame.style.background = 'linear-gradient(to bottom, #93c5fd, #60a5fa, #93c5fd)';
                deviceFrame.style.border = '1px solid rgba(0,0,0,0.1)';
              }
            } else {
              if (device.color === 'black') {
                deviceFrame.style.backgroundColor = '#000';
                deviceFrame.style.border = '1px solid rgba(255,255,255,0.1)';
              } else if (device.color === 'white') {
                deviceFrame.style.backgroundColor = '#fff';
                deviceFrame.style.border = '1px solid rgba(0,0,0,0.1)';
              } else {
                deviceFrame.style.backgroundColor = '#f3f4f6';
                deviceFrame.style.border = '1px solid rgba(0,0,0,0.1)';
              }
            }
            
            deviceFrame.style.boxShadow = shadow ? '0 20px 40px rgba(0,0,0,0.15)' : 'none';
            
            // Apply 3D rotation if it exists
            if (device.rotation) {
              deviceFrame.style.transform = `perspective(1000px) rotateX(${device.rotation.x}deg) rotateY(${device.rotation.y}deg)`;
              deviceFrame.style.transformStyle = 'preserve-3d';
            }
            
            // Screen area with proper insets
            const screen = document.createElement('div');
            screen.style.position = 'absolute';
            screen.style.top = `${screenInset.top}px`;
            screen.style.left = `${screenInset.left}px`;
            screen.style.right = `${screenInset.right}px`;
            screen.style.bottom = `${screenInset.bottom}px`;
            screen.style.backgroundColor = '#1f2937';
            screen.style.borderRadius = device.type === 'android' ? '8px' : device.type === 'pixel-pro' ? '24px' : device.type.includes('iphone') ? '30px' : '8px';
            screen.style.overflow = 'hidden';
            screen.style.border = '1px solid #374151';
            
            // Screenshot image
            const img = document.createElement('img');
            img.src = device.image;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center top';
            img.style.display = 'block';
            img.crossOrigin = 'anonymous';
            
            img.onload = () => console.log('Device image loaded:', device.image);
            img.onerror = (e) => console.error('Device image failed to load:', device.image, e);
            
            screen.appendChild(img);
            deviceFrame.appendChild(screen);
            
            // Add device-specific elements
            if (device.type.includes('iphone')) {
              // Add notch/dynamic island
              const notch = document.createElement('div');
              notch.style.position = 'absolute';
              notch.style.top = device.type === 'iphone-pro' ? `${20 * scaleToFit}px` : `${16 * scaleToFit}px`;
              notch.style.left = '50%';
              notch.style.transform = 'translateX(-50%)';
              notch.style.width = device.type === 'iphone-pro' ? `${75 * scaleToFit}px` : `${80 * scaleToFit}px`;
              notch.style.height = device.type === 'iphone-pro' ? `${11 * scaleToFit}px` : `${24 * scaleToFit}px`;
              notch.style.backgroundColor = '#000';
              notch.style.borderRadius = device.type === 'iphone-pro' ? '10px' : '12px';
              notch.style.zIndex = '10';
              deviceFrame.appendChild(notch);
              
              // Add side buttons
              const volumeUp = document.createElement('div');
              volumeUp.style.position = 'absolute';
              volumeUp.style.left = '-2px';
              volumeUp.style.top = `${112 * scaleToFit}px`;
              volumeUp.style.width = '4px';
              volumeUp.style.height = `${40 * scaleToFit}px`;
              volumeUp.style.backgroundColor = device.color === 'black' ? '#333' : '#999';
              volumeUp.style.borderRadius = '0 2px 2px 0';
              deviceFrame.appendChild(volumeUp);
              
              const volumeDown = document.createElement('div');
              volumeDown.style.position = 'absolute';
              volumeDown.style.left = '-2px';
              volumeDown.style.top = `${160 * scaleToFit}px`;
              volumeDown.style.width = '4px';
              volumeDown.style.height = `${56 * scaleToFit}px`;
              volumeDown.style.backgroundColor = device.color === 'black' ? '#333' : '#999';
              volumeDown.style.borderRadius = '0 2px 2px 0';
              deviceFrame.appendChild(volumeDown);
              
              const powerButton = document.createElement('div');
              powerButton.style.position = 'absolute';
              powerButton.style.right = '-2px';
              powerButton.style.top = `${112 * scaleToFit}px`;
              powerButton.style.width = '4px';
              powerButton.style.height = `${40 * scaleToFit}px`;
              powerButton.style.backgroundColor = device.color === 'black' ? '#333' : '#999';
              powerButton.style.borderRadius = '2px 0 0 2px';
              deviceFrame.appendChild(powerButton);
            } else if (device.type === 'android') {
              // Add Android camera notch
              const notch = document.createElement('div');
              notch.style.position = 'absolute';
              notch.style.top = `${12 * scaleToFit}px`;
              notch.style.left = '50%';
              notch.style.transform = 'translateX(-50%)';
              notch.style.width = `${12 * scaleToFit}px`;
              notch.style.height = `${12 * scaleToFit}px`;
              notch.style.backgroundColor = '#1f2937';
              notch.style.borderRadius = '50%';
              notch.style.zIndex = '10';
              deviceFrame.appendChild(notch);
              
              // Add side buttons
              const volumeUp = document.createElement('div');
              volumeUp.style.position = 'absolute';
              volumeUp.style.right = '-2px';
              volumeUp.style.top = `${96 * scaleToFit}px`;
              volumeUp.style.width = '4px';
              volumeUp.style.height = `${48 * scaleToFit}px`;
              volumeUp.style.backgroundColor = device.color === 'black' ? '#333' : '#999';
              volumeUp.style.borderRadius = '2px 0 0 2px';
              deviceFrame.appendChild(volumeUp);
              
              const powerButton = document.createElement('div');
              powerButton.style.position = 'absolute';
              powerButton.style.right = '-2px';
              powerButton.style.top = `${160 * scaleToFit}px`;
              powerButton.style.width = '4px';
              powerButton.style.height = `${48 * scaleToFit}px`;
              powerButton.style.backgroundColor = device.color === 'black' ? '#333' : '#999';
              powerButton.style.borderRadius = '2px 0 0 2px';
              deviceFrame.appendChild(powerButton);
            } else if (device.type === 'pixel-pro') {
              // Add Pixel Pro camera bar
              const cameraBar = document.createElement('div');
              cameraBar.style.position = 'absolute';
              if (isPortrait) {
                cameraBar.style.top = `${24 * scaleToFit}px`;
                cameraBar.style.left = '0';
                cameraBar.style.right = '0';
                cameraBar.style.height = `${48 * scaleToFit}px`;
              } else {
                cameraBar.style.top = '0';
                cameraBar.style.bottom = '0';
                cameraBar.style.left = `${24 * scaleToFit}px`;
                cameraBar.style.width = `${48 * scaleToFit}px`;
              }
              cameraBar.style.backgroundColor = '#1f2937';
              cameraBar.style.zIndex = '5';
              deviceFrame.appendChild(cameraBar);
              
              // Add camera lenses
              const camera1 = document.createElement('div');
              camera1.style.position = 'absolute';
              if (isPortrait) {
                camera1.style.top = `${36 * scaleToFit}px`;
                camera1.style.left = `${48 * scaleToFit}px`;
              } else {
                camera1.style.top = `${48 * scaleToFit}px`;
                camera1.style.left = `${36 * scaleToFit}px`;
              }
              camera1.style.width = `${24 * scaleToFit}px`;
              camera1.style.height = `${24 * scaleToFit}px`;
              camera1.style.backgroundColor = '#374151';
              camera1.style.borderRadius = '50%';
              camera1.style.border = '1px solid #4b5563';
              deviceFrame.appendChild(camera1);
              
              const camera2 = document.createElement('div');
              camera2.style.position = 'absolute';
              if (isPortrait) {
                camera2.style.top = `${36 * scaleToFit}px`;
                camera2.style.left = `${96 * scaleToFit}px`;
              } else {
                camera2.style.top = `${96 * scaleToFit}px`;
                camera2.style.left = `${36 * scaleToFit}px`;
              }
              camera2.style.width = `${24 * scaleToFit}px`;
              camera2.style.height = `${24 * scaleToFit}px`;
              camera2.style.backgroundColor = '#374151';
              camera2.style.borderRadius = '50%';
              camera2.style.border = '1px solid #4b5563';
              deviceFrame.appendChild(camera2);
              
              // Add side buttons
              const volumeUp = document.createElement('div');
              volumeUp.style.position = 'absolute';
              volumeUp.style.right = '-2px';
              volumeUp.style.top = `${112 * scaleToFit}px`;
              volumeUp.style.width = '4px';
              volumeUp.style.height = `${48 * scaleToFit}px`;
              volumeUp.style.backgroundColor = device.color === 'black' ? '#333' : '#999';
              volumeUp.style.borderRadius = '2px 0 0 2px';
              deviceFrame.appendChild(volumeUp);
              
              const powerButton = document.createElement('div');
              powerButton.style.position = 'absolute';
              powerButton.style.right = '-2px';
              powerButton.style.top = `${176 * scaleToFit}px`;
              powerButton.style.width = '4px';
              powerButton.style.height = `${48 * scaleToFit}px`;
              powerButton.style.backgroundColor = device.color === 'black' ? '#333' : '#999';
              powerButton.style.borderRadius = '2px 0 0 2px';
              deviceFrame.appendChild(powerButton);
            }
            
            // Add keyboard for MacBooks
            if (device.type.includes('macbook')) {
              const keyboard = document.createElement('div');
              keyboard.style.position = 'absolute';
              keyboard.style.bottom = '0';
              keyboard.style.left = '0';
              keyboard.style.right = '0';
              keyboard.style.height = `${64 * scaleToFit}px`;
              keyboard.style.backgroundColor = device.color === 'black' ? '#374151' : '#d1d5db';
              keyboard.style.borderRadius = device.type === 'macbook-pro' ? '0 0 14px 14px' : '0 0 10px 10px';
              
              // Add trackpad
              const trackpad = document.createElement('div');
              trackpad.style.position = 'absolute';
              trackpad.style.bottom = `${16 * scaleToFit}px`;
              trackpad.style.left = '50%';
              trackpad.style.transform = 'translateX(-50%)';
              trackpad.style.width = `${128 * scaleToFit}px`;
              trackpad.style.height = `${32 * scaleToFit}px`;
              trackpad.style.backgroundColor = device.color === 'black' ? '#1f2937' : '#9ca3af';
              trackpad.style.borderRadius = '4px';
              trackpad.style.border = `1px solid ${device.color === 'black' ? '#4b5563' : '#6b7280'}`;
              keyboard.appendChild(trackpad);
              
              deviceFrame.appendChild(keyboard);
              
              // Add MacBook Pro notch if applicable
              if (device.type === 'macbook-pro') {
                const macNotch = document.createElement('div');
                macNotch.style.position = 'absolute';
                macNotch.style.top = '0';
                macNotch.style.left = '50%';
                macNotch.style.transform = 'translateX(-50%)';
                macNotch.style.width = `${32 * scaleToFit}px`;
                macNotch.style.height = `${8 * scaleToFit}px`;
                macNotch.style.backgroundColor = '#1f2937';
                macNotch.style.borderRadius = '0 0 6px 6px';
                macNotch.style.zIndex = '10';
                deviceFrame.appendChild(macNotch);
              }
            }
            
            deviceWrapper.appendChild(deviceFrame);
          }
          
          exportContainer.appendChild(deviceWrapper);
          modifiedCount++;
        });
        
        console.log('Modified elements for export:', modifiedCount);
        console.log('Export container contents:', exportContainer.innerHTML);
        console.log('Export container dimensions:', {
          width: exportContainer.offsetWidth,
          height: exportContainer.offsetHeight,
          children: exportContainer.children.length
        });

        // Ensure all images are loaded before capture
        const images = exportContainer.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
          if (img.complete) return Promise.resolve();
          return new Promise(resolve => {
            img.onload = resolve;
            img.onerror = resolve; // Resolve even on error to not block export
            setTimeout(resolve, 5000); // Timeout after 5 seconds
          });
        });
        
        await Promise.all(imagePromises);
        
        // Wait for layout to settle
        await new Promise(resolve => setTimeout(resolve, 300));

        // Temporarily bring to front for capture
        exportContainer.style.zIndex = '9999';

        // Capture the simplified export container
        let contentCanvas = await html2canvas(exportContainer, {
          allowTaint: true,
          useCORS: true,
          scale: 2, // High resolution capture
          logging: false, // Disable verbose logging
          foreignObjectRendering: true,
          backgroundColor: null,
          imageTimeout: 20000, // Longer timeout for images
          width: exportContainer.offsetWidth,
          height: exportContainer.offsetHeight,
          x: 0,
          y: 0,
          scrollX: 0,
          scrollY: 0,
          windowWidth: window.innerWidth,
          windowHeight: window.innerHeight,
          ignoreElements: (element) => {
            return element.classList.contains('ignore-export') || 
                  element.tagName === 'BUTTON' ||
                  (element.tagName === 'DIV' && element.getAttribute('role') === 'button');
          },
        });
        
        // Immediately hide again after capture
        exportContainer.style.zIndex = '-9999';
        
        // Clean up the export container
        if (exportContainer.parentNode) {
          exportContainer.parentNode.removeChild(exportContainer);
        }
        
        console.log('html2canvas capture complete:', {
          canvasSize: { width: contentCanvas.width, height: contentCanvas.height },
          hasData: contentCanvas.width > 0 && contentCanvas.height > 0
        });

        // Quick test - convert to data URL to see if there's content
        const testDataUrl = contentCanvas.toDataURL('image/png');
        console.log('Content canvas data URL length:', testDataUrl.length);

        // Create final canvas with user-specified dimensions
        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = canvasSize.width;
        finalCanvas.height = canvasSize.height;
        const ctx = finalCanvas.getContext('2d')!;
        
        // Apply solid background first
        if (backgroundStyles.backgroundColor) {
          ctx.fillStyle = backgroundStyles.backgroundColor;
          ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        } else if (backgroundStyles.backgroundImage && backgroundStyles.backgroundImage.includes('gradient')) {
          // Handle gradients by creating a simple gradient
          if (background === 'gradient') {
            const gradient = ctx.createLinearGradient(0, 0, canvasSize.width, canvasSize.height);
            gradient.addColorStop(0, '#D1FAE5'); // green-100
            gradient.addColorStop(1, '#DBEAFE'); // blue-100
            ctx.fillStyle = gradient;
          } else if (background === 'gradient-purple') {
            const gradient = ctx.createLinearGradient(0, 0, canvasSize.width, canvasSize.height);
            gradient.addColorStop(0, '#EDE9FE'); // purple-100
            gradient.addColorStop(1, '#FCE7F3'); // pink-100
            ctx.fillStyle = gradient;
          }
          ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        } else {
          // Default white background
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
        }

        // Scale and center the content appropriately for the canvas size
        // Account for html2canvas scale factor (we used scale: 2)
        const htmlCanvasScale = 2;
        const actualContentWidth = contentCanvas.width / htmlCanvasScale;
        const actualContentHeight = contentCanvas.height / htmlCanvasScale;
        
        // Use more of the canvas space - 90% for better utilization
        const maxContentWidth = canvasSize.width * 0.9;
        const maxContentHeight = canvasSize.height * 0.9;
        
        console.log('Export Debug:', {
          canvasSize,
          rawContentSize: { width: contentCanvas.width, height: contentCanvas.height },
          actualContentSize: { width: actualContentWidth, height: actualContentHeight },
          maxContentSize: { width: maxContentWidth, height: maxContentHeight }
        });
        
        // Calculate scaling based on actual content size with more aggressive scaling
        const scaleX = maxContentWidth / actualContentWidth;
        const scaleY = maxContentHeight / actualContentHeight;
        
        // Use the larger scale factor to ensure content fills the space better, but cap at reasonable limits
        let scale = Math.min(scaleX, scaleY);
        
        // Ensure minimum scale to prevent tiny content - at least 0.5x
        scale = Math.max(scale, 0.5);
        
        // Cap maximum scale to prevent overly large content - max 5x
        scale = Math.min(scale, 5);
        
        console.log('Export Scaling:', { 
          scaleX, 
          scaleY, 
          finalScale: scale,
          beforeMinMax: Math.min(scaleX, scaleY),
          contentSizeRatio: {
            widthRatio: actualContentWidth / canvasSize.width,
            heightRatio: actualContentHeight / canvasSize.height
          }
        });
        
        // Calculate final content dimensions (scale the original captured canvas)
        const finalContentWidth = actualContentWidth * scale;
        const finalContentHeight = actualContentHeight * scale;
        
        // Center the scaled content on the canvas
        const contentX = (canvasSize.width - finalContentWidth) / 2;
        const contentY = (canvasSize.height - finalContentHeight) / 2;
        
        console.log('Export Final:', {
          finalContentSize: { width: finalContentWidth, height: finalContentHeight },
          position: { x: contentX, y: contentY }
        });
        
        // Draw the content scaled and centered on the canvas
        console.log('Drawing content to canvas...', {
          contentCanvas: contentCanvas,
          contentCanvasSize: { width: contentCanvas.width, height: contentCanvas.height },
          drawParams: { x: contentX, y: contentY, width: finalContentWidth, height: finalContentHeight }
        });
        
        ctx.drawImage(contentCanvas, contentX, contentY, finalContentWidth, finalContentHeight);
        
        // Apply pattern overlay after content is drawn
        if (backgroundPattern !== 'none') {
          const patternBgColor = backgroundStyles.backgroundColor || '#ffffff';
          const patternCanvas = document.createElement('canvas');
          const patternSize = 100; // Size of pattern tile
          patternCanvas.width = patternSize;
          patternCanvas.height = patternSize;
          const patternCtx = patternCanvas.getContext('2d')!;
          
          // Make pattern tile transparent background
          patternCtx.clearRect(0, 0, patternSize, patternSize);
          
          // Draw pattern overlay only (no background fill)
          patternCtx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
          patternCtx.lineWidth = 1;
          
          switch (backgroundPattern) {
            case 'dots':
              patternCtx.fillStyle = 'rgba(0, 0, 0, 0.06)';
              for (let x = 0; x < patternSize; x += 20) {
                for (let y = 0; y < patternSize; y += 20) {
                  patternCtx.beginPath();
                  patternCtx.arc(x + 10, y + 10, 1, 0, 2 * Math.PI);
                  patternCtx.fill();
                }
              }
              break;
            case 'grid':
              for (let x = 0; x <= patternSize; x += 20) {
                patternCtx.beginPath();
                patternCtx.moveTo(x, 0);
                patternCtx.lineTo(x, patternSize);
                patternCtx.stroke();
              }
              for (let y = 0; y <= patternSize; y += 20) {
                patternCtx.beginPath();
                patternCtx.moveTo(0, y);
                patternCtx.lineTo(patternSize, y);
                patternCtx.stroke();
              }
              break;
            case 'lines':
              for (let i = -patternSize; i < patternSize * 2; i += 8) {
                patternCtx.beginPath();
                patternCtx.moveTo(i, 0);
                patternCtx.lineTo(i + patternSize, patternSize);
                patternCtx.stroke();
              }
              break;
          }
          
          // Create pattern and apply it as overlay to entire canvas
          const pattern = ctx.createPattern(patternCanvas, 'repeat');
          if (pattern) {
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);
            ctx.globalCompositeOperation = 'source-over'; // Reset to default
          }
        }
        
        // Verify something was drawn
        const imageData = ctx.getImageData(0, 0, 100, 100);
        const hasNonTransparentPixels = imageData.data.some((value, index) => index % 4 === 3 && value > 0);
        console.log('Canvas has content:', hasNonTransparentPixels);

        // Create download link
        const imageUrl = finalCanvas.toDataURL('image/png');

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
          mockupContainer.style.padding = originalContainerStyles.padding; // Restore original padding
          mockupContainer.style.minWidth = originalContainerStyles.minWidth || 'auto';
          mockupContainer.style.minHeight = originalContainerStyles.minHeight || 'auto';
          mockupContainer.style.maxHeight = originalContainerStyles.maxHeight || 'auto';
          mockupContainer.style.display = originalContainerStyles.display;
          mockupContainer.style.alignItems = originalContainerStyles.alignItems;
          mockupContainer.style.justifyContent = originalContainerStyles.justifyContent;
          mockupContainer.style.position = originalContainerStyles.position;
          mockupContainer.style.overflow = originalContainerStyles.overflow;
          mockupContainer.style.background = originalContainerStyles.background;
          mockupContainer.style.backgroundImage = originalContainerStyles.backgroundImage;
          mockupContainer.style.backgroundSize = originalContainerStyles.backgroundSize;
          mockupContainer.style.backgroundColor = originalContainerStyles.backgroundColor;
          mockupContainer.style.margin = originalContainerStyles.margin || '';
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
            // Restore original z-index and position
            (el as HTMLElement).style.zIndex = '';
            (el as HTMLElement).style.position = '';
          }
        });
        
        // Also restore the devices container z-index and position
        const devicesContainer = mockupContainer.querySelector('.devices-container') as HTMLElement;
        if (devicesContainer) {
          devicesContainer.style.zIndex = '';
          devicesContainer.style.position = '';
        }
        
        // Restore text element z-index and position
        const textElements = mockupContainer.querySelectorAll('.text-element');
        textElements.forEach(el => {
          (el as HTMLElement).style.zIndex = '';
          (el as HTMLElement).style.position = '';
          (el as HTMLElement).style.opacity = '';
          (el as HTMLElement).style.visibility = '';
          (el as HTMLElement).style.pointerEvents = '';
        });
        
        // Restore draggable style
        draggableElements.forEach(el => {
          (el as HTMLElement).style.pointerEvents = 'auto';
          (el as HTMLElement).style.position = '';
        });
        
        // Browser constraint restoration removed - no longer needed with canvas approach
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

  const handleCanvasSizeChange = (size: { width: number; height: number }) => {
    setCanvasSize(size);
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
                    <MarketingPreview
                      type={marketingPreview}
                      imageUrl={generatedAssetUrl}
                      isLoading={isLoading}
                      revisedPrompt={revisedPrompt}
                      onClose={() => setMarketingPreview(null)}
                      onDownload={handleDownloadImage}
                    />
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
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white rounded-lg">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent animate-spin"></div>
                          <div className="w-16 h-16 rounded-full border-4 border-t-transparent border-r-transparent border-b-blue-300 border-l-blue-300 animate-spin absolute inset-0" style={{ animationDirection: 'reverse' }}></div>
                        </div>
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
                          data-device-id={device.id}
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
                            isPro={device.isPro || isPro}
                            rotation={device.rotation}
                            onRotationChange={(newRotation) => handleRotationChange(device.id, newRotation)}
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
                  canvasSize={canvasSize}
                  onCanvasSizeChange={handleCanvasSizeChange}
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

      {showOpenAIPromptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4">Create AI Scene Mockup</h3>
            <p className="text-sm text-gray-500 mb-4">
              Describe the real-life scene where you want your device to appear. 
              For example: "iPhone on a wooden desk next to a cup of coffee" or 
              "Phone in someone's hand at the gym"
            </p>
            
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] mb-4"
              placeholder="Describe the scene for your mockup..."
              value={openAIPrompt}
              onChange={(e) => setOpenAIPrompt(e.target.value)}
            ></textarea>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowOpenAIPromptModal(false);
                  setOpenAIPrompt('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (openAIPrompt.trim() === '') {
                    toast({
                      title: "Empty prompt",
                      description: "Please enter a scene description",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  setShowOpenAIPromptModal(false);
                  // Pass the prompt to the export function
                  handleExport('openai-mockup-confirmed');
                }}
                disabled={openAIPrompt.trim() === ''}
              >
                Generate Scene
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;