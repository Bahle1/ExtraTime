import { useState } from 'react';
import styles from './ui.module.css';

type ShareOutcome = 'idle' | 'shared' | 'cancelled' | 'copied' | 'failed';

const STATUS_MESSAGES: Readonly<Record<ShareOutcome, string>> = {
  idle: '',
  shared: '',
  cancelled: '',
  copied: 'Link copied',
  failed: "Couldn't copy the link. Copy it from the address bar instead.",
};

/** Props of ShareButton. */
export interface ShareButtonProps {
  /** Site path such as /episodes/{slug}; shared as an absolute URL on this origin. */
  readonly path: string;
  readonly title: string;
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

async function shareLink(url: string, title: string): Promise<ShareOutcome> {
  if (typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, url });
      return 'shared';
    } catch (error) {
      if (isAbortError(error)) return 'cancelled';
      // Any other share-sheet failure falls back to the clipboard (LFR-17).
    }
  }
  await navigator.clipboard.writeText(url);
  return 'copied';
}

/** Shares a page: the native share sheet, else the clipboard with a "Link copied" status (LFR-17). */
export function ShareButton({ path, title }: ShareButtonProps) {
  const [outcome, setOutcome] = useState<ShareOutcome>('idle');
  const share = () => {
    setOutcome('idle');
    const url = new URL(path, window.location.origin).href;
    void shareLink(url, title).then(setOutcome, () => setOutcome('failed'));
  };
  return (
    <span className={styles.share}>
      <button
        className={styles.shareButton}
        type="button"
        aria-label={`Share ${title}`}
        onClick={share}
      >
        Share
      </button>
      <span className={styles.shareStatus} role="status">
        {STATUS_MESSAGES[outcome]}
      </span>
    </span>
  );
}
