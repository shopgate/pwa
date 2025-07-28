import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} HeadlineWidgetConfig
 * @property {Object} [headline] - The headline configuration object.
 * @property {string} [headline.text] - The text to display as the headline.
 */

// eslint-disable-next-line valid-jsdoc
/**
 * Custom hook to retrieve the headline widget configuration.
 */
export const useHeadlineWidget = () => {
  const { config } = useWidget();

  const {
    bold, italic, text, underline, textAlign, typography,
  } = config.headline;

  const styles = {
    ...(bold && { fontWeight: 'bold' }),
    ...(italic && { fontStyle: 'italic' }),
    ...(underline && { textDecoration: 'underline' }),
  };

  return {
    headline: text,
    variant: typography,
    align: textAlign,
    styles,
  };
};
