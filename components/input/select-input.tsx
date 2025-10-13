import { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import {
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonInput,
  IonModal,
  IonHeader,
  IonToolbar,
  IonContent,
} from "@ionic/react";
import {
  useBaseAnimation,
  useFilterOptions,
} from "../../hooks";
import { Text } from "../text";
import { layout, typography } from "../../styles";
import type { TOptions } from "i18next";
import { useTranslatedText } from "@gaddario98/react-localization";
import {
  checkmarkCircleOutline,
  closeCircleOutline,
  chevronForwardOutline,
} from "ionicons/icons";
import { ListItems } from "../list";
import { CustomIonItem } from "../item";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
  keys?: string[];
}

interface IconProps {
  slot?: string;
  color?: string;
  size?: string;
  className?: string;
  onClick?: () => void;
  icon?: string;
}

export interface SelectInputProps {
  label?: string;
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  errorMessage?: string;
  helperText?: string;
  options: SelectOption[];
  onValidationChange?: (isValid: boolean) => void;
  containerClassName?: string;
  selectClassName?: string;
  labelClassName?: string;
  variant?: "primary" | "secondary" | "tertiary";
  startIcon?: IconProps;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  ns?: string;
  translationOption?: TOptions;
  lines?: "full" | "inset" | "none";
  interface?: "action-sheet" | "popover" | "alert" | "modal" | "filter";
  cancelText?: string;
  filterable?: boolean;
  filterPlaceholder?: string;
  isResettable?: boolean;
}

