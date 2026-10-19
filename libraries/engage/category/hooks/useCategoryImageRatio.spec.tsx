import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import useCategoryImageRatio, { type CategoryImageRatio } from './useCategoryImageRatio';

jest.mock('react-redux', () => ({ useSelector: jest.fn() }));
jest.mock('@shopgate/engage/settings/selectors/appSettings', () => ({
  getCategoryImageRatio: jest.fn(),
}));

const renderHook = (ratio: { width: number; height: number }, imageWidth: number) => {
  (useSelector as jest.Mock).mockReturnValue(ratio);
  let result: CategoryImageRatio | undefined;
  const Consumer = () => {
    result = useCategoryImageRatio(imageWidth);
    return null;
  };
  render(<Consumer />);
  return result;
};

describe('useCategoryImageRatio', () => {
  it('derives the requested resolution from the configured ratio', () => {
    expect(renderHook({
      width: 4,
      height: 3,
    }, 96)).toEqual({
      ratio: [4, 3],
      resolutions: [{
        width: 96,
        height: 72,
      }],
      aspectRatio: '4 / 3',
    });
  });

  it('falls back to a square for an invalid ratio', () => {
    expect(renderHook({
      width: 0,
      height: 3,
    }, 440)?.ratio).toEqual([1, 1]);
  });
});
