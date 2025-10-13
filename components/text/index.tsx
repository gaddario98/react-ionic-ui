import { forwardRef, memo, useRef, createElement } from "react";
import { IonIcon } from "@ionic/react";
import {
  useComposeClassNames,
  useBaseAnimation,
} from "../../hooks";
import type { TOptions } from "i18next";
import { layout, typography } from "../../styles";
import { useTranslatedText } from "@gaddario98/react-localization";

export interface IconProps extends React.HTMLAttributes<HTMLIonIconElement> {
  slot?: string;
  color?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
  icon?: string;
}

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string;
  icon?: IconProps;
  iconEnd?: IconProps;
  lines?: "multiple" | "single";
  translationOption?: TOptions;
  contentClassName?: string;
  animation?: boolean;
  tag?: "p" | "div" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const TextComponent = forwardRef<HTMLDivElement, TextProps>(
  (
    {
      text,
      icon,
      lines,
      translationOption,
      contentClassName,
      className,
      tag,
      iconEnd,
      animation = false,
      ...props
    },
    ref
  ) => {
    // Riferimento al contenitore per le animazioni
    const containerRef = useRef<HTMLDivElement | null>(null);
    useBaseAnimation(containerRef, { enabled: animation });

    // Traduci il testo
    const { traslateText } = useTranslatedText();
    const translatedText = traslateText(text, translationOption);

    // Componi le classi
    const containerClasses = useComposeClassNames({
      baseClasses: `${layout.contentRow}`,
      conditionalClasses: {
        [contentClassName || ""]: !!contentClassName,
        [typography.truncate]: lines === "single",
      },
    });

    const textClasses = useComposeClassNames({
      baseClasses: "",
      additionalClasses: className,
    });

    const iconClasses = useComposeClassNames({
      baseClasses: textClasses,
      additionalClasses: `${icon?.className}`,
    });

    // Non renderizzare se non c'è testo
    if (!translatedText) return null;

    return (
      <div className={containerClasses} ref={ref} {...props}>
        {icon && (
          <div className="shrink flex items-center">
            <IonIcon slot={"start"} {...icon} className={iconClasses} />
          </div>
        )}
        <div className={lines === "single" ? typography.truncate : ""}>
          {tag
            ? createElement(
                tag,
                { className: `!m-0 ${textClasses}` },
                translatedText
              )
            : translatedText}
        </div>

        {iconEnd && (
          <div className="shrink flex items-center">
            <IonIcon
              slot={iconEnd.slot || "end"}
              {...iconEnd}
              className={iconClasses}
            />
          </div>
        )}
      </div>
    );
  }
);

TextComponent.displayName = "Text";

export const Text = memo(TextComponent);
