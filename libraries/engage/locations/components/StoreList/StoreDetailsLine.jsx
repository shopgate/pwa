import * as React from 'react';
import PropTypes from 'prop-types';
import { Grid } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';

const { gap } = themeVariables;
const gapM = gap.small + gap.xsmall;

const useStyles = makeStyles()({
  detailsLine: {
    marginTop: gapM,
  },
  detailsIcon: {
    color: 'var(--color-text-medium-emphasis)',
    fontSize: '1.4rem',
    padding: `${gap.xsmall}px ${gap.big}px 0 0`,
  },
  detailsIconLinked: {
    color: 'var(--color-primary)',
  },
  details: {
    paddingTop: gap.xsmall,
  },
});

/**
 * Renders a single store headline.
 * @param {Object} props The component props.
 * @param {React.ReactElement} props.icon The icon component.
 * @param {boolean} props.linked Whether the details should be linked.
 * @param {React.ReactNode} props.children The component children.
 * @returns {JSX.Element}
 */
export function StoreDetailsLine({ icon: Icon, children, linked }) {
  const { classes, cx } = useStyles();
  return (
    <Grid className={classes.detailsLine}>
      <Grid.Item
        shrink={0}
        className={cx(classes.detailsIcon, { [classes.detailsIconLinked]: linked })}
      >
        <Icon aria-hidden />
      </Grid.Item>
      <Grid.Item grow={1} className={classes.details}>
        {children}
      </Grid.Item>
    </Grid>
  );
}

StoreDetailsLine.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.elementType.isRequired,
  linked: PropTypes.bool,
};

StoreDetailsLine.defaultProps = {
  linked: false,
};
