import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  delay?: number;
}

const FeatureCard = ({ 
  title, 
  description, 
  icon: Icon, 
  path,
  delay = 0 
}: FeatureCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5,
        delay: delay * 0.1,
        ease: "easeOut"
      }}
      whileHover={{ scale: 1.02 }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="relative border border-[hsl(var(--border))] h-full transition-all duration-300 overflow-hidden group interactive-card bg-white dark:bg-gray-800">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[hsl(var(--primary))/5%] via-transparent to-[hsl(var(--primary))/3%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Animated blob in background */}
        <motion.div 
          className="absolute -right-10 -bottom-10 w-40 h-40 rounded-full bg-[hsl(var(--primary))/3%] filter blur-3xl"
          animate={{ 
            scale: isHovered ? [1, 1.2, 1] : 1,
            opacity: isHovered ? [0.2, 0.3, 0.2] : 0.2
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <CardHeader className="pb-2 relative z-10">
          <motion.div 
            className="w-14 h-14 rounded-xl bg-[hsl(var(--primary))/10] flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-[hsl(var(--primary))/15]"
            whileHover={{ scale: 1.05, rotate: 5 }}
            animate={isHovered ? { y: [0, -5, 0] } : {}}
            transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
          >
            <motion.div
              animate={isHovered ? { rotate: 360 } : {}}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="relative w-10 h-10 flex items-center justify-center"
            >
              <div className="absolute inset-0 rounded-full border-2 border-[hsl(var(--primary))/20] border-dashed"></div>
              <Icon className="h-7 w-7 text-[hsl(var(--primary))] transition-transform duration-300 relative z-10" />
            </motion.div>
          </motion.div>
          
          <CardTitle className="text-black dark:text-white text-xl font-bold">
            {title}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="relative z-10">
          <CardDescription className="text-gray-700 dark:text-gray-300 text-base">
            {description}
          </CardDescription>
        </CardContent>
        
        <CardFooter className="relative z-10">
          <Link to={path} className="w-full">
            <Button 
              variant="premium"
              className={cn(
                "w-full relative overflow-hidden group/button bg-[hsl(var(--primary))] text-white hover:bg-[hsl(var(--primary))/90]"
              )}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-[hsl(var(--primary-foreground))/20] to-transparent -translate-x-[100%] group-hover/button:animate-shimmer-x"></span>
              <span className="relative z-10 flex items-center gap-2">
                <span className="relative">
                  Try now
                  <motion.span 
                    className="absolute -bottom-1 left-0 h-[2px] bg-[hsl(var(--primary-foreground))/30] rounded-full" 
                    initial={{ width: "0%" }}
                    animate={isHovered ? { width: "100%" } : { width: "0%" }}
                    transition={{ duration: 0.3 }}
                  />
                </span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  animate={isHovered ? { x: [0, 5, 0] } : {}}
                  transition={{ duration: 1, repeat: isHovered ? Infinity : 0 }}
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </motion.svg>
              </span>
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
