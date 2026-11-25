/**
 * A scanned code, as the scanner actions receive it.
 */
export interface ScanResult {
  /**
   * The scope of the scanner.
   */
  scope: string;
  /**
   * The format of the code.
   */
  format: string;
  /**
   * The content of the code.
   */
  payload: string;
}
