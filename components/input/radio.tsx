import { memo, useCallback, useMemo } from "react";
import { IonRadioGroup, IonRadio } from "@ionic/react";
import { useComposeClassNames } from "../../hooks";
import { Card } from "../card";
import { TOptions } from "i18next";
import { typography } from "../../styles";
import { useTranslatedText } from "@gaddario98/react-localization";
import { Text } from "../text";

export interface RadioOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface RadioGroupProps {
  label?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  options: RadioOption[];
  errorMessage?: string;
  helperText?: string;
  labelClassName?: string;
  radioClassName?: string;
  optionClassName?: string;
  variant?: "primary" | "secondary" | "tertiary";
  disabled?: boolean;
  name?: string;
  required?: boolean;
  horizontal?: boolean;
  lines?: "full" | "inset" | "none";
  translationOption?: TOptions;
}

const RadioGroupComponent = ({
  label,
  value = "",
  onChange = () => {},
  options = [],
  errorMessage = "",
  helperText = "",
  labelClassName,
  radioClassName,
  optionClassName,
  variant = "primary",
  disabled = false,
  name,
  required = false,
  horizontal = false,
  lines = "none",
  translationOption,
  ...restProps
}: RadioGroupProps) => {
  const { traslateText } = useTranslatedText();
  // Event handlers
  const handleChange = useCallback(
    (e: CustomEvent) => {
      onChange(e.detail.value);
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

  const labelClasses = useComposeClassNames({
    baseClasses: typography.text.input,
    additionalClasses: labelClassName,
  });

  const hasError = useMemo(() => !!errorMessage, [errorMessage]);
  const translatedErrorMessage = useMemo(
    () => (errorMessage ? traslateText(errorMessage, translationOption) : ""),
    [traslateText, errorMessage, translationOption]
  );
  const translatedHelperText = useMemo(
    () => (helperText ? traslateText(helperText, translationOption) : ""),
    [traslateText, helperText, translationOption]
  );

  if (!options.length) {
    return null;
  }

  return (
    <>
      <Card
        title={{
          text: label ?? "",
          contentClassName: labelClasses,
          translationOption: translationOption ?? { ns: "form" },
        }}
        content={
          <IonRadioGroup
            value={value}
            onIonChange={handleChange}
            allowEmptySelection={false}
            name={name}
            {...restProps}
          >
            {options.map((option, i) =>  (
                <IonRadio
                  value={option.value.toString()}
                  disabled={disabled || option.disabled}
                  color={hasError ? "danger" : getIonicColor}
                  className={radioClassName}
                  labelPlacement="end"
                  key={i}
                >
                  {traslateText(
                    option.label,
                    translationOption ?? { ns: "form" }
                  )}
                </IonRadio>
              )
            )}
          </IonRadioGroup>
        }
      ></Card>

      {translatedErrorMessage ? (
        <Text
          text={translatedErrorMessage}
          contentClassName="ion-text-small w-full text-red-500 text-xs"
        />
      ) : translatedHelperText ? (
        <Text
          text={translatedHelperText}
          contentClassName="ion-text-small w-full text-gray-500 text-xs"
        />
      ) : null}
    </>
  );
};

export const RadioGroup = memo(RadioGroupComponent);
