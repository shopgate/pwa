import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import useVariantSelectorSettings from './useVariantSelectorSettings';

let mockSettings: Record<string, unknown> = {};

jest.mock('react-redux', () => ({
  useSelector: () => mockSettings,
}));

/**
 * Renders the resolved settings as JSON.
 * @returns The settings.
 */
const Settings = () => <pre>{JSON.stringify(useVariantSelectorSettings())}</pre>;

/**
 * Renders the hook with the given settings.
 * @param settings The settings from the store.
 * @returns The resolved settings.
 */
const resolve = (settings: Record<string, unknown>) => {
  mockSettings = settings;
  const { unmount } = render(<Settings />);
  const result = JSON.parse(screen.getByText(/\{/).textContent || '{}');
  unmount();
  return result;
};

describe('useVariantSelectorSettings()', () => {
  it('parses the swatch characteristics only when swatches are enabled', () => {
    expect(resolve({
      swatchesEnabled: true,
      swatchCharacteristics: ' Farbe, COLOR ,, ',
    })
      .swatchCharacteristics).toEqual(['farbe', 'color']);
    expect(resolve({
      swatchesEnabled: false,
      swatchCharacteristics: 'Farbe',
    })
      .swatchCharacteristics).toEqual([]);
    expect(resolve({
      swatchesEnabled: true,
      swatchCharacteristics: 42,
    })
      .swatchCharacteristics).toEqual([]);
  });

  it('limits the image zoom and guards malformed values', () => {
    expect(resolve({ swatchImageZoom: 50 }).swatchImageZoom).toBe(100);
    expect(resolve({ swatchImageZoom: 900 }).swatchImageZoom).toBe(600);
    expect(resolve({ swatchImageZoom: 'abc' }).swatchImageZoom).toBe(100);
    expect(resolve({ swatchImageZoom: 250 }).swatchImageZoom).toBe(250);
    expect(resolve({ swatchProperty: 5 }).swatchProperty).toBe('');
  });

  it('only enables preselection for a real true', () => {
    expect(resolve({ preselect: true }).preselect).toBe(true);
    expect(resolve({ preselect: 'true' }).preselect).toBe(false);
  });
});
