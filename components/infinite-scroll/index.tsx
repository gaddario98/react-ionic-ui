import { IonInfiniteScroll, IonInfiniteScrollContent } from "@ionic/react";
import { useCallback, useMemo, useState } from "react";

interface Props {
  numberOfItems?: number;
  items: React.JSX.Element[];
}

export const InfiniteScroll: React.FC<Props> = ({ items, numberOfItems }) => {
  const [num, setNum] = useState<number>(numberOfItems ?? items?.length ?? 0);

  const generateItems = useCallback(() => {
    if (numberOfItems && num < items.length) {
      setNum((prevNum) => Math.min(prevNum + numberOfItems, items.length));
    }
  }, [numberOfItems, items.length, num]);

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

  const splicedItems = useMemo(
    () => items?.slice(0, Math.min(num, items.length)),
    [num, items]
  );
  return (
    <>
      {splicedItems}
      {numberOfItems && num < items.length && (
        <IonInfiniteScroll onIonInfinite={handleIonInfinite}>
          <IonInfiniteScrollContent></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      )}
    </>
  );
};
