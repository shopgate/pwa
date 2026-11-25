/**
 * A favorites list of the user.
 */
export interface FavoritesList {
  /**
   * The id of the list.
   */
  id: string;
  /**
   * The name of the list.
   */
  name: string;
}

/**
 * Reads a value, e.g. an id, from the redux state and the props.
 */
export type PropsGetter<T, P = undefined> = (state: object, props: P) => T;

/**
 * A selector that reads a value from the redux state. It needs props when its getters read them.
 */
export type PropsSelector<T, P = undefined> =
  (state: object, ...props: P extends undefined ? [props?: P] : [props: P]) => T;
