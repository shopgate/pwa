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
  name?: string | null;
  className?: string | null;
  testId?: string | null;
  ellipsis?: boolean;
  portalName?: string | null;
  portalProps?: Record<string, unknown> | null;
  itemProp?: string | null;
  rows?: number | null;
  style?: React.CSSProperties | null;
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
 * @returns The ProductName component.
 */
const ProductName = ({
  name = null,
  className = null,
  testId = null,
  ellipsis = true,
  portalName = null,
  portalProps = null,
  itemProp = null,
  rows = null,
  style = null,
}: ProductNameProps) => (
  <ConditionalWrapper
    condition={!!portalName}
    wrapper={(children: React.ReactNode) => (
      <SurroundPortals portalName={portalName!} portalProps={portalProps ?? undefined}>
        {children}
      </SurroundPortals>
    )}
  >
    <div
      className={classNames(styles.wrapper, className, 'engage__product__product-name')}
      style={style ?? undefined}
      itemProp={itemProp ?? undefined}
      data-test-id={testId ?? undefined}
      aria-label={`${name}.`}
    >
      <ProductNameContent name={name} ellipsis={ellipsis} rows={rows} />
    </div>
  </ConditionalWrapper>
);

export default ProductName;
