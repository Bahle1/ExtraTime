import { ApiError } from '../../lib/api/ApiError';
import styles from './feedback.module.css';

const ERROR_TITLE = "This content didn't load";
const NETWORK_MESSAGE = "We couldn't reach ExtraTime. Check your connection, then try again.";
const SERVER_MESSAGE = 'Something went wrong on our side. Please try again in a moment.';

/** Props of ErrorState. */
export interface ErrorStateProps {
  /** The failure; only its kind is shown, never raw messages or stack traces. */
  readonly error: unknown;
  readonly onRetry: () => void;
}

function describeError(error: unknown): string {
  const isNetwork = error instanceof ApiError && error.fields.kind === 'network';
  return isNetwork ? NETWORK_MESSAGE : SERVER_MESSAGE;
}

/** Failure block with a Retry button (LFR-14). */
export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className={styles.error} role="alert">
      <p className={styles.title}>{ERROR_TITLE}</p>
      <p>{describeError(error)}</p>
      <button className={styles.button} type="button" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
