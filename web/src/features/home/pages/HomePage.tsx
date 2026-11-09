import { pageTitle, SITE_SLOGAN } from '../../../components/layout/layout.constants';
import { Ticker } from '../../../components/ui/Ticker';
import { AboutIntro } from '../components/AboutIntro';
import { FollowCta } from '../components/FollowCta';
import { GuestSpotlight } from '../components/GuestSpotlight';
import { HeroFeaturedEpisode } from '../components/HeroFeaturedEpisode';
import { HostsStrip } from '../components/HostsStrip';
import { LatestEpisodesRail } from '../components/LatestEpisodesRail';
import { SocialHighlights } from '../components/SocialHighlights';
import { WaysIn } from '../components/WaysIn';
import { TICKER_WORDS } from '../home.constants';

/** /: hero, ticker, about, founders, latest conversations, ways in, guests, socials and follow (LFR-15). */
export function HomePage() {
  return (
    <>
      <title>{pageTitle(SITE_SLOGAN)}</title>
      <HeroFeaturedEpisode />
      <Ticker words={TICKER_WORDS} />
      <AboutIntro />
      <LatestEpisodesRail />
      <HostsStrip />
      <WaysIn />
      <GuestSpotlight />
      <SocialHighlights />
      <FollowCta />
    </>
  );
}
