import React, { memo } from 'react';
import PropTypes from 'prop-types';
import noop from 'lodash/noop';
import { makeStyles } from '@shopgate/engage/styles';
import { PRODUCT_SWATCH } from '@shopgate/pwa-common-commerce/product/constants/Portals';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { SurroundPortals } from '../../../components';

const { colors } = themeConfig;

const useStyles = makeStyles()(() => ({
  swatch: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(12px, 1fr))',
    gridGap: '2px',
    marginBottom: '0.2rem',
  },
  item: {
    minWidth: '12px',
    width: '12px',
    maxWidth: '12px',
    minHeight: '12px',
    height: '12px',
    maxHeight: '12px',
    borderRadius: '50%',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: colors.shade4,
    backgroundSize: 'cover',
  },
  itemSelected: {
    borderColor: 'var(--color-secondary)',
  },
}));

/**
 * The swatch content component.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const SwatchContent = ({ swatch, classNames, onClick }) => {
  const { classes, cx } = useStyles();

  if (!swatch) {
    return null;
  }

  return (
    <SurroundPortals portalName={PRODUCT_SWATCH} portalProps={{ swatch }}>
      <ul className={cx(classes.swatch, classNames.swatch)}>
        {swatch.values.map(value => (
          <li
            aria-hidden
            key={value.id}
            onClick={() => onClick(value.id)}
            className={cx(classes.item, classNames.item, {
              [classes.itemSelected]: !!value.selected,
              [classNames.itemSelected]: !!value.selected,
            })}
            style={{
              ...value.swatch.color && { backgroundColor: value.swatch.color },
              ...value.swatch.imageUrl && { backgroundImage: `url(${value.swatch.imageUrl})` },
            }}
          />
        ))}
      </ul>
    </SurroundPortals>
  );
};

SwatchContent.propTypes = {
  classNames: PropTypes.shape({
    swatch: PropTypes.string,
    item: PropTypes.string,
    itemSelected: PropTypes.string,
  }),
  onClick: PropTypes.func,
  swatch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      swatch: PropTypes.shape({
        imageUrl: PropTypes.string,
        color: PropTypes.string,
      }).isRequired,
    })).isRequired,
  }),
};

SwatchContent.defaultProps = {
  classNames: {},
  swatch: null,
  onClick: noop,
};

export default memo(SwatchContent);
