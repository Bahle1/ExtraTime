import styles from './feedback.module.css';

/** Props of LoadingState. */
export interface LoadingStateProps {
  /** Visible, announced text such as "Loading episodes". */
  readonly label: string;
}

/** Busy placeholder that reserves space for the content it stands in for (LFR-14). */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className={styles.loading} role="status" aria-busy="true">
      <span className={styles.spinner} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
