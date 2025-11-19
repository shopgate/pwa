import { useWidget } from '@shopgate/engage/page/hooks';
import { resolveBorderRadiusFromWidgetConfig } from '../../helpers';

/**
 * @typedef {Object} VideoWidgetConfig
 * @property {string} url The video URL.
 * @property {boolean} [muted] Whether the video should be muted.
 * @property {boolean} [loop] Whether the video should loop.
 * @property {boolean} [controls] Whether the video should display controls.
 * @property {boolean} [autoplay] Whether the video should autoplay.
 * @property {string} [borderRadius] The border radius preset.
 * @property {string} [link] The link URL.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<VideoWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Video widget configuration and data.
 */
export const useVideoWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();
  console.log('sasa:25: config', config);
  const {
    url, muted, loop, controls, autoplay, borderRadius, borderRadiusCustom, link,
  } = config || {};

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
