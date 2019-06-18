import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import debounce from 'lodash/debounce';
import TextField from '@shopgate/pwa-ui-shared/Form/TextField';
import InfoIcon from '@shopgate/pwa-ui-shared/icons/InfoIcon';
import withShowModal from '@shopgate/pwa-common/helpers/modal/withShowModal';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import transition from './../../../Characteristics/transition';
import { ProductContext } from '../../../../context';
import OptionInformation from './components/OptionInfo';
import styles from './style';

/**
 * The TextOption component
 */
class TextOption extends PureComponent {
  static propTypes = {
    conditioner: PropTypes.shape().isRequired,
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    price: PropTypes.number.isRequired,
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

    broadcastLiveMessage('product.fill_out_required_input_first', { force: true });
    this.ref.scrollIntoView({ behavior: 'smooth' });
    this.setState({ highlight: true });
    return false;
  }

  /**
   * @returns {JSX}
   */
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
   * @param {string} val value.
   */
  handleChange = (val) => {
    this.props.onChange(this.props.id, val, this.props.price);
  }

  handleDebounced = debounce(this.handleChange, 300)

  /**
   * @return {JSX}
   */
  render() {
    const {
      id,
      label,
      value,
      required,
      price,
      info,
    } = this.props;
    const optionInfoId = id;
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
                  onChange={this.handleDebounced}
                  onKeyPress={this.handleKeyPress}
                  placeholder={label}
                  label={label}
                  rightElement={this.infoIcon()}
                  data-test-id={label}
                  hasUnderline={false}
                  className={styles.element}
                  attributes={{
                    'aria-describedby': optionInfoId,
                  }}
                />
              </div>
              <OptionInformation
                label={label}
                required={required}
                price={price}
                info={info}
                optionInfoId={optionInfoId}
              />
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
