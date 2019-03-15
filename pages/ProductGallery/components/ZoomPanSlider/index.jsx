import React, { PureComponent } from 'react';
import ZoomPanContainer from '@shopgate/pwa-common/components/ZoomPanContainer';
import { objectWithoutProps } from '@shopgate/pwa-common/helpers/data';
import { Swiper } from '@shopgate/pwa-common/components';

/**
 * A slider that is capable of zooming and panning its children.
 */
class ZoomPanSlider extends PureComponent {
  static propTypes = Swiper.propTypes;

  static defaultProps = Swiper.defaultProps;

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      zoom: 1,
    };
  }

  /**
   * @return {Object}
   */
  get sliderProps() {
    const props = objectWithoutProps(this.props, [
      'children',
    ]);

    // Disable swiping if currently zoomed in.
    props.disabled = this.state.zoom > 1;

    return props;
  }

  /**
   * The handler that processes zoom events from the components children.
   * @param {number} zoom The current zoom factor.
   */
  handleZoom = (zoom) => {
    this.setState({ zoom });
  };

  /**
   * @return {JSX}
   */
  render() {
    /* eslint-disable react/no-array-index-key */
    return (
      <Swiper {...this.sliderProps}>
        {React.Children.map(this.props.children, (child, index) => (
          <Swiper.Item key={`zoompanchild-${index}`}>
            <ZoomPanContainer onZoom={this.handleZoom}>
              {child}
            </ZoomPanContainer>
          </Swiper.Item>
        ))}
      </Swiper>
    );
    /* eslint-enable react/no-array-index-key */
  }
}

export default ZoomPanSlider;
