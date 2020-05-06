// @flow
import * as React from 'react';
import classNames from 'classnames';
import { Grid } from '@shopgate/engage/components';
import {
  detailsLine, detailsIcon, detailsIconLinked, details,
} from './Store.style';

type Props = {
  icon: any,
  children: React.Node,
  linked?: boolean
}

/**
 * Renders a single store headline.
 * @returns {JSX}
 */
export function StoreDetailsLine({ icon: Icon, children, linked }: Props) {
  return (
    <Grid className={detailsLine}>
      <Grid.Item shrink={0} className={classNames(detailsIcon, { [detailsIconLinked]: linked })}>
        <Icon />
      </Grid.Item>
      <Grid.Item grow={1} className={details}>
        {children}
      </Grid.Item>
    </Grid>
  );
}

StoreDetailsLine.defaultProps = {
  linked: false,
};
