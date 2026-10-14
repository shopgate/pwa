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
