import { memo, useMemo } from "react";
import { IonListHeader } from "@ionic/react";
import { useComposeClassNames } from "../../hooks";
import { useTranslatedText } from "@gaddario98/react-localization";
import { Button } from "../button";
import { Paragraph } from "../paragraph";
import type { ListProps, ListItemModel } from "./types";
import { ListItems } from "./list-items";
import { layout } from "../../styles";

const ListComponent = ({
  ns,
  button,
  itemsKey,
  paragraph,
  onPressGeneral,
  mapItems,
  listItems,
  customClasses,
  header,
  insetList = false,
  contentDirection,
}: ListProps) => {
  const { traslateText } = useTranslatedText(ns);

  // Get items from translation or props
  const items = useMemo(() => {
    if (itemsKey) {
      try {
        const translatedItems = traslateText(itemsKey, {
          returnObjects: true,
        });
        return Array.isArray(translatedItems)
          ? (translatedItems as ListItemModel[])
          : [];
      } catch (error) {
        console.error("Error translating list items:", error);
        return [];
      }
    }
    return listItems ?? [];
  }, [itemsKey, traslateText, listItems]);

  // Apply mapping function if provided
  const mappedItems = useMemo(
    () => (mapItems ? mapItems(items) : items),
    [items, mapItems]
  );

  // Container classes
  const containerClasses = useComposeClassNames({
    baseClasses: layout.contents,
    additionalClasses: customClasses?.container,
  });

  // If no items, don't render
  if (!mappedItems?.length) {
    return null;
  }

  return (
    <div className={containerClasses}>
      {/* Header se fornito */}
      {header && <IonListHeader>{traslateText(header, { ns })}</IonListHeader>}

      {/* Paragraph component if provided */}
      {paragraph && <Paragraph ns={ns} {...paragraph} />}

      {/* List items */}
      <ListItems
        items={mappedItems}
        onPressGeneral={onPressGeneral}
        ns={ns}
        customClasses={customClasses}
        insetList={insetList}
        contentDirection={contentDirection}
      />

      {/* Button at the bottom if provided */}
      {button && (
        <div className="ion-padding">
          <Button size="large" {...button} className="ion-align-self-start" />
        </div>
      )}
    </div>
  );
};

export const List = memo(ListComponent);
