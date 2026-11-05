import { useRef } from 'react';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import { FULLSCREEN_PAGINATION_TYPES } from './constants';

const INSET_X = 'var(--gallery-image-inset-x, 0px)';
const INSET_Y = 'var(--gallery-image-inset-y, 0px)';

const useStyles = makeStyles()((theme) => {
  const { top, bottom } = theme.layout.safeArea;

  return {
    pagination: {
      '--swiper-pagination-inset-left': INSET_X,
      '--swiper-pagination-inset-right': INSET_X,
    },
    onImage: {
      '--swiper-pagination-fraction-top-offset': `calc(max(${INSET_Y}, ${top}) + 4px)`,
      '--swiper-pagination-bottom': `max(calc(${INSET_Y} + 8px), ${bottom})`,
      '&& .swiper-pagination-progressbar': {
        top: `max(${INSET_Y}, ${top})`,
      },
    },
    below: {
      '--swiper-pagination-bottom': `max(calc(${INSET_Y} - 16px), ${bottom})`,
      '&& .swiper-pagination-fraction': {
        top: `min(calc(100% - ${INSET_Y} + 4px), calc(100% - ${bottom} - 32px))`,
        left: 0,
        right: 0,
        margin: '4px auto',
      },
    },
  };
});

/**
 * Places the pagination of a fullscreen gallery slider on or below its centered, fitted image.
 * @param {Object} gallery The gallery image settings from useProductImageSettings.
 * @returns {Object} The container ref and style, the Swiper pagination type and class name.
 */
export const useGalleryPagination = ({ ratio, resolutions }) => {
  const ref = useRef(null);
  const { width, height } = useElementSize(ref, { includeWidth: true });
  const { pagination } = useProductGallerySettings();
  const { classes, cx } = useStyles();

  const largest = resolutions[resolutions.length - 1];
  const [ratioWidth, ratioHeight] = ratio ?? [largest?.width, largest?.height];
  const imageRatio = ratioHeight / ratioWidth || 1;
  const belowType = FULLSCREEN_PAGINATION_TYPES[pagination];

  return {
    ref,
    style: {
      '--gallery-image-inset-x': `${Math.max((width - height / imageRatio) / 2, 0)}px`,
      '--gallery-image-inset-y': `${Math.max((height - width * imageRatio) / 2, 0)}px`,
    },
    paginationType: belowType || pagination,
    className: cx(classes.pagination, belowType ? classes.below : classes.onImage),
  };
};
