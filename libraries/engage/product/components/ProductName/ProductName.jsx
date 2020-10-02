import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import classNames from 'classnames';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import {
  ConditionalWrapper,
  SurroundPortals,
} from '@shopgate/engage/components';
import ProductNameContent from './ProductNameContent';

const styles = {
  wrapper: css({
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      wordBreak: 'keep-all !important',
      hyphens: 'none !important',
    },
  }).toString(),
};

/**
 * @param {Object} props The component props
 * @returns {JSX}
 */
const ProductName = ({
  name, className, testId, ellipsis, portalName, portalProps, itemProp, rows, style,
}) => (
  <ConditionalWrapper
    condition={!!portalName}
    wrapper={children =>
      <SurroundPortals portalName={portalName} portalProps={portalProps}>
        {children}
      </SurroundPortals>
    }
  >
    <div
      className={classNames(styles.wrapper, className)}
      style={style}
      itemProp={itemProp}
      data-test-id={testId}
      aria-label={`${name}.`}
    >
      <ProductNameContent name={name} ellipsis={ellipsis} rows={rows} />
    </div>
  </ConditionalWrapper>
);

ProductName.propTypes = {
  className: PropTypes.string,
  ellipsis: PropTypes.bool,
  itemProp: PropTypes.string,
  name: PropTypes.string,
  portalName: PropTypes.string,
  portalProps: PropTypes.shape(),
  rows: PropTypes.number,
  style: PropTypes.shape(),
  testId: PropTypes.string,
};

ProductName.defaultProps = {
  name: null,
  className: null,
  ellipsis: true,
  itemProp: null,
  portalName: null,
  portalProps: null,
  style: null,
  rows: null,
  testId: null,
};

export default ProductName;
