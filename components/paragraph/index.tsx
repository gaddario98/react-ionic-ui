import { memo } from "react";
import { useComposeClassNames } from "../../hooks";
import { IconProps, Text } from "../text";
import { Image } from "../image";
import { typography, layout } from "../../styles";
import type { TOptions } from "i18next";
// Tipi per gestire sia stringhe che proprietà di Text
type TextContent = string;
type TextProps = {
  text: string;
  className?: string;
  icon?: IconProps
  numberOfLines?: number;
  translationOption?: TOptions;
};

type TextContentOrProps = TextContent | TextProps;

interface ParagraphProps {
  title?: TextContentOrProps;
  subTitle?: TextContentOrProps;
  description?: TextContentOrProps;
  contentClassName?: string;
  img?: string;
  alt?: string;
  imgClassName?: string;
  imgContainerClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  descriptionClassName?: string;
  imageWidth?: number;
  imageHeight?: number;
  imagePriority?: boolean;
  ns?: string;
}

// Helper per verificare se un valore è di tipo TextProps
const isTextProps = (
  value: TextContentOrProps | undefined
): value is TextProps => {
  return value !== undefined && typeof value === "object" && "text" in value;
};

// Helper per convertire TextContentOrProps in TextProps
const convertToTextProps = (
  content: TextContentOrProps | undefined,
  defaultClassName: string
): TextProps | undefined => {
  if (!content) return undefined;

  if (isTextProps(content)) {
    return {
      ...content,
      className: content.className || defaultClassName,
    };
  }

  return {
    text: content,
    className: defaultClassName,
  };
};

const defaultImageSize = 23;

const ParagraphComponent = ({
  title,
  subTitle,
  description,
  contentClassName,
  img,
  alt = "Image",
  imgClassName,
  imgContainerClassName,
  titleClassName,
  subtitleClassName,
  descriptionClassName,
  imageWidth,
  imageHeight,
  imagePriority = false,
  ns,
}: ParagraphProps) => {
  // Converti i contenuti in props per il componente Text
  const titleProps = convertToTextProps(title, typography.text.sectionTitle);
  const subtitleProps = convertToTextProps(
    subTitle,
    typography.text.sectionSubtitle
  );
  const descriptionProps = convertToTextProps(
    description,
    typography.text.paragraph
  );

  // Classi per il contenitore principale
  const containerClasses = useComposeClassNames({
    baseClasses: layout.content,
    additionalClasses: contentClassName,
  });

  // Classi per la riga del titolo/sottotitolo con eventuale immagine
  const headerRowClasses = useComposeClassNames({
    baseClasses: layout.contentRow,
  });

  // Classi per il contenitore del testo nell'header
  const textContainerClasses = useComposeClassNames({
    baseClasses: layout.content,
  });

  return (
    <div className={containerClasses}>
      <div className={headerRowClasses}>
        {img && (
          <div className={imgContainerClassName}>
            <Image
              src={img}
              alt={alt}
              width={imageWidth || defaultImageSize}
              height={imageHeight || defaultImageSize}
              fallbackSrc="/placeholder.jpg"
              resizeMode="cover"
              className={imgClassName}
              priority={imagePriority}
            />
          </div>
        )}

        <div className={textContainerClasses}>
          {titleProps && (
            <div className={layout.contentRow}>
              <Text
                tag="h1"
                {...titleProps}
                className={`${titleClassName || titleProps.className}`}
                translationOption={{
                  ns,
                  ...(titleProps?.translationOption ?? {}),
                }}
              />
            </div>
          )}

          {subtitleProps && (
            <Text
              tag="h2"
              {...subtitleProps}
              className={`${subtitleClassName || subtitleProps.className}`}
              translationOption={{
                ns,
                ...(subtitleProps?.translationOption ?? {}),
              }}
            />
          )}
        </div>
      </div>

      {descriptionProps && (
        <Text
          {...descriptionProps}
          className={`${descriptionClassName || descriptionProps.className}`}
          translationOption={{
            ns,
            ...(descriptionProps?.translationOption ?? {}),
          }}
        />
      )}
    </div>
  );
};

ParagraphComponent.displayName = "Paragraph";
export const Paragraph = memo(ParagraphComponent);
