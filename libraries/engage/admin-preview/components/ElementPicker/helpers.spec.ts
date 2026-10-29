import { findStableElement, getStableClass, getStableSelectors } from './helpers';

const createTree = () => {
  document.body.innerHTML = `
    <div class="theme__product-grid">
      <div class="sg-abc-root engage__product-card common__card">
        <div class="sg-def-info">
          <span id="price" class="price ui-shared__price">1 €</span>
          <span id="plain">plain</span>
        </div>
      </div>
    </div>
    <div id="outside"><span id="nothing">x</span></div>
  `;

  return (id: string) => document.getElementById(id) as Element;
};

describe('admin-preview/ElementPicker/helpers', () => {
  it('prefers prefixed classes over legacy ones and ignores generated ones', () => {
    const byId = createTree();

    expect(getStableClass(byId('price'))).toBe('ui-shared__price');
    expect(getStableClass(document.querySelector('.engage__product-card') as Element))
      .toBe('engage__product-card');
    expect(getStableClass(byId('plain'))).toBeNull();
  });

  it.each([
    'push-opt-in-modal__title',
    'cookie-consent-modal__button-accept-all',
    'no-results__image',
  ])('accepts the block__element class %s', (stableClass) => {
    document.body.innerHTML = `<div id="element" class="sg-x-root ${stableClass}">x</div>`;

    expect(getStableClass(document.getElementById('element') as Element)).toBe(stableClass);
  });

  it.each([
    'sg-abc__root',
    'MuiButton-root',
    'Mui-disabled',
    'product__',
    '__title',
  ])('ignores %s', (name) => {
    document.body.innerHTML = `<div id="element" class="${name}">x</div>`;

    expect(getStableClass(document.getElementById('element') as Element)).toBeNull();
  });

  it('falls back to the legacy classes', () => {
    document.body.innerHTML = '<span id="legacy" class="sg-x-root price-striked">1 €</span>';

    expect(getStableClass(document.getElementById('legacy') as Element)).toBe('price-striked');
  });

  it('finds the closest element with a stable class', () => {
    const byId = createTree();

    expect(findStableElement(byId('plain'))).toBe(document.querySelector('.engage__product-card'));
    expect(findStableElement(byId('nothing'))).toBeNull();
  });

  it('lists the selectors of the element and its ancestors, closest first', () => {
    const byId = createTree();

    expect(getStableSelectors(byId('price'))).toEqual([
      '.ui-shared__price',
      '.engage__product-card',
      '.theme__product-grid',
    ]);
  });
});
