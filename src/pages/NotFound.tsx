
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-mockup-gray-50 p-4">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-mockup-gray-100 rounded-full mb-6">
          <Camera size={32} className="text-mockup-blue" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-mockup-gray-800">404</h1>
        <p className="text-xl text-mockup-gray-600 mb-6">
          Oops! We couldn't find the mockup you're looking for.
        </p>
        <Button asChild className="bg-mockup-blue hover:bg-blue-600">
          <a href="/">Return to MockupMagic</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
