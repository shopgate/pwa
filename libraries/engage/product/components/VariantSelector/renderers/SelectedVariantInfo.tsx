import { makeStyles } from '@shopgate/engage/styles';
import { CharacteristicsButton } from '@shopgate/engage/back-in-stock/components';
import type { VariantSelection } from '../types';

const useStyles = makeStyles({ name: 'SelectedVariantInfo' })(theme => ({
  root: {
    display: 'flow-root',
    padding: theme.spacing(0, 2),
    marginTop: theme.spacing(-1),
    marginBottom: theme.spacing(2),
    '&:empty': {
      display: 'none',
    },
  },
}));

export interface SelectedVariantInfoProps {
  /** The complete selection. */
  selection: VariantSelection;
}

/**
 * Shows the back in stock button of the selected variant. The availability is part of the
 * product header, so it is not repeated here.
 * @returns The info.
 */
const SelectedVariantInfo = ({ selection }: SelectedVariantInfoProps) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.root, 'engage__variant-selector__selected-variant')}>
      <CharacteristicsButton characteristics={selection} />
    </div>
  );
};

export default SelectedVariantInfo;
