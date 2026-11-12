import { useEffect, useRef, useState } from 'react';
import { makeStyles } from '@shopgate/engage/styles';

const VIDEO_FILE_EXTENSIONS = ['.mp4', '.m4v', '.mov', '.webm', '.ogv'];
const YOUTUBE_PLACEHOLDER_WIDTH = 120;
const NEAR_VIEWPORT_MARGIN = '100px';

const vimeoThumbnails = new Map<string, Promise<string | null>>();

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
 * Tells whether a url is on a domain or one of its subdomains.
 * @param url The url.
 * @param domain The domain.
 * @returns Whether the url is on the domain.
 */
const isOnDomain = (url: URL, domain: string) => (
  url.hostname === domain || url.hostname.endsWith(`.${domain}`)
);

/**
 * Finds the id of a YouTube video url.
 * @param url The video url.
 * @returns The id, or null for other urls.
 */
const getYouTubeId = (url: URL) => {
  if (url.hostname === 'youtu.be') {
    return url.pathname.slice(1) || null;
  }

  if (!isOnDomain(url, 'youtube.com')) {
    return null;
  }

  const [, kind, id] = url.pathname.split('/');

  return url.searchParams.get('v') || (['embed', 'shorts', 'live'].includes(kind) ? id : null);
};

/**
 * Looks up the thumbnail of a Vimeo video through the oEmbed api of Vimeo, once per video and size.
 * @param url The video url.
 * @param width The width of the thumbnail.
 * @returns The thumbnail url, or null when there is none.
 */
const getVimeoThumbnail = (url: string, width: number) => {
  const params = new URLSearchParams({
    url,
    width: `${width}`,
  });
  const key = params.toString();

  if (!vimeoThumbnails.has(key)) {
    vimeoThumbnails.set(key, fetch(`https://vimeo.com/api/oembed.json?${key}`)
      .then(response => (response.ok ? response.json() : null))
      .then(data => data?.thumbnail_url ?? null)
      .catch(() => {
        vimeoThumbnails.delete(key);
        return null;
      }));
  }

  return vimeoThumbnails.get(key) as Promise<string | null>;
};

/** The image or first frame that stands in for a video. */
interface Preview {
  /** An image, or the first frame of a video file. */
  type: 'image' | 'video';
  src: string;
  /** Shown instead when the image turns out to be a placeholder. */
  fallback?: string;
}

/**
 * Finds the preview of a video: the thumbnail of a YouTube or Vimeo video, or the first frame of a
 * video file. Not every YouTube video has a large thumbnail, so the medium one is the fallback.
 * @param url The video url.
 * @param large Whether the preview is larger than a thumbnail.
 * @returns The preview, or null for other videos.
 */
const getPreview = async (url: string, large: boolean): Promise<Preview | null> => {
  const parsed = new URL(url);
  const youTubeId = getYouTubeId(parsed);

  if (youTubeId) {
    const medium = `https://i.ytimg.com/vi/${youTubeId}/mqdefault.jpg`;

    return large ? {
      type: 'image',
      src: `https://i.ytimg.com/vi/${youTubeId}/maxresdefault.jpg`,
      fallback: medium,
    } : {
      type: 'image',
      src: medium,
    };
  }

  if (isOnDomain(parsed, 'vimeo.com')) {
    const src = await getVimeoThumbnail(url, large ? 1280 : 320);
    return src ? {
      type: 'image',
      src,
    } : null;
  }

  const path = parsed.pathname.toLowerCase();

  if (VIDEO_FILE_EXTENSIONS.some(extension => path.endsWith(extension))) {
    return {
      type: 'video',
      src: `${url}#t=0.1`,
    };
  }

  return null;
};

/**
 * Tells once an element has come near the viewport, so it can load what it shows.
 * @returns The ref for the element and whether it is near.
 */
const useNearViewport = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (near || !element) {
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setNear(true);
      }
    }, { rootMargin: NEAR_VIEWPORT_MARGIN });

    observer.observe(element);

    return () => observer.disconnect();
  }, [near]);

  return {
    ref,
    near,
  };
};

export interface VideoPreviewProps {
  /** The url of the video. */
  url: string;
  /** Shows the whole frame in a sharper image, for previews larger than a thumbnail. */
  large?: boolean;
}

/**
 * A preview of a video with a play icon. YouTube and Vimeo videos show their thumbnail and video
 * files their first frame, other videos only the icon. The image loads once the preview comes near
 * the viewport.
 * @returns The preview.
 */
const VideoPreview = ({ url, large = false }: VideoPreviewProps) => {
  const { classes, cx } = useStyles();
  const { ref, near } = useNearViewport();
  const [preview, setPreview] = useState<Preview | null>(null);
  const className = cx(classes.poster, large && classes.wholeFrame);

  useEffect(() => {
    if (!near) {
      return undefined;
    }

    let active = true;

    getPreview(url, large)
      .catch(() => null)
      .then((result) => {
        if (active) {
          setPreview(result);
        }
      });

    return () => {
      active = false;
    };
  }, [large, near, url]);

  const showFallback = () => {
    if (preview?.fallback) {
      setPreview({
        type: 'image',
        src: preview.fallback,
      });
    }
  };

  return (
    <div ref={ref} className={classes.root}>
      {preview?.type === 'image' && (
        <img
          src={preview.src}
          alt=""
          className={className}
          onLoad={(event) => {
            if (event.currentTarget.naturalWidth <= YOUTUBE_PLACEHOLDER_WIDTH) {
              showFallback();
            }
          }}
          onError={showFallback}
        />
      )}
      {preview?.type === 'video' && (
        <video src={preview.src} preload="metadata" muted playsInline className={className} />
      )}
      <svg className={classes.play} viewBox="-6 -6 36 36" aria-hidden>
        <path d="M8 5v14l11-7z" />
      </svg>
    </div>
  );
};

export default VideoPreview;
