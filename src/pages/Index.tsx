import { useEffect } from "react";
import { Brain, FileText, Calculator, GraduationCap, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeatureCard from "@/components/FeatureCard";
import ComingSoonCard from "@/components/ComingSoonCard";
import MainLayout from "@/components/MainLayout";
import { useHomeAnimations } from "@/hooks/useHomeAnimations";

const showFeatures = {
  resumeGenerator: true,
  gradeCalculator: true,
  marksPredictor: true,
  aiAssistant: true
};

const Index = () => {
  useHomeAnimations();

  // Pre-load key components to improve navigation performance
  useEffect(() => {
    const links = [
      '/grade-calculator',
      '/resume-generator',
      '/roadmaps',
      '/endterm-marks-predictor'
    ];

    links.forEach(link => {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = link;
      document.head.appendChild(prefetch);
    });
  }, []);

  return (
    <>
      <MainLayout>
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="hero-title text-4xl md:text-5xl font-extrabold text-[hsl(var(--iitm-dark))] mb-6 opacity-0">
              IITM Scholar Hub - Essential Tools for IIT Madras Students
            </h1>
            <p className="hero-description relative text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto opacity-0 overflow-hidden">
              <span className="inline-block">
                Comprehensive educational platform offering Grade Calculator, End Term Marks Predictor, Resume Generator, and Learning Roadmaps for IIT Madras students.
              </span>
            </p>
            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center opacity-0">
              <Link to="/grade-calculator">
                <Button className="bg-[hsl(var(--iitm-blue))] text-white hover:bg-[hsl(var(--iitm-blue))]/90 px-6 py-6 h-auto text-lg">
                  Try Our Grade Calculator
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" className="border-[hsl(var(--iitm-blue))] text-[hsl(var(--iitm-blue))] hover:bg-[hsl(var(--iitm-blue))]/10 px-6 py-6 h-auto text-lg">
                  Explore All Features
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[hsl(var(--iitm-dark))] mb-4">
                Educational Tools for IIT Madras Students
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our specialized tools are designed specifically for IITM BS/BSc students to help track your academic progress,
                calculate your CGPA, predict marks, and follow curated learning roadmaps for different domains.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {showFeatures.gradeCalculator ? (
                <div className="feature-card opacity-0">
                  <FeatureCard
                    title="Grade Calculator"
                    description="Calculate your Cumulative Grade Point Average (CGPA) by entering your course details and grades. Built specifically for IITM grading system."
                    icon={GraduationCap}
                    path="/grade-calculator"
                  />
                </div>
              ) : (
                <div className="feature-card opacity-0">
                  <ComingSoonCard
                    title="Grade Calculator"
                    description="Calculate your Cumulative Grade Point Average (CGPA) by entering your course details and grades."
                    icon={GraduationCap}
                  />
                </div>
              )}

              {showFeatures.resumeGenerator ? (
                <div className="feature-card opacity-0">
                  <FeatureCard
                    title="Resume Generator"
                    description="Create professional resumes by filling out your details and choosing from elegant templates. Tailored for IITM students to highlight academic achievements."
                    icon={FileText}
                    path="/resume-generator"
                  />
                </div>
              ) : (
                <div className="feature-card opacity-0">
                  <ComingSoonCard
                    title="Resume Generator"
                    description="Create professional resumes by filling out your details and choosing from elegant templates."
                    icon={FileText}
                  />
                </div>
              )}

              <div className="feature-card opacity-0">
                <FeatureCard
                  title="Learning Roadmaps"
                  description="Follow curated learning paths for Data Science, Web Development, Python, Java, and DSA designed for students."
                  icon={Brain}
                  path="/roadmaps"
                />
              </div>

              {showFeatures.marksPredictor ? (
                <div className="feature-card opacity-0">
                  <FeatureCard
                    title="End Term Marks Predictor"
                    description="Predict your final exam scores needed to achieve desired grades in your IITM courses using the official assessment formula."
                    icon={Calculator}
                    path="/endterm-marks-predictor"
                  />
                </div>
              ) : (
                <div className="feature-card opacity-0">
                  <ComingSoonCard
                    title="End Term Marks Predictor"
                    description="Predict your final exam scores needed to achieve desired grades in your courses."
                    icon={Calculator}
                  />
                </div>
              )}

              {showFeatures.aiAssistant && (
                <div className="feature-card opacity-0">
                  <FeatureCard
                    title="AI Assistant"
                    description="Chat with our specialized AI assistant for help with academic questions, programming, mathematics, and more."
                    icon={MessageSquare}
                    path="/ai-assistant"
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[hsl(var(--iitm-dark))] mb-4">
                How Our IIT Madras Tools Work
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our tools use the official IITM grading criteria and assessment weightages to provide accurate academic assistance for IIT Madras students.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="how-it-works-card opacity-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-[hsl(var(--iitm-blue))]/10 dark:bg-[hsl(var(--iitm-blue))]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[hsl(var(--iitm-blue))] font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--iitm-dark))] mb-2">Select Your IITM Level</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Choose your IIT Madras program level (Foundation, Diploma, or Degree), and select the specific course you want to calculate CGPA for.
                </p>
              </div>
              <div className="how-it-works-card opacity-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-[hsl(var(--iitm-blue))]/10 dark:bg-[hsl(var(--iitm-blue))]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[hsl(var(--iitm-blue))] font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--iitm-dark))] mb-2">Enter Your IITM Course Details</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Input your GAA, quiz scores, and final exam marks for each IIT Madras course you've completed to get accurate calculations.
                </p>
              </div>
              <div className="how-it-works-card opacity-0 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-[hsl(var(--iitm-blue))]/10 dark:bg-[hsl(var(--iitm-blue))]/20 rounded-full flex items-center justify-center mb-4">
                  <span className="text-[hsl(var(--iitm-blue))] font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-[hsl(var(--iitm-dark))] mb-2">Get Your IITM CGPA Results</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Instantly see your calculated CGPA based on the official IIT Madras grading system, with all grades and scores saved for future reference.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Learning Roadmaps Section */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[hsl(var(--iitm-dark))] mb-4">
                Specialized Learning Roadmaps
              </h2>
              <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Follow our structured learning paths curated specifically for Students in various domains:
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="roadmap-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-[hsl(var(--iitm-dark))] mb-2">Data Science Roadmap</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A comprehensive learning path for Students to master data science, from statistics to machine learning.
                </p>
                <Link to="/roadmaps" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">View Roadmap →</Link>
              </div>
              <div className="roadmap-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-[hsl(var(--iitm-dark))] mb-2">Web Development Roadmap</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Learn frontend and backend web development skills relevant to coursework and projects.
                </p>
                <Link to="/roadmaps" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">View Roadmap →</Link>
              </div>
              <div className="roadmap-card bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-semibold text-[hsl(var(--iitm-dark))] mb-2">DSA Roadmap</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Master Data Structures and Algorithms with a structured path designed for Students.
                </p>
                <Link to="/roadmaps" className="text-blue-600 dark:text-blue-400 font-medium hover:underline">View Roadmap →</Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-16 bg-iitm-dark px-4 opacity-0">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to use IITM Scholar Hub?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Start using our specialized tools today to better manage your IIT Madras academic journey and achieve your educational goals.
            </p>
            <div className="flex justify-center">
              <Link to="/grade-calculator">
                <Button className="bg-iitm-blue text-white hover:bg-iitm-blue/90 px-8 py-6 h-auto text-lg">
                  Calculate Your IITM Grades Now
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
};

export default Index;
