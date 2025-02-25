// MainLayout.tsx
import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ThemeProvider } from "./ThemeContext";

const MainLayout: React.FC = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
        <Navbar />        
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default MainLayout;
