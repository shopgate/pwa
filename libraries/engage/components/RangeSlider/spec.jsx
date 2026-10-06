import {
  render, fireEvent, createEvent, act,
} from '@testing-library/react';
import RangeSlider from './index';

/**
 * Renders a slider which is 100px wide, so that with a range of 0 to 100 one pixel is one unit.
 * @param {Object} props The component props.
 * @returns {Object} The slider element, its handles and the onChange mock.
 */
const renderSlider = (props) => {
  const onChange = jest.fn();
  const { container } = render(<RangeSlider min={0} max={100} onChange={onChange} {...props} />);
  const slider = container.querySelector('.engage__range-slider');
  const [lowerHandle, upperHandle] = container.querySelectorAll('.engage__range-slider__handle');

  jest.spyOn(slider.firstChild, 'getBoundingClientRect').mockReturnValue({
    width: 100,
    left: 0,
  });

  return {
    slider,
    lowerHandle,
    upperHandle,
    onChange,
  };
};

/**
 * Drags a handle to a horizontal position.
 * @param {HTMLElement} handle The handle to drag.
 * @param {number} pageX The position where the handle is dropped.
 */
const drag = async (handle, pageX) => {
  fireEvent.touchStart(handle, { touches: [{ pageX: 0 }] });

  await act(async () => {
    fireEvent.touchMove(document, { touches: [{ pageX }] });
  });

  fireEvent.touchEnd(document);
};

describe('<RangeSlider />', () => {
  it('renders two handles', () => {
    const { container } = render(<RangeSlider />);

    expect(container.querySelectorAll('.engage__range-slider__handle')).toHaveLength(2);
  });

  it('emits the new range when the upper handle is dragged', async () => {
    const { upperHandle, onChange } = renderSlider({ value: [50, 75] });

    await drag(upperHandle, 90);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([50, 90]);
  });

  it('emits the new range when the lower handle is dragged', async () => {
    const { lowerHandle, onChange } = renderSlider({ value: [50, 75] });

    await drag(lowerHandle, 20);

    expect(onChange).toHaveBeenCalledWith([20, 75]);
  });

  it('swaps the handles when one is dragged past the other', async () => {
    const { upperHandle, onChange } = renderSlider({ value: [50, 75] });

    await drag(upperHandle, 30);

    expect(onChange).toHaveBeenCalledWith([30, 50]);
  });

  it('keeps the range within the boundaries', async () => {
    const { upperHandle, onChange } = renderSlider({ value: [50, 75] });

    await drag(upperHandle, 150);

    expect(onChange).toHaveBeenCalledWith([50, 100]);
  });

  it('applies the exponential easing', async () => {
    const { upperHandle, onChange } = renderSlider({
      value: [0, 100],
      easing: 'exponential',
      factor: 2,
    });

    await drag(upperHandle, 50);

    expect(onChange).toHaveBeenCalledWith([0, 25]);
  });

  it('stops emitting when the handle is released', async () => {
    const { upperHandle, onChange } = renderSlider({ value: [50, 75] });

    await drag(upperHandle, 90);
    await act(async () => {
      fireEvent.touchMove(document, { touches: [{ pageX: 60 }] });
    });

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('moves the closest handle when the outer range is pressed', async () => {
    const { slider, onChange } = renderSlider({
      min: -100,
      max: 100,
      value: [0, 0],
    });

    const mouseDown = createEvent.mouseDown(slider);
    Object.defineProperty(mouseDown, 'pageX', { value: 10 });

    await act(async () => {
      fireEvent(slider, mouseDown);
    });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith([-80, 0]);
  });
});
