// src/components/List/types.ts
import type { ComponentProps } from 'react';
import type { Button } from '../button';
import type { Text } from '../text';
import type { Paragraph } from '../paragraph';

export interface ListPress {
  route?: string;
  link?: string;
  action?: {
    title?: string;
    description?: string;
    ns?: string;
    okButton?: { action?: () => void; label?: string };
    cancelButton?: { action?: () => void; label?: string };
  };
}

export interface ListItemModel {
  title?: string | ComponentProps<typeof Text>;
  text?: string | ComponentProps<typeof Text>;
  onPress?: ListPress | (() => void);
  icon?: string; // Icona Ionic invece di LucideIconName
  iconRight?: string; // Icona Ionic invece di LucideIconName
  profilePicture?: string;
  profilePictureSize?: number;
  rightButton?: {
    icon?: string; // Icona Ionic invece di LucideIconName
    onClick?: () => void;
    color?: string
    className?: string;
  };
  key?: string;
  bottomButton?:
    | ComponentProps<typeof Button>
    | ComponentProps<typeof Button>[];
  disableDivider?: boolean;
  detail?: boolean; // Aggiunto per supportare la freccia di dettaglio di Ionic
  disabled?: boolean; // Aggiunto per supportare item disabilitati
  lines?: 'full' | 'inset' | 'none'; // Aggiunto per supportare i tipi di linee di Ionic
  contentDirection?: "row" | "col";
  id?:string
}

export interface ListItemProps {
  items: ListItemModel[];
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
  insetList?: boolean; // Aggiunto per supportare liste con inset in Ionic
  contentDirection?: "row" | "col";
  infiniteScroll?: {
    numberOfItems: number;
    onInfinite?: () => void;

  }
}

export interface ListProps extends Omit<ListItemProps, 'items'> {
  itemsKey?: string;
  listItems?: ListItemModel[];
  button?: ComponentProps<typeof Button>;
  paragraph?: ComponentProps<typeof Paragraph>;
  mapItems?: (items: ListItemModel[]) => ListItemModel[];
  customClasses?: {
    container?: string;
    item?: string;
    title?: string;
    description?: string;
    icon?: string;
    profilePicture?: string;
  };
  header?: string; // Aggiunto per supportare header di lista in Ionic
  insetList?: boolean; // Lista con margini laterali
}