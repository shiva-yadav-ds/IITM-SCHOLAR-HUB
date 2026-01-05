import { useEffect } from "react";
import { Brain, FileText, Calculator, GraduationCap, MessageSquare, Sparkles, Zap, BookOpen, ArrowRight, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import FeatureCard from "@/components/FeatureCard";
import MainLayout from "@/components/MainLayout";
import { motion } from "framer-motion";



// Features data
const features = [
  {
    title: "Grade Calculator",
    description: "Calculate your CGPA using the official IITM grading system with detailed breakdowns for each course.",
    icon: GraduationCap,
    path: "/grade-calculator",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    title: "CGPA Calculator",
    description: "Comprehensive CGPA calculation with support for Foundation, Diploma, and Degree levels.",
    icon: Calculator,
    path: "/cgpa-calculator",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Resume Generator",
    description: "Create stunning professional resumes with modern templates tailored for IITM students.",
    icon: FileText,
    path: "/resume-generator",
    gradient: "from-emerald-500/20 to-teal-500/20",
  },
  {
    title: "Learning Roadmaps",
    description: "Follow curated learning paths for Data Science, Web Dev, Python, and DSA.",
    icon: Brain,
    path: "/roadmaps",
    gradient: "from-orange-500/20 to-amber-500/20",
  },
  {
    title: "Marks Predictor",
    description: "Predict end-term scores needed to achieve your target grades in each course.",
    icon: Zap,
    path: "/endterm-marks-predictor",
    gradient: "from-rose-500/20 to-red-500/20",
  },
  {
    title: "AI Assistant",
    description: "Get instant help with academic questions, programming, and mathematics.",
    icon: MessageSquare,
    path: "/ai-assistant",
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
];

const Index = () => {

  // Pre-load key components
  useEffect(() => {
    const links = ['/grade-calculator', '/resume-generator', '/roadmaps', '/endterm-marks-predictor'];
    links.forEach(link => {
      const prefetch = document.createElement('link');
      prefetch.rel = 'prefetch';
      prefetch.href = link;
      document.head.appendChild(prefetch);
    });
  }, []);

  return (
    <MainLayout>
      {/* Hero Section - Premium Design */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Light Mode Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:hidden" />

        {/* Dark Mode Background - Rich gradient with accent colors */}
        <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black" />

        {/* Grid pattern overlay for dark mode */}
        <div className="absolute inset-0 hidden dark:block opacity-20" style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(148 163 184 / 0.1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e")`,
        }} />

        {/* Accent glow orbs - Light Mode */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/25 rounded-full blur-3xl dark:hidden" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl dark:hidden" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-300/15 rounded-full blur-3xl dark:hidden" />

        {/* Accent glow orbs - Dark Mode (more vibrant) */}
        <div className="absolute top-10 left-0 w-96 h-96 bg-blue-600/30 rounded-full blur-[100px] hidden dark:block" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-600/25 rounded-full blur-[120px] hidden dark:block" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-[80px] hidden dark:block" />
        <div className="absolute bottom-1/3 left-1/4 w-48 h-48 bg-pink-500/15 rounded-full blur-[60px] hidden dark:block" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-full border border-gray-200 dark:border-white/20 shadow-sm dark:shadow-none"
          >
            <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-white">
              Made for IIT Madras Students
            </span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight"
          >
            <span className="text-gray-900 dark:text-white">Your </span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
              Academic
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
              Success Hub
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Grade calculators, CGPA tools, resume builder, and learning roadmaps
            — all the tools you need to excel at IIT Madras.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link to="/grade-calculator">
              <Button
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/25 dark:hover:shadow-blue-500/20 transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/roadmaps">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-white/90 dark:bg-white/10 border-2 border-gray-300 dark:border-white/20 hover:border-blue-500 dark:hover:border-blue-400 text-gray-900 dark:text-white rounded-xl backdrop-blur-md hover:bg-white dark:hover:bg-white/20 transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                View Roadmaps
              </Button>
            </Link>
          </motion.div>

          {/* 2026 Update Announcement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-white/10 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-[2px] bg-gradient-to-r from-transparent to-blue-500"></div>
                <span className="px-4 py-1.5 text-xs font-bold bg-blue-600/90 text-white rounded-md uppercase tracking-widest">
                  2026 Updated
                </span>
                <div className="w-8 h-[2px] bg-gradient-to-l from-transparent to-blue-500"></div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-3 tracking-tight">
                All Tools Updated for 2026 Grading System
              </h3>
              <p className="text-center text-gray-400 text-base md:text-lg font-medium mb-5">
                Grade Calculator  •  Marks Predictor  •  CGPA Calculator
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg font-medium text-gray-300 border border-white/10">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  100% Accurate
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg font-medium text-gray-300 border border-white/10">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Official IITM Formulas
                </span>
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg font-medium text-gray-300 border border-white/10">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  Up to Date
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-gray-400 dark:border-gray-600 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 relative">
        {/* Section Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/50 to-transparent dark:via-gray-900/50 pointer-events-none" />

        <div className="max-w-7xl mx-auto relative">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span
              className="inline-block px-4 py-1.5 mb-4 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 rounded-full"
              whileHover={{ scale: 1.05 }}
            >
              ✨ Powerful Tools
            </motion.span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to
              <span className="text-gradient-premium"> Succeed</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Purpose-built tools designed specifically for IIT Madras students to track progress, predict grades, and plan your academic journey.
            </p>
          </motion.div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <FeatureCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  path={feature.path}
                  delay={index}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* How It Works Section */}
      <section className="py-20 px-4 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 text-sm font-medium text-blue-400 bg-blue-500/10 rounded-md border border-blue-500/20">
              <Zap className="w-4 h-4" />
              Simple Process
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              How It <span className="text-blue-500">Works</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes with our intuitive tools built on official IITM grading criteria.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector Line (Desktop) */}
            <div className="hidden md:block absolute top-24 left-[16%] right-[16%] h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />

            {[
              { step: 1, title: "Select Your Level", desc: "Choose Foundation, Diploma, or Degree program", icon: GraduationCap },
              { step: 2, title: "Enter Your Scores", desc: "Input GAA, quizzes, and exam marks for each course", icon: Calculator },
              { step: 3, title: "Get Results", desc: "View calculated CGPA with detailed grade breakdowns", icon: Star },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="relative text-center"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20 w-6 h-6 bg-gray-900 dark:bg-gray-800 border border-blue-500/50 rounded-full flex items-center justify-center text-xs font-bold text-blue-400">
                  {item.step}
                </div>

                {/* Step Icon */}
                <motion.div
                  className="relative z-10 w-16 h-16 mx-auto mb-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 shadow-lg backdrop-blur-sm"
                  whileHover={{ scale: 1.05, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <item.icon className="w-7 h-7" />
                </motion.div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        {/* Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent" />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 text-sm font-medium text-white/80 bg-white/5 backdrop-blur-sm rounded-md border border-white/10">
            <GraduationCap className="w-4 h-4" />
            Start Your Journey Today
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Ready to Excel at IITM?
          </h2>

          <p className="text-xl text-white/60 mb-10 max-w-2xl mx-auto">
            Join hundreds of students using our tools to track their academic progress and achieve their goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/grade-calculator">
              <Button
                size="lg"
                className="group px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all"
              >
                Calculate Your Grades
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/cgpa-calculator">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-6 text-lg font-semibold border border-white/20 text-white hover:bg-white/5 rounded-xl"
              >
                Try CGPA Calculator
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Index;
