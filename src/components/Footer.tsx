
import React from 'react';

const Footer = () => {
  return (
    <footer className="py-4 px-6 border-t border-mockup-gray-200 mt-auto">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-mockup-gray-500 mb-2 md:mb-0">
          &copy; 2025 MockupMagic. All rights reserved.
        </div>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-mockup-gray-500 hover:text-mockup-blue">Terms</a>
          <a href="#" className="text-sm text-mockup-gray-500 hover:text-mockup-blue">Privacy</a>
          <a href="#" className="text-sm text-mockup-gray-500 hover:text-mockup-blue">Help</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
