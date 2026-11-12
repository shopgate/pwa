import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The calendar icon component.
 */
const Calendar = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="calendar" {...props} />
);

export default Calendar;
