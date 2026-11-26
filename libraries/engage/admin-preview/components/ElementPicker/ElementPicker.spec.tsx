import React from 'react';
import {
  act, fireEvent, render, screen,
} from '@testing-library/react';
import ElementPicker from './ElementPicker';

const renderPicker = (active = true) => {
  const onPick = jest.fn();
  const onCancel = jest.fn();
  const onAppClick = jest.fn();

  render(
    <>
      <div className="engage__product-card">
        <button type="button" className="sg-abc-root" onClick={onAppClick}>Add to cart</button>
      </div>
      <ElementPicker active={active} onPick={onPick} onCancel={onCancel} />
    </>
  );

  return { onPick, onCancel, onAppClick };
};

describe('admin-preview/ElementPicker', () => {
  it('outlines the closest element with a stable class', () => {
    renderPicker();

    fireEvent.pointerMove(screen.getByRole('button'));

    expect(screen.getByText('.engage__product-card')).toBeInTheDocument();
  });

  it('moves the label left so it stays inside the viewport', () => {
    // jsdom lays nothing out: the element sits close to the right edge and the label is wide.
    const getBoundingClientRect = jest.spyOn(Element.prototype, 'getBoundingClientRect')
      .mockReturnValue({
        left: 900,
        top: 100,
        width: 100,
        height: 50,
      } as DOMRect);
    const offsetWidth = jest.spyOn(HTMLElement.prototype, 'offsetWidth', 'get')
      .mockReturnValue(200);

    renderPicker();
    fireEvent.pointerMove(screen.getByRole('button'));

    // 1024px wide jsdom window, minus the label and the 4px margin, relative to the element.
    expect(screen.getByText('.engage__product-card')).toHaveStyle({ left: '-80px' });

    getBoundingClientRect.mockRestore();
    offsetWidth.mockRestore();
  });

  it('reports a clicked element instead of passing the click on', () => {
    const { onPick, onAppClick } = renderPicker();

    fireEvent.click(screen.getByRole('button'));

    expect(onPick).toHaveBeenCalledWith(['.engage__product-card']);
    expect(onAppClick).not.toHaveBeenCalled();
  });

  it('reports a disabled button on pointer up, since no click reaches it', () => {
    const onPick = jest.fn();

    render(
      <>
        <button type="button" className="engage__button" disabled>
          <span>Add to cart</span>
        </button>
        <ElementPicker active onPick={onPick} onCancel={jest.fn()} />
      </>
    );

    fireEvent.pointerUp(screen.getByText('Add to cart'));

    expect(onPick).toHaveBeenCalledWith(['.engage__button']);
  });

  it('waits for the click of an enabled element', () => {
    const { onPick } = renderPicker();

    fireEvent.pointerUp(screen.getByRole('button'));

    expect(onPick).not.toHaveBeenCalled();
  });

  it('lets the pointer reach elements disabled with aria-disabled while picking', () => {
    const { unmount } = render(<ElementPicker active onPick={jest.fn()} onCancel={jest.fn()} />);
    const hasRule = () => Array.from(document.head.querySelectorAll('style'))
      .some(style => style.textContent?.includes('[aria-disabled="true"] { pointer-events: auto !important; }'));

    expect(hasRule()).toBe(true);

    unmount();

    expect(hasRule()).toBe(false);
  });

  it('cancels on escape', () => {
    const { onCancel } = renderPicker();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(onCancel).toHaveBeenCalled();
  });

  it('outlines all elements of a selector while not picking', () => {
    // jsdom lays nothing out, so every element would count as hidden.
    const getClientRects = jest.spyOn(Element.prototype, 'getClientRects')
      .mockReturnValue([{}] as unknown as DOMRectList);

    render(
      <>
        <div className="engage__product-card">A</div>
        <div className="engage__product-card">B</div>
        <ElementPicker
          active={false}
          highlightSelector=".engage__product-card"
          onPick={jest.fn()}
          onCancel={jest.fn()}
        />
      </>
    );

    expect(document.querySelectorAll('[data-element-picker-highlight]')).toHaveLength(2);
    expect(screen.getAllByText('.engage__product-card')).toHaveLength(1);

    getClientRects.mockRestore();
  });

  describe('updates', () => {
    let getClientRects: jest.SpyInstance;
    let requestAnimationFrame: jest.SpyInstance;

    const countOutlines = () => document.querySelectorAll('[data-element-picker-highlight]').length;

    const nextFrame = () => act(() => new Promise((resolve) => {
      window.requestAnimationFrame(() => resolve(undefined));
    }));

    /**
     * Reports DOM changes to the picker. The test setup replaces MutationObserver with a stub that
     * never reports, so the picker's callback is called directly.
     * @param records The changes to report.
     */
    const reportMutations = (records: Partial<MutationRecord>[]) => {
      const { calls } = (global as unknown as { mutationConstructorSpy: jest.Mock })
        .mutationConstructorSpy.mock;
      const callback = calls[calls.length - 1][0] as MutationCallback;

      callback(records as MutationRecord[], {} as MutationObserver);
    };

    const childListChange = (target: Node, addedNodes: Node[], removedNodes: Node[] = []) => ({
      type: 'childList' as const,
      target,
      addedNodes: addedNodes as unknown as NodeList,
      removedNodes: removedNodes as unknown as NodeList,
    });

    const renderHighlighter = () => render(
      <>
        <div className="engage__product-card">A</div>
        <ElementPicker
          active={false}
          highlightSelector=".engage__product-card"
          onPick={jest.fn()}
          onCancel={jest.fn()}
        />
      </>
    );

    beforeEach(() => {
      // jsdom lays nothing out, so every element would count as hidden.
      getClientRects = jest.spyOn(Element.prototype, 'getClientRects')
        .mockReturnValue([{}] as unknown as DOMRectList);
      requestAnimationFrame = jest.spyOn(window, 'requestAnimationFrame');
    });

    afterEach(() => {
      getClientRects.mockRestore();
      requestAnimationFrame.mockRestore();
    });

    it('updates the outlines once per frame while the app scrolls', () => {
      renderHighlighter();

      fireEvent.scroll(window);
      fireEvent.scroll(window);
      fireEvent.scroll(window);

      expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
    });

    it('outlines elements that match the selector after the content changed', async () => {
      renderHighlighter();

      expect(countOutlines()).toBe(1);

      const element = document.createElement('div');

      element.className = 'engage__product-card';
      document.body.appendChild(element);
      reportMutations([childListChange(document.body, [element])]);
      await nextFrame();

      expect(countOutlines()).toBe(2);

      element.remove();
    });

    it('drops the outline of a picked element that left the page', async () => {
      const onPick = jest.fn();
      const card = document.createElement('div');

      card.className = 'engage__product-card';
      document.body.appendChild(card);
      render(<ElementPicker active onPick={onPick} onCancel={jest.fn()} />);

      fireEvent.pointerMove(card);

      expect(countOutlines()).toBe(1);

      card.remove();
      reportMutations([childListChange(document.body, [], [card])]);
      await nextFrame();

      expect(countOutlines()).toBe(0);
      expect(onPick).not.toHaveBeenCalled();
    });

    it('ignores changes of its own outlines', () => {
      renderHighlighter();

      const outline = document.querySelector('[data-element-picker-highlight]') as Element;

      reportMutations([
        childListChange(document.body, [outline]),
        {
          type: 'attributes',
          target: outline.firstChild as Node,
        },
      ]);

      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });
  });

  it('ignores an invalid selector', () => {
    render(
      <ElementPicker active={false} highlightSelector="..." onPick={jest.fn()} onCancel={jest.fn()} />
    );

    expect(document.querySelector('[data-element-picker-highlight]')).toBeNull();
  });

  it('leaves the app alone while inactive', () => {
    const { onPick, onAppClick } = renderPicker(false);

    fireEvent.pointerMove(screen.getByRole('button'));
    fireEvent.click(screen.getByRole('button'));

    expect(screen.queryByText('.engage__product-card')).not.toBeInTheDocument();
    expect(onPick).not.toHaveBeenCalled();
    expect(onAppClick).toHaveBeenCalled();
  });
});
