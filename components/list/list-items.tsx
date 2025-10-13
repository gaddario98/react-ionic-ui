import { memo, useState, useCallback, useMemo, useEffect } from "react";
import {
  IonList,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import { useComposeClassNames } from "../../hooks";
import { Item } from "./item";
import type { ListItemProps } from "./types";

const ListItemsComponent = ({
  items,
  ns,
  onPressGeneral,
  customClasses,
  defaultProfilePictureSize,
  insetList = false,
  contentDirection,
  infiniteScroll,
}: ListItemProps) => {
  const initNum = useMemo(
    () => infiniteScroll?.numberOfItems ?? items?.length ?? 0,
    [infiniteScroll, items?.length]
  );
  const [num, setNum] = useState<number>(initNum);

  useEffect(() => {
    setNum(initNum);
  }, [initNum]);

  const generateItems = useCallback(() => {
    if (infiniteScroll?.numberOfItems && num < items.length) {
      setNum((prevNum) =>
        Math.min(prevNum + infiniteScroll.numberOfItems, items.length)
      );
    }
  }, [infiniteScroll, items.length, num]);

  const listClasses = useComposeClassNames({
    baseClasses: "",
    additionalClasses: `${customClasses?.container ?? ""} !rounded-md !py-0`, //!py-0
  });

  const splicedItems = useMemo(
    () => items?.slice(0, Math.min(num, items.length)),
    [num, items]
  );

  const handleIonInfinite = useCallback(
    (
      event: Parameters<
        Required<
          React.ComponentProps<typeof IonInfiniteScroll>
        >["onIonInfinite"]
      >["0"]
    ) => {
      generateItems();
      setTimeout(() => event.target.complete(), 0);
    },
    [generateItems]
  );

  return (
    <>
      <IonList className={listClasses} inset={insetList}>
        {splicedItems?.map((item, index) => (
          <Item
            {...item}
            contentDirection={item?.contentDirection ?? contentDirection}
            key={item.key ?? index.toString()}
            ns={ns}
            onPressGeneral={onPressGeneral}
            customClasses={customClasses}
            defaultProfilePictureSize={defaultProfilePictureSize}
            lines={index === items.length - 1 ? "none" : "full"}
          />
        ))}
      </IonList>

      {infiniteScroll?.numberOfItems && num < items.length && (
        <IonInfiniteScroll onIonInfinite={handleIonInfinite}>
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      )}
    </>
  );
};

export const ListItems = memo(ListItemsComponent);
