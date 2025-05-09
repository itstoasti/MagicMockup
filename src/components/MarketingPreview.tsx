
import React from 'react';
import { X } from 'lucide-react';

interface MarketingPreviewProps {
  children: React.ReactNode;
  type: string;
  onClose: () => void;
}

const MarketingPreview = ({ children, type, onClose }: MarketingPreviewProps) => {
  let title: string;
  
  switch (type) {
    case 'appstore':
      title = 'App Store Preview';
      break;
    case 'instagram':
      title = 'Instagram Post Preview';
      break;
    default:
      title = 'Marketing Preview';
  }
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b border-mockup-gray-200 p-4">
          <h3 className="font-medium text-mockup-gray-800">{title}</h3>
          <button 
            onClick={onClose}
            className="text-mockup-gray-500 hover:text-mockup-gray-700 p-1 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 overflow-auto flex-1">
          <div className="bg-mockup-gray-100 p-4 flex items-center justify-center rounded-lg overflow-hidden">
            <div className="max-w-full max-h-[70vh] overflow-auto">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingPreview;
