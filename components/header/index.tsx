import { memo, useEffect, useMemo, useRef } from "react";
import { IonIcon } from "@ionic/react";
import { Text } from "../text";
import { TOptions } from "i18next";
import { layout, typography } from "../../styles";
import { useBaseAnimation } from "../../hooks";

interface PageHeaderProps {
  backIcon?: any; // in base al tipo di icon usato
  onBack?: () => void;
  text: string | { [key: string]: any };
  classNames?: {
    container?: string;
    icon?: string;
    text?: string;
  };
  translationOption?: TOptions;
  lines?: "none" | "inset" | "full";
}

const PageHeaderComponent = ({
  backIcon,
  onBack,
  text,
  classNames,
  translationOption,
  lines,
}: PageHeaderProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useBaseAnimation(containerRef)
  const bottomBarClass = useMemo(() => {
    if (lines === "none") {
      return "hidden";
    } else if (lines === "inset") {
      // La linea inset viene indentata con un margine sinistro (tipico degli IonItem)
      return "border-b border-gray-200 ml-12";
    } else {
      return "border-b border-gray-300 dark:border-gray-600";
    }
  }, []);
  return (
    <div className={`${layout.content} ${typography.text.sectionTitle}`} ref={containerRef}>
      <div className={layout.contentRow}>
        {backIcon && (
          <IonIcon
            icon={backIcon}
            aria-hidden="true"
            onClick={onBack}
            className={`cursor-pointer ${classNames?.icon || ""}`}
            size="large"
          />
        )}
        <div className="ml-2 flex-1">
          {typeof text === "string" ? (
            <Text
              text={text}
              className={classNames?.text}
              translationOption={translationOption}
            />
          ) : (
            <Text
              translationOption={translationOption}
              {...text}
              className={classNames?.text}
              text={text?.text ?? ""}
            />
          )}
        </div>
      </div>
      <div className={bottomBarClass} />
    </div>
  );
};

export const Header = memo(PageHeaderComponent);
