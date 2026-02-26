// Utility functions for StudentHub NG

/**
 * Convert user ID to number for database operations
 */
export function toNumericId(id: string | number | undefined): number {
  if (typeof id === 'number') return id;
  if (typeof id === 'string') return parseInt(id) || 0;
  return 0;
}

/**
 * Convert user ID to string for store operations
 */
export function toStringId(id: string | number | undefined): string {
  if (typeof id === 'string') return id;
  if (typeof id === 'number') return String(id);
  return '0';
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format time from seconds
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Calculate percentage safely
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
