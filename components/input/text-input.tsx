import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  memo,
  ComponentProps,
  RefObject,
} from "react";
import { IonInput, IonTextarea, IonIcon } from "@ionic/react";
import { closeCircleOutline } from "ionicons/icons";
import { useBaseAnimation } from "../../hooks";
import { useTranslatedText } from "@gaddario98/react-localization";
import type { TOptions } from "i18next";
import { typography } from "../../styles";
import { CustomIonItem } from "../item";
import { Text } from "../text";

interface ValidationPatterns {
  [key: string]: RegExp;
}

interface ValidationMessages {
  [key: string]: string;
}

const INPUT_TYPES: Record<
  string,
  Required<ComponentProps<typeof IonInput>>["type"] | "textarea"
> = {
  EMAIL: "email",
  PASSWORD: "password",
  PHONE: "tel",
  TEXT: "text",
  NUMBER: "number",
  TEXTAREA: "textarea",
  SEARCH: "search",
};

const VALIDATION_PATTERNS: ValidationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  tel: /^\+?[0-9]{10,14}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
};

const VALIDATION_MESSAGES: ValidationMessages = {
  email: "validation.email",
  tel: "validation.phone",
  password: "validation.password",
};

export interface TextInputProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  helperText?: string;
  type?: ComponentProps<typeof IonInput>["type"] | "textarea";
  onValidationChange?: (isValid: boolean) => void;
  // containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  min?: number;
  max?: number;
  variant?: "primary" | "secondary" | "tertiary";
  startIcon?: string;
  endIcon?: string;
  onEndIconPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  debounceTime?: number;
  name?: string;
  required?: boolean;
  ns?: string;
  translationOption?: TOptions;
  disabledValidation?: boolean;
  labelPlacement?: ComponentProps<typeof IonInput>["labelPlacement"];
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
/*
const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  if (isPlatform('ios')) {
    return <div className={className}>{children}</div>;
  }
  return <div className={className}>{children}</div>;
};
*/

type InputRef = HTMLIonInputElement | HTMLIonTextareaElement;

