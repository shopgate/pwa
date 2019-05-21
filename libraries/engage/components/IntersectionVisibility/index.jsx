import { Component } from 'react';
import PropTypes from 'prop-types';
import 'intersection-observer';

const thresholds = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

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
  static propTypes = {
    children: PropTypes.func.isRequired,
    thresholds: PropTypes.arrayOf(PropTypes.number),
  };

  static defaultProps = {
    thresholds,
  }

  state = {
    visible: true,
    ratio: 1,
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
   * @param {Object} intersectionRatio first entry
   */
  handleIntersectionEvent = ([{ intersectionRatio }]) => {
    this.setState({
      visible: intersectionRatio > 0,
      ratio: intersectionRatio,
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
