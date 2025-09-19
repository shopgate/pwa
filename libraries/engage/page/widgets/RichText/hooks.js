import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} RichTextWidgetConfig
 * @property {string} text The rich text content.
 */

/**
 * @typedef {ReturnType< typeof import('@shopgate/engage/page/hooks')
 *   .useWidget<RichTextWidgetConfig> >} UseWidgetReturnType
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Hook to access the Image widget configuration and data.
 */
export const useRichTextWidget = () => {
  /** @type {UseWidgetReturnType}  */
  const { config } = useWidget();
  return {
    richText: config?.text,
  };
};
