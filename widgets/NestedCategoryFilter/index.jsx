import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { router } from '@virtuous/conductor';
import { RouteContext } from '@shopgate/pwa-common/context';
import I18n from '@shopgate/pwa-common/components/I18n';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import { CATEGORY_PATH } from '@shopgate/pwa-common-commerce/category/constants';
import ButtonLink from '@shopgate/pwa-ui-shared/ButtonLink';
import Headline from 'Components/Headline';
import CategoryPicker from './components/Picker';
import styles from './style';

/**
 * The NestedCategoryFilter component
 */
class NestedCategoryFilter extends PureComponent {
  static contextType = RouteContext;

  static propTypes = {
    id: PropTypes.string.isRequired,
    settings: PropTypes.shape().isRequired,
    persistedState: PropTypes.shape(),
  }

  static defaultProps = {
    persistedState: null,
  }

  /**
   * The component constructor.
   * @param {Object} props The components props.
   */
  constructor(props) {
    super(props);

    const defaultState = {
      pickers: [{
        categoryId: this.props.settings.categoryNumber,
        selectedId: null,
      }],
      buttonCategoryId: null,
    };

    this.state = props.persistedState || defaultState;
  }

  /**
   * Persists the widget state when the component is removed from the DOM.
   */
  componentWillUnmount() {
    router.update(this.context.id, {
      [this.props.id]: this.state,
    });
  }

  /**
   * Handles the selection of a subcategory within a category picker.
   * @param {string} categoryId The categoryId of the picker where a subcategory was selected.
   * @param {Object} subcategory The subcategory entity which was selected.
   */
  handleSelection = (categoryId, subcategory) => {
    const { pickers } = this.state;
    const { id: subcategoryId, childrenCount } = subcategory;

    const limitReached = pickers.length === this.props.settings.limit;
    const appendNewPicker = !!childrenCount && !limitReached;

    const selectedIndex = pickers.findIndex(picker => picker.categoryId === categoryId);

    // Get all pickers from the list, till the one where the selection happened.
    let updatedPickers = pickers.slice(0, selectedIndex + 1);
    // Add the selected subcategoryId to the picker.
    updatedPickers[updatedPickers.length - 1].selectedId = subcategoryId;

    if (appendNewPicker) {
      // Add a new picker entry if necessary.
      updatedPickers = updatedPickers.concat([{
        categoryId: subcategoryId,
        selectedId: null,
      }]);
    }

    this.setState({
      pickers: updatedPickers,
      buttonCategoryId: !appendNewPicker ? subcategoryId : null,
    });
  }

  /**
   * Creates the pickers.
   * @returns {JSX}
   */
  createPickers() {
    const { settings } = this.props;
    const { pickers } = this.state;
    const { limit } = settings;

    return (
      <div>
        {Array(parseInt(limit, 10)).fill('').map((entry, index) => {
          const { categoryId = null, selectedId } = pickers[index] || {};
          const key = categoryId === null ? `dummy_${index}` : categoryId;

          return (
            <CategoryPicker
              key={key}
              categoryId={categoryId}
              selectedId={selectedId}
              onSelect={this.handleSelection}
              label={settings[`label_${index + 1}`]}
            />
          );
        })}
      </div>
    );
  }

  /**
   * The render method.
   * @returns {JSX}
   */
  render() {
    const { buttonCategoryId } = this.state;

    return (
      <div className={styles.container}>
        <Headline text={this.props.settings.headline} />
        { this.createPickers() }
        <ButtonLink href={`${CATEGORY_PATH}/${bin2hex(buttonCategoryId)}`} disabled={!buttonCategoryId} flat={false}>
          <I18n.Text string="common.show_products" />
        </ButtonLink>
      </div>
    );
  }
}

export default props => (
  <RouteContext.Consumer>
    {({ state }) => (
      <NestedCategoryFilter {...props} persistedState={state[props.id]} />
    )}
  </RouteContext.Consumer>
);

export { NestedCategoryFilter as UnwrappedNestedCategoryFilter };
