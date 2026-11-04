import { parseIconSvg } from './parseIconSvg';

describe('engage > icons > helpers > parseIconSvg', () => {
  it('parses the content of an svg element without own viewBox or attributes', () => {
    const icon = parseIconSvg('<path d="M1 1"/>');

    expect(icon.viewBox).toBeUndefined();
    expect(icon.attributes).toEqual({});
    expect(icon.content).toBe('<path d="M1 1"></path>');
  });

  it('keeps the root attributes of a line icon and takes out its stroke width', () => {
    const icon = parseIconSvg(
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>'
    );

    expect(icon.viewBox).toBe('0 0 24 24');
    expect(icon.attributes).toEqual({
      fill: 'none',
      stroke: 'currentColor',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
    });
    expect(icon.strokeWidth).toBe(2);
    expect(icon.content).toBe('<path d="M5 12h14"></path>');
  });

  it('takes the first stroke width of the content when the root has none', () => {
    const icon = parseIconSvg('<path stroke="#000" stroke-width="1.5"/><path stroke-width="3"/>');

    expect(icon.strokeWidth).toBe(1.5);
    expect(icon.content).not.toContain('stroke-width');
  });

  it('replaces hardcoded colors with the text color', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 10 10" stroke="#333"><path fill="#ff0000" stroke="rgb(0, 0, 0)" style="fill: #fff; opacity: .5"/><path fill="none"/><stop stop-color="red"/></svg>'
    );

    expect(icon.attributes.stroke).toBe('currentColor');
    expect(icon.content).toContain('<path fill="currentColor" stroke="currentColor" style="fill:currentColor;opacity:.5">');
    expect(icon.content).toContain('<path fill="none">');
    expect(icon.content).toContain('stop-color="currentColor"');
  });

  it('keeps the colors when asked to', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 10 10" fill="#333"><path fill="#ff0000"/></svg>',
      { keepColors: true }
    );

    expect(icon.attributes.fill).toBe('#333');
    expect(icon.content).toContain('fill="#ff0000"');
  });

  it('applies the class rules of style elements as attributes and removes them', () => {
    const markup = '<svg viewBox="0 0 46 46"><style>.a{fill:#81c6e5}.b, .c {opacity: .5}</style><path class="a"/><path class="c"/></svg>';

    const recolored = parseIconSvg(markup);
    const kept = parseIconSvg(markup, { keepColors: true });

    expect(recolored.content).not.toContain('<style');
    expect(recolored.content).toContain('<path class="a" fill="currentColor">');
    expect(recolored.content).toContain('<path class="c" opacity=".5">');
    expect(kept.content).toContain('<path class="a" fill="#81c6e5">');
  });

  it('prefixes ids and their references per icon', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 10 10"><defs><linearGradient id="g"></linearGradient></defs><path fill="url(#g)"/></svg>'
    );

    const [, id] = icon.content.match(/id="([^"]+)"/) ?? [];

    expect(id).toMatch(/^sgi\w+-g$/);
    expect(icon.content).toContain(`fill="url(#${id})"`);
  });

  it.each([
    ['<svg width="48" height="32"><path/></svg>', '0 0 48 32'],
    ['<svg width="100%" height="100%"><path/></svg>', undefined],
    ['<?xml version="1.0"?><!-- export --><svg viewBox="0 0 2 2"><path/></svg>', '0 0 2 2'],
  ])('reads the viewBox of %s', (markup, viewBox) => {
    expect(parseIconSvg(markup).viewBox).toBe(viewBox);
  });

  it('only sanitizes when normalizing is turned off', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 24 24" stroke-width="2"><path id="a" fill="#fff"/></svg>',
      { normalize: false }
    );

    expect(icon.strokeWidth).toBe(2);
    expect(icon.content).toBe('<path id="a" fill="#fff"></path>');
  });

  it('removes scripts, event handlers and foreign content', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 24 24" onload="alert(1)"><script>alert(1)</script><foreignObject><div>x</div></foreignObject><path d="M1 1" onclick="alert(1)"/></svg>'
    );

    expect(icon.content).toBe('<path d="M1 1"></path>');
  });

  it('removes references to other documents and links', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 24 24"><defs><linearGradient id="base"/><linearGradient id="g" href="#base"/></defs><image href="https://tracker.example/p.png"/><image xlink:href="https://tracker.example/q.png"/><image href="data:image/png;base64,AAAA"/><a href="https://example.com"><path d="M1"/></a></svg>',
      { keepColors: true }
    );

    expect(icon.content).not.toContain('tracker.example');
    expect(icon.content).not.toContain('example.com');
    expect(icon.content).not.toContain('<a');
    expect(icon.content).toContain('href="data:image/png;base64,AAAA"');
    expect(icon.content).toMatch(/<linearGradient id="sgi\w+-g" href="#sgi\w+-base">/);
    expect(icon.content).toContain('<path d="M1"></path>');
  });

  it('removes references to other documents when normalizing is turned off', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 24 24"><image href="https://tracker.example/p.png"/><a href="https://example.com"><path d="M1"/></a></svg>',
      { normalize: false }
    );

    expect(icon.content).toBe('<image></image><path d="M1"></path>');
  });

  it.each([undefined, null, '', '   '])('returns an empty icon for %j', (markup) => {
    expect(parseIconSvg(markup as unknown as string)).toEqual({
      attributes: {},
      content: '',
    });
  });
});
