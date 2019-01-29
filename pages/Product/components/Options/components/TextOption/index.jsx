import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import TextField from '@shopgate/pwa-ui-shared/Form/TextField';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import withShowModal from '@shopgate/pwa-common/helpers/modal/withShowModal';
import transition from './../../../Characteristics/Characteristic/transition';
import { ProductContext } from '../../../../context';
import OptionInfo from './components/OptionInfo';
import styles from './style';

/**
 * @param {Object} props The compoent props.
 * @returns {JSX}
 */
class TextOption extends PureComponent {
  static propTypes = {
    /** @type {Conditioner} */
    conditioner: PropTypes.shape().isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    price: PropTypes.shape({
      currency: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
    }).isRequired,
    required: PropTypes.bool.isRequired,
    showModal: PropTypes.func.isRequired,
    info: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    info: null,
    value: null,
  }

  /**
     * @param {Object} props The component props.
     */
  constructor(props) {
    super(props);

    this.state = {
      highlight: false,
    };

    this.ref = null;
    props.conditioner.addConditioner(`text-option-${props.id}`, this.checkInput);
  }

  /**
   * @param {Object} ref ref
   */
  setRef = (ref) => {
    this.ref = ref;
  }

  /**
   * Remove highlight state
   */
  removeHighlight = () => {
    this.setState({ highlight: false });
  }

  /**
   * Checks if required input is done.
   * @return {boolean}
   */
  checkInput = () => {
    if (!this.props.required) {
      return true;
    }
    if (this.props.value) {
      return true;
    }

    this.ref.scrollIntoView({ behavior: 'smooth' });
    this.setState({ highlight: true });
    return false;
  }

  infoIcon = () => {
    if (!this.props.info) {
      return null;
    }
    const { label, info, showModal } = this.props;
    return (
      <div
        onClick={() => showModal({
          title: label,
          message: info,
        })}
        aria-hidden
      >
        <InfoIcon size={24} className={styles.infoIcon} />
      </div>
    );
  }

  /**
   * Handles form submits by key.
   * @param {Object} event The event that caused the keypress.
   */
  handleKeyPress = (event) => {
    // Enter key and on iOS also the "Done" button.
    if (event.which === 13) {
      this.ref.blur();
    }
  }

  /**
   * @return {JSX}
   */
  render() {
    const {
      id,
      label,
      value,
      onChange,
      required,
      price,
    } = this.props;

    return (
      <div className={styles.row}>
        <Transition in={this.state.highlight} timeout={700} onEntered={this.removeHighlight}>
          {state => (
            <Fragment>
              <div className={styles.wrapper} style={transition[state]}>
                <TextField
                  setRef={this.setRef}
                  name={`text_${id}`}
                  value={value}
                  onChange={val => onChange(id, val)}
                  onKeyPress={this.handleKeyPress}
                  placeholder={label}
                  label={label}
                  rightElement={this.infoIcon()}
                  data-test-id={label}
                  hasUnderline={false}
                  className={styles.element}
                />
              </div>
              <OptionInfo label={label} required={required} price={price} />
            </Fragment>
          )}
        </Transition>
      </div>
    );
  }
}

export default withShowModal(props => (
  <ProductContext.Consumer>
    {({ conditioner }) => (
      <TextOption conditioner={conditioner} {...props} />
    )}
  </ProductContext.Consumer>
));
