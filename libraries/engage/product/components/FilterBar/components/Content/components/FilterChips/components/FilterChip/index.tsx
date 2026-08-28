import { useCallback } from 'react';
import type { ComponentType, ReactNode } from 'react';
import noop from 'lodash/noop';
import Button from '@shopgate/pwa-common/components/Button';
import { CrossIcon } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

interface StyleParams {
  removable: boolean;
}

const useStyles = makeStyles<StyleParams>()((theme, { removable }) => ({
  chip: {
    display: 'flex',
    alignItems: 'center',
    minWidth: 0,
    maxWidth: '72%',
    height: 30,
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.components.border.medium}`,
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    paddingLeft: theme.spacing(1.25),
    paddingRight: removable ? theme.spacing(0.75) : theme.spacing(1.25),
    outline: 0,
  },
  name: {
    ...theme.typography.body2,
    fontWeight: theme.typography.fontWeightMedium,
    display: 'block',
    color: 'inherit',
    padding: 0,
    paddingRight: removable ? theme.spacing(0.5) : 0,
    maxWidth: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  removeButton: {
    display: 'flex',
    flexShrink: 0,
    padding: 0,
    color: theme.palette.secondary.main,
  },
}));

/**
 * `Button` is untyped JavaScript whose optional props read as required from TypeScript.
 */
const ChipButton = Button as unknown as ComponentType<{
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  testId?: string;
  'aria-label'?: string;
}>;

export interface FilterChipProps {
  /**
   * Id of the filter value. Used as the test id and passed back to `onRemove`.
   */
  id: string;
  /**
   * The chip label.
   */
  children: ReactNode;
  /**
   * Whether the chip renders a remove button (default `true`).
   */
  removable?: boolean;
  /**
   * Aria label for the label button, which opens the filter page.
   */
  editLabel?: string;
  /**
   * Aria label for the remove button.
   */
  removeLabel?: string;
  /**
   * Invoked when the chip label is clicked.
   */
  onClick?: () => void;
  /**
   * Invoked with the chip id when the remove button is clicked.
   */
  onRemove?: (id: string) => void;
}

/**
 * A removable chip representing one active filter within the filter bar.
 * @returns The rendered component.
 */
const FilterChip = ({
  id,
  children,
  removable = true,
  editLabel,
  removeLabel,
  onClick = noop,
  onRemove = noop,
}: FilterChipProps) => {
  const { classes } = useStyles({ removable });

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [onRemove, id]);

  return (
    <div className={classes.chip} data-test-id={id}>
      <ChipButton className={classes.name} onClick={onClick} aria-label={editLabel}>
        {children}
      </ChipButton>
      {removable && (
        <ChipButton
          className={classes.removeButton}
          onClick={handleRemove}
          testId="removeFilter"
          aria-label={removeLabel}
        >
          <CrossIcon size={16} />
        </ChipButton>
      )}
    </div>
  );
};

export default FilterChip;
