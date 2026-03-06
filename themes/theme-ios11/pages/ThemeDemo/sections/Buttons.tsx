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
}));

/**
 * Demo section for buttons
 */
const Buttons = () => {
  const { classes } = useStyles();

  const [loading, setLoading] = useState(false);
  const [showStartIcon, setShowStartIcon] = useState(true);
  const [showEndIcon, setShowEndIcon] = useState(false);
  const [disableElevation, setDisableElevation] = useState(false);
  const [loadingPosition, setLoadingPosition] = useState<'start' | 'center' | 'end'>('center');

  const [groupDisabled, setGroupDisabled] = useState(false);

  const startIcon = useMemo(() => (showStartIcon ? <PhoneIcon /> : null), [showStartIcon]);
  const endIcon = useMemo(() => (showEndIcon ? <TimeIcon /> : null), [showEndIcon]);

  const handleLoadingPositionChange = useCallback((update: 'start' | 'center' | 'end') => {
    setLoadingPosition(update);
  }, []);

  return (
    <Section title="Buttons">
      <SubSection title="Variants">
        <SectionRow className={classes.settings}>
          <div>
            <div>
              <Switch
                checked={disableElevation}
                onChange={() => setDisableElevation(!disableElevation)}
              >
                Disable Elevation
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
            disableElevation={disableElevation}
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
            disableElevation={disableElevation}
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
            disableElevation={disableElevation}
            startIcon={startIcon}
            endIcon={endIcon}
            loading={loading}
            loadingPosition={loadingPosition}
          >
            Text
          </Button>

        </SectionRow>
        <SectionRow>
          <Button
            variant="contained"
            color="secondary"
            disableElevation={disableElevation}
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
      <SubSection title="Sizes">
        <SectionRow>
          <Button variant="contained" size="small" color="primary">
            Small
          </Button>
          <Button variant="contained" size="medium" color="primary">
            Medium
          </Button>
          <Button variant="contained" size="large" color="primary">
            Large
          </Button>
        </SectionRow>
        <SectionRow>
          <Button variant="outlined" size="small" color="primary">
            Small
          </Button>
          <Button variant="outlined" size="medium" color="primary">
            Medium
          </Button>
          <Button variant="outlined" size="large" color="primary">
            Large
          </Button>
        </SectionRow>
        <SectionRow>
          <Button variant="text" size="small" color="primary">
            Small
          </Button>
          <Button variant="text" size="medium" color="primary">
            Medium
          </Button>
          <Button variant="text" size="large" color="primary">
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
        </SectionRow>
        <SectionRow>
          <ButtonGroup
            variant="contained"
            color="primary"
            disabled={groupDisabled}
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
            disabled={groupDisabled}
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
            disabled={groupDisabled}
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
              disabled={groupDisabled}
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
              disabled={groupDisabled}
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
              disabled={groupDisabled}
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
