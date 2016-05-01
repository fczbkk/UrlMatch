/**
 * Checks whether value is defined and not null.
 * @param val
 * @returns {boolean}
 * @ignore
 */
export default function (val) {
  return (typeof val !== 'undefined') && (val !== null);
}
