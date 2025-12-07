import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, FileText, Book, Calculator, Home, BookOpen, ChevronDown, LayoutGrid, MessageSquare, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Reorganized navigation items with dropdowns for better organization
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    {
      name: "Tools",
      icon: Calculator,
      dropdown: true,
      items: [
        { name: "Grade Calculator", path: "/grade-calculator", icon: Calculator },
        { name: "CGPA Calculator", path: "/cgpa-calculator", icon: Calculator },
        { name: "End Term Marks Predictor", path: "/endterm-marks-predictor", icon: Calculator },
        { name: "Resume Generator", path: "/resume-generator", icon: FileText },
      ]
    },
    {
      name: "Resources",
      icon: BookOpen,
      dropdown: true,
      items: [
        { name: "Learning Roadmaps", path: "/roadmaps", icon: Book },
        { name: "Python Cheatsheet", path: "/python-cheatsheet", icon: Code2 },
      ]
    },
    { name: "AI Assistant", path: "/ai-assistant", icon: MessageSquare },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Add the blur style to the document head
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .navbar-blur {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      // Clean up the style element when component unmounts
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavClick = (path: string) => {
    // Close mobile menu if open
    if (isMenuOpen) {
      setIsMenuOpen(false);
    }

    // Reset active dropdown
    setActiveDropdown(null);
  };

  const toggleDropdown = (name: string) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 navbar-blur",
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 border-b border-border shadow-sm"
            : "bg-white/40 dark:bg-gray-900/40"
        )}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group">
                <motion.span
                  className="text-lg sm:text-xl font-bold whitespace-nowrap relative overflow-hidden text-iitm-dark dark:text-white"
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-gradient-premium">IITM</span> Scholar Hub
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--primary))/60%] transition-all duration-300 group-hover:w-full"></span>
                </motion.span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = !item.dropdown && location.pathname === item.path;
                const isDropdownActive = item.dropdown && item.items?.some(subItem => location.pathname === subItem.path);

                // If it's a dropdown menu item
                if (item.dropdown) {
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      className="relative group"
                      onMouseEnter={() => setActiveDropdown(item.name)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        className={cn(
                          "px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium relative group whitespace-nowrap flex items-center gap-1.5 transition-all duration-300 focus-ring",
                          isDropdownActive
                            ? "text-[hsl(var(--primary))]"
                            : "text-iitm-dark dark:text-white hover:text-[hsl(var(--primary))]"
                        )}
                        onClick={() => toggleDropdown(item.name)}
                        aria-expanded={activeDropdown === item.name}
                        aria-haspopup="true"
                      >
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          {Icon && <Icon className={cn("transition-all duration-300", isDropdownActive ? "h-4 w-4" : "h-3.5 w-3.5")} />}
                        </motion.div>
                        <span className="relative">
                          <span className="relative z-10">{item.name}</span>
                          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                        </span>
                        <motion.div
                          animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="h-3.5 w-3.5" />
                        </motion.div>
                      </button>

                      {/* Dropdown menu */}
                      <AnimatePresence>
                        {(activeDropdown === item.name || activeDropdown === `${item.name}-hover`) && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, height: 0 }}
                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                            exit={{ opacity: 0, y: 10, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute left-0 mt-1 w-48 rounded-md shadow-lg bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border border-border overflow-hidden z-50"
                          >
                            <div className="py-1">
                              {item.items?.map((subItem) => {
                                const SubIcon = subItem.icon;
                                const isSubActive = location.pathname === subItem.path;

                                return (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.path}
                                    className={cn(
                                      "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200 relative overflow-hidden group/item",
                                      isSubActive
                                        ? "bg-accent text-accent-foreground"
                                        : "text-iitm-dark dark:text-white hover:bg-accent/50 hover:text-accent-foreground"
                                    )}
                                    onClick={() => handleNavClick(subItem.path)}
                                  >
                                    <motion.div
                                      whileHover={{ scale: 1.15, rotate: 5 }}
                                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                    >
                                      {SubIcon && <SubIcon className="h-4 w-4" />}
                                    </motion.div>
                                    <span className="relative z-10">{subItem.name}</span>

                                    {/* Animated dot indicator */}
                                    <span className={cn(
                                      "absolute left-0 top-1/2 w-1 h-1 rounded-full bg-blue-500 -translate-y-1/2 transition-all duration-300",
                                      isSubActive ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"
                                    )}></span>
                                  </Link>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                }

                // Regular menu item (not dropdown)
                return (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: "easeOut"
                    }}
                  >
                    <Link
                      to={item.path}
                      onClick={() => handleNavClick(item.path)}
                      className={cn(
                        "px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium relative group whitespace-nowrap flex items-center gap-1.5 transition-all duration-300",
                        isActive
                          ? "text-[hsl(var(--primary))]"
                          : "text-iitm-dark dark:text-white hover:text-[hsl(var(--primary))]"
                      )}
                    >
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        {Icon && <Icon className={cn("transition-all duration-300", isActive ? "h-4 w-4" : "h-3.5 w-3.5")} />}
                      </motion.div>
                      <span className="relative">
                        <span className="relative z-10">{item.name}</span>
                        <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full"></span>
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
              <ThemeToggle />
            </div>

            {/* Mobile menu button and theme toggle */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label="Toggle menu"
                className="focus-ring text-iitm-dark dark:text-white hover:text-[hsl(var(--primary))] transition-colors duration-300"
              >
                <AnimatePresence mode="wait">
                  {isMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="h-6 w-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-border"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {/* Render flattened structure for mobile */}
                {navItems.map((item, index) => {
                  if (item.dropdown) {
                    return (
                      <div key={item.name} className="space-y-1">
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                            ease: "easeOut"
                          }}
                        >
                          <button
                            className={cn(
                              "w-full text-left px-3 py-2.5 rounded-md text-base font-medium flex items-center justify-between gap-2.5 transition-all duration-300",
                              activeDropdown === item.name
                                ? "text-[hsl(var(--primary))] bg-[hsla(var(--primary),0.1)]"
                                : "text-iitm-dark dark:text-white hover:text-[hsl(var(--primary))]"
                            )}
                            onClick={() => toggleDropdown(item.name)}
                            aria-expanded={activeDropdown === item.name}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className={cn(
                                "flex items-center justify-center w-6 h-6 rounded-md transition-all duration-300",
                                activeDropdown === item.name
                                  ? "bg-[hsla(var(--primary),0.15)]"
                                  : "bg-white/60 dark:bg-gray-700/60"
                              )}>
                                {item.icon && <item.icon className="h-4 w-4" />}
                              </div>
                              <span>{item.name}</span>
                            </div>
                            <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", activeDropdown === item.name && "transform rotate-180")} />
                          </button>
                        </motion.div>

                        <AnimatePresence>
                          {activeDropdown === item.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="pl-6 pr-2 space-y-1"
                            >
                              {item.items?.map((subItem, subIndex) => {
                                const SubIcon = subItem.icon;
                                const isActive = location.pathname === subItem.path;

                                return (
                                  <motion.div
                                    key={subItem.name}
                                    initial={{ opacity: 0, x: -5 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: subIndex * 0.05,
                                    }}
                                  >
                                    <Link
                                      to={subItem.path}
                                      className={cn(
                                        "block px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2.5 transition-all duration-300",
                                        isActive
                                          ? "text-[hsl(var(--primary))] bg-[hsla(var(--primary),0.1)]"
                                          : "text-iitm-dark dark:text-white hover:text-[hsl(var(--primary))]"
                                      )}
                                      onClick={() => handleNavClick(subItem.path)}
                                    >
                                      <div className={cn(
                                        "flex items-center justify-center w-5 h-5 rounded-md transition-all duration-300",
                                        isActive
                                          ? "bg-[hsla(var(--primary),0.15)]"
                                          : "bg-white/60 dark:bg-gray-700/60"
                                      )}>
                                        {SubIcon && <SubIcon className="h-3 w-3" />}
                                      </div>
                                      <span>{subItem.name}</span>
                                    </Link>
                                  </motion.div>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;

                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                    >
                      <Link
                        to={item.path}
                        className={cn(
                          "block px-3 py-2.5 rounded-md text-base font-medium flex items-center gap-2.5 transition-all duration-300",
                          isActive
                            ? "text-[hsl(var(--primary))] bg-[hsla(var(--primary),0.1)]"
                            : "text-iitm-dark dark:text-white hover:text-[hsl(var(--primary))]"
                        )}
                        onClick={() => handleNavClick(item.path)}
                      >
                        <div className={cn(
                          "flex items-center justify-center w-6 h-6 rounded-md transition-all duration-300",
                          isActive
                            ? "bg-[hsla(var(--primary),0.15)]"
                            : "bg-white/60 dark:bg-gray-700/60"
                        )}>
                          {Icon && <Icon className="h-4 w-4" />}
                        </div>
                        <span>{item.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
};

export default Navbar;
