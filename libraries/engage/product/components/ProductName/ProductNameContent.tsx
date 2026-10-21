import React from 'react';
import { Ellipsis, ConditionalWrapper, PlainText } from '@shopgate/engage/components';

export interface ProductNameContentProps {
  name?: string | null;
  ellipsis?: boolean;
  rows?: number | null;
}

/**
 * The ProductNameContent component.
 * @returns The ProductNameContent component.
 */
const ProductNameContent = ({
  name = null,
  ellipsis = true,
  rows = null,
}: ProductNameContentProps) => (
  <ConditionalWrapper
    condition={ellipsis}
    wrapper={(children: React.ReactNode) => (
      <Ellipsis rows={rows !== null ? rows : undefined}>
        <span>
          {children}
        </span>
      </Ellipsis>
    )}
  >
    <span><PlainText text={name} /></span>
  </ConditionalWrapper>
);

export default ProductNameContent;
