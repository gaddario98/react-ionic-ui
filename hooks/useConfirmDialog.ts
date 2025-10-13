import { useIonAlert } from "@ionic/react";
import { useCallback } from "react";
import { useTranslatedText } from "@gaddario98/react-localization";

interface UseConfirmDialogReturn {
  showConfirmDialog: (title: string, message: string) => Promise<boolean>;
}

export const useConfirmDialog = (): UseConfirmDialogReturn => {
  const [present] = useIonAlert();
      const { traslateText } = useTranslatedText();

  const showConfirmDialog = useCallback(
    (title: string, message: string): Promise<boolean> => {
      return new Promise((resolve) => {
        present({
          header: title,
          message: message,
          buttons: [
            {
              text: traslateText('cancel', { ns: 'buttons' }),
              role: 'cancel',
              handler: () => {
                resolve(false);
              },
            },
            {
              text: traslateText('confirm', { ns: 'buttons' }),
              role: 'confirm',
              handler: () => {
                resolve(true);
              },
            },
          ],
          onDidDismiss: (ev) => {
            // Se viene dismissato senza selezione, ritorna false
            if (ev.detail.role !== 'confirm') {
              resolve(false);
            }
          },
        });
      });
    },
    [present, traslateText]
  );

  return { showConfirmDialog };
};
