import { useWidget } from '@shopgate/engage/page/hooks';
import { resolveBorderRadiusFromWidgetConfig } from '../../helpers';
import type { WidgetButtonAlignment } from '../../components/WidgetButton';
import type { HeadlineProps } from '../../components/WidgetHeadline/WidgetHeadline';

/** Side of the text the image sits on from a width of 480 px. */
export type ImageWithTextPosition = 'left' | 'right';

/** Share of the widget width the image takes from a width of 480 px. */
export type ImageWithTextWidth = 'half' | 'third';

/**
 * Configuration of the ImageWithText widget.
 */
export interface ImageWithTextWidgetConfig {
  /** The image with its alt text. */
  image?: {
    /** The image URL. */
    url?: string;
    /** The image alt text. */
    altText?: string;
  } | null;
  /** Side of the text the image sits on. */
  imagePosition?: ImageWithTextPosition;
  /** Share of the widget width the image takes. */
  imageWidth?: ImageWithTextWidth;
  /** The headline next to the image. */
  headline?: HeadlineProps;
  /** Rich text below the headline. */
  text?: string;
  /** Text of the button that opens the link. */
  buttonText?: string;
  /** The link that image and button open. */
  link?: string;
  /** Where the button sits. */
  buttonAlignment?: WidgetButtonAlignment;
  /** The border radius option of the image. */
  borderRadius: 'default' | 'none' | 'rounded' | 'custom';
  /** The custom border radius value of the image. */
  borderRadiusCustom?: number;
}

/**
 * Hook to access the ImageWithText widget configuration.
 * @returns The configuration with its defaults and the resolved image border radius.
 */
export const useImageWithTextWidget = () => {
  const { config } = useWidget<ImageWithTextWidgetConfig>();
  const {
    image, borderRadius, borderRadiusCustom, ...rest
  } = config;

  return {
    ...rest,
    imageUrl: image?.url,
    altText: image?.altText ?? '',
    imagePosition: rest.imagePosition ?? 'left',
    imageWidth: rest.imageWidth ?? 'half',
    buttonAlignment: rest.buttonAlignment ?? 'left',
    borderRadius: resolveBorderRadiusFromWidgetConfig({
      borderRadius,
      borderRadiusCustom,
    }),
  };
};
