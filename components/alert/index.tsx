import { ComponentProps, useMemo } from "react";
import { useComposeClassNames } from "../../hooks";
import { Text } from "../text";
import { IonItem } from "@ionic/react";
import { Button } from "../button";
import { layout } from "../../styles";

type AlertType = "success" | "error" | "info" | "warning";

export interface AlertProps {
  message: string | ComponentProps<typeof Text>;
  type?: AlertType;
  className?: string;
  style?: React.CSSProperties;
  actions?: Array<ComponentProps<typeof Button>>;
  actionsContainerClassName?: string;
  disablePadding?: boolean;
}

const getNotificationColors = (type: AlertType) => {
  switch (type) {
    case "success":
      return {
        background: "--ion-color-success",
        color: "--ion-color-success-contrast",
      };
    case "error":
      return {
        background: "--ion-color-danger",
        color: "--ion-color-danger-contrast",
      };
    case "warning":
      return {
        background: "--ion-color-warning",
        color: "--ion-color-warning-contrast",
      };
    case "info":
      return {
        background: "--ion-color-primary",
        color: "--ion-color-primary-contrast",
      };
    default:
      return {
        background: "--ion-color-primary",
        color: "--ion-color-primary-contrast",
      };
  }
};

export const Alert: React.FC<AlertProps> = ({
  message,
  type = "info",
  className,
  style,
  actions,
  actionsContainerClassName,
  disablePadding = false,
}) => {
  const colors = useMemo(() => getNotificationColors(type), [type]);

  const props = useMemo(
    () => (typeof message === "string" ? { text: message } : message),
    [message]
  );

  const alertClasses = useComposeClassNames({
    baseClasses: ` ion-radius shadow-md border-2 ${layout.content} items-center justify-center`,
    additionalClasses: className,
    conditionalClasses: {
      ["ion-padding"]: !disablePadding,
    },
  });

  const actionsNode = useMemo(
    () =>
      actions?.length && (
        <div
          slot="end"
          className={`text-right ${actionsContainerClassName || ""}`}
        >
          {actions.map((btnProps, i) => (
            <Button key={i} size="small" variant="text" {...btnProps} />
          ))}
        </div>
      ),
    [actions, actionsContainerClassName]
  );

  if (!props?.text) return <></>;

  return (
    <div
      className={alertClasses}
      style={{
        backgroundColor: `rgba(var(${colors.background}-rgb), 0.8)`,
        borderColor: `var(${colors.background})`,
        color: `var(${colors.color})`,
        ...style,
      }}
    >
      <Text {...props} />
      {actionsNode}
    </div>
  );
};
