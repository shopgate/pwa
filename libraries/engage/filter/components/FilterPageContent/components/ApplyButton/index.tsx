import { memo } from 'react';
import { I18n, SurroundPortals } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
import { PORTAL_FILTER_APPLY_BUTTON } from '@shopgate/engage/filter/constants';
import { withWidgetSettings } from '@shopgate/engage/core';

export interface FilterApplyButtonProps {
  /**
   * Click handler for the button.
   */
  onClick: () => void;
  /**
   * Widget settings injected by `withWidgetSettings`, forwarded to the portal.
   */
  widgetSettings?: Record<string, unknown>;
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
 * The filter apply button, rendered as "View Results" in the filter button bar.
 * @returns The rendered component.
 */
const FilterApplyButton = ({
  disabled = false, onClick, className, widgetSettings,
}: FilterApplyButtonProps) => (
  <SurroundPortals
    portalName={PORTAL_FILTER_APPLY_BUTTON}
    portalProps={{
      disabled,
      onClick,
      widgetSettings,
    }}
  >
    <Button
      className={className}
      variant="contained"
      color="secondary"
      onClick={onClick}
      disabled={disabled}
      fullWidth
      size="small"
      testId="applyFilterButton"
    >
      <I18n.Text string="filter.view_results" />
    </Button>
  </SurroundPortals>
);

export default withWidgetSettings(memo(FilterApplyButton), '@shopgate/engage/components/AppBar');
