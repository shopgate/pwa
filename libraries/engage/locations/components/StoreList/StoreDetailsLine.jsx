// @flow
import React from 'react';
import { Grid } from '@shopgate/engage/components';
import { detailsLine, detailsIcon, details } from './Store.style';

type Props = {
  icon: any,
  children: any,
}

/**
 * Renders a single store headline.
 * @returns {JSX}
 */
export function StoreDetailsLine({ icon: Icon, children }: Props) {
  return (
    <Grid className={detailsLine}>
      <Grid.Item shrink={0} className={detailsIcon}>
        <Icon />
      </Grid.Item>
      <Grid.Item grow={1} className={details}>
        {children}
      </Grid.Item>
    </Grid>
  );
}
