import {
  CircularProgress,
} from '@shopgate/engage/components/v2';
import { Section, SectionRow, SubSection } from '../SectionLayout';

/**
 * Demo section for miscellaneous components
 */
const Misc = () => (
  <Section title="Miscellaneous">
    <SectionRow>
      <SubSection title="Circular Progress">
        <SectionRow>
          <CircularProgress
            color="secondary"
            size={20}
            variant="indeterminate"
          />
          <CircularProgress
            color="primary"
            size={20}
            variant="determinate"
            value={20}
          />
        </SectionRow>
      </SubSection>
    </SectionRow>
  </Section>
);

export default Misc;
