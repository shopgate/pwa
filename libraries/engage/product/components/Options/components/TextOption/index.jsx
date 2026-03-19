import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import debounce from 'lodash/debounce';
import { TextField, InfoIcon } from '@shopgate/engage/components';
import { withShowModal } from '@shopgate/engage/core/hocs';
import { withStyles } from '@shopgate/engage/styles';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { ProductContext } from '@shopgate/engage/product/contexts';
import transition from '@shopgate/engage/product/components/Characteristics/transition';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import OptionInformation from './components/OptionInfo';

const { colors, variables } = themeConfig;

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
    classes: PropTypes.shape({
      element: PropTypes.string,
      infoIcon: PropTypes.string,
      row: PropTypes.string,
      wrapper: PropTypes.string,
    }),
    info: PropTypes.string,
    value: PropTypes.string,
  };

  static defaultProps = {
    classes: {
      element: '',
      infoIcon: '',
      row: '',
      wrapper: '',
    },
    info: null,
    value: null,
  };

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
  };

  /**
   * Remove highlight state
   */
  removeHighlight = () => {
    this.setState({ highlight: false });
  };

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

    broadcastLiveMessage('product.fill_out_required_input_first');
    this.ref.scrollIntoView({ behavior: 'smooth' });
    this.setState({ highlight: true });
    return false;
  };

  /**
   * @returns {JSX}
   */
  infoIcon = () => {
    if (!this.props.info) {
      return null;
    }
    const {
      label, info, showModal,
    } = this.props;
    const classes = withStyles.getClasses(this.props);
    return (
      <div
        onClick={() => showModal({
          title: label,
          message: info,
        })}
        aria-hidden
      >
        <InfoIcon size={24} className={classes.infoIcon} />
      </div>
    );
  };

  /**
   * Handles form submits by key.
   * @param {Object} event The event that caused the keypress.
   */
  handleKeyPress = (event) => {
    // Enter key and on iOS also the "Done" button.
    if (event.which === 13) {
      this.ref.blur();
    }
  };

  /**
   * @param {string} val value.
   */
  handleChange = (val) => {
    this.props.onChange(this.props.id, val, this.props.price);
  };

  handleDebounced = debounce(this.handleChange, 300);

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
    const classes = withStyles.getClasses(this.props);
    const optionInfoId = id;
    return (
      <div className={classes.row}>
        <Transition in={this.state.highlight} timeout={700} onEntered={this.removeHighlight}>
          {state => (
            <>
              <div className={classes.wrapper} style={transition[state]}>
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
                  className={classes.element}
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
            </>
          )}
        </Transition>
      </div>
    );
  }
}

const StyledTextOption = withStyles(
  TextOption,
  () => ({
    row: {
      marginBottom: variables.gap.small,
    },
    wrapper: {
      backgroundColor: 'var(--color-background-accent)',
      padding: `${variables.gap.small}px ${variables.gap.big}px`,
      minHeight: 56,
    },
    element: {
      paddingBottom: 0,
      '& label': {
        fontWeight: 400,
        color: 'var(--color-text-high-emphasis, inherit)',
      },
      '& input': {
        fontWeight: 500,
        color: 'var(--color-text-high-emphasis)',
      },
      '& .placeholder': {
        color: 'var(--color-text-low-emphasis)',
      },
    },
    infoIcon: {
      color: colors.shade9,
    },
  })
);

export default withShowModal(props => (
  <ProductContext.Consumer>
    {({ conditioner }) => (
      <StyledTextOption conditioner={conditioner} {...props} />
    )}
  </ProductContext.Consumer>
));
