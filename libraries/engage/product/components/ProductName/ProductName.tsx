import React from 'react';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import {
  ConditionalWrapper,
  SurroundPortals,
} from '@shopgate/engage/components';
import ProductNameContent from './ProductNameContent';

export interface ProductNameProps {
  name: string;
  className?: string;
  testId?: string;
  ellipsis?: boolean;
  portalName?: string;
  portalProps?: Record<string, unknown>;
  itemProp?: string;
  rows?: number;
  style?: React.CSSProperties;
}

const useStyles = makeStyles()({
  wrapper: {
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      wordBreak: 'keep-all',
      hyphens: 'none',
    },
  },
});

/**
 * The ProductName component.
 */
const ProductName = ({
  name,
  className,
  testId,
  ellipsis,
  portalName,
  portalProps,
  itemProp,
  rows,
  style,
}: ProductNameProps) => {
  const { classes, cx } = useStyles();

  return (
    <ConditionalWrapper
      condition={!!portalName}
      wrapper={(children: React.ReactNode) => (
        <SurroundPortals portalName={portalName ?? ''} portalProps={portalProps}>
          {children}
        </SurroundPortals>
      )}
    >
      <div
        className={cx(classes.wrapper, className, 'engage__product__product-name')}
        style={style}
        itemProp={itemProp}
        data-test-id={testId}
        aria-label={`${name}.`}
      >
        <ProductNameContent name={name} ellipsis={ellipsis} rows={rows} />
      </div>
    </ConditionalWrapper>
  );
};

export default ProductName;
