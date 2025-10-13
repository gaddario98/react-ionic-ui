// src/components/List/item.tsx
import { memo, useCallback, useMemo } from "react";
import { IonItem, IonLabel, IonIcon } from "@ionic/react";
import { useComposeClassNames } from "../../hooks";
import { useListItemActions } from "./hooks";
import type { ListItemModel, ListPress } from "./types";
import { Button } from "../button";
import { Text } from "../text";
import { layout, typography } from "../../styles";

interface ItemProps extends ListItemModel {
  ns?: string;
  onPressGeneral?: ListPress | (() => void);
  customClasses?: {
    container?: string;
    item?: string;
    title?: string;
    description?: string;
    icon?: string;
    profilePicture?: string;
  };
  defaultProfilePictureSize?: number;
  iconClick?: () => void;
}

const DEFAULT_PROFILE_PICTURE_SIZE = 65;

// Versione alternativa che utilizza nativamente le proprietà di IonItem
const ItemComponent = ({
  icon,
  iconRight,
  rightButton,
  onPress,
  text = "",
  title = "",
  profilePicture,
  profilePictureSize,
  bottomButton,
  ns,
  onPressGeneral,
  customClasses,
  defaultProfilePictureSize = DEFAULT_PROFILE_PICTURE_SIZE,
  disableDivider,
  detail = false,
  disabled = false,
  lines = "inset",
  contentDirection = "col",
  iconClick,id
}: ItemProps) => {
  const { handlePress } = useListItemActions(ns);

  const renderBottomContent = useCallback(
    (bottomButton?: ListItemModel["bottomButton"]) => {
      if (bottomButton) {
        if (Array.isArray(bottomButton)) {
          return (
            <div className="ion-flex ion-flex-row ion-gap">
              {bottomButton?.map((el, index) => <Button key={index} {...el} />)}
            </div>
          );
        }

        return <Button {...bottomButton} />;
      }
      return null;
    },
    []
  );

  const itemClasses = useComposeClassNames({
    baseClasses: " ",
    additionalClasses: customClasses?.item,
  });

  const itemTitleClasses = useComposeClassNames({
    baseClasses: typography.text.listItemTitle,
    additionalClasses: customClasses?.title,
  });

  const itemTextClasses = useComposeClassNames({
    baseClasses: typography.text.listItem,
    additionalClasses: customClasses?.description,
  });

  // Gestisce il click sull'item
  const handleClick = useCallback(() => {
    if (!disabled) {
      handlePress(onPress ?? onPressGeneral);
    }
  }, [disabled, handlePress, onPress, onPressGeneral]);

  // Verifica se l'item è cliccabile
  const isClickable = useMemo(
    () => !!(onPress || onPressGeneral),
    [onPress, onPressGeneral]
  );

  // Prepara i contenuti per IonLabel
  const titleText = useMemo(
    () =>
      typeof title === "string" ? (
        <Text
          text={title}
          className={itemTitleClasses}
          translationOption={{ ns }}
        />
      ) : (
        <Text
          translationOption={{ ns }}
          className={itemTitleClasses}
          {...title}
        />
      ),
    [title]
  );

  const descriptionText = useMemo(
    () =>
      typeof text === "string" ? (
        <Text
          translationOption={{ ns }}
          text={text}
          className={itemTextClasses}
        />
      ) : (
        <Text
          translationOption={{ ns }}
          className={itemTextClasses}
          {...text}
        />
      ),
    [text]
  );

  return (
    <div className={layout.content} id={id}>
      <IonItem
        className={itemClasses}
        button={isClickable}
        disabled={disabled}
        lines={disableDivider ? "none" : lines}
        onClick={isClickable ? handleClick : undefined}
        detail={detail}
      >
        {icon && !profilePicture && (
          <IonIcon
            aria-hidden="true"
            slot="start"
            icon={icon}
            size={"large"}
            className={`${typography.icon.title} ${customClasses?.icon} mr-3 ${iconClick ? "cursor-pointer" : ""}`}
            onClick={iconClick}
          />
        )}
        {/* Immagine profilo o icona */}
        {profilePicture && (
          <div slot="start" className={customClasses?.profilePicture}>
            <img
              src={profilePicture}
              alt="Profile"
              width={profilePictureSize ?? defaultProfilePictureSize}
              height={profilePictureSize ?? defaultProfilePictureSize}
              className="ion-avatar"
            />
          </div>
        )}
        <div
          className={`
              ${
                contentDirection === "row" ? layout.contentRow : layout.content
              } max-w-full my-2`}
        >
          {!!titleText && titleText}

          {!!descriptionText && descriptionText}
        </div>
        {/* Icona o pulsante a destra */}
        {iconRight && !rightButton && (
          <IonIcon
            slot="end"
            icon={iconRight}
            className={`${typography.icon.title} text-gray-400 ${customClasses?.icon}`}
          />
        )}
        {rightButton && (
          <IonIcon
            slot="end"
            icon={rightButton.icon}
            color={rightButton.color}
            className={`${typography.icon.title} ${customClasses?.icon || ""} ${rightButton?.className || ""}`}
            onClick={rightButton.onClick}
          />
        )}
      </IonItem>

      {/* Pulsanti inferiori */}
      {bottomButton && (
        <div className="ion-padding-horizontal ion-padding-bottom">
          {renderBottomContent(bottomButton)}
        </div>
      )}
    </div>
  );
};

export const Item = memo(ItemComponent);

// Per utilizzare una versione più nativa di Ionic, decommentare questa riga e commentare quella sopra
// export const Item = memo(NativeItemComponent);
