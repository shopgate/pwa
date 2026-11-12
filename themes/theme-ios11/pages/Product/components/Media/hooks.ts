import { useCallback, useState } from 'react';
import type { SwiperClass } from 'swiper/react';

/**
 * Connects the slider of the product page with its thumbnails and the media viewer. Closing the
 * viewer moves the slider to the media that was shown last.
 * @returns The slider instance, the index the viewer is open at and the handlers.
 */
export const useMediaGallery = () => {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  const openViewer = useCallback((index: number) => {
    setViewerIndex(swiper && !swiper.destroyed ? swiper.realIndex : index);
  }, [swiper]);

  const closeViewer = useCallback((index: number) => {
    if (swiper && !swiper.destroyed && swiper.realIndex !== index) {
      swiper.slideToLoop(index, 0);
    }

    setViewerIndex(null);
  }, [swiper]);

  return {
    swiper,
    setSwiper,
    viewerIndex,
    openViewer,
    closeViewer,
  };
};
