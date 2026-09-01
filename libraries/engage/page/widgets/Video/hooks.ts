import { useWidget } from '@shopgate/engage/page/hooks';
import { resolveBorderRadiusFromWidgetConfig } from '../../helpers';

/**
 * Configuration of the Video widget.
 */
export interface VideoWidgetConfig {
  /**
   * The video URL.
   */
  url: string;
  /**
   * Whether the video should be muted.
   */
  muted?: boolean;
  /**
   * Whether the video should loop.
   */
  loop?: boolean;
  /**
   * Whether the video should display controls.
   */
  controls?: boolean;
  /**
   * Whether the video should autoplay.
   */
  autoplay?: boolean;
  /**
   * The border radius option.
   */
  borderRadius: 'default' | 'none' | 'rounded' | 'custom';
  /**
   * The custom border radius value.
   */
  borderRadiusCustom?: number;
  /**
   * The link URL.
   */
  link?: string;
}

/**
 * Resolved data returned by {@link useVideoWidget}. Reuses the field docs from
 * {@link VideoWidgetConfig} for the pass-through fields via `Pick`.
 */
export interface UseVideoWidgetResult extends Pick<
  VideoWidgetConfig,
  'url' | 'muted' | 'loop' | 'controls' | 'autoplay' | 'link'
> {
  /**
   * The resolved border radius as a CSS length.
   */
  borderRadius: string;
}

/**
 * Hook to access the Video widget configuration and data.
 * @returns The resolved Video widget data.
 */
export const useVideoWidget = (): UseVideoWidgetResult => {
  const { config } = useWidget<VideoWidgetConfig>();
  const {
    url, muted, loop, controls, autoplay, borderRadius, borderRadiusCustom, link,
  } = config || ({} as VideoWidgetConfig);

  const borderRadiusResolved = resolveBorderRadiusFromWidgetConfig({
    borderRadius,
    borderRadiusCustom,
  });

  return {
    url,
    muted,
    loop,
    controls,
    autoplay,
    borderRadius: borderRadiusResolved,
    link,
  };
};
