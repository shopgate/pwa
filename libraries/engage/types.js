// @flow
import { type Action, type Dispatch } from 'redux';
import { type Observable } from 'rxjs';

export type State = {
  [string]: any;
}

export type ObservableAction = {
  action: Action;
  dispatch: Dispatch<Action>;
  getState: () => State;
  prevState: State;
}

export type SubscribeHandler = (
  stream$: Observable<Action>,
  callback: (params: ObservableAction) => void
) => void;

export type ClassName = { [string]: any } | null;
