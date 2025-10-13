// src/ui/components/input/checkbox.tsx
import { memo, useCallback, useMemo, useRef } from "react";
import { IonItem, IonCheckbox, IonLabel, IonText } from "@ionic/react";
import {
  useBaseAnimation,
  useComposeClassNames,
} from "../../hooks";
import { useTranslatedText } from "@gaddario98/react-localization";
import { TOptions } from "i18next";
import { Text } from "../text";
import { CustomIonItem } from "../item";

export interface CheckboxProps {
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  errorMessage?: string;
  helperText?: string;
  containerClassName?: string;
  labelClassName?: string;
  checkboxClassName?: string;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  name?: string;
  required?: boolean;
  lines?: "full" | "inset" | "none";
  translationOption?: TOptions;
}

const CheckboxComponent = ({
  label,
  checked = false,
  onChange = () => {},
  errorMessage = "",
  helperText = "",
  containerClassName,
  labelClassName,
  checkboxClassName,
  variant = "primary",
  disabled = false,
  name,
  required = false,
  lines = "none",
  translationOption,
  ...restProps
}: CheckboxProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useBaseAnimation(containerRef);
  const { traslateText } = useTranslatedText();
  // Event handlers
  const handleChange = useCallback(
    (e: CustomEvent) => {
      onChange(e.detail.checked);
    },
    [onChange]
  );

  // Map variant to Ionic color
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

  // Compute classes
  const containerClasses = useComposeClassNames({
    baseClasses: "",
    additionalClasses: containerClassName,
  });

  const labelClasses = useComposeClassNames({
    baseClasses: "",
    additionalClasses: labelClassName,
    conditionalClasses: { ["text-red-500"]: !!errorMessage },
  });

  const translatedLabel = useMemo(
    () => (label ? traslateText(label, translationOption) : ""),
    [traslateText, label, translationOption]
  );
  const translatedErrorMessage = useMemo(
    () => (errorMessage ? traslateText(errorMessage, translationOption) : ""),
    [traslateText, errorMessage, translationOption]
  );
  const translatedHelperText = useMemo(
    () => (helperText ? traslateText(helperText, translationOption) : ""),
    [traslateText, helperText, translationOption]
  );

  return (
    <div className={containerClasses} ref={containerRef}>
      <CustomIonItem className={errorMessage ? "ion-invalid" : ""}>
        <IonCheckbox
          slot="start"
          checked={checked}
          onIonChange={handleChange}
          disabled={disabled}
          name={name}
          color={errorMessage ? "danger" : getIonicColor}
          className={checkboxClassName}
          {...restProps}
        />

        <Text
          text={translatedLabel}
          slot="end"
          contentClassName={labelClasses}
        ></Text>
      </CustomIonItem>
      {translatedErrorMessage ? (
        <Text
          text={translatedErrorMessage}
          className="ion-padding-start ion-text-wrap ion-text-small"
        />
      ) : translatedHelperText ? (
        <Text
          text={translatedHelperText}
          className="ion-padding-start ion-text-wrap ion-text-small"
        />
      ) : null}
    </div>
  );
};

export const Checkbox = memo(CheckboxComponent);
