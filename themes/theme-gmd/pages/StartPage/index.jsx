import React, { Component } from 'react';
import View from 'Components/View';
import { PAGE_ID_INDEX } from '@shopgate/engage/page';
import PageContent from '../Page/components/Content';

let windowLoaded = false;

/**
 * @returns {JSX}
 */
class StartPage extends Component {
  state = { content: windowLoaded };

  /**
   * Component did mount callback
   */
  componentDidMount() {
    if (!windowLoaded) {
      window.addEventListener('load', this.onWindowLoad);
    }
  }

  /**
   * Listener for window.load event
   */
  onWindowLoad = () => {
    // With small timeout to let window commit loaded state
    setTimeout(() => this.setState({ content: true }), 50);
    windowLoaded = true;
  }

  /**
   * @returns {JSX}
   */
  render() {
    return (
      <View>
        {this.state.content && <PageContent pageId={PAGE_ID_INDEX} />}
      </View>
    );
  }
}

export default StartPage;
