import { Link } from "react-router-dom";
import { Github, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-iitm-dark text-iitm-light py-6 sm:py-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">IITM Scholar Hub</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              A comprehensive tool for IITM BS/BSc students to predict marks
              and calculate CGPA.
            </p>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Quick Links</h2>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-iitm-blue transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/endterm-marks-predictor" className="text-gray-400 hover:text-iitm-blue transition-colors">
                  End Term Marks Predictor
                </Link>
              </li>
              <li>
                <Link to="/grade-calculator" className="text-gray-400 hover:text-iitm-blue transition-colors">
                  Grade Calculator
                </Link>
              </li>
              <li>
                <Link to="/resume-generator" className="text-gray-400 hover:text-iitm-blue transition-colors">
                  Resume Generator
                </Link>
              </li>
              <li>
                <Link to="/roadmaps" className="text-gray-400 hover:text-iitm-blue transition-colors">
                  Learning Roadmaps
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="text-gray-400 hover:text-iitm-blue transition-colors">
                  AI Assistant
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Connect</h2>
            <div className="flex space-x-4">
              <a
                href="https://github.com/shiva-yadav-ds"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-iitm-blue transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/shiva-yadav-4043912b9/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-iitm-blue transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a
                href="mailto:yaduvanshishubha678@gmail.com"
                className="text-gray-400 hover:text-iitm-blue transition-colors"
                aria-label="Email"
              >
                <Mail size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 sm:mt-8 sm:pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-400">
            © {currentYear} IITM Scholar Hub. All rights reserved.
          </p>
          <p className="text-xs text-gray-400 mt-2 md:mt-0">
            <span className="block md:inline">Disclaimer: This is an unofficial tool.</span>
            <span className="block md:inline md:ml-1">Not affiliated with IITM.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
