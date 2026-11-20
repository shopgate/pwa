import { memo, useCallback } from 'react';
import noop from 'lodash/noop';
import { ButtonBase } from '@shopgate/engage/components/v2';
import { i18n } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import type { ValueCheckboxProps } from '../ValueCheckbox';

const useStyles = makeStyles()(theme => ({
  chip: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    minHeight: 44,
    padding: theme.spacing(0, 2.5),
    borderRadius: theme.shape.borderRadius,
    border: `1px solid ${theme.components.separatorLine.borderColor}`,
    background: theme.palette.background.surface,
    color: theme.palette.text.primary,
    fontSize: theme.typography.body1.fontSize,
    '&[aria-pressed="true"]': {
      background: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.text.primary}`,
      outlineOffset: 2,
    },
  },
  hits: {
    opacity: 0.6,
  },
}));

export type ValueChipProps = ValueCheckboxProps;

/**
 * A selectable filter value shown as a chip, used where the filter page has room to lay its values
 * out side by side.
 * @returns The rendered component.
 */
const ValueChip = ({
  id,
  label,
  hits,
  isActive = false,
  onToggle = noop,
}: ValueChipProps) => {
  const { classes, cx } = useStyles();

  const handleClick = useCallback(() => {
    onToggle(id);
  }, [id, onToggle]);

  return (
    <ButtonBase
      className={cx(classes.chip, 'engage__filter-page__selector__value')}
      aria-pressed={isActive}
      aria-label={hits == null ? label : i18n.text('filter.hits', {
        label,
        count: hits,
      })}
      data-test-id={id}
      onClick={handleClick}
    >
      <span>{label}</span>
      {hits != null && <span className={classes.hits} aria-hidden>{hits}</span>}
    </ButtonBase>
  );
};

export default memo(ValueChip);
