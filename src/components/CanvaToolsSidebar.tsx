import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  UploadCloud,
  Layout,
  Smartphone,
  Image, 
  Type, 
  Palette, 
  PanelLeft,
  Box,
  Grid3X3
} from 'lucide-react';
import UploadArea from './UploadArea';

interface CanvaToolsSidebarProps {
  isCollapsed: boolean;
  onImageUpload: (image: string) => void;
  onDeviceSelect: (type: string) => void;
  deviceTypes: Array<{id: string, name: string}>;
}

const CanvaToolsSidebar = ({
  isCollapsed,
  onImageUpload,
  onDeviceSelect,
  deviceTypes = [
    {id: 'iphone', name: 'iPhone'},
    {id: 'iphone-pro', name: 'iPhone Pro'},
    {id: 'android', name: 'Android'},
    {id: 'pixel-pro', name: 'Pixel Pro'},
    {id: 'ipad', name: 'iPad'},
    {id: 'macbook', name: 'MacBook'},
    {id: 'macbook-pro', name: 'MacBook Pro'},
    {id: 'galaxy-fold', name: 'Galaxy Fold'}
  ]
}: CanvaToolsSidebarProps) => {
  if (isCollapsed) {
    return (
      <div className="py-4 flex flex-col items-center space-y-6">
        <Button variant="ghost" className="h-10 w-10 p-0">
          <UploadCloud size={20} />
        </Button>
        <Button variant="ghost" className="h-10 w-10 p-0">
          <Smartphone size={20} />
        </Button>
        <Button variant="ghost" className="h-10 w-10 p-0">
          <Image size={20} />
        </Button>
        <Button variant="ghost" className="h-10 w-10 p-0">
          <Type size={20} />
        </Button>
        <Button variant="ghost" className="h-10 w-10 p-0">
          <Palette size={20} />
        </Button>
        <Button variant="ghost" className="h-10 w-10 p-0">
          <Box size={20} />
        </Button>
        <Button variant="ghost" className="h-10 w-10 p-0">
          <Grid3X3 size={20} />
        </Button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Upload</h3>
          <UploadArea onImageUpload={onImageUpload} hasImage={false} />
        </div>

        <Accordion type="single" collapsible defaultValue="devices">
          <AccordionItem value="devices">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Smartphone size={16} />
                <span>Devices</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {deviceTypes.map((device) => (
                  <Button 
                    key={device.id}
                    variant="outline" 
                    className="h-auto py-2 justify-start text-xs"
                    onClick={() => onDeviceSelect(device.id)}
                  >
                    {device.name}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="elements">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Box size={16} />
                <span>Elements</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <Button variant="outline" className="w-full justify-start text-xs">
                  Add Text
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  Add Shape
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  Add Icon
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="backgrounds">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Palette size={16} />
                <span>Backgrounds</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-4 gap-2">
                  {['white', 'black', 'gray', 'blue', 'red', 'green', 'yellow', 'purple'].map((color) => (
                    <div 
                      key={color}
                      className="h-10 w-full rounded-md cursor-pointer border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <Input type="file" accept="image/*" className="text-xs" />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="layout">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Layout size={16} />
                <span>Layout</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                <Button variant="outline" className="w-full justify-start text-xs">
                  Single Device
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  Multiple Devices
                </Button>
                <Button variant="outline" className="w-full justify-start text-xs">
                  Custom Layout
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="patterns">
            <AccordionTrigger className="text-sm font-medium">
              <div className="flex items-center gap-2">
                <Grid3X3 size={16} />
                <span>Patterns</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {['dots', 'grid', 'lines', 'zigzag', 'waves'].map((pattern) => (
                  <Button 
                    key={pattern}
                    variant="outline" 
                    className="h-auto py-2 justify-start text-xs capitalize"
                  >
                    {pattern}
                  </Button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default CanvaToolsSidebar; 