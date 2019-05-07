import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'intersection-observer';

const thresholds = [0, 0.25, 0.5, 0.75, 1.0];

/**
 * The IntersectionVisibility component.
 * @example
 *    <IntersectionVisibility>
 *       {({ visible, ratio }) => (
           <Video autoPlay={visible} />}
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
    this.io.observe(this.node);
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
    this.node = ref;
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
    return (
      <div ref={this.setRef}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

export default IntersectionVisibility;
