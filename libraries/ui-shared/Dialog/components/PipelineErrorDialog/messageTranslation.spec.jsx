import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PipelineErrorDialog from './index';

// Isolate the dialog and make i18n observable, so we can tell a value that was run through
// I18n.Text (a locale key) apart from one rendered verbatim (already-translated text). This lives
// in its own file because the module-level mocks would otherwise overwrite the snapshot tests in
// the sibling spec.jsx.
jest.mock('../BasicDialog', () => ({
  __esModule: true,
  default: ({ children }) => children,
}));
jest.mock('@shopgate/engage/components', () => ({
  __esModule: true,
  I18n: {
    // eslint-disable-next-line react/prop-types
    Text: ({ string }) => <span>{`i18n(${string})`}</span>,
  },
}));

const baseParams = {
  code: '123',
  message: 'raw backend message',
  pipeline: 'fakePipeline',
  request: {},
};

describe('<PipelineErrorDialog /> message translation', () => {
  it('should run a locale-key message through I18n.Text when translated is false', () => {
    // This is what error.js now sends whenever the display message is a key (generic fallback,
    // code-mapped key, or a pipeline-provided i18n key) rather than already-human text.
    render((
      <PipelineErrorDialog
        actions={[]}
        message="cart.error_out_of_stock"
        params={{
          ...baseParams,
          translated: false,
        }}
      />
    ));

    // The key was translated, not shown verbatim to the user.
    expect(screen.getByText('i18n(cart.error_out_of_stock)')).toBeInTheDocument();
    expect(screen.queryByText('cart.error_out_of_stock')).not.toBeInTheDocument();
  });

  it('should render an already-translated message verbatim when translated is true', () => {
    render((
      <PipelineErrorDialog
        actions={[]}
        message="Der Artikel ist nicht mehr verfügbar"
        params={{
          ...baseParams,
          translated: true,
        }}
      />
    ));

    expect(screen.getByText('Der Artikel ist nicht mehr verfügbar')).toBeInTheDocument();
    // It must not be passed through i18n (which would wrap the string).
    expect(
      screen.queryByText('i18n(Der Artikel ist nicht mehr verfügbar)')
    ).not.toBeInTheDocument();
  });
});
