// @flow
import * as React from 'react';
import { type MerchantSettings } from '../../../core/config/config.types';

export type OwnProps = {
  title: string;
  children: React.Node;
}

export type StateProps = {
  settings?: MerchantSettings | null;
}
