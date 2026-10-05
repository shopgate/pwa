import React, { useEffect, useState } from 'react';
import Transition from 'react-transition-group/Transition';
import { makeStyles } from '@shopgate/engage/styles';
import transition from '../../Characteristics/transition';

const useStyles = makeStyles({ name: 'VariantCharacteristicHeading' })(theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    gap: 6,
    margin: '0 -8px 8px',
    padding: '4px 8px',
    borderRadius: theme.shape.borderRadius,
    outline: 0,
    transition: 'background 250ms ease-in, color 250ms ease-in',
  },
  label: {
    fontWeight: theme.typography.fontWeightMedium,
  },
  value: {
    color: 'inherit',
    opacity: 0.7,
  },
}));

export interface CharacteristicHeadingProps {
  /** Ref that is focused when the characteristic still needs a selection. */
  charRef: React.RefObject<HTMLElement>;
  /** ID of the heading, referenced by the value group. */
  id: string;
  label: string;
  /** Label of the selected value. */
  selectedLabel?: string | null;
  highlight: boolean;
}

/**
 * Heading of a characteristic that flashes when a selection is missing.
 * @param props The component props.
 * @returns The heading.
 */
const CharacteristicHeading = ({
  charRef, id, label, selectedLabel = null, highlight: highlightProp,
}: CharacteristicHeadingProps) => {
  const { classes, cx } = useStyles();
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(highlightProp);
  }, [highlightProp]);

  return (
    <Transition in={highlight} timeout={500} onEntered={() => setHighlight(false)}>
      {(state: keyof typeof transition) => (
        <div
          id={id}
          ref={charRef as React.RefObject<HTMLDivElement>}
          tabIndex={-1}
          className={cx(classes.root, 'engage__variant-selector__heading')}
          style={transition[state]}
        >
          <span id={`${id}-label`} className={cx(classes.label, 'engage__variant-selector__label')}>{label}</span>
          {selectedLabel && (
            <span className={cx(classes.value, 'engage__variant-selector__selected-value')}>
              {selectedLabel}
            </span>
          )}
        </div>
      )}
    </Transition>
  );
};

export default CharacteristicHeading;
