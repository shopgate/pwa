import React, { useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@shopgate/pwa-common/components/Button';
import ResponsiveContainer from '@shopgate/engage/components/ResponsiveContainer';
import { hasNewServices } from '@shopgate/engage/core/helpers';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import CrossIcon from '../icons/CrossIcon';

/**
 * @param {boolean} hasRemoveButton Whether this chip has a remove button.
 * @param {Object} theme Theme with spacing().
 * @returns {Object} Shared layout fields for the chip root.
 */
const chipBase = (hasRemoveButton, theme) => ({
  display: 'flex',
  alignItems: 'center',
  borderRadius: 26,
  outline: 0,
  height: 26,
  paddingRight: theme.spacing(1),
  paddingLeft: hasRemoveButton ? theme.spacing(0.5) : theme.spacing(1),
  marginRight: 5,
  marginTop: 4,
  marginBottom: 4,
  minWidth: 0,
});

const useStyles = makeStyles()((theme, { removable, invert }) => ({
  chip: {
    ...chipBase(removable, theme),
    ...(hasNewServices()
      ? {
        backgroundColor: invert
          ? 'var(--color-primary)'
          : 'var(--color-primary-contrast)',
        color: invert
          ? 'var(--color-primary-contrast)'
          : 'var(--color-primary)',
      }
      : {
        backgroundColor: invert
          ? 'var(--color-secondary)'
          : 'var(--color-secondary-contrast)',
        color: invert
          ? 'var(--color-secondary-contrast)'
          : 'var(--color-secondary)',
        '--color-text-high-emphasis': invert
          ? 'var(--color-secondary-contrast)'
          : 'var(--color-secondary)',
      }),
  },
  removeButton: {
    flexShrink: 0,
    padding: 0,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      padding: '0 5px',
      fontSize: '1.125rem',
    },
  },
  name: {
    paddingLeft: (theme.spacing(0.5)),
    paddingRight: (theme.spacing(0.5)),
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 12,
    fontWeight: 500,
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    display: 'block',
    lineHeight: '1',
    color: 'inherit',
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      padding: '6px 8px 6px 0',
    },
  },
}));

/**
 * The chip component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Chip = (props) => {
  const {
    removable, children, id, onClick, onRemove, invert, removeLabel, editLabel,
  } = props;
  const { classes } = useStyles({
    removable,
    invert,
  });
  const ref = useRef(null);

  const handleRemove = useCallback(() => {
    onRemove(id);
  }, [onRemove, id]);

  useEffect(() => {
    ref.current.removeAttribute('style');
  });

  return (
    <div ref={ref} className={`ui-shared__chip ${classes.chip}`} data-test-id={id}>
      {removable && (
        <Button
          className={classes.removeButton}
          onClick={handleRemove}
          testId="removeFilter"
          aria-label={removeLabel}
        >
          <ResponsiveContainer breakpoint="<=xs" appAlways>
            <CrossIcon
              size={16}
            />
          </ResponsiveContainer>
          <ResponsiveContainer breakpoint=">xs" webOnly>
            <CrossIcon
              size={18}
            />
          </ResponsiveContainer>

        </Button>
      )}
      <Button className={classes.name} onClick={onClick} aria-label={editLabel}>
        {children}
      </Button>
    </div>
  );
};

Chip.propTypes = {
  children: PropTypes.node.isRequired,
  id: PropTypes.string.isRequired,
  editLabel: PropTypes.string,
  invert: PropTypes.bool,
  onClick: PropTypes.func,
  onRemove: PropTypes.func,
  removable: PropTypes.bool,
  removeLabel: PropTypes.string,
};

Chip.defaultProps = {
  invert: false,
  onClick: () => { },
  onRemove: () => { },
  removable: true,
  removeLabel: null,
  editLabel: null,
};

export default Chip;
