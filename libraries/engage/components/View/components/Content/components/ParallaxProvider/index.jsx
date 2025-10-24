import React, {
  useEffect, useContext, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import {
  ParallaxProvider as ParallaxProviderCmp,
  useParallaxController,
} from 'react-scroll-parallax';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { useScrollContainer } from '@shopgate/engage/core/helpers';
import { useReduceMotion } from '@shopgate/engage/a11y/hooks';
import { ViewContext } from '@shopgate/engage/components/View';

/**
 * The ParallaxProviderInner component is used to update the parallax controller when the
 * scroll height changes.
 * @param {Object} props The component props.
 * @param {number} props.scrollHeight The height of the scroll container.
 * @param {Object} props.children The component children.
 * @returns {JSX.Element}
 */
const ParallaxProviderInner = ({
  scrollHeight,
  children,
}) => {
  const { update } = useParallaxController();

  useEffect(() => {
    update();
  }, [scrollHeight, update]);

  return children;
};

ParallaxProviderInner.propTypes = {
  children: PropTypes.node.isRequired,
};

/**
 * The ParallaxProvider component wraps the parallax context from the react-scroll-parallax package
 * around its children.
 * @param {Object} props The component props.
 * @param {boolean} props.viewVisible Whether the view is currently visible.
 * @param {Object} props.children The component children.
 * @returns {JSX.Element}
 */
const ParallaxProvider = ({
  viewVisible,
  children,
}) => {
  const reduceMotion = useReduceMotion();

  // Determine if a scroll container is used. If false PWA is in curbside website mode and window
  // is used as scroll container.
  const scrollContainerUsed = useScrollContainer();

  const { contentRef: viewRef } = useContext(ViewContext);

  // Mocked ref for the useElementSize hook to track the size of the scroll container.
  const mockedElementSizeRef = useMemo(() => ({
    current: scrollContainerUsed
      ? viewRef?.current?.querySelector('.engage__view__content__scrollable-content')
      : null,
  }), [scrollContainerUsed, viewRef]);

  const { height } = useElementSize(mockedElementSizeRef);

  return (
    <ParallaxProviderCmp
      // For now Parallax is disabled when no scroll container is used.
      isDisabled={!scrollContainerUsed || reduceMotion || !viewVisible}
      scrollContainer={scrollContainerUsed ? viewRef.current : null}
    >
      <ParallaxProviderInner scrollHeight={height}>
        {children}
      </ParallaxProviderInner>
    </ParallaxProviderCmp>
  );
};

ParallaxProvider.propTypes = {
  children: PropTypes.node.isRequired,
  viewVisible: PropTypes.bool.isRequired,
};

export default ParallaxProvider;
