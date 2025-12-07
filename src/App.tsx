import React, { useEffect, lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import About from "./pages/About";
import ChatWidgetProvider from "./components/ChatWidgetProvider";

// Use React.lazy for code splitting (only load components when needed)
const ResumeGenerator = lazy(() => import("./pages/ResumeGenerator"));
const GradeCalculator = lazy(() => import("./pages/GradeCalculator"));
const EndTermMarksPredictor = lazy(() => import("./pages/EndTermMarksPredictor"));
const NotFound = lazy(() => import("./pages/NotFound"));
const RoadmapListing = lazy(() => import("./pages/RoadmapListing"));
const RoadmapDetail = lazy(() => import("./pages/RoadmapDetail"));
const AiAssistant = lazy(() => import("./pages/AiAssistant"));

// Loading fallback component - should be lightweight
const PageLoader = () => (
  <div className="flex items-center justify-center w-full h-screen bg-background">
    <div className="flex flex-col items-center gap-2">
      <div className="h-10 w-10 rounded-full border-4 border-t-blue-600 border-blue-200 animate-spin"></div>
      <p className="text-sm text-muted-foreground">Loading...</p>
    </div>
  </div>
);

// Create the query client with cache optimization
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1, // Limit retries
      gcTime: 10 * 60 * 1000, // 10 minutes (garbage collection time)
    },
  },
});

const App = () => {
  // Fix for iOS height issue and performance optimizations
  useEffect(() => {
    // Fix iOS height issue
    const fixIOSHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Use passive event listeners for better scroll performance
    const opts = { passive: true };

    // Initial call and event listener
    fixIOSHeight();
    window.addEventListener('resize', fixIOSHeight, opts);
    window.addEventListener('orientationchange', fixIOSHeight, opts);

    // Prevent body scrolling on mobile touch devices
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) {
      document.body.style.overscrollBehavior = 'none';
    }

    // Prefetch important routes
    const prefetchRoutes = () => {
      const importPromises = [
        import("./pages/Index"),
      ];
      // Execute all imports in parallel
      Promise.all(importPromises).catch(() => {
        // Silently fail prefetching
      });
    };

    // Prefetch after initial load during idle time
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(prefetchRoutes);
    } else {
      // Fallback for browsers without requestIdleCallback
      setTimeout(prefetchRoutes, 1000);
    }

    return () => {
      window.removeEventListener('resize', fixIOSHeight);
      window.removeEventListener('orientationchange', fixIOSHeight);
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/resume-generator" element={<ResumeGenerator />} />
                <Route path="/grade-calculator" element={<GradeCalculator />} />
                <Route path="/endterm-marks-predictor" element={<EndTermMarksPredictor />} />
                <Route path="/roadmaps" element={<RoadmapListing />} />
                <Route path="/roadmaps/:id" element={<RoadmapDetail />} />
                <Route path="/ai-assistant" element={<AiAssistant />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ChatWidgetProvider />
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
