
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-mockup-blue mx-auto"></div>
          <p className="mt-4 text-mockup-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-mockup-gray-800 mb-2">
            Welcome back, {user.email?.split('@')[0]}!
          </h1>
          <p className="text-mockup-gray-600">
            Let's create some beautiful mockups for your projects.
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold mb-2">Getting Started</h2>
          <ol className="list-decimal list-inside space-y-2 text-mockup-gray-700">
            <li>Upload a screenshot of your app or website</li>
            <li>Choose a device frame (iPhone, iPad, MacBook, etc.)</li>
            <li>Customize colors and orientation</li>
            <li>Export your mockup in high resolution</li>
          </ol>
          <div className="mt-4">
            <Button className="bg-mockup-blue hover:bg-blue-600">
              Create New Mockup
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-mockup-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Mockups</h2>
            <div className="text-center py-8 text-mockup-gray-500">
              <p>You haven't created any mockups yet.</p>
              <p className="mt-2">Create your first one to see it here.</p>
            </div>
          </div>
          
          <div className="bg-white border border-mockup-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Account Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-mockup-gray-600">Plan</span>
                <span className="font-medium">Free Plan</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mockup-gray-600">Exports Available</span>
                <span className="font-medium">5 / 5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-mockup-gray-600">Renewal Date</span>
                <span className="font-medium">First of next month</span>
              </div>
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  Upgrade to Pro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
