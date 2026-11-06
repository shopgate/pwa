import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
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
