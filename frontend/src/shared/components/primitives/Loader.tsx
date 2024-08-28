import { cn } from "@shared/helpers/tailwind";
import Icon from "./Icon";

interface LoaderProps {
  size: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  className?: string;
}

const sizeClasses = {
  xs: "text-[14px]",
  sm: "text-[20px]",
  md: "text-[28px]",
  lg: "text-[40px]",
  xl: "text-[60px]",
  "2xl": "text-[90px]",
  "3xl": "text-[130px]",
  "4xl": "text-[180px]",
};

const Loader = ({ size, className }: LoaderProps) => {
  return (
    <div className={cn("flex h-fit items-center justify-center text-gray-4", sizeClasses[size], className)}>
      <Icon icon="circle-notch" className="animate-spin" />
    </div>
  );
};

export default Loader;
