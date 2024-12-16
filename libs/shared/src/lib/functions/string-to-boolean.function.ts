export function stringToBoolean(str: string | boolean): boolean {
  return (typeof str === 'boolean' && str) || str.toString().toLowerCase() === 'true' || str.toString() === '0';
}
