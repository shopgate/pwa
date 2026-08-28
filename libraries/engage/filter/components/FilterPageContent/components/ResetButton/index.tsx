import { memo } from 'react';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { PORTAL_FILTER_RESET_BUTTON } from '@shopgate/engage/filter/constants';

export interface FilterResetButtonProps {
  /**
   * Click handler for the button.
   */
  onClick: () => void;
  /**
   * Class name for the button.
   */
  className?: string;
  /**
   * Whether the button is disabled.
   */
  disabled?: boolean;
}

/**
 * The filter reset button, rendered as "Clear all" in the filter button bar.
 * @returns The rendered component.
 */
const FilterResetButton = ({ disabled = false, onClick, className }: FilterResetButtonProps) => (
  <SurroundPortals
    portalName={PORTAL_FILTER_RESET_BUTTON}
    portalProps={{
      disabled,
      onClick,
    }}
  >
    <Button
      className={className}
      variant="outlined"
      onClick={onClick}
      disabled={disabled}
      fullWidth
      size="small"
      testId="clearAllButton"
    >
      <I18n.Text string="filter.clear_all" />
    </Button>
  </SurroundPortals>
);

export default memo(FilterResetButton);
