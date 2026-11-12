import { pageTitle, SITE_NAME, SITE_SLOGAN } from '../../../components/layout/layout.constants';
import { SectionHeading } from '../../../components/ui/SectionHeading';
import ui from '../../../components/ui/ui.module.css';
import { ABOUT_CONTACT, ABOUT_STORY } from '../about.constants';
import styles from '../about.module.css';

/** /about: the ExtraTime story, slogan and contact route (LFR-20, FR-24). */
export function AboutPage() {
  return (
    <article>
      <title>{pageTitle('About')}</title>
      <div className={`${ui.container} ${styles.hero}`}>
        <SectionHeading eyebrow="Our story" lines={['About', SITE_NAME]} accentLine={1} level={1} />
        <p className={styles.slogan}>{SITE_SLOGAN}</p>
      </div>
      <section className={ui.paper} aria-labelledby="about-story">
        <div className={`${ui.container} ${ui.section} ${styles.story}`}>
          <h2 className={styles.blockLabel} id="about-story">
            Our story
          </h2>
          <div className={styles.storyBody}>
            {ABOUT_STORY.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.contact} aria-labelledby="about-contact">
        <div className={`${ui.container} ${styles.contactInner}`}>
          <h2 className={styles.contactHeading} id="about-contact">
            {ABOUT_CONTACT.heading}
          </h2>
          <div className={styles.contactBody}>
            <p>{ABOUT_CONTACT.text}</p>
            <a className={ui.buttonPrimary} href={ABOUT_CONTACT.url} rel="noopener noreferrer">
              {ABOUT_CONTACT.linkLabel}
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
