
import React from 'react';
import { Link } from 'react-router-dom';
import { Camera, Smartphone, Laptop, Monitor, Download, Layout, PenTool, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';

const Landing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-50 to-blue-100">
        <div className="container mx-auto px-4 py-6">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera size={28} className="text-mockup-blue" />
              <h1 className="text-xl font-bold text-mockup-gray-800">MockupMagic</h1>
            </div>
            <div>
              <Button variant="ghost" className="mr-2">
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button className="bg-mockup-blue hover:bg-blue-600">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center py-20">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight text-mockup-gray-800 mb-6">
                Create Stunning Device Mockups in Seconds
              </h2>
              <p className="text-xl text-mockup-gray-600 mb-8">
                Transform your app screenshots into beautiful device mockups for your marketing, portfolio, and presentations.
              </p>
              <Button size="lg" className="bg-mockup-blue hover:bg-blue-600">
                <Link to="/auth">Start Creating for Free</Link>
              </Button>
              <p className="text-sm text-mockup-gray-500 mt-4">
                No credit card required. 5 free mockups per month.
              </p>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative animate-float">
                <div className="absolute -top-10 -left-10 rotate-[-10deg]">
                  <img 
                    src="/placeholder.svg" 
                    alt="iPhone mockup" 
                    className="w-48 shadow-xl rounded-xl"
                  />
                </div>
                <div className="rotate-[5deg]">
                  <img 
                    src="/placeholder.svg" 
                    alt="iPad mockup" 
                    className="w-64 shadow-xl rounded-xl"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 rotate-[8deg]">
                  <img 
                    src="/placeholder.svg" 
                    alt="MacBook mockup" 
                    className="w-48 shadow-xl rounded-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-mockup-gray-800 mb-12">
            Everything You Need for Perfect Device Mockups
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-blue-50 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Smartphone className="h-12 w-12 text-mockup-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">Multiple Devices</h3>
                <p className="text-mockup-gray-600">
                  Choose from iPhones, iPads, MacBooks, and more for your mockups.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <PenTool className="h-12 w-12 text-mockup-green mb-4" />
                <h3 className="text-xl font-semibold mb-2">Customizable</h3>
                <p className="text-mockup-gray-600">
                  Change colors, angles, and backgrounds to match your brand.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-blue-50 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Download className="h-12 w-12 text-mockup-blue mb-4" />
                <h3 className="text-xl font-semibold mb-2">Easy Export</h3>
                <p className="text-mockup-gray-600">
                  Download high-resolution PNG files ready for use anywhere.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50 border-none">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <Layout className="h-12 w-12 text-mockup-green mb-4" />
                <h3 className="text-xl font-semibold mb-2">Marketing Ready</h3>
                <p className="text-mockup-gray-600">
                  Create App Store and social media ready promotional graphics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Testimonials/CTA Section */}
      <section className="py-20 bg-mockup-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-mockup-gray-800 mb-12">
            Ready to Transform Your Screenshots?
          </h2>
          
          <div className="flex justify-center mb-12">
            <Button size="lg" className="bg-mockup-blue hover:bg-blue-600">
              <Link to="/auth">Create Your First Mockup</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <p className="text-mockup-gray-600 italic mb-4">
                  "MockupMagic made creating professional app mockups so easy. Saved me hours of work!"
                </p>
                <p className="font-medium">Sarah T., UI Designer</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <p className="text-mockup-gray-600 italic mb-4">
                  "Perfect for our marketing materials. The results look amazing and professional."
                </p>
                <p className="font-medium">Michael P., App Developer</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <p className="text-mockup-gray-600 italic mb-4">
                  "I use this for every project now. It's become an essential tool in my workflow."
                </p>
                <p className="font-medium">Alex J., Product Manager</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Landing;
