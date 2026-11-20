import { useMemo } from 'react';
import { useWidget } from '@shopgate/engage/page/hooks';

/** Whether the entries stand side by side or move from right to left in a loop. */
export type TextBandDisplay = 'static' | 'scrolling';

/** How fast a scrolling band moves. */
export type TextBandSpeed = 'slow' | 'normal' | 'fast';

/** A color picked in the admin. */
export interface TextBandColor {
  /** The CSS color. */
  value?: string;
}

/** An entry of the band. */
export interface TextBandEntry {
  /** The text of the entry, may contain emojis. */
  text?: string;
  /** The link the entry opens. */
  link?: string;
}

/**
 * Configuration of the TextBand widget.
 */
export interface TextBandWidgetConfig {
  /** The entries of the band. */
  entries?: TextBandEntry[];
  /** Whether the entries stand still or scroll. */
  display?: TextBandDisplay;
  /** How fast a scrolling band moves. */
  speed?: TextBandSpeed;
  /** Background color of the band. */
  backgroundColor?: TextBandColor | null;
  /** Text color of the band. */
  textColor?: TextBandColor | null;
}

/**
 * Hook to access the TextBand widget configuration.
 * @returns The configuration with its defaults and the entries that have a text.
 */
export const useTextBandWidget = () => {
  const { config } = useWidget<TextBandWidgetConfig>();

  const entries = useMemo(() => (config.entries ?? [])
    .map(({ text, link }) => ({
      text: text?.trim() ?? '',
      link: link || undefined,
    }))
    .filter(entry => entry.text), [config.entries]);

  return {
    entries,
    display: config.display ?? 'scrolling',
    speed: config.speed ?? 'normal',
    backgroundColor: config.backgroundColor?.value || undefined,
    textColor: config.textColor?.value || undefined,
  };
};
