import { useEffect } from 'react';
import { useParallaxController } from 'react-scroll-parallax';
/**
 * ParallaxUpdate component to update the parallax controller / context
 * when the container height changes e.g.
 * async content is loaded or content is added/removed.
 * @param {Object} props The component props.
 * @param {number} props.scrollHeight The scroll height of the container.
 * @returns {null}
 */
const ParallaxUpdate = ({ scrollHeight }) => {
  const parallaxController = useParallaxController();

  useEffect(() => {
    parallaxController.update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollHeight]);
  return null;
};

export default ParallaxUpdate;
