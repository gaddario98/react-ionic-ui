import { forwardRef, useCallback, useRef, memo, useMemo } from "react";
import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import {
  useConfirmDialog,
  useComposeClassNames,
  useBaseAnimation,
} from "../../hooks";
import type { TOptions } from "i18next";
import { typography } from "../../styles";
import { useTranslatedText } from "@gaddario98/react-localization";

export type ButtonVariant = "text" | "contained" | "outlined";
export type ButtonColor =
  | "primary"
  | "secondary"
  | "tertiary"
  | "error"
  | "success"
  | "warning";
export type ButtonSize = "small" | "medium" | "large";
export type ButtonShape = "rounded" | "square" | "pill";

interface IconProps {
  name: string; // Nome dell'icona Ionic
  size?: string;
  color?: string;
  className?: string;
}

interface RequireConfirmConfig {
  text: string;
}

export interface ButtonProps extends React.ComponentProps<typeof IonButton> {
  variant?: ButtonVariant;
  color?: React.ComponentProps<typeof IonButton>["color"];
  loading?: boolean;
  expand?: "block" | "full" | undefined;
  startIcon?: IconProps;
  endIcon?: IconProps;
  className?: string;
  labelClassName?: string;
  text?: string;
  ns?: string;
  translationOption?: TOptions;
  loadingText?: string;
  uppercase?: boolean;
  iconOnly?: boolean;
  compact?: boolean;
  requireConfirm?: RequireConfirmConfig;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLIonButtonElement>) => void;
  children?: React.ReactNode;
  type?: React.ComponentProps<typeof IonButton>["type"];
  animation?: boolean;
}

// Mappatura delle varianti dal nostro sistema a Ionic
const VARIANT_MAPPING: Record<
  ButtonVariant,
  { fill: "solid" | "outline" | "clear" }
> = {
  contained: { fill: "solid" },
  outlined: { fill: "outline" },
  text: { fill: "clear" },
};

const ButtonComponent = forwardRef<HTMLIonButtonElement, ButtonProps>(
  (
    {
      variant = "contained",
      color = "primary",
      size = "default",
      shape = "rounded",
      loading = false,
      expand,
      startIcon,
      endIcon,
      disabled = false,
      className,
      labelClassName,
      onClick,
      text,
      children,
      ns = "buttons",
      translationOption,
      loadingText,
      uppercase = false,
      iconOnly = false,
      compact = false,
      requireConfirm,
      animation = true,
      type,
      ...rest
    },
    ref
  ) => {
    const buttonRef = useRef<HTMLIonButtonElement | null>(null);
    const { traslateText } = useTranslatedText(ns);
    const { showConfirmDialog } = useConfirmDialog();
    useBaseAnimation(buttonRef, { enabled: animation });

    // Gestione del click con conferma opzionale
    const handleClick = useCallback(
      async (event: React.MouseEvent<HTMLIonButtonElement>) => {
        if (event.stopPropagation) {
          event.stopPropagation();
        }

        if (requireConfirm && onClick) {
          const confirmed = await showConfirmDialog(
            traslateText("confirm"),
            traslateText(requireConfirm.text)
          );

          if (confirmed) {
            onClick(event);
          }
        } else if (onClick) {
          onClick(event);
        }
      },
      [onClick, requireConfirm, showConfirmDialog, traslateText]
    );

    // Applica gli stili personalizzati
    const buttonClasses = useComposeClassNames({
      baseClasses: `
        ${uppercase ? "ion-text-uppercase" : "normal-case"}
        ${typography.text.button}
      `,
      additionalClasses: className,
    });

    // Rendering del contenuto interno del pulsante
    const content = useMemo(
      () => children || traslateText(text || "", translationOption),
      [children, text, traslateText, translationOption]
    );

    return (
      <IonButton
        ref={(el) => {
          // Gestione sia del ref passato dall'utente che del nostro ref interno
          if (typeof ref === "function") {
            ref(el);
          } else if (ref) {
            ref.current = el;
          }
          buttonRef.current = el;
        }}
        type={type}
        className={buttonClasses}
        onClick={handleClick}
        disabled={disabled || loading}
        color={color}
        fill={VARIANT_MAPPING[variant].fill}
        size={size}
        expand={expand}
        {...rest}
      >
        {loading && (
          <IonSpinner
            name="crescent"
            className="h-[22px]"
            style={{
              color:
                variant === "contained"
                  ? `var(--ion-color-${color}-contrast)`
                  : `var(--ion-color-${color})`,
            }}
          />
        )}

        {startIcon && !loading && (
          <IonIcon
            icon={startIcon.name}
            size={startIcon.size || (compact ? "small" : "default")}
            color={startIcon.color}
            className={`${iconOnly ? "" : "mr-2"} ${typography.icon.title} ${startIcon.className || ""}`}
            slot={iconOnly ? "icon-only" : "start"}
          />
        )}

        {!iconOnly &&
          !loading &&
          (typeof content === "string" ? (
            <span className={labelClassName}>{content}</span>
          ) : (
            content
          ))}

        {endIcon && !loading && (
          <IonIcon
            icon={endIcon.name}
            size={endIcon.size || (compact ? "small" : "default")}
            color={endIcon.color}
            className={typography.icon.title}
            slot={iconOnly ? "icon-only" : "end"}
          />
        )}
      </IonButton>
    );
  }
);

ButtonComponent.displayName = "Button";

export const Button = memo(ButtonComponent);
