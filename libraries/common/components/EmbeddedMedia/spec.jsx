import { render } from '@testing-library/react';
import Helmet from 'react-helmet';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import EmbeddedMedia from './index';

jest.mock('react-helmet', () => jest.fn(() => null));

jest.mock('@shopgate/pwa-common/collections', () => ({
  embeddedMedia: {
    getHasPendingProviders: jest.fn(),
    providers: new Set([{
      isPending: false,
      remoteScriptUrl: 'http://foo.bar',
    }, {
      isPending: true,
      remoteScriptUrl: 'http://bar.foo',
      onScriptLoaded: jest.fn(),
    }]),
  },
}));

describe('<EmbeddedMedia />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return children', () => {
    embeddedMedia.getHasPendingProviders.mockReturnValueOnce(false);

    const { container } = render((
      <EmbeddedMedia>
        <div>Children</div>
      </EmbeddedMedia>
    ));

    expect(container.innerHTML).toEqual('<div>Children</div>');
    expect(Helmet).not.toHaveBeenCalled();
  });

  it('should render Helmet with a script', () => {
    embeddedMedia.getHasPendingProviders.mockReturnValueOnce(true);
    render((
      <EmbeddedMedia cookieConsentSettings={{ comfortCookiesAccepted: true }}>
        <div>Content with embedded media (youtube, vimeo, etc)</div>
      </EmbeddedMedia>
    ));

    const helmetProps = Helmet.mock.lastCall[0];

    expect(helmetProps.script).toEqual([{
      src: 'http://bar.foo',
      type: 'text/javascript',
    }]);

    const scriptTags = [{
      getAttribute: jest.fn().mockReturnValue('http://bar.foo'),
    }];

    helmetProps.onChangeClientState(null, { scriptTags });

    scriptTags[0].onload();

    const [, secondProvider] = embeddedMedia.providers;
    expect(secondProvider.onScriptLoaded).toHaveBeenCalledTimes(1);
  });
});
