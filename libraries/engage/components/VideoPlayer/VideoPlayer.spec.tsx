import { render, act } from '@testing-library/react';
import { UIEvents } from '@shopgate/engage/core/events';
import { UI_VISIBILITY_CHANGE } from '@shopgate/pwa-common/constants/ui';
import VideoPlayer from './index';

interface PlayerProps {
  playing: boolean;
  onReady: () => void;
  onPause: () => void;
}

const mockPlayer = jest.fn((_props: PlayerProps) => null);

jest.mock('react-player', () => (props: PlayerProps) => mockPlayer(props));

const lastProps = () => mockPlayer.mock.calls[mockPlayer.mock.calls.length - 1][0];

describe('<VideoPlayer />', () => {
  beforeEach(() => {
    mockPlayer.mockClear();
  });

  it('starts playing once the player is ready', () => {
    render(<VideoPlayer url="https://example.com/a.mp4" playing />);

    expect(lastProps().playing).toBe(false);

    act(() => lastProps().onReady());

    expect(lastProps().playing).toBe(true);
  });

  it('keeps a video paused by the user paused', () => {
    const { rerender } = render(<VideoPlayer url="https://example.com/a.mp4" playing />);

    act(() => lastProps().onReady());
    act(() => lastProps().onPause());
    rerender(<VideoPlayer url="https://example.com/a.mp4" playing={false} />);
    rerender(<VideoPlayer url="https://example.com/a.mp4" playing />);

    expect(lastProps().playing).toBe(false);
  });

  it('pauses when the app goes to the background', () => {
    render(<VideoPlayer url="https://example.com/a.mp4" playing />);

    act(() => lastProps().onReady());
    act(() => {
      UIEvents.emit(UI_VISIBILITY_CHANGE);
    });

    expect(lastProps().playing).toBe(false);
  });
});
