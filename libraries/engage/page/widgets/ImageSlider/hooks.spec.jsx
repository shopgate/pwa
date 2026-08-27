import { render } from '@testing-library/react';
import { useWidget } from '@shopgate/engage/page/hooks';
import { useTheme } from '@shopgate/engage/styles';
import { useImageSliderWidget } from './hooks';

jest.mock('@shopgate/engage/page/hooks', () => ({ useWidget: jest.fn() }));
jest.mock('@shopgate/engage/styles', () => ({ useTheme: jest.fn() }));
jest.mock('../../helpers', () => ({ resolveBorderRadiusFromWidgetConfig: () => undefined }));

const CONFIG = {
  images: [
    { image: { url: 'https://example.com/1.jpg' } },
    { image: { url: 'https://example.com/2.jpg' } },
  ],
  imageSpacing: 0,
  paginationStyle: 'fraction',
};

const NO_MARGINS = {
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
};

/**
 * Renders the hook with the given container margins and returns the resolved swiper props.
 * @param {Object} layout The resolved margins of the widget container.
 * @returns {Object} The swiper props the hook produced.
 */
const renderHook = (layout) => {
  let result;

  useWidget.mockReturnValue({
    config: CONFIG,
    isPreview: false,
    layout,
  });

  useTheme.mockReturnValue({
    breakpoints: {
      values: {
        sm: 600,
        md: 900,
      },
    },
  });

  const Consumer = () => {
    ({ swiperProps: result } = useImageSliderWidget());
    return null;
  };

  render(<Consumer />);

  return result;
};

describe('useImageSliderWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('offsets the pagination by the margin it compensates', () => {
    const { style } = renderHook({
      ...NO_MARGINS,
      marginLeft: 10,
      marginRight: 24,
    });

    expect(style).toEqual({
      marginLeft: -10,
      paddingLeft: 10,
      '--swiper-pagination-inset-left': '10px',
      marginRight: -24,
      paddingRight: 24,
      '--swiper-pagination-inset-right': '24px',
    });
  });

  it('leaves the pagination alone on a side without a margin', () => {
    const { style } = renderHook({
      ...NO_MARGINS,
      marginLeft: 10,
    });

    expect(style).toEqual({
      marginLeft: -10,
      paddingLeft: 10,
      '--swiper-pagination-inset-left': '10px',
    });
  });

  it('adds no style at all without horizontal margins', () => {
    expect(renderHook(NO_MARGINS)).not.toHaveProperty('style');
  });
});
