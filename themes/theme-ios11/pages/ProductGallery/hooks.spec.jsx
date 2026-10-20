import React from 'react';
import { render } from '@testing-library/react';
import { useElementSize } from '@shopgate/engage/core/hooks';
import { useProductGallerySettings } from '@shopgate/engage/product/hooks';
import { useGalleryPagination } from './hooks';

jest.mock('@shopgate/engage/core/hooks', () => ({ useElementSize: jest.fn() }));
jest.mock('@shopgate/engage/product/hooks', () => ({ useProductGallerySettings: jest.fn() }));

const renderHook = (gallery) => {
  let result;
  const Consumer = () => {
    result = useGalleryPagination(gallery);
    return null;
  };
  render(<Consumer />);
  return result;
};

describe('useGalleryPagination', () => {
  beforeEach(() => {
    useElementSize.mockReturnValue({
      width: 400,
      height: 800,
    });
    useProductGallerySettings.mockReturnValue({ pagination: 'bullets' });
  });

  it('insets the pagination vertically for an image shorter than the slider', () => {
    const { style } = renderHook({
      ratio: [1, 1],
      resolutions: [],
    });

    expect(style).toEqual({
      '--gallery-image-inset-x': '0px',
      '--gallery-image-inset-y': '200px',
    });
  });

  it('insets the pagination horizontally for an image narrower than the slider', () => {
    const { style } = renderHook({
      ratio: [1, 4],
      resolutions: [],
    });

    expect(style).toEqual({
      '--gallery-image-inset-x': '100px',
      '--gallery-image-inset-y': '0px',
    });
  });

  it('takes the ratio from the largest resolution without a configured ratio', () => {
    const { style } = renderHook({
      ratio: null,
      resolutions: [{
        width: 100,
        height: 50,
      }, {
        width: 400,
        height: 400,
      }],
    });

    expect(style['--gallery-image-inset-y']).toBe('200px');
  });

  it('renders the below variants as their plain Swiper pagination type', () => {
    useProductGallerySettings.mockReturnValue({ pagination: 'fractionBelow' });

    expect(renderHook({
      ratio: [1, 1],
      resolutions: [],
    }).paginationType).toBe('fraction');
  });
});
