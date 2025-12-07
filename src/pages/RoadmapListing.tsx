import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import { motion } from "framer-motion";
import { Code, BrainCircuit, Database, Network, MonitorSmartphone, ArrowRight, Coffee, BookOpen, Layers, BarChart } from 'lucide-react';
import roadmaps from '@/data/roadmaps';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { Helmet } from 'react-helmet';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5 }
  }
};

// Helper function for roadmap icons with their background
const getRoadmapIconWithBg = (id: string) => {
  switch(id) {
    case 'data-scientist':
      return {
        icon: <BrainCircuit className="h-7 w-7" />,
        bg: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
        border: "border-purple-500/50 dark:border-purple-500/30"
      };
    case 'dsa-python':
      return {
        icon: <Code className="h-7 w-7" />,
        bg: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
        border: "border-blue-500/50 dark:border-blue-500/30"
      };
    case 'dsa-java':
      return {
        icon: <Coffee className="h-7 w-7" />,
        bg: "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400",
        border: "border-amber-600/50 dark:border-amber-500/30"
      };
    case 'fullstack':
      return {
        icon: <MonitorSmartphone className="h-7 w-7" />,
        bg: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-500/50 dark:border-emerald-500/30"
      };
    default:
      return {
        icon: <Code className="h-7 w-7" />,
        bg: "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300",
        border: "border-gray-500/50 dark:border-gray-500/30"
      };
  }
};

// Helper for category badges
const getCategoryStyle = (id: string) => {
  switch(id) {
    case 'data-scientist':
      return "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300";
    case 'dsa-python':
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300";
    case 'dsa-java':
      return "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300";
    case 'fullstack':
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300";
    default:
      return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300";
  }
};

const RoadmapListing = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Data Science & Tech Learning Roadmaps | Complete Career Paths | IITM Scholar Hub</title>
        <meta name="description" content="Follow our detailed roadmaps for data science, programming, web development and more. Step-by-step guides from beginner to expert with comprehensive learning paths for any tech career." />
        <meta name="keywords" content="data science roadmap, complete data science roadmap, programming learning path, tech career roadmap, full stack development path, data science learning journey, beginner to expert roadmap, free learning roadmaps" />
        <meta property="og:title" content="Data Science & Tech Learning Roadmaps | Complete Career Paths" />
        <meta property="og:description" content="Follow our detailed roadmaps for data science, programming and web development with step-by-step guides." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IITM Scholar Hub" />
        <meta property="og:url" content="https://iitm-scholar-hub.vercel.app/roadmaps" />
        <meta property="og:image" content="https://iitm-scholar-hub.vercel.app/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content="Data Science & Tech Learning Roadmaps" />
        <meta name="twitter:description" content="Follow comprehensive roadmaps for data science and tech careers." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://iitm-scholar-hub.vercel.app/og-image.svg" />
      </Helmet>
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
            Learning Roadmaps
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6 max-w-3xl mx-auto">
            Explore our comprehensive learning paths designed to guide you from beginner to expert in various tech domains.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-16"
        >
          {roadmaps.map((roadmap) => {
            const iconWithBg = getRoadmapIconWithBg(roadmap.id);
            const categoryStyle = getCategoryStyle(roadmap.id);
            
            return (
            <motion.div key={roadmap.id} variants={itemVariants}>
                <Card className="h-full flex flex-col group transition-all duration-300
                                border dark:border-gray-800 hover:shadow-lg dark:hover:shadow-gray-900/30
                                bg-white dark:bg-gray-900/70 backdrop-blur-sm
                                overflow-hidden">
                  <div className={`h-1.5 w-full ${iconWithBg.border}`}></div>
                  <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl ${iconWithBg.bg}`}>
                        {iconWithBg.icon}
                      </div>
                      <div className={`px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyle}`}>
                      {roadmap.id === 'data-scientist' ? 'Data Science' : 
                       roadmap.id === 'dsa-python' ? 'Programming' : 
                       roadmap.id === 'dsa-java' ? 'Programming' : 
                       roadmap.id === 'fullstack' ? 'Web Dev' : 'Technology'}
                    </div>
                  </div>
                    <CardTitle className="text-xl md:text-2xl mt-3 text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {roadmap.title}
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-400">
                      {roadmap.description}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-3">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-2.5">
                        <Database className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                        {roadmap.roadmap.sections.length} Learning Sections
                      </span>
                    </div>
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-2.5">
                        <Network className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                        {roadmap.roadmap.sections.reduce((acc, section) => 
                          acc + section.modules.length, 0
                        )} Detailed Modules
                      </span>
                    </div>
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-4 py-2.5">
                        <Code className="w-5 h-5 text-purple-500 dark:text-purple-400" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                        {roadmap.roadmap.sections.reduce((acc, section) => 
                          acc + section.modules.reduce((moduleAcc, module) => 
                            moduleAcc + module.lectures.length, 0
                          ), 0
                        )}+ Individual Lectures
                      </span>
                    </div>
                  </div>
                </CardContent>
                  <CardFooter className="mt-auto pt-5">
                    <Button asChild variant="default" className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white">
                      <Link to={`/roadmaps/${roadmap.id}`} className="flex items-center justify-center">
                        View Roadmap
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                </CardFooter>
              </Card>
            </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-1.5 shadow-lg dark:shadow-gray-900/30 overflow-hidden"
        >
          <div className="rounded-lg bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-6 border border-gray-200/50 dark:border-gray-700/50">
            <h2 className="text-2xl font-semibold mb-6 text-center text-gray-900 dark:text-white">
              Why Follow Our Roadmaps?
            </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 }}
                className="rounded-xl overflow-hidden"
              >
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800/30 h-full">
                  <div className="w-12 h-12 rounded-lg bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center mb-4">
                    <Layers className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Structured Learning</h3>
                  <p className="text-gray-600 dark:text-gray-300">Our roadmaps provide a clear, step-by-step path from basics to advanced topics.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="rounded-xl overflow-hidden"
              >
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-purple-100 dark:border-purple-800/30 h-full">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center mb-4">
                    <BarChart className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Industry Relevance</h3>
                  <p className="text-gray-600 dark:text-gray-300">Content designed based on current industry requirements and best practices.</p>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 }}
                className="rounded-xl overflow-hidden"
              >
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800/30 h-full">
                  <div className="w-12 h-12 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center mb-4">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
            </div>
                  <h3 className="font-semibold text-lg mb-3 text-gray-900 dark:text-white">Comprehensive Coverage</h3>
                  <p className="text-gray-600 dark:text-gray-300">Each roadmap covers all essential topics needed to master the subject area.</p>
            </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default RoadmapListing; 