const SelectInputComponent = ({
  label,
  value = "",
  onChange = () => {},
  placeholder = "",
  errorMessage = "",
  helperText = "",
  options = [],
  onValidationChange = () => {},
  containerClassName,
  selectClassName,
  labelClassName,
  variant = "primary",
  startIcon,
  disabled = false,
  name,
  required = false,
  ns = "common",
  translationOption,
  cancelText,
  filterable = false,
  filterPlaceholder = "Filtra...",
  isResettable = false,
  ...restProps
}: SelectInputProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  useBaseAnimation(containerRef);
  const { traslateText } = useTranslatedText(ns);

  // Generate unique id for accessibility
  const selectId = useMemo(
    () => name || `select-input-${Math.random().toString(36).substr(2, 9)}`,
    [name]
  );
  const [filterText, setFilterText] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (value && !options?.find((option) => option.value === value)) {
      onChange("");
    }
  }, [options]);

  // Event handlers
  const handleChange = useCallback(
    (e: CustomEvent) => {
      const newValue = e.detail.value;
      onChange(newValue);
      onValidationChange(!!newValue);
    },
    [onChange, onValidationChange]
  );

  // Translated texts
  const translatedLabel = useMemo(
    () => (label ? traslateText(label, translationOption) : ""),
    [traslateText, label, translationOption]
  );
  const translatedPlaceholder = useMemo(
    () => (placeholder ? traslateText(placeholder, translationOption) : ""),
    [traslateText, placeholder, translationOption]
  );
  const translatedErrorMessage = useMemo(
    () => (errorMessage ? traslateText(errorMessage, translationOption) : ""),
    [traslateText, errorMessage, translationOption]
  );
  const translatedHelperText = useMemo(
    () => (helperText ? traslateText(helperText, translationOption) : ""),
    [traslateText, helperText, translationOption]
  );

  const translatedOptions = useMemo(
    () =>
      options.map((option) => ({
        ...option,
        label: traslateText(option.label, translationOption),
      })),
    [options, traslateText, translationOption]
  );
  const filter = useFilterOptions(translatedOptions ?? []);

  const getIonicColor = useMemo(() => {
    const colorMap: Record<string, string> = {
      primary: "primary",
      secondary: "secondary",
      tertiary: "tertiary",
    };
    return colorMap[variant] || "primary";
  }, [variant]);

  const hasError = useMemo(() => !!errorMessage, [errorMessage]);

  // Common props similar to TextInputComponent
  const commonProps = useMemo(
    () => ({
      value,
      onIonChange: handleChange,
      placeholder: translatedPlaceholder,
      disabled,
      className: selectClassName,
      id: selectId,
      name,
      "aria-invalid": hasError,
      required,
      ...restProps,
    }),
    [
      value,
      handleChange,
      translatedPlaceholder,
      disabled,
      selectClassName,
      selectId,
      name,
      hasError,
      required,
      restProps,
    ]
  );

  // Compute filtered options if filterable is enabled
  const displayedOptions = useMemo(() => {
    if (!filterable || !filterText) return translatedOptions;
    return translatedOptions.filter((option) =>
      option.label.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterable, filterText, translatedOptions]);

  const interfaceType = useMemo(
    () => commonProps.interface,
    [commonProps.interface]
  );

  // For "filter" interface: render a trigger that opens a modal with a search bar and option list
  const selectedOption = useMemo(
    () => translatedOptions.find((option) => option.value === value),
    [translatedOptions, value]
  );

  const filterableOptions = useMemo(
    () =>
      (filter(filterText)
        ?.map((el) =>
          translatedOptions?.find((option) => option.value === el.value)
        )
        ?.filter(Boolean) ?? []) as SelectOption[],
    [filter, filterText]
  );

  if (interfaceType !== "filter") {
    return (
      <div className={`${layout.content} w-full`} ref={containerRef}>
        <CustomIonItem
          className={`${typography.text.input} ${containerClassName} w-full h-full items-center`}
        >
          <IonSelect
            {...commonProps}
            interface={interfaceType}
            label={translatedLabel}
            color={getIonicColor}
            labelPlacement="floating"
          >
            {startIcon?.icon && (
              <IonIcon
                slot="start"
                {...startIcon}
                className={`${startIcon?.className ?? ""} ${typography.text.input}`}
              />
            )}
            {displayedOptions.map((option) => (
              <IonSelectOption
                key={`${option.label}-${option.value}`}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </IonSelectOption>
            ))}
            {value && isResettable && (
              <IonIcon
                icon={closeCircleOutline}
                color={"danger"}
                onClick={() => onChange("")}
                className={` ${typography.icon.title} shrink-0`}
                slot="end"
              />
            )}
          </IonSelect>
        </CustomIonItem>
        {translatedErrorMessage ? (
          <Text
            text={translatedErrorMessage}
            contentClassName="ion-text-small w-full text-red-500 text-xs px-3"
          />
        ) : translatedHelperText ? (
          <Text
            text={translatedHelperText}
            contentClassName="ion-text-small w-full text-gray-500 text-xs"
          />
        ) : null}
      </div>
    );
  }

  const textValue = useMemo(
    () => (selectedOption ? selectedOption.label : translatedPlaceholder),
    [translatedPlaceholder, selectedOption]
  );

  return (
    <>
      <div
        className={`${typography.text.input} ${containerClassName} ${layout.content} w-full  cursor-pointer`}
        ref={containerRef}
        onClick={() => setModalOpen(true)}
      >
        <CustomIonItem
          className={`w-full h-full`}
          onClick={() => setModalOpen(true)}
        >
          <div className="h-full flex justify-center flex-col w-full py-2 !min-h-[56px]">
            <Text
              text={translatedLabel}
              contentClassName={`${textValue ? "!text-xs" : "!text-base"} ${errorMessage ? "text-red-500" : ""} ${labelClassName}`}
            />
            <div className="flex justify-between w-full gap-0.5">
              <Text
                text={textValue}
                contentClassName={`${typography.text.input} ${selectedOption ? "" : "text-black/60"}  truncate`}
                className={"text-red-50"}
                lines="single"
              />
              {value && isResettable && (
                <IonIcon
                  slot="end"
                  icon={closeCircleOutline}
                  className={`${typography.icon.title} shrink-0`}
                  onClick={() => onChange("")}
                  color="danger"
                />
              )}
            </div>
          </div>
          {startIcon?.icon && (
            <IonIcon
              slot="start"
              {...startIcon}
              className={`${startIcon?.className ?? ""} ${typography.text.input}`}
            />
          )}
        </CustomIonItem>
        {translatedErrorMessage ? (
          <Text
            text={translatedErrorMessage}
            contentClassName="ion-text-small w-full text-red-500 text-xs px-3"
          />
        ) : translatedHelperText ? (
          <Text
            text={translatedHelperText}
            contentClassName="ion-text-small w-full text-gray-500 text-xs"
          />
        ) : null}
      </div>
      <IonModal
        isOpen={modalOpen}
        onDidDismiss={() => setModalOpen(false)}
        initialBreakpoint={0.5}
        breakpoints={[0, 0.25, 0.5, 0.75, 1]}
        expandToScroll={false}
      >
        <IonHeader>
          <IonToolbar color={"light"}>
            <div className="ion-padding-horizontal">
              <IonInput
                placeholder={filterPlaceholder}
                value={filterText}
                onIonInput={(e: CustomEvent) => setFilterText(e.detail.value)}
                clearInput
              />
            </div>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color={"light"}>
          <ListItems
            items={filterableOptions?.map(({ label, value, disabled }) => ({
              title: label,
              iconRight:
                value === selectedOption?.value
                  ? checkmarkCircleOutline
                  : chevronForwardOutline,
              onPress() {
                onChange(value.toString());
                onValidationChange(true);
                setModalOpen(false);
                setFilterText("");
              },
              disabled,
              detail: false,
            }))}
            infiniteScroll={{ numberOfItems: 30 }}
          />
        </IonContent>
      </IonModal>
    </>
  );
};

/*  <IonIcon
                  icon={chevronCollapseOutline}
                  onClick={() => setModalOpen(true)}
                  className={` !text-lg`}
                />*/
export const SelectInput = memo(SelectInputComponent);
