
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, User, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b border-mockup-gray-200 bg-white py-4 px-6">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera size={24} className="text-mockup-blue" />
          <h1 className="text-xl font-bold text-mockup-gray-800">MockupMagic</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center">
                <Link to="/dashboard" className="text-mockup-gray-600 hover:text-mockup-gray-900 px-3 py-2">
                  Dashboard
                </Link>
                <Link to="/mockup" className="text-mockup-gray-600 hover:text-mockup-gray-900 px-3 py-2">
                  Create Mockup
                </Link>
              </div>
              
              <div className="text-sm text-mockup-gray-500">
                <span className="font-medium">Free Plan</span>
                <span className="ml-2">• 5 exports left</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm font-medium">
                    {user.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/mockup">Create Mockup</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button className="bg-mockup-blue hover:bg-blue-600" asChild>
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
