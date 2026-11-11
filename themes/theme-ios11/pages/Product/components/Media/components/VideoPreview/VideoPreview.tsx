import { useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@shopgate/engage/styles';

const VIDEO_FILE_EXTENSIONS = ['.mp4', '.m4v', '.mov', '.webm', '.ogv'];
const YOUTUBE_PLACEHOLDER_WIDTH = 120;

const useStyles = makeStyles()(theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    background: theme.palette.common.black,
  },
  poster: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
  },
  wholeFrame: {
    objectFit: 'contain',
  },
  play: {
    position: 'relative',
    width: '30%',
    minWidth: 24,
    maxWidth: 64,
    aspectRatio: '1',
    borderRadius: '50%',
    background: 'rgba(0, 0, 0, 0.5)',
    fill: theme.palette.common.white,
  },
}));

/**
 * Finds the id of a YouTube video url.
 * @param url The video url.
 * @returns The id, or null for other urls.
 */
const getYouTubeId = (url: URL) => {
  if (url.hostname === 'youtu.be') {
    return url.pathname.slice(1) || null;
  }

  if (!url.hostname.endsWith('youtube.com')) {
    return null;
  }

  const [, kind, id] = url.pathname.split('/');

  return url.searchParams.get('v') || (['embed', 'shorts', 'live'].includes(kind) ? id : null);
};

/**
 * Parses a url without throwing.
 * @param url The url.
 * @returns The parsed url, or null when it is invalid.
 */
const parseUrl = (url: string) => {
  try {
    return new URL(url);
  } catch {
    return null;
  }
};

interface YouTubePosterProps {
  id: string;
  highResolution: boolean;
  className: string;
}

/**
 * The thumbnail of a YouTube video. Not every video has a high resolution one, YouTube answers
 * those with a small placeholder, so it falls back to the medium one that always exists.
 * @returns The thumbnail.
 */
const YouTubePoster = ({ id, highResolution, className }: YouTubePosterProps) => {
  const [fallback, setFallback] = useState(!highResolution);

  return (
    <img
      src={`https://i.ytimg.com/vi/${id}/${fallback ? 'mqdefault' : 'maxresdefault'}.jpg`}
      alt=""
      loading="lazy"
      className={className}
      onLoad={(event) => {
        if (event.currentTarget.naturalWidth <= YOUTUBE_PLACEHOLDER_WIDTH) {
          setFallback(true);
        }
      }}
      onError={() => setFallback(true)}
    />
  );
};

interface VimeoPosterProps {
  url: string;
  highResolution: boolean;
  className: string;
}

/**
 * The thumbnail of a Vimeo video, looked up through the oEmbed api of Vimeo.
 * @returns The thumbnail, or nothing until it is known.
 */
const VimeoPoster = ({ url, highResolution, className }: VimeoPosterProps) => {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      url,
      width: highResolution ? '1280' : '320',
    });

    fetch(`https://vimeo.com/api/oembed.json?${params}`, { signal: controller.signal })
      .then(response => (response.ok ? response.json() : null))
      .then(data => setSrc(data?.thumbnail_url ?? null))
      .catch(() => setSrc(null));

    return () => controller.abort();
  }, [highResolution, url]);

  return src ? <img src={src} alt="" loading="lazy" className={className} /> : null;
};

export interface VideoPreviewProps {
  /** The url of the video. */
  url: string;
  /** Shows the whole frame in a sharper still, for previews larger than a thumbnail. */
  large?: boolean;
}

/**
 * A still of a video with a play icon. YouTube and Vimeo videos show their thumbnail and video
 * files their first frame, other videos only the icon.
 * @returns The preview.
 */
const VideoPreview = ({ url, large = false }: VideoPreviewProps) => {
  const { classes, cx } = useStyles();
  const posterClassName = cx(classes.poster, large && classes.wholeFrame);

  const poster = useMemo(() => {
    const parsed = parseUrl(url);

    if (!parsed) {
      return null;
    }

    const youTubeId = getYouTubeId(parsed);

    if (youTubeId) {
      return (
        <YouTubePoster
          key={youTubeId}
          id={youTubeId}
          highResolution={large}
          className={posterClassName}
        />
      );
    }

    if (parsed.hostname.endsWith('vimeo.com')) {
      return <VimeoPoster url={url} highResolution={large} className={posterClassName} />;
    }

    const path = parsed.pathname.toLowerCase();

    if (VIDEO_FILE_EXTENSIONS.some(extension => path.endsWith(extension))) {
      return (
        <video
          src={`${url}#t=0.1`}
          preload="metadata"
          muted
          playsInline
          className={posterClassName}
        />
      );
    }

    return null;
  }, [large, posterClassName, url]);

  return (
    <div className={classes.root}>
      {poster}
      <svg className={classes.play} viewBox="-6 -6 36 36" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
};

export default VideoPreview;
