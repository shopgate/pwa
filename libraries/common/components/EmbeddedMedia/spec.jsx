import React from 'react';
import { shallow } from 'enzyme';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import EmbeddedMedia from './index';

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

    const wrapper = shallow((
      <EmbeddedMedia>
        <div>Children</div>
      </EmbeddedMedia>
    ));

    expect(wrapper.html()).toEqual('<div>Children</div>');
  });

  it.skip('should render Helmet with a script', () => {
    embeddedMedia.getHasPendingProviders.mockReturnValueOnce(true);
    const wrapper = shallow((
      <EmbeddedMedia>
        <div>Content with embedded media (youtube, vimeo, etc)</div>
      </EmbeddedMedia>
    ));

    const helmetProps = wrapper.find('HelmetWrapper').props();

    expect(helmetProps).toEqual({
      defer: true,
      encodeSpecialCharacters: true,
      onChangeClientState() { },
      script: [],
    });

    const scriptTags = [{
      onload: jest.fn(),
      getAttribute: jest.fn().mockReturnValue('http://bar.foo'),
    }];

    // Invoke helmet cb
    helmetProps.onChangeClientState(null, { scriptTags });

    // Invoke onload on script
    scriptTags[0].onload();

    const [, secondProvider] = embeddedMedia.providers;
    expect(secondProvider.onScriptLoaded).toHaveBeenCalledTimes(1);
  });
});
