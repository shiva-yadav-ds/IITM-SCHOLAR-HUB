import React from 'react';
import MainLayout from '@/components/MainLayout';
import GradeCalculatorComponent from '@/components/calculators/GradeCalculator';
import { GraduationCap } from 'lucide-react';
import { Helmet } from 'react-helmet';

const GradeCalculatorPage = () => {
  return (
    <MainLayout>
      <Helmet>
        <title>Grade Calculator for IIT Madras BS Program | IITM Scholar Hub</title>
        <meta name="description" content="Calculate your grades accurately with our specialized Grade Calculator for IIT Madras BS students. Uses official IITM grading system (A=10, B=9, C=8, D=7, E=6, F=0). Get instant grade calculations for all IIT Madras programs." />
        <meta name="keywords" content="Grade Calculator for IIT Madras, IITM Grade Calculator, IIT Madras BS grade calculator, IITM BS program grades, BS degree grade calculator, IITM grading system, free grade calculator" />
        <meta property="og:title" content="Grade Calculator for IIT Madras BS Program | IITM Scholar Hub" />
        <meta property="og:description" content="Calculate your grades accurately with our specialized calculator for IIT Madras BS students." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="IITM Scholar Hub" />
        <meta property="og:url" content="https://iitm-scholar-hub.vercel.app/grade-calculator" />
        <meta property="og:image" content="https://iitm-scholar-hub.vercel.app/og-image.svg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:title" content="Grade Calculator for IIT Madras BS Program" />
        <meta name="twitter:description" content="Calculate your grades for IIT Madras BS program with our free calculator." />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://iitm-scholar-hub.vercel.app/og-image.svg" />
      </Helmet>
      <div className="min-h-screen bg-[#020817]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">Grade Calculator</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
            Calculate your grades based on the IITM grading system
          </p>

          <div className="mt-4 sm:mt-8">
            <GradeCalculatorComponent />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default GradeCalculatorPage;

