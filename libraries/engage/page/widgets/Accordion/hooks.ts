import { useWidget } from '@shopgate/engage/page/hooks';
import { HEADING_VARIANTS } from '../../../styles/theme/createTheme/createTypography';
import type { HeadlineProps } from '../../components/WidgetHeadline/WidgetHeadline';

/** One question of the accordion with its answer. */
export interface AccordionEntry {
  /** The question that opens and closes the answer. */
  question?: string;
  /** The answer as rich text. */
  answer?: string;
}

/** Which entry is open when the page opens. */
export type AccordionInitiallyOpen = 'none' | 'first';

/**
 * Configuration of the Accordion widget.
 */
export interface AccordionWidgetConfig {
  /** Whether the headline is shown. */
  showHeadline?: boolean;
  /** The headline above the entries. */
  headline?: HeadlineProps;
  /** The questions with their answers. */
  entries?: AccordionEntry[];
  /** Which entry is open when the page opens. */
  initiallyOpen?: AccordionInitiallyOpen;
  /** Whether several entries can be open at the same time. */
  allowMultipleOpen?: boolean;
}

/**
 * Hook to access the Accordion widget configuration.
 * @returns The configuration with its defaults and the heading tag of the questions.
 */
export const useAccordionWidget = () => {
  const { code, config } = useWidget<AccordionWidgetConfig>();
  const headline = config.showHeadline && config.headline?.text ? config.headline : null;
  const headlineLevel = headline ? Number((headline.typography ?? 'h3').charAt(1)) : 1;

  return {
    code,
    headline,
    questionTag: HEADING_VARIANTS[Math.min(headlineLevel, 5)],
    entries: config.entries ?? [],
    initiallyOpen: config.initiallyOpen ?? 'none',
    allowMultipleOpen: !!config.allowMultipleOpen,
  };
};
