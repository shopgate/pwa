import { render } from '@testing-library/react';
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react';
import usePressHandler from './usePressHandler';
import type { PressHandlers, UsePressHandlerOptions } from './usePressHandler';

// Renders the hook and returns the handlers it produced.
const renderHook = (onPress: () => void, options?: UsePressHandlerOptions) => {
  let handlers: PressHandlers | undefined;

  const Consumer = () => {
    handlers = usePressHandler(onPress, options);
    return null;
  };

  render(<Consumer />);

  return handlers as PressHandlers;
};

// Only `key` and `preventDefault` are ever read off the event.
const keyEvent = (key: string) => ({
  key,
  preventDefault: jest.fn(),
} as unknown as ReactKeyboardEvent);

describe('engage > core > hooks > events > usePressHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should invoke the callback on click', () => {
    const onPress = jest.fn();
    const event = {} as ReactMouseEvent;

    renderHook(onPress).onClick(event);

    expect(onPress).toHaveBeenCalledWith(event);
  });

  // Space activates by default, Enter does not.
  it.each([
    [' ', true],
    ['Spacebar', true],
    ['Enter', false],
  ])('should handle the %s key by default', (key, expected) => {
    const onPress = jest.fn();
    const event = keyEvent(key);

    renderHook(onPress).onKeyDown(event);

    expect(onPress).toHaveBeenCalledTimes(expected ? 1 : 0);
    expect(event.preventDefault).toHaveBeenCalledTimes(expected ? 1 : 0);
  });

  it('should handle Enter once it is opted into', () => {
    const onPress = jest.fn();
    const event = keyEvent('Enter');

    renderHook(onPress, { triggerOnEnter: true }).onKeyDown(event);

    expect(onPress).toHaveBeenCalledTimes(1);
    expect(event.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('should ignore Space once it is opted out of', () => {
    const onPress = jest.fn();
    const event = keyEvent(' ');

    renderHook(onPress, { triggerOnSpace: false }).onKeyDown(event);

    expect(onPress).not.toHaveBeenCalled();
    expect(event.preventDefault).not.toHaveBeenCalled();
  });

  it('should ignore any other key', () => {
    const onPress = jest.fn();

    renderHook(onPress, { triggerOnEnter: true }).onKeyDown(keyEvent('a'));

    expect(onPress).not.toHaveBeenCalled();
  });
});
