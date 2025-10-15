import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} VideoWidgetConfig
 * @property {string} url The video URL.
 * @property {boolean} [muted] Whether the video should be muted.
 * @property {boolean} [loop] Whether the video should loop.
 * @property {boolean} [controls] Whether the video should display controls.
 * @property {boolean} [autoplay] Whether the video should autoplay.
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
  const {
    url, muted, loop, controls, autoplay,
  } = config || {};

  return {
    url,
    muted,
    loop,
    controls,
    autoplay,
  };
};
