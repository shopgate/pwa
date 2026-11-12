import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The checked radio component.
 *
 * @link https://material.io/tools/icons/?search=rad&icon=radio_button_checked&style=baseline
 *
 */
const RadioChecked = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="radioChecked" {...props} />
);

export default RadioChecked;
