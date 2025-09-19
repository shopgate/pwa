/* tslint:disable:unified-signatures */

export type SpacingArgument = number | string;

export interface Spacing {
  /**
   * The spacing helper can be used to create consistent spacing between UI element.
   *
   * It accepts 0 to 4 spacing arguments, which can be numbers or strings like `auto`,
   */
  (): number;
  (value: number): number;
  (topBottom: SpacingArgument, rightLeft: SpacingArgument): string;
  (top: SpacingArgument, rightLeft: SpacingArgument, bottom: SpacingArgument): string;
  (
    top: SpacingArgument,
    right: SpacingArgument,
    bottom: SpacingArgument,
    left: SpacingArgument
  ): string;
}

export default function createSpacing(): Spacing;
