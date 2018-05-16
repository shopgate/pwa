import React, { Component } from 'react';
import ZoomPanContainer from '@shopgate/pwa-common/components/ZoomPanContainer';
import { objectWithoutProps } from '@shopgate/pwa-common/helpers/data';
import ImageSlider from '@shopgate/pwa-ui-shared/ImageSlider';

/**
 * A slider that is capable of zooming and panning its children.
 */
class ZoomPanSlider extends Component {
  static propTypes = {
    ...ImageSlider.propTypes,
  };

  static defaultProps = {
    ...ImageSlider.defaultProps,
  };

  /**
   * Creates a new zoom pan slider component.
   * @param {Object} props The component properties.
   */
  constructor(props) {
    super(props);

    this.state = {
      zoom: 1,
    };
  }

  /**
   * The handler that processes zoom events from the components children.
   * @param {number} zoom The current zoom factor.
   */
  handleZoom = (zoom) => {
    // Update the state.
    this.setState({ zoom });
  };

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    // Wrap each child into a zoom pan container.
    const sliderItems = React.Children.map(this.props.children, (child, index) => (
      <ZoomPanContainer key={index} onZoom={this.handleZoom}>
        {child}
      </ZoomPanContainer>
    ));

    const props = objectWithoutProps(this.props, [
      'children',
    ]);

    // Disable swiping if currently zoomed in.
    props.disabled = this.state.zoom > 1;

    return (
      <ImageSlider {...props}>{sliderItems}</ImageSlider>
    );
  }
}

export default ZoomPanSlider;
