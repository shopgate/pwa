import { Component } from 'react';
import PropTypes from 'prop-types';
import 'intersection-observer';

/**
 * The IntersectionVisibility component.
 * @example
 *    <IntersectionVisibility>
 *       {({ visible, ratio, setRef }) => (
           <Video autoPlay={visible && ratio > 0.8} ref={setRef} />}
        )}
 *     </IntersectionVisibility>
 */
class IntersectionVisibility extends Component {
  /**
   * Calculate threshold by number of steps
   * Ex: 5 steps will be [0.20, 0.40, 0.60, 0.80, 1.00]
   * @param {number} steps .
   * @returns {number[]}
   */
  static buildThresholdList = steps => (
    Array(steps).fill(0).map((v, i) => (i + 1) / steps)
  )

  static propTypes = {
    children: PropTypes.func.isRequired,
    thresholds: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    thresholds: IntersectionVisibility.buildThresholdList(10),
  }

  state = {
    visible: true,
    ratio: 1,
    entries: null,
  };

  /**
   * Start the observer when the component is mounted
   */
  componentDidMount() {
    this.io = new IntersectionObserver(this.handleIntersectionEvent, {
      threshold: this.props.thresholds,
    });
    if (this.node) {
      this.io.observe(this.node);
    }
  }

  /**
   * @inheritDoc
   */
  componentWillUnmount() {
    if (this.io) {
      this.io.disconnect();
    }
  }

  /**
   * @param {Object} ref ref
   */
  setRef = (ref) => {
    if (!ref) {
      return;
    }
    this.node = ref;
    if (this.io) {
      this.io.observe(this.node);
    }
  }

  /**
   * @param {IntersectionObserverEntry[]} entries first entry
   */
  handleIntersectionEvent = (entries) => {
    const [{ intersectionRatio }] = entries;
    this.setState({
      visible: intersectionRatio > 0,
      ratio: intersectionRatio,
      entries,
    });
  };

  /**
   * @returns {JSX.Element}
   */
  render() {
    return this.props.children({
      ...this.state,
      setRef: this.setRef,
    });
  }
}

export default IntersectionVisibility;
