import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { themeConfig } from '@shopgate/engage';
import { applyScrollContainer, svgToDataUrl } from '@shopgate/engage/core/helpers';
import { makeStyles } from '@shopgate/engage/styles';
import Icon from './components/Icon';
import connect from './connector';

const { svgImages = {}, variables } = themeConfig || {};
const { emptyCart = '' } = svgImages || {};

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
    height: '100%',
  },
  wrapperNoScrollContainer: {
    paddingTop: 100,
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: '1',
    flexShrink: '0',
  },
  icon: {
    width: variables.emptyPage.icon,
  },
  title: {
    textAlign: 'center',
    paddingTop: variables.emptyPage.titleTopGap,
  },
  buttonContainer: {
    flexGrow: '0',
    padding: theme.spacing(3, 2),
  },
  button: {
    width: '100%',
  },
}));

/**
 * The Cart Empty component.
 * @param {Object} props The component props.
 * @return {JSX.Element}
 */
const Empty = ({ goBackHistory }) => {
  const { classes, cx } = useStyles();
  const imageSRC = useMemo(() => svgToDataUrl(emptyCart), []);

  return (
    <div
      className={cx(
        classes.wrapper,
        !applyScrollContainer() && classes.wrapperNoScrollContainer
      )}
    >
      <Portal name={portals.CART_EMPTY_BEFORE} />
      <Portal name={portals.CART_EMPTY}>
        <div className={classes.container}>
          <div className={cx(classes.icon, 'empty-cart__image')}>
            {emptyCart ? <img src={imageSRC} alt="" /> : <Icon />}
          </div>
          <div className={classes.title} data-test-id="emptyCartPlaceHolderString">
            <I18n.Text string="cart.empty" />
          </div>
        </div>
      </Portal>
      <Portal name={portals.CART_EMPTY_AFTER} />
      <div className={classes.buttonContainer}>
        <RippleButton onClick={goBackHistory} className={classes.button} type="secondary">
          <I18n.Text string="cart.continue" />
        </RippleButton>
      </div>
    </div>
  );
};

Empty.propTypes = {
  goBackHistory: PropTypes.func.isRequired,
};

export default connect(Empty);
