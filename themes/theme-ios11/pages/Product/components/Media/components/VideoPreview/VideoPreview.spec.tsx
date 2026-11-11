import { render, fireEvent, waitFor } from '@testing-library/react';
import VideoPreview from './VideoPreview';

describe('<VideoPreview />', () => {
  it('shows the medium YouTube thumbnail', () => {
    const { container } = render(<VideoPreview url="https://youtu.be/abc123" />);

    expect(container.querySelector('img')).toHaveAttribute('src', 'https://i.ytimg.com/vi/abc123/mqdefault.jpg');
  });

  it('falls back to the medium YouTube thumbnail when the large one is a placeholder', () => {
    const { container } = render(<VideoPreview url="https://www.youtube.com/watch?v=abc123" large />);
    const image = container.querySelector('img') as HTMLImageElement;

    expect(image).toHaveAttribute('src', 'https://i.ytimg.com/vi/abc123/maxresdefault.jpg');

    Object.defineProperty(image, 'naturalWidth', { value: 120 });
    fireEvent.load(image);

    expect(image).toHaveAttribute('src', 'https://i.ytimg.com/vi/abc123/mqdefault.jpg');
  });

  it('shows the first frame of a video file', () => {
    const { container } = render(<VideoPreview url="https://example.com/clip.mp4" />);

    expect(container.querySelector('video')).toHaveAttribute('src', 'https://example.com/clip.mp4#t=0.1');
  });

  it('shows the Vimeo thumbnail', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ thumbnail_url: 'https://i.vimeocdn.com/video/1.jpg' }),
    });
    const { container } = render(<VideoPreview url="https://vimeo.com/90509568" />);

    await waitFor(() => expect(container.querySelector('img')).toHaveAttribute('src', 'https://i.vimeocdn.com/video/1.jpg'));
  });

  it('shows only the play icon for other videos', () => {
    const { container } = render(<VideoPreview url="https://example.com/watch/1" />);

    expect(container.querySelector('img, video')).toBeNull();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });
});
