import {
  memo,
  useMemo,
  useCallback,
  ComponentProps,
  useRef,
  ReactNode,
} from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonCardSubtitle,
  IonIcon,
  IonItem,
} from "@ionic/react";
import { useBaseAnimation, useComposeClassNames } from "../../hooks";
import { Button } from "../button";
import { Image, ImagePosition } from "../image";
import { Text } from "../text";
import { layout, typography } from "../../styles";

type ContentType = string | ComponentProps<typeof Text>;

interface IconProps {
  name: string;
  size?: string;
  color?: string;
  onClick?: () => void;
  className?: string;
}

export interface CardProps {
  title?: ContentType;
  subtitle?: ContentType;
  content?: string | ReactNode;
  image?: string;
  actions?: Array<React.ComponentProps<typeof Button>>;
  outlined?: boolean;
  elevated?: boolean;
  onClick?: () => void;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  contentClassName?: string;
  actionsContainerClassName?: string;
  onlyImage?: boolean;
  imageClassName?: string;
  imagePosition?: ImagePosition;
  icon?: IconProps;
  alt?: string;
  id?: string;
}

const CardComponent = ({
  title,
  subtitle,
  content,
  image,
  actions,
  outlined = false,
  elevated = false,
  onClick,
  className,
  titleClassName,
  subtitleClassName,
  contentClassName,
  actionsContainerClassName,
  onlyImage = false,
  imageClassName,
  imagePosition = "top",
  icon,
  alt = "Card image",
  id,
}: CardProps) => {
  const cardRef = useRef<HTMLIonCardElement>(null);
  useBaseAnimation(cardRef);

  // composizione classi
  const cardClasses = useComposeClassNames({
    baseClasses: [
      "ion-radius",
      outlined && "ion-card-outlined",
      !elevated && "shadow-none",
      ["left", "right"].includes(imagePosition) && "ion-card-horizontal",
    ]
      .filter(Boolean)
      .join(" "),
    additionalClasses: className,
  });

  // stile flessibile per left/right
  const cardStyle = useMemo(
    () =>
      ["left", "right"].includes(imagePosition)
        ? {
            display: "flex",
            flexDirection: imagePosition === "left" ? "row" : "row-reverse",
          }
        : {},
    [imagePosition]
  );

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  // icona “floating”
  const iconNode = useMemo(
    () =>
      icon && (
        <div
          className={`ion-position-absolute ion-padding-sm ${icon.className || ""}`}
          style={{ top: 8, right: 8, zIndex: 10 }}
          onClick={(e) => {
            e.stopPropagation();
            icon.onClick?.();
          }}
        >
          <IonIcon icon={icon.name} size={icon.size} color={icon.color} />
        </div>
      ),
    [icon]
  );

  const imageNode = useMemo(
    () =>
      image && (
        <div
          className="ion-relative"
          style={{
            width: ["left", "right"].includes(imagePosition) ? "33%" : "100%",
          }}
        >
          <Image
            src={image}
            alt={alt}
            fallbackSrc="/placeholder.jpg"
            resizeMode="cover"
            position={imagePosition}
            className={imageClassName}
            fill
          />
          {onlyImage && typeof title === "string" && (
            <div
              className="ion-position-absolute ion-padding-sm ion-text-center ion-color-light"
              style={{
                bottom: 0,
                left: 0,
                right: 0,
                background: "rgba(0,0,0,0.4)",
              }}
            >
              <Text text={title} className={typography.text.paragraph} />
            </div>
          )}
        </div>
      ),
    [image, alt, imagePosition, imageClassName, onlyImage, title]
  );

  const contentNode = useMemo(
    () =>
      content && (
        <IonItem lines="full">
          <IonCardContent
            className={`ion-no-padding ion-padding-vertical w-full ${contentClassName}`}
          >
            {typeof content === "string" ? (
              <Text text={content} className={typography.text.paragraph} />
            ) : (
              content
            )}
          </IonCardContent>
        </IonItem>
      ),
    [content, contentClassName]
  );

  const actionsNode = useMemo(
    () =>
      !!actions?.length && (
        <IonItem lines="none">
          <div
            slot="end"
            className={`text-right ${actionsContainerClassName || ""}`}
          >
            {actions.map((btnProps, i) => (
              <Button key={i} size="small" variant="text" {...btnProps} />
            ))}
          </div>
        </IonItem>
      ),
    [actions, actionsContainerClassName]
  );

  if (onlyImage) {
    return (
      <IonCard
        ref={cardRef}
        className={cardClasses}
        onClick={handleClick}
        style={{ padding: 0, margin: 0, ...cardStyle }}
      >
        {imageNode}
        {iconNode}
      </IonCard>
    );
  }

  return (
    <div id={id}>
      <IonCard
        ref={cardRef}
        className={cardClasses}
        onClick={handleClick}
        style={cardStyle}
      >
        {["top", "left"].includes(imagePosition) && imageNode}
        {iconNode}
        {(title || subtitle) && (
          <IonItem lines={content || actionsNode ? "full" : "none"}>
            <div className="ion-padding-vertical">
              <IonCardHeader>
                {title && (
                  <IonCardTitle>
                    {typeof title === "string" ? (
                      <Text
                        text={title}
                        contentClassName={`${typography.text.cardTitle} ${titleClassName}`}
                      />
                    ) : (
                      <Text
                        {...title}
                        contentClassName={[
                          typography.text.cardTitle,
                          titleClassName,
                          title?.contentClassName,
                        ]
                          ?.filter(Boolean)
                          ?.join(" ")}
                      />
                    )}
                  </IonCardTitle>
                )}
                {subtitle && (
                  <IonCardSubtitle>
                    {typeof subtitle === "string" ? (
                      <Text
                        text={subtitle}
                        contentClassName={`${typography.text.cardSubtitle} ${subtitleClassName}`}
                      />
                    ) : (
                      <Text
                        {...subtitle}
                        contentClassName={[
                          typography.text.cardSubtitle,
                          subtitleClassName,
                          subtitle?.contentClassName,
                        ]
                          ?.filter(Boolean)
                          ?.join(" ")}
                      />
                    )}
                  </IonCardSubtitle>
                )}
              </IonCardHeader>
            </div>
          </IonItem>
        )}
        {contentNode} {actionsNode}
        {["bottom", "right"].includes(imagePosition) && imageNode}
      </IonCard>
    </div>
  );
};

CardComponent.displayName = "Card";
export const Card = memo(CardComponent);
