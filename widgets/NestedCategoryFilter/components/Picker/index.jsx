import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Sheet from './components/Sheet';
import connect from './connector';
import styles from './style';

/**
 * The CategoryPicker component.
 */
class CategoryPicker extends PureComponent {
  static propTypes = {
    fetchCategory: PropTypes.func.isRequired,
    onSelect: PropTypes.func.isRequired,
    categoryId: PropTypes.string,
    label: PropTypes.string,
    selectedId: PropTypes.string,
    subcategories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    })),
  }

  static defaultProps = {
    categoryId: null,
    label: '',
    selectedId: null,
    subcategories: null,
  }

  static contextTypes = {
    i18n: PropTypes.func,
  };

  state = {
    sheet: false,
    disabled: false,
  };

  /**
   * Determines the disabled state for the component.
   * @param {Object} props The component props.
   * @return {Object}
   */
  static getDerivedStateFromProps(props) {
    const hasSubcategories = Array.isArray(props.subcategories) && props.subcategories.length > 0;

    return {
      disabled: !hasSubcategories || props.categoryId === null,
    };
  }

  /**
   * Get the category data for the category once the component has mounted.
   */
  componentDidMount() {
    const { categoryId, subcategories, fetchCategory } = this.props;
    if (categoryId !== null && subcategories === null) {
      fetchCategory(categoryId);
    }
  }

  /**
   * @param {string} defaultLabel The default button label.
   * @return {string}
   */
  getPickerLabel = (defaultLabel) => {
    const { subcategories, selectedId } = this.props;

    if (!selectedId) {
      return defaultLabel;
    }

    const subcategory = subcategories.find(val => (val.id === selectedId));

    return subcategory.name;
  }

  /**
   * Closes the sheet.
   */
  closeSheet = () => {
    this.setState({ sheet: false });
  }

  /**
   * Click handler for the picker button.
   * @param {Object} event The event object.
   */
  handlePickerClick = (event) => {
    event.preventDefault();

    if (this.state.disabled) {
      return;
    }

    this.setState({ sheet: true });
  }

  /**
   * Selection handler for the sheet.
   * @param {string} subcategoryId The selected subcategoryId.
   */
  handleSheetSelect = (subcategoryId) => {
    const { categoryId, subcategories, onSelect } = this.props;
    const subcategory = subcategories.find(item => item.id === subcategoryId);
    onSelect(categoryId, subcategory);
    this.closeSheet();
  }

  /**
   * Render method of the component.
   * @returns {JSX}
   */
  render() {
    const { __ } = this.context.i18n();
    const { selectedId, subcategories, label } = this.props;
    const { disabled } = this.state;

    const buttonLabel = this.getPickerLabel(__('common.please_choose'));
    const pickerClasses = classNames(
      styles.button,
      { [styles.buttonDisabled]: disabled }
    );

    return (
      <Fragment>
        <div
          aria-hidden
          onClick={this.handlePickerClick}
          className={pickerClasses}
        >
          {label && <div className={styles.label}>{label}</div>}
          <div className={styles.selection}>{buttonLabel}</div>
        </div>
        <Sheet
          items={subcategories || []}
          onSelect={this.handleSheetSelect}
          onClose={this.closeSheet}
          open={this.state.sheet}
          selectedId={selectedId}
          label={label}
        />
      </Fragment>
    );
  }
}

export default connect(CategoryPicker);
