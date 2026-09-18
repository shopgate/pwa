import type { HTMLAttributes } from 'react';

/**
 * Props shared by the simulated top and bottom insets.
 */
export interface SimulatedInsetProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the inset is highlighted.
   */
  highlightInset: boolean;
  /**
   * The function to call when the inset is clicked.
   */
  onClick: () => void;
}
