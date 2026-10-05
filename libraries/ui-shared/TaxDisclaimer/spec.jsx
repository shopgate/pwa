import { render, screen } from '@testing-library/react';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/styles', () => ({
  makeStyles: () => function mockUseStylesFactory() {
    return function useStylesMock() {
      return {
        classes: {
          text: 'mock-class-text',
        },
        cx: (...classes) => classes.filter(Boolean).join(' '),
      };
    };
  },
  keyframes: () => ({}),
}));

jest.mock('@shopgate/engage/core/hooks/useWidgetSettings', () => ({
  useWidgetSettings: jest.fn().mockReturnValue({
    show: null,
    hint: '*',
    text: null,
  }),
}));

describe('<TaxDisclaimer />', () => {
  afterEach(() => {
    jest.resetModules();
  });

  it('should display the component', () => {
    jest.mock('@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer', () => true);
    const TaxDisclaimer = jest.requireActual('./index').default;
    const { container } = render(<TaxDisclaimer />);

    const disclaimer = container.querySelector('[data-test-id="taxDisclaimer"]');

    expect(disclaimer).toHaveClass('mock-class-text', 'ui-shared__tax-disclaimer');
    expect(disclaimer).toHaveAttribute('aria-hidden', 'true');
    expect(disclaimer).toHaveTextContent('product.tax_disclaimer');
  });

  it('should display null', () => {
    jest.mock('@shopgate/pwa-common-commerce/market/helpers/showTaxDisclaimer', () => false);
    const TaxDisclaimer = jest.requireActual('./index').default;
    const { container } = render(<TaxDisclaimer />);

    expect(container.querySelector('[data-test-id="taxDisclaimer"]')).not.toBeInTheDocument();
    expect(screen.queryByText('product.tax_disclaimer')).not.toBeInTheDocument();
  });
});
