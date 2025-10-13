// src/ui/components/input/switch.tsx
import { memo, useCallback, useMemo, useRef } from "react";
import { IonItem, IonToggle, IonLabel, IonText } from "@ionic/react";
import { useBaseAnimation, useComposeClassNames } from "../../hooks";

export interface SwitchProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  errorMessage?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  switchClassName?: string;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  name?: string;
  required?: boolean;
  size?: "small" | "medium" | "large";
  lines?: "full" | "inset" | "none";
}

const SwitchComponent = ({
  label,
  checked = false,
  onChange = () => {},
  errorMessage = "",
  helperText = "",
  containerClassName,
  labelClassName,
  switchClassName,
  variant = "primary",
  disabled = false,
  name,
  required = false,
  size = "medium",
  lines = "none",
  ...restProps
}: SwitchProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useBaseAnimation(containerRef)
  // Event handlers
  const handleChange = useCallback(
    (e: CustomEvent) => {
      onChange(e.detail.checked);
    },
    [onChange]
  );

  const getIonicColor = useMemo(() => {
    switch (variant) {
      case "primary":
        return "primary";
      case "secondary":
        return "secondary";
      case "tertiary":
        return "tertiary";
      default:
        return "primary";
    }
  }, [variant]);

  // Map size to Ionic property
  const getToggleStyle = useMemo(() => {
    switch (size) {
      case "small":
        return { "--width": "30px", "--height": "18px" };
      case "large":
        return { "--width": "54px", "--height": "32px" };
      case "medium":
      default:
        return {};
    }
  }, [size]);

  // Compute classes
  const containerClasses = useComposeClassNames({
    baseClasses: "",
    additionalClasses: containerClassName,
  });

  const labelClasses = useComposeClassNames({
    baseClasses: "",
    additionalClasses: labelClassName,
  });

  const hasError = useMemo(() => !!errorMessage, [errorMessage]);

  return (
    <div className={containerClasses} ref={containerRef}>
      <IonItem lines={lines} className={hasError ? "ion-invalid" : ""}>
        {label && (
          <IonLabel className={labelClasses}>
            {label}
            {required && <span className="ion-text-danger">*</span>}
          </IonLabel>
        )}

        <IonToggle
          slot="end"
          checked={checked}
          onIonChange={handleChange}
          disabled={disabled}
          name={name}
          color={hasError ? "danger" : getIonicColor}
          className={switchClassName}
          style={getToggleStyle}
          {...restProps}
        />
      </IonItem>

      {errorMessage && (
        <IonText
          color="danger"
          className="ion-padding-start ion-text-wrap ion-text-small"
        >
          <p>{errorMessage}</p>
        </IonText>
      )}

      {helperText && !errorMessage && (
        <IonText
          color="medium"
          className="ion-padding-start ion-text-wrap ion-text-small"
        >
          <p>{helperText}</p>
        </IonText>
      )}
    </div>
  );
};

export const Switch = memo(SwitchComponent);
