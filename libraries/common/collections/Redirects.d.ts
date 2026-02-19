export type RedirectHandler =
  | string
  | Promise<string>
  | ((...args: any[]) => string | Promise<string>);

export type RedirectOptions = {
  /**
   * Whether to show a loading indicator while the redirect is being processed.
   * @default true
   */
  showLoading?: boolean;
  /**
   * Whether to override an existing redirect.
   * @default false
   */
  override?: boolean;
};

export interface RedirectExtendedData {
  /**
   * The value passed as "from" to set()
   */
  matcher?: string;
  /**
   * The value passed as "to" to set()
   */
  handler: RedirectHandler;
  /**
   * Decoded params from the pathname - defined within the matcher
   */
  pathParams?: Record<string, any> | null;
  /**
   * Decoded query params from the pathname
   */
  queryParams: Record<string, any>;
  /**
   * Additional options for the redirect, passed as the third argument to set()
   */
  options?: RedirectOptions | null;
}

export class Redirects {
  /**
   * Returns a specified element from the internal "redirects" Map object.
   * @param pathname The pathname to lookup.
   */
  get(pathname: string): RedirectHandler | null;
  /**
   * Returns the redirect for a passed pathname.
   * @param {string} pathname The pathname to check.
   */
  getRedirect(pathname: string): RedirectHandler | null;
  /**
   * Unlike "getRedirect" which only returns a matching handler for a passed pathname, this method
   * returns an object that contains some extended data.
   * @param pathname The pathname to check.
   */
  getRedirectExtended(pathname: string): RedirectExtendedData | null;
  /**
   * Adds a redirect handler to the collection.
   * @param from The link to redirect from. Route patterns are also supported.
   * @param to redirect / handle to create a dynamic link
   * @param force Whether or not to forcefully set the redirect.
   */
  set(from?: string | null, to?: RedirectHandler | null, force?: boolean): void;

  /**
   * Adds a redirect handler to the collection.
   * @param from The link to redirect from. Route patterns are also supported.
   * @param to redirect / handle to create a dynamic link
   * @param options Additional options for the redirect.
   * @param force Whether or not to forcefully set the redirect.
   */
  set(from?: string | null, to?: RedirectHandler | null, options?: RedirectOptions, force?: boolean): void;

  /**
   * Removes a specified element from the internal "redirects" Map object.
   * @param pathname The pathname to remove.
   */
  unset(pathname: string): void;
}

declare const redirects: Redirects;
export default redirects;
