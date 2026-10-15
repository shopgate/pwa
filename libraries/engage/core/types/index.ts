import type { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/startWith';

/**
 * The states of the extensions by their reducer key. Extensions describe their own state by
 * declaration merging, e.g. `declare module '@shopgate/engage/core/types'`.
 */
export interface ExtensionsState {
  /**
   * The state of an extension that doesn't describe it.
   */
  [reducerKey: string]: unknown;
}

/**
 * The redux state of the app. Only the states of the extensions are described so far.
 */
export interface RootState {
  /**
   * The states of the extensions.
   */
  extensions: ExtensionsState;
  /**
   * A state of the core.
   */
  [key: string]: unknown;
}

/**
 * Dispatches plain actions and thunks. For a thunk it returns what the thunk returns. It's
 * deliberately loose, since most action creators of the core are untyped JavaScript.
 */
export type AppDispatch = <T>(action: T) => T extends (...args: never[]) => infer R ? R : T;

/**
 * A redux thunk of the app.
 */
export type AppThunk<R = void> = (dispatch: AppDispatch, getState: () => RootState) => R;

/**
 * A listener of a UI event.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UIEventListener = (...args: any[]) => void;

/**
 * The emitter for UI events, e.g. toasts, sheets and modals.
 */
export interface UIEvents {
  /**
   * Emits an event with its arguments.
   * @returns Whether the event had listeners.
   */
  emit(event: string, ...args: unknown[]): boolean;
  /**
   * Adds a listener for an event.
   */
  addListener(event: string, listener: UIEventListener): UIEvents;
  /**
   * Removes a listener of an event.
   */
  removeListener(event: string, listener: UIEventListener): UIEvents;
}

/**
 * A redux action as it passes the streams.
 */
export interface StreamAction {
  /**
   * The type of the action.
   */
  type: string;
}

/**
 * What a stream subscription is called with for every action that passes the stream.
 */
export interface StreamPayload<A extends StreamAction = StreamAction> {
  /**
   * The action that passed the stream.
   */
  action: A;
  /**
   * The dispatch function of the store.
   */
  dispatch: AppDispatch;
  /**
   * Returns the current redux state.
   */
  getState: () => RootState;
  /**
   * The redux state before the action.
   */
  prevState: RootState;
  /**
   * The emitter for UI events.
   */
  events: UIEvents;
}

/**
 * A stream of redux actions. It has the operators that the main stream of the core adds, e.g.
 * `filter`, `merge` and `switchMap`.
 */
export type ActionStream<A extends StreamAction = StreamAction> = Observable<StreamPayload<A>>;

/**
 * Registers a callback for a stream. The payload takes the type of the stream, also for streams
 * merged from others.
 */
export type Subscribe = <P extends StreamPayload>(
  stream$: Observable<P>,
  callback: (payload: P) => void
) => void;

/**
 * A subscribers module, as the `subscribers` of an extension config point to.
 */
export type Subscriber = (subscribe: Subscribe) => void;

/**
 * What a `useBefore` step of a mutable function returns: `next`, `skipRest` or `stop` of
 * `mutableActions`, or nothing to keep the arguments.
 */
export type MutableStepResult = {
  /**
   * How the mutable function goes on.
   */
  action: 'next' | 'skipRest' | 'stop';
  /**
   * The arguments for the next step, or the result for `stop`.
   */
  args: unknown;
} | void;

/**
 * A function made mutable with `mutable`, e.g. many actions of the core. Extensions can replace
 * it or add steps that run before it.
 */
export interface MutableFunction<F extends (...args: never[]) => unknown> {
  (...args: Parameters<F>): ReturnType<F>;
  /**
   * The function as it was made mutable.
   */
  original: F;
  /**
   * The function that replaced the original one, if any.
   */
  current?: F;
  /**
   * Replaces the function. The steps added with `useBefore` still run before it.
   */
  replace(customFunc: F): void;
  /**
   * Restores the original function and keeps the steps.
   */
  restore(): void;
  /**
   * Restores the original function and removes the steps.
   */
  reset(): void;
  /**
   * Adds a step that runs before the function and can change its arguments or stop it.
   */
  useBefore(step: (...args: Parameters<F>) => MutableStepResult): void;
}
