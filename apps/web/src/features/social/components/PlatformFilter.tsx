import type { Platform, SourceStatus } from '@extratime/shared';
import { PLATFORMS } from '@extratime/shared/constants';
import { useId } from 'react';
import { formatPlatform } from '../../../lib/formatting/formatPlatform';
import styles from './social.module.css';

const ALL_PLATFORMS_LABEL = 'All';

/** Props of PlatformFilter. */
export interface PlatformFilterProps {
  /** Selected platform; null shows every platform. */
  readonly value: Platform | null;
  readonly onChange: (platform: Platform | null) => void;
  /** Snapshot sources from meta.sources; disabled platforms are not offered (LFR-19). */
  readonly sources: readonly SourceStatus[];
}

/** Labelled group of toggle buttons; aria-pressed marks the current option (§3.6.7). */
export function PlatformFilter({ value, onChange, sources }: PlatformFilterProps) {
  const labelId = useId();
  const disabled = new Set(
    sources.filter((source) => source.status === 'disabled').map((source) => source.platform),
  );
  const options = [null, ...PLATFORMS.filter((platform) => !disabled.has(platform))];
  return (
    <div className={styles.filter} role="group" aria-labelledby={labelId}>
      <span className={styles.filterLabel} id={labelId}>
        Filter by platform
      </span>
      {options.map((option) => (
        <button
          className={styles.filterOption}
          key={option ?? ALL_PLATFORMS_LABEL}
          type="button"
          aria-pressed={option === value}
          onClick={() => onChange(option)}
        >
          {option === null ? ALL_PLATFORMS_LABEL : formatPlatform(option)}
        </button>
      ))}
    </div>
  );
}
