import { useMemo, memo, useRef, ComponentProps, useEffect } from "react";
import { IonDatetime, IonItem } from "@ionic/react";
import { useBaseAnimation } from "../../hooks";
import { useTranslatedText } from "@gaddario98/react-localization";
import { Text } from "../text";
import { layout, typography } from "../../styles";
import type { TOptions } from "i18next";
import { useTranslation } from "react-i18next";

export interface CalendarInputProps
  extends Omit<ComponentProps<typeof IonDatetime>, "onChange"> {
  label?: string;
  onChange?: (value: string | string[]) => void;
  errorMessage?: string;
  helperText?: string;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  disabled?: boolean;
  name?: string;
  ns?: string;
  translationOption?: TOptions;
}

const CalendarInputComponent = ({
  label,
  value = "",
  onChange = () => {},
  errorMessage = "",
  helperText = "",
  containerClassName = "",
  inputClassName = "",
  labelClassName = "",
  disabled = false,
  ns = "common",
  translationOption,
  ...props
}: CalendarInputProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const datetime = useRef<null | HTMLIonDatetimeElement>(null);
  useEffect(() => {
    if (!datetime.current) return;
    datetime.current.value = value;
  }, [value]);

  useBaseAnimation(containerRef);
  const { traslateText } = useTranslatedText(ns);
  const { i18n } = useTranslation(ns);

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

  useEffect(() => {
    if (!value) return;
    if (Array.isArray(value)) {
      const newValues = value.map((v) => {
        if (props?.min && v < props.min) {
          return props.min!;
        }
        if (props?.max && v > props.max) {
          return props.max!;
        }
        return v;
      });
      if (JSON.stringify(newValues) !== JSON.stringify(value)) {
        onChange(newValues);
      }
    } else {
      if (props?.min && value < props.min) {
        onChange(props.min);
      }
      if (props?.max && value > props.max) {
        onChange(props.max);
      }
    }
  }, [value, props?.min, props?.max, onChange]);

  return (
    <div
      className={`${layout.content} ${containerClassName} ion-radius`}
      ref={containerRef}
    >
      <div>
        {label && (
          <IonItem lines="full" className="rounded-t-md">
            <Text
              text={translatedLabel}
              contentClassName={`${typography.text.input} ${labelClassName}`}
            />
          </IonItem>
        )}
        <IonDatetime
          id="datetime"
          presentation="date-time"
          value={value}
          onIonChange={(e) => {
            onChange(e.detail.value!);
          }}
          disabled={disabled}
          className={`${inputClassName} rounded-b-md ${label ? "" : "rounded-t-md"}`}
          size="cover"
          name={"date"}
          locale={i18n.language}
          color={"primary"}
          {...props}
          ref={datetime}
        ></IonDatetime>
      </div>
      {translatedErrorMessage ? (
        <Text
          text={translatedErrorMessage}
          contentClassName={`text-red-500 ${typography.text.floatLabel}`}
        />
      ) : translatedHelperText ? (
        <Text
          text={translatedHelperText}
          contentClassName={`text-gray-500 ${typography.text.floatLabel}`}
        />
      ) : null}
    </div>
  );
};

export const CalendarInput = memo(CalendarInputComponent);
