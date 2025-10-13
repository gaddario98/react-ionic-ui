// src/components/Modal/index.tsx
import {
  useCallback,
  useMemo,
  ReactNode,
  memo,
  useRef,
  useEffect,
} from "react";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  createAnimation,
} from "@ionic/react";
import { useComposeClassNames } from "../../hooks";
import { useTranslatedText } from "@gaddario98/react-localization";
import { Button } from "../button";
import { closeOutline } from "ionicons/icons";
import { theme } from "../../styles";

export type ModalType = "default" | "actionSheet";

interface BaseModalProps {
  visible?: boolean;
  onClose?: () => void;
  title?: string;
  ns?: string;
  containerClassName?: string;
  type?: ModalType;
  trigger?: string;
}

interface DefaultModalProps extends BaseModalProps {
  type?: "default";
  children: ReactNode;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
}

interface ActionSheetModalProps extends BaseModalProps {
  type: "actionSheet";
  subtitle?: string;
  cancelProps?: Partial<React.ComponentProps<typeof Button>>;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  children?: ReactNode;
}

export type ModalProps = DefaultModalProps | ActionSheetModalProps;

const ModalComponent = (props: ModalProps) => {
  const { traslateText } = useTranslatedText();
  const modalRef = useRef<HTMLIonModalElement>(null);

  // Personalizza le animazioni di entrata e uscita in base al tipo di modal
  useEffect(() => {
    if (modalRef.current) {
      if (props.type === "actionSheet") {
        // Animazione per l'action sheet (slide up dal basso)
        modalRef.current.enterAnimation = (baseEl: HTMLElement) => {
          const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector("ion-backdrop")!)
            .fromTo("opacity", "0.01", "0.4");

          const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector(".modal-wrapper")!)
            .fromTo("transform", "translateY(100%)", "translateY(0%)");

          return createAnimation()
            .addElement(baseEl)
            .duration(400)
            .easing("cubic-bezier(0.36,0.66,0.04,1)")
            .addAnimation([backdropAnimation, wrapperAnimation]);
        };

        modalRef.current.leaveAnimation = (baseEl: HTMLElement) => {
          const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector("ion-backdrop")!)
            .fromTo("opacity", "0.4", "0.0");

          const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector(".modal-wrapper")!)
            .fromTo("transform", "translateY(0%)", "translateY(100%)");

          return createAnimation()
            .addElement(baseEl)
            .duration(300)
            .easing("cubic-bezier(0.36,0.66,0.04,1)")
            .addAnimation([backdropAnimation, wrapperAnimation]);
        };
      } else {
        // Animazione per modal standard (fade in con slide down)
        modalRef.current.enterAnimation = (baseEl: HTMLElement) => {
          const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector("ion-backdrop")!)
            .fromTo("opacity", "0.01", "0.4");

          const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector(".modal-wrapper")!)
            .keyframes([
              { offset: 0, opacity: "0", transform: "translateY(50px)" },
              { offset: 1, opacity: "1", transform: "translateY(0)" },
            ]);

          return createAnimation()
            .addElement(baseEl)
            .duration(400)
            .easing("cubic-bezier(0.36,0.66,0.04,1)")
            .addAnimation([backdropAnimation, wrapperAnimation]);
        };

        modalRef.current.leaveAnimation = (baseEl: HTMLElement) => {
          const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector("ion-backdrop")!)
            .fromTo("opacity", "0.4", "0.0");

          const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector(".modal-wrapper")!)
            .keyframes([
              { offset: 0, opacity: "1", transform: "translateY(0)" },
              { offset: 1, opacity: "0", transform: "translateY(50px)" },
            ]);

          return createAnimation()
            .addElement(baseEl)
            .duration(300)
            .easing("cubic-bezier(0.36,0.66,0.04,1)")
            .addAnimation([backdropAnimation, wrapperAnimation]);
        };
      }
    }
  }, [props.type]);

  const handleClose = useCallback(() => {
    if (props.onClose) {
      props.onClose();
    }
  }, [props]);

  const handleBackdropClick = useCallback(() => {
    if (
      props.onClose &&
      (props.type === "actionSheet" || props.closeOnBackdropClick)
    ) {
      props.onClose();
    }
  }, [props]);

  // Stile dell'header in base al tipo di modal
  const headerStyle = useMemo(() => {
    return props.type === "default"
      ? { "--background": theme.light.colors.primary.bg, "--color": "white" }
      : undefined;
  }, [props.type]);

  // Renderizza l'header del modal
  const renderHeader = useMemo(() => {
    if (!props.title && (props.type !== "default" || !props.showCloseButton))
      return null;

    return (
      <IonHeader>
        <IonToolbar style={headerStyle}>
          <IonTitle>
            {traslateText(props.title || "", { ns: props.ns })}
          </IonTitle>
          {props.type === "default" && props.showCloseButton && (
            <IonButton
              slot="end"
              fill="clear"
              onClick={handleClose}
              style={{ color: props.type === "default" ? "white" : undefined }}
            >
              <IonIcon icon={closeOutline} />
            </IonButton>
          )}
        </IonToolbar>
      </IonHeader>
    );
  }, [
    props.ns,
    handleClose,
    props.showCloseButton,
    props.title,
    props.type,
    traslateText,
    headerStyle,
  ]);

  // Renderizza il contenuto dell'action sheet
  const renderActionSheetContent = useMemo(() => {
    if (props.type !== "actionSheet") return props.children;

    return (
      <>
        {props.subtitle && (
          <div className="ion-padding ion-text-center">
            <p className="ion-text-color-medium ion-text-sm">
              {traslateText(props.subtitle)}
            </p>
          </div>
        )}
        <div className="ion-padding">{props.children}</div>
        <div className="ion-padding-horizontal ion-padding-bottom">
          <Button
            onClick={handleClose}
            variant="text"
            color="danger"
            expand="block"
            text="cancel"
            ns="buttons"
            {...props.cancelProps}
          />
        </div>
      </>
    );
  }, [handleClose, props, traslateText]);

  // Imposta classi CSS e proprietà del modal in base al tipo
  const modalClasses = useComposeClassNames({
    baseClasses: "",
    additionalClasses: props.containerClassName,
  });

  const modalCssClass = useMemo(
    () =>
      props.type === "actionSheet" ? "action-sheet-modal" : "default-modal",
    [props.type]
  );
  const modalInitialBreakpoint = useMemo(
    () => (props.type === "actionSheet" ? 1 : undefined),
    [props.type]
  );
  const modalHandleBehavior = useMemo(
    () => (props.type === "actionSheet" ? "cycle" : undefined),
    [props.type]
  );

  // Imposta lo stile per il contenuto
  const contentStyle = useMemo(
    () =>
      props.type === "actionSheet" ? { "--background": "white" } : undefined,
    [props.type]
  );

  return (
    <IonModal
      ref={modalRef}
      trigger={props?.trigger}
      isOpen={props.visible}
      onDidDismiss={handleBackdropClick}
      className={`${modalClasses} ${modalCssClass}`}
      presentingElement={
        document.querySelector("ion-router-outlet") || undefined
      }
      backdropDismiss={
        props.closeOnBackdropClick || props.type === "actionSheet"
      }
      initialBreakpoint={modalInitialBreakpoint}
      breakpoints={props.type === "actionSheet" ? [0, 1] : undefined}
      handleBehavior={modalHandleBehavior}
    >
      {renderHeader}
      <IonContent style={contentStyle}>
        {props.type === "actionSheet"
          ? renderActionSheetContent
          : props.children}
      </IonContent>
    </IonModal>
  );
};

ModalComponent.displayName = "Modal";

export const Modal = memo(ModalComponent);
