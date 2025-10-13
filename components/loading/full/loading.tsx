import { memo } from "react";
import "./style.css";

const Loading: React.FC<{ className?: string }> = ({
  className,
}: {
  className?: string;
}) => (
  <div
    className={`w-full h-full flex-1 flex items-center justify-center ${className && className}`}
  >
    <div className="spinnerContainer">
      <div className="spinner h-[80px] w-[80px]"></div>
      <div className="loader"></div>
    </div>
  </div>
);
export const FullLoading = memo(Loading);
