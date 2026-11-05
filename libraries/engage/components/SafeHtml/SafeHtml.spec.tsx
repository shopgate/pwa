import React from 'react';
import noop from 'lodash/noop';
import { render } from '@testing-library/react';
import SafeHtml from './SafeHtml';

describe('engage > components > SafeHtml', () => {
  describe('inline profile', () => {
    it('should keep inline formatting and entities', () => {
      const { container } = render(
        <SafeHtml as="span" html={'Tom &amp; Jerry <b>New</b> Shirt<sup>®</sup><br>Blue'} />
      );

      expect(container.innerHTML).toBe('<span>Tom &amp; Jerry <b>New</b> Shirt<sup>®</sup><br>Blue</span>');
    });

    it('should remove links, blocks, attributes and scripts but keep their text', () => {
      const alert = jest.spyOn(window, 'alert').mockImplementation(noop);
      const { container } = render(
        <SafeHtml as="span" html='<a href="https://shop.com">Link</a><p>Block</p><b style="color:red" onclick="alert(1)" data-x="1" aria-label="a">Bold</b><img src=x onerror=alert(1)><script>alert(1)</script>' />
      );

      expect(container.innerHTML).toBe('<span>LinkBlock<b>Bold</b></span>');
      expect(alert).not.toHaveBeenCalled();
    });
  });

  describe('html profile', () => {
    it('should keep markup, attributes and entities', () => {
      const { container } = render(
        <SafeHtml profile="html" html={'<div class="box" aria-label="Box"><p>Tom &amp; <span style="font-size:14px">Jerry</span></p><ul><li>One</li></ul></div>'} />
      );

      expect(container.innerHTML).toBe('<div><div class="box" aria-label="Box"><p>Tom &amp; <span style="font-size:14px">Jerry</span></p><ul><li>One</li></ul></div></div>');
    });

    it('should keep links with safe protocols and relative links', () => {
      const { container } = render(
        <SafeHtml profile="html" html='<a href="https://shop.com" target="_blank">A</a><a href="mailto:a@shop.com">B</a><a href="tel:123">C</a><a href="/terms">D</a>' />
      );

      expect(container.innerHTML).toBe('<div><a href="https://shop.com" target="_blank">A</a><a href="mailto:a@shop.com">B</a><a href="tel:123">C</a><a href="/terms">D</a></div>');
    });

    it('should remove links with unsafe protocols', () => {
      const { container } = render(
        <SafeHtml profile="html" html={'<a href="javascript:alert(1)">A</a><a href=" java\tscript:alert(1)">B</a><a href="data:text/html,<script>alert(1)</script>">C</a>'} />
      );

      expect(container.innerHTML).toBe('<div><a>A</a><a>B</a><a>C</a></div>');
    });

    it('should remove scripts, event handlers and iframes', () => {
      const alert = jest.spyOn(window, 'alert').mockImplementation(noop);
      const { container } = render(
        <SafeHtml profile="html" html='<img src="x" onerror="alert(1)"><script>alert(1)</script><iframe src="https://evil.com"></iframe><b onclick="alert(1)">Name</b>' />
      );

      expect(container.innerHTML).toBe('<div><img src="x"><b>Name</b></div>');
      expect(alert).not.toHaveBeenCalled();
    });

    it('should render with the given element and props', () => {
      const { container } = render(<SafeHtml as="span" className="text" html="Text" />);

      expect(container.innerHTML).toBe('<span class="text">Text</span>');
    });

    it('should render an empty element without html', () => {
      const { container } = render(<SafeHtml />);

      expect(container.innerHTML).toBe('<div></div>');
    });
  });

  describe('svg profile', () => {
    it('should keep svg markup', () => {
      const { container } = render(
        <SafeHtml as="svg" profile="svg" html='<defs><linearGradient id="g"><stop offset="0"></stop></linearGradient></defs><path fill="url(#g)" d="M0 0h24v24H0z"></path>' />
      );

      expect(container.innerHTML).toBe('<svg><defs><linearGradient id="g"><stop offset="0"></stop></linearGradient></defs><path fill="url(#g)" d="M0 0h24v24H0z"></path></svg>');
    });

    it('should remove scripts, event handlers and embedded html', () => {
      const { container } = render(
        <SafeHtml as="svg" profile="svg" html='<path d="M0" onload="alert(1)"></path><script>alert(1)</script><foreignObject><img src=x onerror=alert(1)></foreignObject><a href="javascript:alert(1)"><path d="M1"></path></a>' />
      );

      expect(container.innerHTML).toBe('<svg><path d="M0"></path><a><path d="M1"></path></a></svg>');
    });

    it('should not let markup break out of the svg element', () => {
      const { container } = render(
        <SafeHtml as="svg" profile="svg" html='<path d="M0"></path></svg><img src=x onerror=alert(1)><svg>' />
      );

      expect(container.innerHTML).toBe('<svg><path d="M0"></path></svg>');
    });
  });
});
