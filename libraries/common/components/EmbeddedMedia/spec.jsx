import React from 'react';
import { shallow } from 'enzyme';
import { embeddedMedia } from '@shopgate/pwa-common/collections';
import EmbeddedMedia from './index';

jest.mock('@shopgate/pwa-common/collections', () => ({
  embeddedMedia: {
    hasNotReady: jest.fn(),
    providers: new Set([{
      sdkReady: true,
      sdkUrl: 'http://foo.bar',
    }, {
      sdkReady: false,
      sdkUrl: 'http://bar.foo',
      onSdkLoaded: jest.fn(),
    }]),
  },
}));

describe('<EmbeddedMedia />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return children', () => {
    embeddedMedia.hasNotReady.mockReturnValueOnce(false);

    const wrapper = shallow((
      <EmbeddedMedia>
        <div>Children</div>
      </EmbeddedMedia>
    ));

    expect(wrapper.html()).toEqual('<div>Children</div>');
  });

  it('should render Helmet with a script', () => {
    embeddedMedia.hasNotReady.mockReturnValueOnce(true);
    const wrapper = shallow((
      <EmbeddedMedia>
        <div>Content with embedded media (youtube, vimeo, etc)</div>
      </EmbeddedMedia>
    ));

    const helmetProps = wrapper.find('HelmetWrapper').props();

    expect(helmetProps).toEqual(expect.objectContaining({
      onChangeClientState: expect.any(Function),
      script: [{
        src: 'http://bar.foo',
        type: 'text/javascript',
      }],
    }));

    const scriptTags = [{
      onload: jest.fn(),
      getAttribute: jest.fn().mockReturnValue('http://bar.foo'),
    }];

    // Invoke helmet cb
    helmetProps.onChangeClientState(null, { scriptTags });

    // Invoke onload on script
    scriptTags[0].onload();

    const [, secondProvider] = embeddedMedia.providers;
    expect(secondProvider.onSdkLoaded).toHaveBeenCalledTimes(1);
  });
});
