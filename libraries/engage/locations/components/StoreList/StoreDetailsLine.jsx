import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Grid } from '@shopgate/engage/components';
import {
  detailsLine, detailsIcon, detailsIconLinked, details,
} from './Store.style';

/**
 * Renders a single store headline.
 * @param {Object} props The component props.
 * @param {React.ReactElement} props.icon The icon component.
 * @param {boolean} props.linked Whether the details should be linked.
 * @param {React.ReactNode} props.children The component children.
 * @returns {JSX.Element}
 */
export function StoreDetailsLine({ icon: Icon, children, linked }) {
  return (
    <Grid className={detailsLine}>
      <Grid.Item shrink={0} className={classNames(detailsIcon, { [detailsIconLinked]: linked })}>
        <Icon aria-hidden />
      </Grid.Item>
      <Grid.Item grow={1} className={details}>
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
