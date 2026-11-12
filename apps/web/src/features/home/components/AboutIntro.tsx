import { useId } from 'react';
import { Link } from 'react-router';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { ABOUT_STORY } from '../../about/about.constants';
import { ABOUT_INTRO } from '../home.constants';
import styles from './home.module.css';

/** About split: a stacked statement on the left, the mission on the right (Filthy Fellas "Meet" pattern). */
export function AboutIntro() {
  const headingId = useId();
  return (
    <section className={ui.paper} aria-labelledby={headingId}>
      <div className={`${ui.container} ${ui.section} ${styles.split}`}>
        <div>
          <SectionHeading
            id={headingId}
            eyebrow={ABOUT_INTRO.eyebrow}
            lines={ABOUT_INTRO.headingLines}
            accentLine={ABOUT_INTRO.accentLine}
          />
        </div>
        <div className={styles.splitBody}>
          <p className={ui.standfirst}>Football gives us the platform. People give us the story.</p>
          <p>{ABOUT_STORY[0]}</p>
          <Link className={ui.textLink} to="/about">
            About ExtraTime →
          </Link>
        </div>
      </div>
    </section>
  );
}
