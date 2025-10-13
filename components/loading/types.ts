
interface LoadingProps {
  visible?: boolean;
  text?: string;
  overlay?: boolean;
  size?: "small" | "medium" |"large";
  className?: string;
  textClassName?: string;
  color?: string;
  ns?: string;
  duration?: number; 
}

export type { LoadingProps };