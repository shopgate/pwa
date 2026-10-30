import { sanitizeSvgElement } from './sanitize';

describe('engage > components > SafeHtml > sanitizeSvgElement', () => {
  it('keeps svg markup', () => {
    const svg = sanitizeSvgElement('<defs><linearGradient id="g"><stop offset="0"></stop></linearGradient></defs><path fill="url(#g)" d="M0 0h24v24H0z"></path>');

    expect(svg?.outerHTML).toBe('<svg><defs><linearGradient id="g"><stop offset="0"></stop></linearGradient></defs><path fill="url(#g)" d="M0 0h24v24H0z"></path></svg>');
  });

  it('keeps the root of a complete svg element and removes its prolog', () => {
    const svg = sanitizeSvgElement('<?xml version="1.0"?><!-- export --><!DOCTYPE svg><svg viewBox="0 0 48 48" fill="none"><path d="M0"></path></svg>');

    expect(svg?.getAttribute('viewBox')).toBe('0 0 48 48');
    expect(svg?.getAttribute('fill')).toBe('none');
  });

  it('removes scripts, event handlers and embedded html', () => {
    const svg = sanitizeSvgElement('<path d="M0" onload="alert(1)"></path><script>alert(1)</script><foreignObject><img src=x onerror=alert(1)></foreignObject><a href="javascript:alert(1)"><path d="M1"></path></a>');

    expect(svg?.outerHTML).toBe('<svg><path d="M0"></path><a><path d="M1"></path></a></svg>');
  });

  it('does not let markup break out of the svg element', () => {
    const svg = sanitizeSvgElement('<path d="M0"></path></svg><img src=x onerror=alert(1)><svg>');

    expect(svg?.outerHTML).toBe('<svg><path d="M0"></path></svg>');
  });

  it('visits every kept element after its attributes were sanitized', () => {
    const visited: string[] = [];

    sanitizeSvgElement('<g onclick="alert(1)"><path d="M0"></path></g>', (element) => {
      visited.push(`${element.nodeName.toLowerCase()}:${element.getAttributeNames().join(',')}`);
    });

    expect(visited).toEqual(['svg:', 'g:', 'path:d']);
  });

  it('sanitizes the attributes of the root element', () => {
    expect(sanitizeSvgElement('<svg viewBox="0 0 24 24" onload="alert(1)"></svg>')?.outerHTML)
      .toBe('<svg viewBox="0 0 24 24"></svg>');
  });
});
