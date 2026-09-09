import { useState, useMemo, useCallback } from 'react';
import { makeStyles } from '@shopgate/engage/styles';
import {
  TimeIcon,
  PhoneIcon,
  Switch,
  RadioGroup,
  RadioGroupItem,
} from '@shopgate/engage/components';
import {
  Button,
  ButtonGroup,
} from '@shopgate/engage/components/v2';
import {
  Section,
  SubSection,
  SectionRow,
} from '../SectionLayout';

const useStyles = makeStyles()(theme => ({
  settings: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing(1),
  },
  switchGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
  },
  overriddenButton: {
    borderRadius: 0,
    background: theme.palette.grey[900],
    color: theme.palette.common.white,
  },
  sizeRadioButtons: {
    display: 'flex',
    flexDirection: 'row',
    gap: theme.spacing(1),
    justifyContent: 'center',
    paddingBottom: 0,
    '& .placeholder': {
      display: 'none',
    },
    '& .label': {
      paddingBottom: 'none',
    },
    '& .radioGroup': {
      display: 'flex',
      flexDirection: 'row',
      gap: theme.spacing(1),
    },
  },
}));

/**
 * Demo section for buttons
 */
const Buttons = () => {
  const { classes } = useStyles();

  const [loading, setLoading] = useState(false);
  const [showStartIcon, setShowStartIcon] = useState(true);
  const [showEndIcon, setShowEndIcon] = useState(false);
  const [enableElevation, setEnableElevation] = useState(false);
  const [dense, setDense] = useState(false);
  const [loadingPosition, setLoadingPosition] = useState<'start' | 'center' | 'end'>('center');
  const [groupSize, setGroupSize] = useState<'small' | 'medium' | 'large'>('medium');

  const [groupDisabled, setGroupDisabled] = useState(false);

  const startIcon = useMemo(() => (showStartIcon ? <PhoneIcon /> : null), [showStartIcon]);
  const endIcon = useMemo(() => (showEndIcon ? <TimeIcon /> : null), [showEndIcon]);

  const handleLoadingPositionChange = useCallback((update: 'start' | 'center' | 'end') => {
    setLoadingPosition(update);
  }, []);

  const handleGroupSizeChange = useCallback((update: 'small' | 'medium' | 'large') => {
    setGroupSize(update);
  }, []);

  return (
    <Section title="Buttons">
      <SubSection title="Variants">
        <SectionRow className={classes.settings}>
          <div className={classes.switchGroup}>
            <div>
              <Switch
                checked={enableElevation}
                onChange={() => setEnableElevation(!enableElevation)}
              >
                Enable Elevation
              </Switch>
            </div>
            <div>
              <Switch checked={dense} onChange={() => setDense(!dense)}>
                Dense
              </Switch>
            </div>
            <div>
              <Switch
                checked={loading}
                onChange={() => setLoading(!loading)}
              >
                Loading
              </Switch>
            </div>
            <div>
              <Switch
                checked={showStartIcon}
                onChange={() => setShowStartIcon(!showStartIcon)}
              >
                Start Icon
              </Switch>
            </div>
            <div>
              <Switch
                checked={showEndIcon}
                onChange={() => setShowEndIcon(!showEndIcon)}
              >
                End Icon
              </Switch>
            </div>
          </div>
          <div>
            <RadioGroup
              label="Loading Position"
              name="loading-position"
              value={loadingPosition}
              onChange={handleLoadingPositionChange}
            >
              <RadioGroupItem label="Start" name="start" />
              <RadioGroupItem label="Center" name="center" />
              <RadioGroupItem label="End" name="end" />
            </RadioGroup>
          </div>
        </SectionRow>
        <SectionRow>
          <Button
            variant="contained"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loadingPosition={loadingPosition}
            loading={loading}
          >
            Contained
          </Button>
          <Button
            variant="outlined"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Outlined
          </Button>
          <Button
            variant="text"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Text
          </Button>
          <Button
            variant="link"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Link
          </Button>

        </SectionRow>
        <SectionRow>
          <Button
            variant="contained"
            color="secondary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
            fullWidth
          >
            Full Width
          </Button>
        </SectionRow>
      </SubSection>
      <SubSection title="Colors">
        <SectionRow>
          <Button variant="contained" color="cta">Cta</Button>
          <Button variant="contained" color="error">Error</Button>
          <Button variant="contained" color="inherit">Inherit</Button>
        </SectionRow>
        <SectionRow>
          <Button variant="text" color="cta">Cta</Button>
          <Button variant="outlined" color="error">Error</Button>
          <Button variant="text" color="inherit">Inherit</Button>
        </SectionRow>
      </SubSection>
      <SubSection title="Element">
        <SectionRow>
          <Button component="a" color="primary">Renders an anchor</Button>
          <Button href="/cart" color="primary">Links to the cart</Button>
          <Button href="/cart" color="primary" disabled>Disabled link</Button>
        </SectionRow>
      </SubSection>
      <SubSection title="States and overrides">
        <SectionRow>
          <Button variant="contained" color="primary" disabled>Disabled</Button>
          <Button variant="outlined" color="primary" disabled>Disabled</Button>
          <Button variant="text" color="primary" disabled>Disabled</Button>
          <Button variant="link" color="primary" disabled>Disabled</Button>
        </SectionRow>
        <SectionRow>
          {/* Proves that a consumer class wins over the variant styles. */}
          <Button
            variant="contained"
            color="primary"
            classes={{ root: classes.overriddenButton }}
          >
            Class Override
          </Button>
        </SectionRow>
      </SubSection>
      <SubSection title="Sizes">
        <SectionRow>
          <Button
            variant="contained"
            size="small"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Small
          </Button>
          <Button
            variant="contained"
            size="medium"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Medium
          </Button>
          <Button
            variant="contained"
            size="large"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Large
          </Button>
        </SectionRow>
        <SectionRow>
          <Button
            variant="outlined"
            size="small"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Small
          </Button>
          <Button
            variant="outlined"
            size="medium"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Medium
          </Button>
          <Button
            variant="outlined"
            size="large"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Large
          </Button>
        </SectionRow>
        <SectionRow>
          <Button
            variant="text"
            size="small"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Small
          </Button>
          <Button
            variant="text"
            size="medium"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Medium
          </Button>
          <Button
            variant="text"
            size="large"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Large
          </Button>
        </SectionRow>
        <SectionRow>
          <Button
            variant="link"
            size="small"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Small
          </Button>
          <Button
            variant="link"
            size="medium"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Medium
          </Button>
          <Button
            variant="link"
            size="large"
            color="primary"
            enableElevation={enableElevation}
            dense={dense}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Large
          </Button>
        </SectionRow>
      </SubSection>
      <SubSection title="Button Groups">
        <SectionRow>
          <div>
            <Switch
              checked={groupDisabled}
              onChange={() => setGroupDisabled(!groupDisabled)}
            >
              Disable Groups
            </Switch>
          </div>
          <RadioGroup
            label="Group Size"
            name="group-size"
            value={groupSize}
            onChange={handleGroupSizeChange}
            className={classes.sizeRadioButtons}
          >
            <RadioGroupItem label="Small" name="small" />
            <RadioGroupItem label="Medium" name="medium" />
            <RadioGroupItem label="Large" name="large" />
          </RadioGroup>
        </SectionRow>
        <SectionRow>
          <ButtonGroup
            variant="contained"
            color="primary"
            size={groupSize}
            disabled={groupDisabled}
            enableElevation={enableElevation}
            dense={dense}
          >
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </SectionRow>
        <SectionRow>
          <ButtonGroup
            variant="outlined"
            color="primary"
            size={groupSize}
            disabled={groupDisabled}
            enableElevation={enableElevation}
            dense={dense}
          >
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </SectionRow>
        <SectionRow>
          <ButtonGroup
            variant="text"
            color="primary"
            size={groupSize}
            disabled={groupDisabled}
            enableElevation={enableElevation}
            dense={dense}
          >
            <Button>One</Button>
            <Button>Two</Button>
            <Button>Three</Button>
          </ButtonGroup>
        </SectionRow>
        <SectionRow>
          <div>
            <ButtonGroup
              variant="contained"
              color="primary"
              orientation="vertical"
              size={groupSize}
              disabled={groupDisabled}
              enableElevation={enableElevation}
              dense={dense}
            >
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </div>
          <div>
            <ButtonGroup
              variant="outlined"
              color="primary"
              orientation="vertical"
              size={groupSize}
              disabled={groupDisabled}
              enableElevation={enableElevation}
              dense={dense}
            >
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </div>
          <div>
            <ButtonGroup
              variant="text"
              color="primary"
              orientation="vertical"
              size={groupSize}
              disabled={groupDisabled}
              enableElevation={enableElevation}
              dense={dense}
            >
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </div>

        </SectionRow>
      </SubSection>
    </Section>
  );
};

export default Buttons;
