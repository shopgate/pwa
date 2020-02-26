// @flow
import * as React from 'react';
import { type MerchantSettings } from '../../../core/config/config.types';

export type OwnProps = {
  children: React.Node;
}

export type StateProps = {
  settings?: MerchantSettings | null;
}
