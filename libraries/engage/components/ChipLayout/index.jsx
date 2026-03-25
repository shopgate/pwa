import React, {
  useRef, useEffect, useMemo, useCallback, memo,
} from 'react';
import PropTypes from 'prop-types';
import debounce from 'lodash/debounce';
import { I18n } from '@shopgate/engage/components';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const { variables } = themeConfig;

/**
 * The height of one row.
 * @type {number}
 */
export const CHIP_ROW_HEIGHT = 34;

/**
 * The minimum width that a chip should have.
 * @type {number}
 */
export const CHIP_MINIMUM_WIDTH = 60;

const useStyles = makeStyles()((_theme, { maxRows }) => ({
  container: {
    position: 'relative',
    maxHeight: (CHIP_ROW_HEIGHT * maxRows) + 8,
    overflow: 'hidden',
    marginBottom: variables.gap.small,
  },
  layout: {
    display: 'flex',
    alignContent: 'flex-start',
    flexWrap: 'wrap',
    padding: '8px 5px',
    overflow: 'hidden',
  },
  moreButtonWrapper: {
    position: 'absolute',
    right: 0,
    bottom: 6,
    marginLeft: 'auto',
  },
  moreButton: {
    marginLeft: 'auto',
    outline: 0,
    padding: 9,
    fontSize: '0.8rem',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
  moreButtonInverted: {
    marginLeft: 'auto',
    outline: 0,
    padding: 9,
    fontSize: '0.8rem',
    fontWeight: 500,
    textTransform: 'uppercase',
  },
}));

/**
 * The ChipLayout component.
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const ChipLayout = ({
  children,
  handleMoreButton,
  invertMoreButton,
  maxRows,
  moreLabel,
  pathname,
}) => {
  const { classes, cx } = useStyles({ maxRows });
  const containerRef = useRef(null);
  const layoutRef = useRef(null);
  const moreButtonRef = useRef(null);

  const maxContentHeight = (CHIP_ROW_HEIGHT * maxRows) + 8;

  const processHiddenElements = useCallback(() => {
    const containerEl = containerRef.current;
    const layoutEl = layoutRef.current;
    const moreBtnEl = moreButtonRef.current;

    if (!containerEl || !layoutEl || !moreBtnEl) {
      return;
    }

    let lastVisibleElement = 0;
    const showMoreButton = containerEl.scrollHeight > containerEl.clientHeight;
    const containerHeight = containerEl.clientHeight;
    const chips = Array.from(layoutEl.children);

    moreBtnEl.style.display = showMoreButton ? 'block' : 'none';
    layoutEl.style.minHeight = showMoreButton ? `${maxContentHeight}px` : '0px';

    if (!showMoreButton) {
      return;
    }

    chips.forEach((child, index) => {
      const isVisible = (child.offsetTop + child.clientHeight) < containerHeight;
      child.setAttribute('style', `display: ${isVisible ? 'flex' : 'none'};`);

      if (isVisible) {
        lastVisibleElement = index;
      }
    });

    if (lastVisibleElement === (chips.length - 1)) {
      moreBtnEl.style.display = 'none';
      return;
    }

    chips.slice(0, lastVisibleElement + 1).reverse().every((element) => {
      const offsetBottom = element.offsetTop + element.clientHeight;
      if (moreBtnEl.offsetTop > offsetBottom) {
        return true;
      }

      const buttonSpaceRequired = moreBtnEl.clientWidth + variables.gap.big;
      const elementRight = containerEl.clientWidth -
        (element.offsetLeft + element.clientWidth);
      const spaceDiff = buttonSpaceRequired - elementRight;
      const remainingChipWidth = element.clientWidth - spaceDiff;

      if (remainingChipWidth > CHIP_MINIMUM_WIDTH) {
        element.setAttribute('style', `max-width: ${remainingChipWidth}px`);
        return false;
      }

      if (element.offsetTop !== chips[lastVisibleElement].offsetTop) {
        element.setAttribute('style', 'display: none');
        return false;
      }

      element.setAttribute('style', 'display: none');
      return true;
    });
  }, [maxContentHeight]);

  const processHiddenElementsDebounced = useMemo(
    () => debounce(processHiddenElements, 50),
    [processHiddenElements]
  );

  useEffect(() => {
    processHiddenElementsDebounced();
  }, [
    children,
    pathname,
    maxRows,
    invertMoreButton,
    moreLabel,
    handleMoreButton,
    processHiddenElementsDebounced,
  ]);

  useEffect(() => () => {
    processHiddenElementsDebounced.cancel();
  }, [processHiddenElementsDebounced]);

  const moreButtonClassName = invertMoreButton
    ? classes.moreButtonInverted
    : classes.moreButton;

  return (
    <div
      ref={containerRef}
      className={cx(classes.container, 'engage__chip-layout')}
    >
      <div ref={layoutRef} className={classes.layout}>
        {children}
      </div>

      <div
        ref={moreButtonRef}
        className={classes.moreButtonWrapper}
      >
        <RippleButton
          fill
          type="plain"
          className={moreButtonClassName}
          onClick={handleMoreButton}
        >
          <I18n.Text string={moreLabel} />
        </RippleButton>
      </div>
    </div>
  );
};

ChipLayout.propTypes = {
  children: PropTypes.node,
  handleMoreButton: PropTypes.func,
  invertMoreButton: PropTypes.bool,
  maxRows: PropTypes.number,
  moreLabel: PropTypes.string,
  pathname: PropTypes.string,
};

ChipLayout.defaultProps = {
  children: null,
  handleMoreButton: () => {},
  invertMoreButton: false,
  maxRows: 2,
  moreLabel: 'more',
  pathname: '',
};

export default memo(ChipLayout);
