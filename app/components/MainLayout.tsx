import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import Footer from './Footer';

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar stays at the top */}
      <Navbar />
      

      <Footer />
    </div>
  );
};

export default MainLayout;
