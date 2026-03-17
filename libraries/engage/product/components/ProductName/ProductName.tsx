import React from 'react';
import { css } from 'glamor';
import classNames from 'classnames';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
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

const styles = {
  wrapper: css({
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      wordBreak: 'keep-all !important',
      hyphens: 'none !important',
    },
  }).toString(),
};

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
}: ProductNameProps) => (
  <ConditionalWrapper
    condition={!!portalName}
    wrapper={(children: React.ReactNode) => (
      <SurroundPortals portalName={portalName ?? ''} portalProps={portalProps}>
        {children}
      </SurroundPortals>
    )}
  >
    <div
      className={classNames(styles.wrapper, className, 'engage__product__product-name')}
      style={style}
      itemProp={itemProp}
      data-test-id={testId}
      aria-label={`${name}.`}
    >
      <ProductNameContent name={name} ellipsis={ellipsis} rows={rows} />
    </div>
  </ConditionalWrapper>
);

export default ProductName;
