import React from 'react';
import { X, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MarketingPreviewProps {
  type: string;
  imageUrl: string | null;
  isLoading?: boolean;
  revisedPrompt?: string | null;
  onClose: () => void;
  onDownload?: () => void;
}

const MarketingPreview = ({ 
  type, 
  imageUrl, 
  isLoading = false, 
  revisedPrompt = null, 
  onClose, 
  onDownload 
}: MarketingPreviewProps) => {
  let title: string;
  
  switch (type) {
    case 'appstore':
      title = 'App Store Preview';
      break;
    case 'instagram':
      title = 'Instagram Post Preview';
      break;
    case 'openai-mockup':
      title = 'AI Scene Mockup';
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-12">
              <Loader2 size={48} className="animate-spin text-mockup-blue mb-4" />
              <p className="text-mockup-gray-500">Generating your {type === 'openai-mockup' ? 'AI scene mockup' : 'marketing asset'}...</p>
              <p className="text-mockup-gray-400 text-sm mt-2">This may take a moment</p>
            </div>
          ) : (
            <>
              {imageUrl ? (
                <div className="bg-mockup-gray-100 p-4 flex flex-col items-center justify-center rounded-lg overflow-hidden">
                  {revisedPrompt && type === 'openai-mockup' && (
                    <div className="bg-blue-50 p-3 rounded-md mb-4 w-full text-sm text-blue-800">
                      <p className="font-medium mb-1">Prompt used:</p>
                      <p>{revisedPrompt}</p>
                    </div>
                  )}
                  <div className="max-w-full max-h-[60vh] overflow-auto mb-4">
                    <img 
                      src={imageUrl} 
                      alt={`${type} preview`} 
                      className="max-w-full max-h-[60vh] object-contain rounded-md" 
                    />
                  </div>
                  
                  {onDownload && (
                    <Button 
                      className="gap-2 mt-2" 
                      onClick={onDownload}
                    >
                      <Download size={16} />
                      Download Image
                    </Button>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center p-12 bg-mockup-gray-100 rounded-lg">
                  <p className="text-mockup-gray-500">No preview available</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketingPreview;
