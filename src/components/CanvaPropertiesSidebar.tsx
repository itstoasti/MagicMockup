import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Palette, Smartphone, Type, RotateCw, Layers, Move, Image } from 'lucide-react';
import { HexColorPicker } from "react-colorful";

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

interface CanvaPropertiesSidebarProps {
  selection: {
    type: 'device' | 'text' | 'none';
    id: string | null;
  };
  device?: Device;
  textElement?: TextElement;
  onUpdateDevice?: (id: string, field: string, value: any) => void;
  onUpdateTextElement?: (id: string, field: keyof TextElement, value: any) => void;
  onBackground?: (color: string) => void;
  onShadow?: (shadow: boolean) => void;
  onOrientation?: (orientation: 'portrait' | 'landscape') => void;
}

const CanvaPropertiesSidebar = ({
  selection,
  device,
  textElement,
  onUpdateDevice = () => {},
  onUpdateTextElement = () => {},
  onBackground = () => {},
  onShadow = () => {},
  onOrientation = () => {}
}: CanvaPropertiesSidebarProps) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // Font families
  const fontFamilies = [
    'Arial',
    'Verdana',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Trebuchet MS',
    'Impact'
  ];

  // Device colors
  const deviceColors = [
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'silver', label: 'Silver' },
    { value: 'titanium', label: 'Titanium' },
    { value: 'gold', label: 'Gold' }
  ];

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <h3 className="text-sm font-medium mb-3 flex items-center">
          {selection.type === 'device' && (
            <>
              <Smartphone className="mr-2" size={16} />
              Device Properties
            </>
          )}
          {selection.type === 'text' && (
            <>
              <Type className="mr-2" size={16} />
              Text Properties
            </>
          )}
          {selection.type === 'none' && 'No Selection'}
        </h3>

        {selection.type === 'device' && device && (
          <div className="space-y-6">
            {/* Device Type */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Device Model</Label>
              <div className="text-sm">{device.type}</div>
            </div>
            
            {/* Device Color */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Device Color</Label>
              <Select 
                value={device.color} 
                onValueChange={(value) => onUpdateDevice(device.id, 'color', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select color" />
                </SelectTrigger>
                <SelectContent>
                  {deviceColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      {color.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Orientation */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Orientation</Label>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onOrientation('portrait')}
                >
                  Portrait
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onOrientation('landscape')}
                >
                  Landscape
                </Button>
              </div>
            </div>
            
            {/* Shadow */}
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium">Shadow</Label>
              <Switch 
                checked={true} 
                onCheckedChange={(checked) => onShadow(checked)}
              />
            </div>
            
            {/* Rotation */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Rotation</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onUpdateDevice(device.id, 'rotation', { x: 0, y: 0 })}
                >
                  <RotateCw size={14} />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">X Rotation</Label>
                    <span className="text-xs">{device.rotation?.x || 0}°</span>
                  </div>
                  <Slider 
                    min={-30} 
                    max={30} 
                    step={1} 
                    value={[device.rotation?.x || 0]}
                    onValueChange={(value) => onUpdateDevice(device.id, 'rotation', { ...device.rotation, x: value[0] })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Y Rotation</Label>
                    <span className="text-xs">{device.rotation?.y || 0}°</span>
                  </div>
                  <Slider 
                    min={-30} 
                    max={30} 
                    step={1} 
                    value={[device.rotation?.y || 0]}
                    onValueChange={(value) => onUpdateDevice(device.id, 'rotation', { ...device.rotation, y: value[0] })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selection.type === 'text' && textElement && (
          <div className="space-y-6">
            {/* Text Content */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Text</Label>
              <Input 
                value={textElement.text} 
                onChange={(e) => onUpdateTextElement(textElement.id, 'text', e.target.value)}
              />
            </div>
            
            {/* Font Family */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Font</Label>
              <Select 
                value={textElement.fontFamily} 
                onValueChange={(value) => onUpdateTextElement(textElement.id, 'fontFamily', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Font Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Size</Label>
                <span className="text-xs">{textElement.fontSize}px</span>
              </div>
              <Slider 
                min={8} 
                max={72} 
                step={1} 
                value={[textElement.fontSize]}
                onValueChange={(value) => onUpdateTextElement(textElement.id, 'fontSize', value[0])}
              />
            </div>
            
            {/* Text Color */}
            <div className="space-y-2">
              <Label className="text-xs font-medium">Color</Label>
              <div className="flex items-center space-x-2">
                <div 
                  className="h-8 w-8 rounded-md cursor-pointer border"
                  style={{ backgroundColor: textElement.color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                <Input 
                  value={textElement.color} 
                  onChange={(e) => onUpdateTextElement(textElement.id, 'color', e.target.value)}
                  className="w-24"
                />
              </div>
              
              {showColorPicker && (
                <div className="relative z-10 mt-2">
                  <div 
                    className="fixed inset-0" 
                    onClick={() => setShowColorPicker(false)}
                  />
                  <HexColorPicker 
                    color={textElement.color} 
                    onChange={(color) => onUpdateTextElement(textElement.id, 'color', color)}
                    className="absolute"
                  />
                </div>
              )}
            </div>
            
            {/* Position */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Position</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onUpdateTextElement(textElement.id, 'position', { x: 0, y: 0 })}
                >
                  <Move size={14} />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-xs">X</Label>
                  <Input 
                    type="number" 
                    value={textElement.position.x} 
                    onChange={(e) => onUpdateTextElement(textElement.id, 'position', { ...textElement.position, x: parseInt(e.target.value) })}
                  />
                </div>
                <div>
                  <Label className="text-xs">Y</Label>
                  <Input 
                    type="number" 
                    value={textElement.position.y} 
                    onChange={(e) => onUpdateTextElement(textElement.id, 'position', { ...textElement.position, y: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {selection.type === 'none' && (
          <div className="space-y-6">
            <div className="p-8 text-center text-sm text-gray-500">
              Select a device or text element to edit its properties
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default CanvaPropertiesSidebar; 