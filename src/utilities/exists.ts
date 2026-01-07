/**
 * Checks whether value is defined and not null.
 * @param val
 * @returns {boolean}
 * @ignore
 */
export default function exists(val: unknown): boolean {
  return (typeof val !== 'undefined') && (val !== null);
}
