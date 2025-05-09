import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Download, Share2 } from 'lucide-react';

interface CanvaLayoutProps {
  children: React.ReactNode;
  leftSidebar: React.ReactNode;
  rightSidebar: React.ReactNode;
  showRightSidebar?: boolean;
  onToggleRightSidebar?: () => void;
}

const CanvaLayout = ({
  children,
  leftSidebar,
  rightSidebar,
  showRightSidebar = true,
  onToggleRightSidebar = () => {}
}: CanvaLayoutProps) => {
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
      {/* Top header with brand, tabs, and actions */}
      <header className="flex items-center px-4 h-14 border-b bg-white">
        <div className="flex items-center space-x-4 w-full">
          <div className="font-bold text-xl">MockupStudio</div>
          
          <Tabs defaultValue="design" className="flex-1">
            <TabsList className="w-auto bg-gray-100 p-1">
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="animate">Animate</TabsTrigger>
              <TabsTrigger value="mockups">Mockups</TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Download size={16} />
              Download
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Share2 size={16} />
              Share
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content area with sidebars and canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - collapsible tools panel */}
        <div className={cn(
          "flex flex-col border-r bg-white transition-all duration-200 ease-in-out",
          isLeftSidebarCollapsed ? "w-16" : "w-72"
        )}>
          <div className="flex-1 overflow-y-auto">
            {leftSidebar}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            className="self-end m-2"
          >
            {isLeftSidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>

        {/* Main canvas area */}
        <div className="flex-1 overflow-hidden bg-gray-100 flex items-center justify-center">
          <div className="relative">
            {children}
          </div>
        </div>

        {/* Right sidebar - properties panel */}
        {showRightSidebar && (
          <div className="w-80 border-l bg-white overflow-y-auto">
            {rightSidebar}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggleRightSidebar}
              className="absolute right-80 top-1/2 bg-white rounded-l-md border border-r-0"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}
        
        {!showRightSidebar && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggleRightSidebar}
            className="absolute right-0 top-1/2 bg-white rounded-l-md border border-r-0"
          >
            <ChevronLeft size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CanvaLayout; 