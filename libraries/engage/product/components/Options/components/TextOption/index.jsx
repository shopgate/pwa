import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  memo,
} from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import debounce from 'lodash/debounce';
import { TextField, InfoIcon } from '@shopgate/engage/components';
import { withShowModal } from '@shopgate/engage/core/hocs';
import { makeStyles } from '@shopgate/engage/styles';
import { broadcastLiveMessage } from '@shopgate/engage/a11y';
import { ProductContext } from '@shopgate/engage/product/contexts';
import transition from '@shopgate/engage/product/components/Characteristics/transition';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import OptionInformation from './components/OptionInfo';

const { colors } = themeConfig;

const useStyles = makeStyles()(theme => ({
  row: {
    marginBottom: theme.spacing(1),
  },
  wrapper: {
    backgroundColor: 'var(--color-background-accent)',
    padding: theme.spacing(1, 2),
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
      color: theme.palette.text.primary,
    },
    '& .placeholder': {
      color: theme.palette.text.secondary,
    },
  },
  infoIcon: {
    color: colors.shade9,
  },
}));

/**
 * The TextOption component
 * @param {Object} props Props.
 * @returns {JSX.Element}
 */
const TextOption = ({
  conditioner,
  id,
  label,
  onChange,
  price,
  required,
  showModal,
  info,
  value,
}) => {
  const { classes } = useStyles();
  const [highlight, setHighlight] = useState(false);
  const fieldRef = useRef(null);

  const conditionerName = `text-option-${id}`;

  const checkInput = useCallback(() => {
    if (!required) {
      return true;
    }
    if (value) {
      return true;
    }
    broadcastLiveMessage('product.fill_out_required_input_first');
    fieldRef.current?.scrollIntoView({ behavior: 'smooth' });
    setHighlight(true);
    return false;
  }, [required, value]);

  useEffect(() => {
    conditioner.addConditioner(conditionerName, checkInput);
    return () => {
      conditioner.removeConditioner(conditionerName);
    };
  }, [checkInput, conditioner, conditionerName]);

  const setRef = useCallback((ref) => {
    fieldRef.current = ref;
  }, []);

  const removeHighlight = useCallback(() => {
    setHighlight(false);
  }, []);

  const handleChange = useCallback((val) => {
    onChange(id, val, price);
  }, [id, onChange, price]);

  const handleDebounced = useMemo(
    () => debounce(handleChange, 300),
    [handleChange]
  );

  useEffect(() => () => {
    handleDebounced.cancel();
  }, [handleDebounced]);

  const handleKeyPress = useCallback((event) => {
    if (event.which === 13) {
      fieldRef.current?.blur();
    }
  }, []);

  const infoIcon = useCallback(() => {
    if (!info) {
      return null;
    }
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
  }, [classes.infoIcon, info, label, showModal]);

  const optionInfoId = id;

  return (
    <div className={classes.row}>
      <Transition in={highlight} timeout={700} onEntered={removeHighlight}>
        {state => (
          <>
            <div className={classes.wrapper} style={transition[state]}>
              <TextField
                setRef={setRef}
                name={`text_${id}`}
                value={value}
                onChange={handleDebounced}
                onKeyPress={handleKeyPress}
                placeholder={label}
                label={label}
                rightElement={infoIcon()}
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
};

TextOption.propTypes = {
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

TextOption.defaultProps = {
  info: null,
  value: null,
};

const MemoTextOption = memo(TextOption);

export default withShowModal(props => (
  <ProductContext.Consumer>
    {({ conditioner }) => (
      <MemoTextOption conditioner={conditioner} {...props} />
    )}
  </ProductContext.Consumer>
));
