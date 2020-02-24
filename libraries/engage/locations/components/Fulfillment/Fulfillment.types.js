// @flow
import * as React from 'react';

export type OwnProps = {
  title: string;
  children: React.Node;
}

export type StateProps = {
  settings?: Object | null;
}
