import * as React from 'react';
import NavDrawer from '@shopgate/pwa-ui-material/NavDrawer';
import appConfig from '@shopgate/pwa-common/helpers/config';

const { showGmdMenuSubHeaders } = appConfig as { showGmdMenuSubHeaders?: boolean };

export type SectionProps = {
  /** Section entries. */
  children?: React.ReactNode;
  /** Renders a divider below the section. */
  dividerBottom?: boolean;
  /** Renders a divider above the section. */
  dividerTop?: boolean;
  /** Sub header text, suppressed unless `showGmdMenuSubHeaders` is configured. */
  title?: string;
};

const NavDrawerSection = NavDrawer.Section as React.ComponentType<SectionProps>;

/**
 * Wraps the nav drawer section so section titles can be suppressed by app config.
 * @param props The component props.
 * @param props.title The sub header text.
 * @returns The rendered section.
 */
const Section = ({ title = '', ...rest }: SectionProps) => (
  <NavDrawerSection {...rest} title={showGmdMenuSubHeaders ? title : ''} />
);

Section.Item = NavDrawer.Section.Item;

export default Section;
