import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import Section from './components/Section';

type HeadlineProps = {
  /** Headline text. */
  text?: string;
  /** Legacy alias for `text`. */
  title?: string;
};

/**
 * Accepts the legacy `title` prop next to the current `text` prop.
 * @param props The component props.
 * @param props.text The headline text.
 * @param props.title The legacy alias for the headline text.
 * @returns The rendered headline.
 */
const HeadlineCompatibility = ({ text = '', title = '' }: HeadlineProps) => (
  <NavDrawer.Title text={text || title} />
);

export default {
  Divider: NavDrawer.Divider,
  Headline: HeadlineCompatibility,
  Item: NavDrawer.Item,
  Section,
};
