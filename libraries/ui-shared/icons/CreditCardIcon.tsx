import ThemeIcon, { type ThemeIconProps } from '@shopgate/engage/icons/components/ThemeIcon';

/**
 * The credit card icon component.
 */
const CreditCard = (props: Omit<ThemeIconProps, 'name'>) => (
  <ThemeIcon name="creditCard" {...props} />
);

export default CreditCard;
