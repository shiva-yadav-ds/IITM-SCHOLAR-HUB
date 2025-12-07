
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

const PageHeader = ({ 
  title, 
  description, 
  icon: Icon, 
  className 
}: PageHeaderProps) => {
  return (
    <div className={cn("mb-8", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-6 w-6 text-[hsl(var(--iitm-blue))]" />}
        <h1 className="text-3xl font-bold text-[hsl(var(--iitm-dark))]">{title}</h1>
      </div>
      <p className="mt-2 text-muted-foreground dark:text-gray-300">{description}</p>
    </div>
  );
};

export default PageHeader;
