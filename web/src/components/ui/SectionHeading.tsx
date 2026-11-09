import { Fragment } from 'react';
import styles from './ui.module.css';

/** Props of SectionHeading. */
export interface SectionHeadingProps {
  /** Stacked display lines; the accessible name is the lines joined with spaces. */
  readonly lines: readonly string[];
  /** Index of the line shown in the accent colour, if any. */
  readonly accentLine?: number;
  /** Mono label above the heading, such as "The archive". */
  readonly eyebrow?: string;
  /** 1 for page headings (focusable for route-change focus), else 2. */
  readonly level?: 1 | 2;
  readonly id?: string;
}

/** Props of StackedLines. */
export interface StackedLinesProps {
  readonly lines: readonly string[];
  /** Index of the line shown in the accent colour, if any. */
  readonly accentLine?: number;
  /** Class of the accent line; defaults to the lime accent. */
  readonly accentClassName?: string;
}

/**
 * Display lines for a stacked heading. The separating spaces sit between the spans so the
 * accessible name reads "Meet the hosts", not "Meet thehosts".
 */
export function StackedLines({
  lines,
  accentLine,
  accentClassName = styles.accentLine,
}: StackedLinesProps) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      {index > 0 && ' '}
      <span className={index === accentLine ? accentClassName : styles.headingLine}>{line}</span>
    </Fragment>
  ));
}

/** Eyebrow plus a stacked uppercase display heading with one accent line (Filthy Fellas-style layout). */
export function SectionHeading({ lines, accentLine, eyebrow, level = 2, id }: SectionHeadingProps) {
  const Tag = level === 1 ? 'h1' : 'h2';
  return (
    <>
      {eyebrow !== undefined && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Tag className={styles.heading} id={id} tabIndex={level === 1 ? -1 : undefined}>
        <StackedLines lines={lines} accentLine={accentLine} />
      </Tag>
    </>
  );
}
