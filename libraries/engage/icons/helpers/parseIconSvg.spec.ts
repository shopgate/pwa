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

  it('treats a stroke without stroke width as a line of the default width 1', () => {
    expect(parseIconSvg('<svg fill="none" stroke="#000"><path d="M5 12h14"/></svg>').strokeWidth).toBe(1);
    expect(parseIconSvg('<path style="stroke:#000" d="M5 12h14"/>').strokeWidth).toBe(1);
  });

  it('treats an icon without stroke as no line icon', () => {
    expect(parseIconSvg('<svg stroke="none"><path d="M5 12h14"/></svg>').strokeWidth).toBeUndefined();
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

  it('removes remote urls from presentation attributes and styles', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 24 24"><defs><linearGradient id="g"/></defs><path d="M0" fill="url(https://tracker.example/p.svg#g)" filter="url(\'https://tracker.example/f.svg#f\')" stroke="url(#g)" style="mask:url(https://tracker.example/m.svg#m);opacity:.5"/><path d="M1" style="clip-path:url(https://tracker.example/c.svg#c)"/></svg>',
      { keepColors: true }
    );

    expect(icon.content).not.toContain('tracker.example');
    expect(icon.content).toMatch(/stroke="url\(#sgi\w+-g\)"/);
    expect(icon.content).toContain('style="opacity:.5"');
    expect(icon.content).toContain('<path d="M1"></path>');
  });

  it.each([
    ['an image set', 'mask-image:image-set(\'https://tracker.example/p.png\' 1x)'],
    ['an escaped url', 'fill:\\75 rl(https://tracker.example/p.png)'],
    ['a property that is no presentation property', 'background:red'],
  ])('removes %s from style attributes', (_, declaration) => {
    const { content } = parseIconSvg(`<path style="opacity:.5;${declaration}" d="M0"/>`, { normalize: false });

    expect(content).toBe('<path style="opacity:.5" d="M0"></path>');
  });

  it.each([
    ['an image set', '.a{mask-image:image-set(\'https://tracker.example/p.png\' 1x)}'],
    ['an escaped url', '.a{fill:\\75 rl(https://tracker.example/p.png)}'],
    ['a font face', '@font-face{font-family:x;src:url(https://tracker.example/f.woff)}'],
    ['a property that is no presentation property', '.a{background:red}'],
  ])('removes %s from style elements when normalizing is turned off', (_, rule) => {
    const { content } = parseIconSvg(`<svg><style>${rule}.b{opacity:.5}</style><path class="a b" d="M0"/></svg>`, { normalize: false });

    expect(content).toBe('<style>.b{opacity:.5}</style><path class="a b" d="M0"></path>');
  });

  it.each([
    ['an escaped url', 'filter', '\\75 rl(https://tracker.example/f.svg#f)'],
    ['a remote cursor', 'cursor', 'url(https://tracker.example/c.png), auto'],
  ])('removes presentation attributes with %s', (_, name, value) => {
    const { content } = parseIconSvg(`<path ${name}="${value}" opacity=".5" d="M0"/>`, { normalize: false });

    expect(content).toBe('<path opacity=".5" d="M0"></path>');
  });

  it('keeps the dash offset of style attributes', () => {
    const { content } = parseIconSvg('<path style="stroke-dasharray:51, 51;stroke-dashoffset:20" d="M0"/>', { normalize: false });

    expect(content).toBe('<path style="stroke-dasharray:51, 51;stroke-dashoffset:20" d="M0"></path>');
  });

  it('keeps the transform of style attributes', () => {
    const { content } = parseIconSvg('<path style="transform:rotate(45deg)" d="M0"/>', { normalize: false });

    expect(content).toBe('<path style="transform:rotate(45deg)" d="M0"></path>');
  });

  it('removes remote urls and imports from style elements when normalizing is turned off', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 24 24"><style>@import url(https://tracker.example/s.css);.a{fill:url(https://tracker.example/p.svg#g)}.b{fill:url(#local);opacity:.5}</style><path class="a" d="M0"/><path class="b" d="M1"/></svg>',
      { normalize: false }
    );

    expect(icon.content).not.toContain('tracker.example');
    expect(icon.content).not.toContain('@import');
    expect(icon.content).not.toContain('.a{');
    expect(icon.content).toContain('.b{fill:url(#local);opacity:.5}');
  });

  it('removes references to other documents when normalizing is turned off', () => {
    const icon = parseIconSvg(
      '<svg viewBox="0 0 24 24"><image href="https://tracker.example/p.png"/><a href="https://example.com"><path d="M1"/></a></svg>',
      { normalize: false }
    );

    expect(icon.content).toBe('<image></image><path d="M1"></path>');
  });

  it('uses other ids for the same markup with and without its colors', () => {
    const markup = '<svg viewBox="0 0 10 10"><defs><linearGradient id="g"></linearGradient></defs><path fill="url(#g)"/></svg>';
    const idOf = (content: string) => content.match(/id="([^"]+)"/)?.[1];

    expect(idOf(parseIconSvg(markup).content))
      .not.toBe(idOf(parseIconSvg(markup, { keepColors: true }).content));
  });

  it.each([undefined, null, '', '   '])('returns an empty icon for %j', (markup) => {
    expect(parseIconSvg(markup as unknown as string)).toEqual({
      attributes: {},
      content: '',
    });
  });
});
