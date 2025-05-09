import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from '@/components/ui/label';
import UploadArea from './UploadArea';
import { Check, Download, Image, ImagePlus, Type, Layers, Palette, MousePointerClick, Trash2, Plus, Smartphone, X, Cpu, RotateCw, Lock, FileImage, GalleryHorizontalEnd, Share2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { HexColorPicker } from "react-colorful";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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

interface ToolsPanelProps {
  onImageUpload: (image: string) => void;
  onDeviceTypeChange: (type: string) => void;
  onDeviceColorChange: (color: string) => void;
  onOrientationChange: (orientation: 'portrait' | 'landscape') => void;
  onShadowChange: (shadow: boolean) => void;
  onBackgroundChange: (color: string) => void;
  deviceType: string;
  deviceColor: string;
  orientation: 'portrait' | 'landscape';
  shadow: boolean;
  background: string;
  hasImage: boolean;
  onExport: (type: string) => void;
  textElements: TextElement[];
  activeTextId: string | null;
  onAddTextElement: () => void;
  onUpdateTextElement: (id: string, field: keyof TextElement, value: any) => void;
  onRemoveTextElement: (id: string) => void;
  onTextElementSelect: (id: string | null) => void;
  multipleDevices: {
    enabled: boolean;
    scale: number;
    layout: 'horizontal' | 'vertical';
  };
  onMultipleDevicesChange: (field: string, value: string | boolean | number) => void;
  backgroundPattern: string;
  onBackgroundPatternChange: (pattern: string) => void;
  devices: Device[];
  activeDeviceId: string;
  onSelectDevice: (id: string) => void;
  onAddDevice: () => void;
  onRemoveDevice: (id: string) => void;
  isPro?: boolean;
  onProChange?: (isPro: boolean) => void;
  onRotationChange?: (id: string, rotation: { x: number, y: number }) => void;
  customBackgroundImage?: string | null;
  customBackgroundColor?: string | null;
  onCustomBackgroundImageUpload?: (image: string) => void;
  onCustomBackgroundColorChange?: (color: string) => void;
}

const ToolsPanel = ({
  onImageUpload,
  onDeviceTypeChange,
  onDeviceColorChange,
  onOrientationChange,
  onShadowChange,
  onBackgroundChange,
  deviceType,
  deviceColor,
  orientation,
  shadow,
  background,
  hasImage,
  onExport,
  textElements,
  activeTextId,
  onAddTextElement,
  onUpdateTextElement,
  onRemoveTextElement,
  onTextElementSelect,
  multipleDevices,
  onMultipleDevicesChange,
  backgroundPattern,
  onBackgroundPatternChange,
  devices,
  activeDeviceId,
  onSelectDevice,
  onAddDevice,
  onRemoveDevice,
  isPro = false,
  onProChange = () => {},
  onRotationChange = () => {},
  customBackgroundImage = null,
  customBackgroundColor = null,
  onCustomBackgroundImageUpload = () => {},
  onCustomBackgroundColorChange = () => {}
}: ToolsPanelProps) => {
  
  const { toast } = useToast();
  const activeDevice = devices.find(d => d.id === activeDeviceId) || devices[0];
  
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const handleResetPosition = (id: string) => {
    onUpdateTextElement(id, 'position', { x: 0, y: 0 });
  };

  const activeText = activeTextId ? textElements.find(el => el.id === activeTextId) : null;

  // List of common web-safe fonts
  const fontFamilies = [
    'Arial',
    'Verdana',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Trebuchet MS',
    'Impact',
    'Comic Sans MS',
    'Palatino',
  ];

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

  const handleResetRotation = () => {
    onRotationChange(activeDeviceId, { x: 0, y: 0 });
  };

  const handleBackgroundImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onCustomBackgroundImageUpload(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const [deviceColor, setDeviceColor] = useState(deviceColor);

  return (
    <div className="w-full bg-white rounded-lg border border-mockup-gray-200 overflow-hidden">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="upload">Upload</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="export">Export</TabsTrigger>
        </TabsList>
        
        <div className="p-4">
          <TabsContent value="upload">
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-700">Active Device</h3>
                <Badge variant="outline" className="font-normal">
                  {getDeviceTypeName(deviceType)}
                </Badge>
              </div>
              <UploadArea onImageUpload={onImageUpload} />
              
              {multipleDevices.enabled && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">All Devices</h3>
                  <ScrollArea className="h-[140px] rounded-md border">
                    <div className="p-2 space-y-2">
                      {devices.map(device => (
                        <div 
                          key={device.id}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 ${activeDeviceId === device.id ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'}`}
                          onClick={() => onSelectDevice(device.id)}
                        >
                          <div className="flex items-center gap-2">
                            <Smartphone size={16} className="text-gray-500" />
                            <div>
                              <p className="text-sm font-medium">{getDeviceTypeName(device.type)}</p>
                              <p className="text-xs text-gray-500">{device.color} {device.isPro && <span className="text-blue-500 font-medium">PRO</span>}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {device.image ? (
                              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                <Check size={12} className="text-green-600" />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                <X size={12} className="text-gray-400" />
                              </div>
                            )}
                            {devices.length > 1 && (
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 rounded-full hover:bg-red-50 hover:text-red-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveDevice(device.id);
                                }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  
                  {devices.length < 6 && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-sm flex items-center justify-center gap-1"
                      onClick={onAddDevice}
                    >
                      <Plus size={14} />
                      Add Device ({devices.length}/6)
                    </Button>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="customize">
            <div className="space-y-4">
              <Accordion type="multiple" defaultValue={["device", "text"]}>
                <AccordionItem value="pro">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <Cpu size={16} className="text-blue-600" />
                      <span>Pro Features</span>
                      <Badge variant="secondary" className="ml-2 py-0 h-5">NEW</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch 
                            id="pro-mode" 
                            checked={isPro}
                            onCheckedChange={(checked) => {
                              onProChange(checked);
                              if (checked) {
                                toast({
                                  title: "Pro Mode Activated",
                                  description: "You now have access to premium devices and 3D rotation",
                                });
                              }
                            }}
                          />
                          <Label htmlFor="pro-mode">Enable Pro Mode</Label>
                        </div>
                      </div>
                      
                      {isPro ? (
                        <>
                          <div className="space-y-2 pt-2">
                            <Label className="flex items-center justify-between">
                              <span>3D Rotation</span>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-2"
                                onClick={handleResetRotation}
                              >
                                <RotateCw size={14} className="mr-1" />
                                Reset
                              </Button>
                            </Label>
                            
                            <div className="pt-2">
                              <Label className="text-xs text-gray-500 mb-1 block">X Rotation</Label>
                              <Slider
                                value={[activeDevice.rotation?.x || 0]}
                                min={-30}
                                max={30}
                                step={1}
                                onValueChange={([x]) => onRotationChange(activeDeviceId, { x, y: activeDevice.rotation?.y || 0 })}
                              />
                            </div>
                            
                            <div className="pt-2">
                              <Label className="text-xs text-gray-500 mb-1 block">Y Rotation</Label>
                              <Slider
                                value={[activeDevice.rotation?.y || 0]}
                                min={-30}
                                max={30}
                                step={1}
                                onValueChange={([y]) => onRotationChange(activeDeviceId, { x: activeDevice.rotation?.x || 0, y })}
                              />
                            </div>
                            
                            <p className="text-xs text-gray-500 mt-2">Tip: You can also drag directly on the device to rotate it</p>
                          </div>
                        </>
                      ) : (
                        <div className="bg-blue-50 p-3 rounded-md mt-2 flex items-start gap-2">
                          <Lock size={16} className="text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Unlock Pro Features</p>
                            <p className="text-xs text-blue-600 mt-1">Access premium device models like iPhone 15 Pro, Pixel Pro, and Galaxy Fold with realistic details and 3D rotation capabilities.</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="device">
                  <AccordionTrigger className="py-2">Device Settings</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label>Device Type</Label>
                        <Select value={deviceType} onValueChange={onDeviceTypeChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select device" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iphone">iPhone 14 Pro</SelectItem>
                            <SelectItem value="android">Android Phone</SelectItem>
                            <SelectItem value="ipad">iPad Pro</SelectItem>
                            <SelectItem value="macbook">MacBook</SelectItem>
                            
                            {isPro && (
                              <>
                                <Separator className="my-2" />
                                <div className="px-2 py-1.5">
                                  <span className="text-xs font-semibold text-blue-600">PRO DEVICES</span>
                                </div>
                                <SelectItem value="iphone-pro">iPhone 15 Pro</SelectItem>
                                <SelectItem value="pixel-pro">Pixel Pro</SelectItem>
                                <SelectItem value="galaxy-fold">Galaxy Fold</SelectItem>
                                <SelectItem value="macbook-pro">MacBook Pro</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-3">
                        <Label>Device Color</Label>
                        <Select value={deviceColor} onValueChange={onDeviceColorChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select color" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="black">Black</SelectItem>
                            <SelectItem value="white">White</SelectItem>
                            <SelectItem value="gold">Gold</SelectItem>
                            
                            {isPro && (
                              <>
                                <Separator className="my-2" />
                                <div className="px-2 py-1.5">
                                  <span className="text-xs font-semibold text-blue-600">PRO COLORS</span>
                                </div>
                                {deviceType === 'iphone-pro' && (
                                  <>
                                    <SelectItem value="titanium">Natural Titanium</SelectItem>
                                    <SelectItem value="blue-titanium">Blue Titanium</SelectItem>
                                    <SelectItem value="white-titanium">White Titanium</SelectItem>
                                    <SelectItem value="black-titanium">Black Titanium</SelectItem>
                                  </>
                                )}
                                {deviceType === 'pixel-pro' && (
                                  <SelectItem value="hazel">Hazel</SelectItem>
                                )}
                                {(deviceType === 'galaxy-fold' || deviceType === 'macbook-pro') && (
                                  <SelectItem value="silver">Silver</SelectItem>
                                )}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between">
                        <div className="space-y-1">
                          <Label htmlFor="orientation">Portrait Mode</Label>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="orientation" 
                              checked={orientation === 'portrait'} 
                              onCheckedChange={(checked) => onOrientationChange(checked ? 'portrait' : 'landscape')}
                            />
                            <Label htmlFor="orientation">{orientation === 'portrait' ? 'On' : 'Off'}</Label>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="shadow">Shadow</Label>
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="shadow" 
                              checked={shadow} 
                              onCheckedChange={onShadowChange}
                            />
                            <Label htmlFor="shadow">{shadow ? 'On' : 'Off'}</Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="multiple-devices">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <Layers size={16} />
                      <span>Multiple Devices</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="multiple-devices" 
                          checked={multipleDevices.enabled}
                          onCheckedChange={(checked) => {
                            onMultipleDevicesChange('enabled', checked);
                            // Add a second device if enabling and only one device exists
                            if (checked && devices.length === 1) {
                              onAddDevice();
                            }
                          }}
                        />
                        <Label htmlFor="multiple-devices">Show multiple devices</Label>
                      </div>
                      
                      {multipleDevices.enabled && (
                        <>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <Label>Device Scale: {Math.round(multipleDevices.scale * 100)}%</Label>
                            </div>
                            <Slider
                              value={[multipleDevices.scale]}
                              min={0.5}
                              max={1}
                              step={0.05}
                              onValueChange={([value]) => onMultipleDevicesChange('scale', value)}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Device Layout</Label>
                            <div className="grid grid-cols-2 gap-2">
                              <Button
                                type="button"
                                variant={multipleDevices.layout === 'horizontal' ? 'default' : 'outline'}
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => onMultipleDevicesChange('layout', 'horizontal')}
                              >
                                <span className="text-sm">Side by Side</span>
                              </Button>
                              <Button
                                type="button"
                                variant={multipleDevices.layout === 'vertical' ? 'default' : 'outline'}
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => onMultipleDevicesChange('layout', 'vertical')}
                              >
                                <span className="text-sm">Stacked</span>
                              </Button>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Side by Side recommended for best viewing</p>
                          </div>
                          
                          <Separator className="my-2" />
                          
                          <div className="space-y-2">
                            <Label className="flex items-center justify-between">
                              <span>Manage Devices</span>
                              <span className="text-sm text-gray-500">{devices.length}/6</span>
                            </Label>
                            <ScrollArea className="h-[140px] rounded-md border">
                              <div className="p-2 space-y-2">
                                {devices.map(device => (
                                  <div 
                                    key={device.id}
                                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 ${activeDeviceId === device.id ? 'bg-blue-50 border border-blue-200' : 'border border-gray-200'}`}
                                    onClick={() => onSelectDevice(device.id)}
                                  >
                                    <div className="flex items-center gap-2">
                                      <Smartphone size={16} className="text-gray-500" />
                                      <div>
                                        <p className="text-sm font-medium">{getDeviceTypeName(device.type)}</p>
                                        <p className="text-xs text-gray-500">{device.color}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {device.image ? (
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                          <Check size={12} className="text-green-600" />
                                        </div>
                                      ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                                          <X size={12} className="text-gray-400" />
                                        </div>
                                      )}
                                      {devices.length > 1 && (
                                        <Button 
                                          variant="ghost" 
                                          size="icon" 
                                          className="h-6 w-6 rounded-full hover:bg-red-50 hover:text-red-500"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onRemoveDevice(device.id);
                                          }}
                                        >
                                          <Trash2 size={14} />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                            {devices.length < 6 && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full mt-2 text-sm flex items-center justify-center gap-1"
                                onClick={onAddDevice}
                              >
                                <Plus size={14} />
                                Add Device
                              </Button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="text">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <Type size={16} />
                      <span>Text Elements</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      <Button 
                        className="w-full flex items-center justify-center gap-2"
                        onClick={onAddTextElement}
                      >
                        <Plus size={16} />
                        Add New Text
                      </Button>
                      
                      {textElements.length > 0 && (
                        <>
                          <Separator />
                          
                          <div className="space-y-2">
                            <Label>Select Text Element</Label>
                            <Select 
                              value={activeTextId || ''} 
                              onValueChange={(value) => onTextElementSelect(value || null)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select text to edit" />
                              </SelectTrigger>
                              <SelectContent>
                                {textElements.map(element => (
                                  <SelectItem key={element.id} value={element.id}>
                                    {element.text.substring(0, 20)}{element.text.length > 20 ? '...' : ''}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          {activeText && (
                            <div className="space-y-4 p-3 border border-gray-200 rounded-lg">
                              <div className="space-y-2">
                                <Label htmlFor="text-content">Text Content</Label>
                                <Input 
                                  id="text-content" 
                                  value={activeText.text}
                                  onChange={(e) => onUpdateTextElement(activeText.id, 'text', e.target.value)}
                                  placeholder="Enter text content"
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Font Family</Label>
                                <Select 
                                  value={activeText.fontFamily}
                                  onValueChange={(value) => onUpdateTextElement(activeText.id, 'fontFamily', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select font" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {fontFamilies.map(font => (
                                      <SelectItem key={font} value={font} style={{ fontFamily: font }}>
                                        {font}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <Label>Font Size: {activeText.fontSize}px</Label>
                                </div>
                                <Slider
                                  value={[activeText.fontSize]}
                                  min={8}
                                  max={72}
                                  step={1}
                                  onValueChange={([value]) => onUpdateTextElement(activeText.id, 'fontSize', value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Text Color</Label>
                                <Select 
                                  value={activeText.color}
                                  onValueChange={(value) => onUpdateTextElement(activeText.id, 'color', value)}
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select text color" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="black">Black</SelectItem>
                                    <SelectItem value="white">White</SelectItem>
                                    <SelectItem value="#3B82F6">Blue</SelectItem>
                                    <SelectItem value="#10B981">Green</SelectItem>
                                    <SelectItem value="#EF4444">Red</SelectItem>
                                    <SelectItem value="#8B5CF6">Purple</SelectItem>
                                    <SelectItem value="#F59E0B">Orange</SelectItem>
                                    <SelectItem value="#EC4899">Pink</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="flex items-center gap-2 pt-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="flex-1 flex items-center gap-2 text-sm"
                                  onClick={() => handleResetPosition(activeText.id)}
                                >
                                  <MousePointerClick size={14} />
                                  Center
                                </Button>
                                
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  className="flex-1 flex items-center gap-2 text-sm"
                                  onClick={() => onRemoveTextElement(activeText.id)}
                                >
                                  <Trash2 size={14} />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="background">
                  <AccordionTrigger className="py-2">
                    <div className="flex items-center gap-2">
                      <Palette size={16} />
                      <span>Background</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4">
                      {isPro && (
                        <div className="space-y-3 mb-4">
                          <Label className="flex items-center gap-2">
                            <Badge variant="secondary" className="py-0 h-5">PRO</Badge>
                            <span>Custom Background</span>
                          </Label>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor="bg-image-upload" className="block mb-1 text-xs">Upload Image</Label>
                              <div className="relative">
                                <Button 
                                  variant="outline" 
                                  className="w-full h-16 flex flex-col items-center justify-center gap-1 rounded-md border-dashed"
                                  onClick={() => document.getElementById('bg-image-upload')?.click()}
                                >
                                  <Image size={18} />
                                  <span className="text-xs">Custom Image</span>
                                </Button>
                                <input
                                  id="bg-image-upload"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleBackgroundImageUpload}
                                />
                                {background === 'custom-image' && customBackgroundImage && (
                                  <div className="absolute bottom-1 right-1 bg-green-100 rounded-full p-1">
                                    <Check size={12} className="text-green-600" />
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div>
                              <Label className="block mb-1 text-xs">Custom Color</Label>
                              <div className="relative">
                                <Button 
                                  variant="outline" 
                                  className="w-full h-16 flex flex-col items-center justify-center gap-1 rounded-md border-dashed"
                                  onClick={() => setShowColorPicker(!showColorPicker)}
                                  style={background === 'custom-color' && customBackgroundColor ? {
                                    backgroundColor: customBackgroundColor
                                  } : {}}
                                >
                                  <Palette size={18} />
                                  <span className="text-xs">Color Picker</span>
                                </Button>
                                {background === 'custom-color' && customBackgroundColor && (
                                  <div className="absolute bottom-1 right-1 bg-green-100 rounded-full p-1">
                                    <Check size={12} className="text-green-600" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {showColorPicker && (
                            <div className="relative z-10 mt-2">
                              <div className="absolute top-0 inset-x-0">
                                <div className="bg-white rounded-md shadow-lg p-3 border">
                                  <HexColorPicker 
                                    color={customBackgroundColor || '#ffffff'} 
                                    onChange={(color) => {
                                      onCustomBackgroundColorChange(color);
                                    }} 
                                  />
                                  <div className="flex items-center gap-2 mt-2">
                                    <Input 
                                      value={customBackgroundColor || '#ffffff'} 
                                      className="text-xs"
                                      onChange={(e) => onCustomBackgroundColorChange(e.target.value)}
                                    />
                                    <Button 
                                      size="sm" 
                                      variant="outline"
                                      onClick={() => setShowColorPicker(false)}
                                    >
                                      Done
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <Separator className="my-2" />
                        </div>
                      )}
                      
                      <div className="space-y-3">
                        <Label>Background Pattern</Label>
                        <Select value={backgroundPattern} onValueChange={onBackgroundPatternChange}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select pattern" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="dots">Dots</SelectItem>
                            <SelectItem value="lines">Lines</SelectItem>
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="waves">Waves</SelectItem>
                            <SelectItem value="zigzag">Zigzag</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="space-y-3">
                        <Label>Background Color</Label>
                        <div className="grid grid-cols-5 gap-2">
                          {[
                            'white', 'gray', 'blue', 'green', 'purple', 
                            'pink', 'yellow', 'orange', 'gradient', 'gradient-purple'
                          ].map((color) => (
                            <button
                              key={color}
                              className={`w-full h-10 rounded-md border ${background === color ? 'ring-2 ring-mockup-blue ring-offset-2' : ''}`}
                              style={{
                                background: color === 'white' ? 'white' : 
                                          color === 'gray' ? '#F3F4F6' : 
                                          color === 'blue' ? '#DBEAFE' : 
                                          color === 'green' ? '#DCFCE7' :
                                          color === 'purple' ? '#F3E8FF' :
                                          color === 'pink' ? '#FCE7F3' :
                                          color === 'yellow' ? '#FEF9C3' :
                                          color === 'orange' ? '#FFEDD5' :
                                          color === 'gradient' ? 'linear-gradient(135deg, #DCFCE7 0%, #DBEAFE 100%)' :
                                          'linear-gradient(135deg, #F3E8FF 0%, #FCE7F3 100%)'
                              }}
                              onClick={() => {
                                onBackgroundChange(color);
                              }}
                              disabled={false}
                            >
                              {background === color && <Check size={16} className="m-auto text-mockup-blue" />}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>
          
          <TabsContent value="export">
            <div className="space-y-4">
              <div className="p-4 bg-mockup-gray-50 rounded-lg border border-mockup-gray-200 mb-4">
                <h3 className="font-medium text-mockup-gray-700 mb-2">Marketing Assets (Pro)</h3>
                <p className="text-sm text-mockup-gray-500 mb-4">Generate professional marketing assets for different platforms.</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 justify-start gap-3" 
                    onClick={() => onExport('appstore')}
                    disabled={!hasImage}
                  >
                    <div className="bg-blue-100 p-2 rounded-md">
                      <ImagePlus size={18} className="text-mockup-blue" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-mockup-gray-700">App Store</div>
                      <div className="text-xs text-mockup-gray-500">1242 x 2208</div>
                    </div>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="h-auto py-3 justify-start gap-3" 
                    onClick={() => onExport('instagram')}
                    disabled={!hasImage}
                  >
                    <div className="bg-pink-100 p-2 rounded-md">
                      <Image size={18} className="text-pink-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-medium text-mockup-gray-700">Instagram</div>
                      <div className="text-xs text-mockup-gray-500">1080 x 1080</div>
                    </div>
                  </Button>
                </div>
              </div>
              
              <Button 
                className="w-full bg-mockup-blue gap-2 hover:bg-blue-600" 
                size="lg" 
                onClick={() => onExport('mockup')}
                disabled={!hasImage}
              >
                <Download size={18} />
                Export Mockup (PNG)
              </Button>
              
              <div className="text-center text-xs text-mockup-gray-500 pt-2">
                Free plan: 5 exports remaining this month
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ToolsPanel;
