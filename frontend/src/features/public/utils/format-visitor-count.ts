export function formatVisitorCount(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
