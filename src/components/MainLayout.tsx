import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [mounted, setMounted] = useState(false);
  
  // Mount animation and handle window events
  useEffect(() => {
    setMounted(true);
    
    // Immediately scroll to top when navigating
    window.scrollTo(0, 0);
    
    return () => {
      setMounted(false);
    };
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen bg-background relative">
      {/* Background blobs - positioned absolutely so they don't cause scrolling issues */}
      {mounted && (
        <>
          <div className="blob blob-primary w-80 h-80 top-0 right-0 opacity-[0.08] pointer-events-none" />
          <div className="blob blob-secondary w-80 h-80 left-0 bottom-0 opacity-[0.05] pointer-events-none" />
        </>
      )}
      
      <Navbar />
      
      <main className="flex-grow w-full">
        <div className="w-full" style={{ minHeight: 'calc(100vh - 4rem)' }}>
          {children}
        </div>
      </main>
      
      {isHomePage && (
        <div className="will-change-opacity">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default MainLayout;
