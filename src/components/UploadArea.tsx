
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, Image, X } from 'lucide-react';

interface UploadAreaProps {
  onImageUpload: (image: string) => void;
}

const UploadArea = ({ onImageUpload }: UploadAreaProps) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            onImageUpload(event.target.result);
            toast({
              title: "Screenshot uploaded",
              description: "Your screenshot has been added to the mockup.",
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG or JPG).",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target && typeof event.target.result === 'string') {
            onImageUpload(event.target.result);
            toast({
              title: "Screenshot uploaded",
              description: "Your screenshot has been added to the mockup.",
            });
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload an image file (PNG or JPG).",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div 
      className={`flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-lg p-6 transition-all
        ${isDragging ? 'border-mockup-blue bg-blue-50' : 'border-mockup-gray-300 bg-mockup-gray-50'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Upload 
        className={`mb-3 ${isDragging ? 'text-mockup-blue' : 'text-mockup-gray-400'}`} 
        size={36} 
      />
      <p className="text-center text-mockup-gray-600 mb-2">
        Drag & drop your screenshot here
      </p>
      <p className="text-center text-mockup-gray-500 text-sm mb-4">
        PNG or JPG up to 5MB
      </p>
      <div>
        <label htmlFor="file-upload" className="cursor-pointer inline-flex items-center bg-mockup-gray-100 hover:bg-mockup-gray-200 text-mockup-gray-700 py-2 px-4 rounded-md text-sm transition-colors">
          <Image size={16} className="mr-2" />
          Browse Files
        </label>
        <input 
          id="file-upload" 
          type="file" 
          accept="image/png, image/jpeg" 
          className="hidden" 
          onChange={handleFileInput}
        />
      </div>
    </div>
  );
};

export default UploadArea;
