import { render } from '@testing-library/react';
import SvgIcon, { scaleViewBox } from './SvgIcon';

/**
 * Renders the icon and returns its svg element.
 * @param props The icon props.
 * @returns The svg element.
 */
const renderSvg = (props: Parameters<typeof SvgIcon>[0]) => {
  const { container } = render(<SvgIcon {...props} />);
  return container.querySelector('svg') as SVGSVGElement;
};

describe('engage > icons > components > SvgIcon', () => {
  describe('scaleViewBox()', () => {
    it('widens or narrows the viewBox around its center', () => {
      expect(scaleViewBox('0 0 24 24', 0.8)).toBe('-3 -3 30 30');
      expect(scaleViewBox('0 0 24 24', 1.2)).toBe('2 2 20 20');
    });

    it('keeps the viewBox without a valid scale and limits extreme scales', () => {
      expect(scaleViewBox('0 0 24 24')).toBe('0 0 24 24');
      expect(scaleViewBox('0 0 24 24', 1)).toBe('0 0 24 24');
      expect(scaleViewBox('0 0 24 24', Number.NaN)).toBe('0 0 24 24');
      expect(scaleViewBox('invalid', 0.8)).toBe('invalid');
      expect(scaleViewBox('0 0 24 24', 10)).toBe('6 6 12 12');
    });
  });

  it('applies the scale to the viewBox and keeps the stroke width of line icons', () => {
    const svg = renderSvg({
      markup: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 1"/></svg>',
      scale: 0.8,
    });

    expect(svg.getAttribute('viewBox')).toBe('-3 -3 30 30');
    expect(svg.style.getPropertyValue('--sgi-stroke-scale')).toBe('1.25');
  });

  it('renders the content of an svg element with the given or the default viewBox', () => {
    expect(renderSvg({ markup: '<path d="M1 1"/>' }).getAttribute('viewBox')).toBe('0 0 24 24');
    expect(renderSvg({
      markup: '<path d="M1 1"/>',
      viewBox: '0 0 29 29',
    }).getAttribute('viewBox')).toBe('0 0 29 29');
  });

  it('prefers the own viewBox of a complete svg element over the viewBox prop', () => {
    const svg = renderSvg({
      markup: '<svg viewBox="0 0 48 48"><path d="M1 1"/></svg>',
      viewBox: '0 0 24 24',
    });

    expect(svg.getAttribute('viewBox')).toBe('0 0 48 48');
  });

  it('keeps line icons unfilled via the inline style and scales the stroke width token', () => {
    const svg = renderSvg({
      markup: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M1 1"/></svg>',
      className: 'custom',
    });

    expect(svg.getAttribute('fill')).toBeNull();
    expect(svg.style.fill).toBe('none');
    expect(svg.style.strokeWidth).toBe('');
    expect(svg.style.getPropertyValue('--sgi-stroke-base')).toBe('1.5');
    expect(svg.style.getPropertyValue('--sgi-stroke-scale')).toBe('2');
    expect(getComputedStyle(svg).strokeWidth).toBe('calc(var(--sg-components-icon-strokeWidth, var(--sgi-stroke-base)) * var(--sgi-stroke-scale))');
    expect(svg.getAttribute('stroke-linecap')).toBe('round');
    expect(svg.getAttribute('class')).toContain('custom');
    expect(svg.getAttribute('class')).toContain('common__icon');
  });

  it('keeps the designed stroke width of a stroke icon without own svg element', () => {
    const svg = renderSvg({
      markup: '<path d="M10 5v6" stroke="#000000" stroke-width="2" stroke-linecap="round"/>',
    });

    expect(svg.style.getPropertyValue('--sgi-stroke-base')).toBe('2');
    expect(svg.style.getPropertyValue('--sgi-stroke-scale')).toBe('1');
    expect(svg.innerHTML).toContain('stroke="currentColor"');
  });

  it('applies the color and size props', () => {
    const svg = renderSvg({
      markup: '<path d="M1 1"/>',
      color: 'red',
      size: 32,
    });

    expect(svg.style.color).toBe('red');
    expect(svg.style.fontSize).toBe('32px');
    expect(svg.style.fill).toBe('');
    expect(getComputedStyle(svg).strokeWidth).toBe('');
  });

  it('hides the icon from assistive technology', () => {
    expect(renderSvg({ markup: '<path d="M1 1"/>' }).getAttribute('aria-hidden')).toBe('true');
  });

  it('keeps an own root fill color when the colors are kept', () => {
    const svg = renderSvg({
      markup: '<svg viewBox="0 0 24 24" fill="#333"><path d="M1 1"/></svg>',
      keepColors: true,
    });

    expect(svg.style.fill).toBe('#333');
  });

  it('renders no unsafe markup', () => {
    const svg = renderSvg({
      markup: '<path d="M1 1" onclick="alert(1)"/><script>alert(1)</script>',
    });

    expect(svg.innerHTML).toBe('<path d="M1 1"></path>');
  });
});