const TextInputComponent = ({
  label,
  value = "",
  onChange = () => {},
  placeholder = "",
  errorMessage = "",
  helperText = "",
  type = INPUT_TYPES.TEXT,
  onValidationChange = () => {},
  // containerClassName,
  inputClassName,
  labelClassName,
  min,
  max,
  variant = "primary",
  startIcon,
  endIcon,
  onEndIconPress,
  disabled = false,
  loading = false,
  debounceTime = 600,
  name,
  required = false,
  ns = "common",
  translationOption,
  disabledValidation,
  labelPlacement = "floating",
  children,
  ...restProps
}: TextInputProps) => {
  const { traslateText } = useTranslatedText(ns);

  // State hooks
  const [isFocused, setIsFocused] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const containerRef = useRef<InputRef | null>(null);
  useBaseAnimation(containerRef as RefObject<HTMLElement | null>);
  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined
  );

  // Sincronizzazione del valore locale
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Cleanup del debounce
  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  // Validazione input
  const validateInput = useCallback(
    (text: string) => {
      if (disabledValidation) {
        return;
      }
      if (!text || type === INPUT_TYPES.TEXT || type === INPUT_TYPES.TEXTAREA) {
        onValidationChange(true);
        return;
      }

      const pattern = VALIDATION_PATTERNS[type];
      const isValid = pattern?.test?.(text) ?? true;
      onValidationChange(isValid);
    },
    [type, onValidationChange, disabledValidation]
  );

  // Gestione cambio testo con debounce
  const handleChange = useCallback(
    (val: string | number | null | undefined) => {
      let formattedText = String(val || "");

      if (type === INPUT_TYPES.PHONE) {
        formattedText = formattedText.replace(/[^\d+]/g, "");
      } else if (type === INPUT_TYPES.NUMBER) {
        if (formattedText === "") {
          formattedText = "";
        } else {
          const num = parseInt(formattedText.replace(/\D/g, ""));
          if (!isNaN(num)) {
            if (min !== undefined && num < min) {
              formattedText = min.toString();
            } else if (max !== undefined && num > max) {
              formattedText = max.toString();
            } else {
              formattedText = num.toString();
            }
          } else {
            formattedText = "";
          }
        }
      }

      setLocalValue(formattedText);

      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        onChange?.(formattedText);
        validateInput(formattedText);
      }, debounceTime);
    },
    [type, onChange, validateInput, min, max, debounceTime]
  );

  // Event handlers
  const handleFocus = useCallback(() => setIsFocused(true), []);
  const handleBlur = useCallback(() => {
    setIsFocused(false);
    validateInput(localValue);
  }, [validateInput, localValue]);

  // Traduzione testi
  const translatedLabel = useMemo(
    () => (label ? traslateText(label, translationOption) : ""),
    [traslateText, label, translationOption]
  );
  const translatedPlaceholder = useMemo(
    () => (placeholder ? traslateText(placeholder, translationOption) : ""),
    [placeholder, traslateText, translationOption]
  );
  const translatedErrorMessage = useMemo(
    () => (errorMessage ? traslateText(errorMessage, translationOption) : ""),
    [traslateText, errorMessage, translationOption]
  );
  const translatedHelperText = useMemo(
    () => (helperText ? traslateText(helperText, translationOption) : ""),
    [traslateText, helperText, translationOption]
  );

  // Map variant to Ionic color
  const getIonicColor = useMemo(() => {
    const colorMap: Record<string, string> = {
      primary: "primary",
      secondary: "secondary",
      tertiary: "tertiary",
    };
    return colorMap[variant] || "primary";
  }, [variant]);

  // Determina il tipo di input HTML
  const inputType = useMemo(() => {
    return type as Required<ComponentProps<typeof IonInput>>["type"];
  }, [type]);

  const hasError = useMemo(
    () => !!translatedErrorMessage,
    [translatedErrorMessage]
  );
  const commonProps = useMemo(
    () => ({
      value: localValue,
      onIonInput: (e: CustomEvent) => handleChange(e.detail.value),
      onIonFocus: handleFocus,
      onIonBlur: handleBlur,
      placeholder: translatedPlaceholder,
      disabled: disabled || loading,
      className: `${hasError && "ion-invalid"} ${inputClassName} ${typography.text.input} w-full`,
      id: name,
      name,
      /*  color: hasError ? "danger" : getIonicColor,
      "aria-invalid": hasError,*/
      required,
      labelPlacement: label ? labelPlacement : undefined,
      label: translatedLabel,
      // fill: "solid" as ComponentProps<typeof IonInput>["fill"],
      helperText: translatedHelperText || "",
      ...restProps,
    }),
    [
      localValue,
      handleChange,
      handleFocus,
      handleBlur,
      translatedPlaceholder,
      disabled,
      loading,
      inputClassName,
      name,
      getIonicColor,
      hasError,
      translatedLabel,
      required,
      restProps,
      translatedErrorMessage,
      isFocused,
    ]
  );

  const autocomplete = useMemo((): HTMLIonInputElement["autocomplete"] => {
    if (type === INPUT_TYPES.EMAIL) {
      return "email";
    }
    if (type === INPUT_TYPES.PHONE) {
      return "tel";
    }
    if (type === INPUT_TYPES.TEXT) {
      return "on";
    }
    if (type === INPUT_TYPES.SEARCH) {
      return "on";
    }
    return "off";
  }, [type]);

  // Rendering condizionale per textarea o input
  /* const CommonChildren = useMemo(
    () => (
      <>
        {startIcon && <IonIcon slot="start" icon={startIcon} />}{" "}
        {loading && <IonSpinner slot="end" name="dots" />}
        {!loading && finalEndIcon && localValue && (
          <IonIcon
            slot="end"
            icon={finalEndIcon}
            onClick={
              type === INPUT_TYPES.PASSWORD
                ? togglePasswordVisibility
                : onEndIconPress
            }
            style={{ opacity: disabled ? 0.5 : 1, cursor: "pointer" }}
          />
        )}
      </>
    ),
    [
      startIcon,
      loading,
      finalEndIcon,
      localValue,
      type,
      togglePasswordVisibility,
      onEndIconPress,
      disabled,
    ]
  );*/

  if (type === INPUT_TYPES.TEXTAREA) {
    return (
      <>
        <CustomIonItem>
          <IonTextarea
            autoGrow
            rows={4}
            {...commonProps}
            ref={containerRef as React.RefObject<HTMLIonTextareaElement>}
          >
            {startIcon && <IonIcon slot="start" icon={startIcon} />}
            {endIcon && (
              <IonIcon slot="end" icon={endIcon} onClick={onEndIconPress} />
            )}
            {children && <div slot="end">{children}</div>}
          </IonTextarea>
        </CustomIonItem>
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
  }
  /*
  if (type === INPUT_TYPES.SEARCH) {
    return (<IonSearchbar
      debounce={debounceTime}
      {...commonProps}
      className="!p-0"
      searchIcon={startIcon}
    ></IonSearchbar>);
  }*/

  return (
    <>
      <CustomIonItem>
        {startIcon && <IonIcon slot="start" icon={startIcon} />}
        <IonInput
          type={inputType}
          min={min}
          max={max}
          clearInput
          ref={containerRef as React.RefObject<HTMLIonInputElement>}
          autocomplete={autocomplete}
          clearInputIcon={closeCircleOutline}
          {...commonProps}
        ></IonInput>
        {endIcon && (
          <IonIcon
            slot="end"
            icon={endIcon}
            className={typography.icon.title}
            onClick={onEndIconPress}
            color="primary"
          />
        )}
        {!!children && children}
      </CustomIonItem>
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
/**className="pr-[0.1rem]"
        {loading && <IonSpinner slot="end" name="dots" />}
        {!loading && finalEndIcon && localValue && (
          <IonIcon
            slot="end"
            icon={finalEndIcon}
            onClick={
              type === INPUT_TYPES.PASSWORD
                ? togglePasswordVisibility
                : onEndIconPress
            }
            style={{ opacity: disabled ? 0.5 : 1, cursor: "pointer" }}
          />
        )} */
export const TextInput = memo(TextInputComponent);
