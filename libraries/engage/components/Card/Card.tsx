import React from 'react';
import { useTheme, makeStyles } from '@shopgate/engage/styles';
import type { ShadowSize } from '@shopgate/engage/styles';
import Paper from '../Paper';
import type { PaperVariant } from '../Paper';
import { useCardAppearance } from './useCardAppearance';

export type CardVariant = 'elevation' | 'outlined' | 'plain';

export interface CardProps {
  children?: React.ReactNode;
  className?: string;
  id?: string;
  /** Element or component to render as. @default 'div' */
  component?: React.ElementType;
  /** Overrides the merchant-configured style. `plain` renders no chrome at all. */
  variant?: CardVariant;
  /** Overrides the configured elevation. Ignored unless the resolved variant is `elevation`. */
  elevation?: number | ShadowSize;
  /** Removes the rounded corners. */
  square?: boolean;
  [key: `data-${string}`]: string;
}

type StyleParams = { variant: CardVariant };

const useStyles = makeStyles<StyleParams>({ name: 'Card' })((theme, { variant }) => ({
  root: {
    ...variant !== 'plain' && { overflow: 'hidden' },
  },
}));

/**
 * A themed content surface built on `Paper`, reading the merchant's card settings.
 */
const Card = ({
  className, children, id, variant, elevation, square, ...rest
}: CardProps) => {
  const theme = useTheme();
  const appearance = useCardAppearance();
  const resolvedVariant = variant ?? appearance.variant;
  const isPlain = resolvedVariant === 'plain';
  const paperVariant: PaperVariant = resolvedVariant === 'outlined' ? 'outlined' : 'elevation';
  const { classes, cx } = useStyles({ variant: resolvedVariant });

  return (
    <Paper
      id={id}
      variant={paperVariant}
      elevation={isPlain ? 0 : (elevation ?? appearance.elevation)}
      square={square || isPlain}
      borderRadius={theme.shape.cardsBorderRadius}
      background={isPlain ? 'transparent' : theme.components.cards.backgroundColor}
      border={theme.components.cards.border}
      shadowColor={theme.components.cards.shadowColor}
      className={cx(classes.root, 'engage__card', 'ui-shared__card', className)}
      {...rest}
    >
      {children}
    </Paper>
  );
};

export default Card;
