import type { ComponentType } from 'react';
import { makeStyles } from '@shopgate/engage/styles';

const useStyles = makeStyles()({
  root: {
    display: 'flex',
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
    fontSize: 24,
  },
});

/**
 * The props of a tab icon.
 */
interface Props {
  /**
   * The icon component, e.g. from `getActionIcon`.
   */
  icon: ComponentType;
}

/**
 * Renders a theme icon in the size of the tab icons.
 * @param props The component props.
 * @param props.icon The icon component.
 * @returns The icon.
 */
const TabBarIcon = ({ icon: Icon }: Props) => {
  const { classes, cx } = useStyles();

  return (
    <span className={cx(classes.root, 'theme__tab-bar__icon')}>
      <Icon />
    </span>
  );
};

export default TabBarIcon;
