import type { ReactElement } from 'react';
import {
  render, fireEvent, waitFor, act,
} from '@testing-library/react';
import VideoPreview from './VideoPreview';

/**
 * Renders a preview and lets it come near the viewport.
 * @param ui The preview.
 * @returns The render result.
 */
const renderNear = (ui: ReactElement) => {
  const result = render(ui);
  const observer = jest.mocked(IntersectionObserver).mock.results.at(-1)?.value;

  act(() => observer.trigger([{ isIntersecting: true }]));

  return result;
};

describe('<VideoPreview />', () => {
  it('loads no preview image before it comes near the viewport', () => {
    const { container } = render(<VideoPreview url="https://youtu.be/abc123" />);

    expect(container.querySelector('img')).toBeNull();
  });

  it('shows the medium YouTube thumbnail', async () => {
    const { container } = renderNear(<VideoPreview url="https://youtu.be/abc123" />);

    await waitFor(() => expect(container.querySelector('img')).toHaveAttribute('src', 'https://i.ytimg.com/vi/abc123/mqdefault.jpg'));
  });

  it('falls back to the medium YouTube thumbnail when the large one is a placeholder', async () => {
    const { container } = renderNear(<VideoPreview url="https://www.youtube.com/watch?v=abc123" large />);

    await waitFor(() => expect(container.querySelector('img')).toHaveAttribute('src', 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg'));
    const image = container.querySelector('img') as HTMLImageElement;

    Object.defineProperty(image, 'naturalWidth', { value: 120 });
    fireEvent.load(image);

    expect(image).toHaveAttribute('src', 'https://i.ytimg.com/vi/abc123/mqdefault.jpg');
  });

  it('shows the first frame of a video file', async () => {
    const { container } = renderNear(<VideoPreview url="https://example.com/clip.mp4" />);

    await waitFor(() => expect(container.querySelector('video')).toHaveAttribute('src', 'https://example.com/clip.mp4#t=0.1'));
  });

  it('looks up the Vimeo thumbnail once for every preview of the video', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ thumbnail_url: 'https://i.vimeocdn.com/video/1.jpg' }),
    });
    const first = renderNear(<VideoPreview url="https://vimeo.com/90509568" />);
    const second = renderNear(<VideoPreview url="https://vimeo.com/90509568" />);

    await waitFor(() => expect(first.container.querySelector('img')).toHaveAttribute('src', 'https://i.vimeocdn.com/video/1.jpg'));
    await waitFor(() => expect(second.container.querySelector('img')).toHaveAttribute('src', 'https://i.vimeocdn.com/video/1.jpg'));
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it('shows only the play icon for other videos', async () => {
    const { container } = renderNear(<VideoPreview url="https://example.com/watch/1" />);

    await act(() => Promise.resolve());
    expect(container.querySelector('img, video')).toBeNull();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
