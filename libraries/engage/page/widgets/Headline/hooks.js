import { useWidget } from '@shopgate/engage/page/hooks';

/**
 * @typedef {Object} HeadlineWidgetConfig
 * @property {Object} [headline] - The headline configuration object.
 * @property {string} [headline.text] - The text to display as the headline.
 */

/**
 * Custom hook to retrieve the headline widget configuration.
 * @returns {{ headline: string }} An object containing the headline text.
 */
export const useHeadlineWidget = () => {
  const { config } = useWidget();

  const {
    bold, fontSize, italic, text, underline, textAlign,
  } = config.headline;

  const styles = {
    ...(bold && { fontWeight: 'bold' }),
    ...(italic && { fontStyle: 'italic' }),
    ...(underline && { textDecoration: 'underline' }),
    ...(fontSize ? { fontSize } : 14),
    ...(textAlign && { textAlign }),
  };

  return {
    headline: text,
    styles,
  };
};
