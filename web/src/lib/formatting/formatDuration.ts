const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 3_600;
const CLOCK_DIGITS = 2;

function twoDigits(value: number): string {
  return String(value).padStart(CLOCK_DIGITS, '0');
}

/** Formats a duration as m:ss below one hour and h:mm:ss from one hour (TC-WEB-019). */
export function formatDuration(totalSeconds: number): string {
  const whole = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(whole / SECONDS_PER_HOUR);
  const minutes = Math.floor((whole % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE);
  const seconds = twoDigits(whole % SECONDS_PER_MINUTE);
  return hours > 0 ? `${hours}:${twoDigits(minutes)}:${seconds}` : `${minutes}:${seconds}`;
}
