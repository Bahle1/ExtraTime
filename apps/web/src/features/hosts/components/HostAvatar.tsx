import type { Image } from '@extratime/shared';
import styles from './hosts.module.css';

/** Props of HostAvatar. */
export interface HostAvatarProps {
  readonly name: string;
  /** Contract avatar; null renders initials (LFR-18). */
  readonly avatar: Image | null;
  /** 'large' on profile pages; defaults to 'medium'. */
  readonly size?: 'medium' | 'large';
}

function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter((word) => word !== '');
  const ends = words.length > 1 ? [words[0], words.at(-1)] : words;
  return ends
    .map((word) => word?.charAt(0) ?? '')
    .join('')
    .toUpperCase();
}

/** Host portrait, or initials hidden from assistive technology beside the visible name (§3.6.7). */
export function HostAvatar({ name, avatar, size = 'medium' }: HostAvatarProps) {
  if (avatar === null) {
    return (
      <span className={styles.avatar} data-size={size} aria-hidden="true">
        {initialsOf(name)}
      </span>
    );
  }
  return (
    <img
      className={styles.avatar}
      data-size={size}
      src={avatar.url}
      alt={avatar.alt}
      width={avatar.width}
      height={avatar.height}
    />
  );
}
