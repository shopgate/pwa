import PropTypes from 'prop-types';
import { render, screen } from '@testing-library/react';
import { i18n as i18nHelper } from '@shopgate/engage/core';
import I18nProvider from './index';

jest.unmock('@shopgate/engage/core/helpers/i18n');

describe('<I18nProvider />', () => {
  const locales = {
    greeting: 'Guten Tag {name}',
  };
  const lang = 'de-DE';

  i18nHelper.init({
    locales,
    lang,
  });

  const onContext = jest.fn();

  /**
   * Reads the legacy context of the provider.
   * @param {Object} props The component props.
   * @param {Object} context The legacy context.
   * @returns {JSX.Element}
   */
  const Consumer = (props, context) => {
    onContext(context);

    const { __: translate } = context.i18n();

    return <div>{translate('greeting', { name: 'Test' })}</div>;
  };

  Consumer.contextTypes = {
    i18n: PropTypes.func,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should render nothing without children', () => {
      const { container } = render(<I18nProvider />);
      expect(container).toBeEmptyDOMElement();
    });

    it('should provide access to i18n via context', () => {
      render(<I18nProvider><Consumer /></I18nProvider>);

      const [{ i18n }] = onContext.mock.calls[0];
      expect(i18n()).toEqual({
        __: i18nHelper.text,
        _p: i18nHelper.price,
        _d: i18nHelper.date,
        _t: i18nHelper.time,
        _n: i18nHelper.number,
      });
    });

    it('should translate with the i18n instance from the context', () => {
      render(<I18nProvider><Consumer /></I18nProvider>);

      expect(screen.getByText('Guten Tag Test')).toBeInTheDocument();
    });
  });
});
