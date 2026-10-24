export const CATEGORIES = [
  'ID Cards',
  'Books and Stationery',
  'Electronics',
  'Bags',
  'Keys',
  'Wallets',
  'Clothing',
  'Other',
];

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'Invalid date';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return formatDate(dateString);
};

// Fallback placeholder image SVG as data URI
export const DEFAULT_ITEM_PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='260' viewBox='0 0 400 260' fill='%23f1f5f9'%3e%3crect width='400' height='260' fill='%23f1f5f9'/%3e%3cg fill='%2394a3b8'%3e%3cpath d='M160 110a20 20 0 100-40 20 20 0 000 40zm80 20l-45-45-65 65h150l-40-20z'/%3e%3c/g%3e%3ctext x='50%25' y='75%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%2364748b'%3eNo Photo Provided%3c/text%3e%3c/svg%3e";
