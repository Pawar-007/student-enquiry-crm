// Date / currency formatting helpers.
// We never rewrite the raw backend date/time strings — these are purely for display.

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseBackendDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

// LocalDate -> "02 Sep 2026"
export function formatDate(value) {
  const d = parseBackendDate(value);
  if (!d) return '—';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

// LocalDateTime -> "02 Sep 2026, 4:25 PM"
export function formatDateTime(value) {
  const d = parseBackendDate(value);
  if (!d) return '—';
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${formatDate(value)}, ${hours}:${minutes} ${ampm}`;
}

// Relative-ish helper for timelines
export function timeAgo(value) {
  const d = parseBackendDate(value);
  if (!d) return '—';
  const diffMs = Date.now() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(value);
}

// BigDecimal-safe INR formatting — keeps decimal precision when it exists,
// never mutates the underlying numeric value used in API payloads.
export function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '₹0';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (Number.isNaN(num)) return '₹0';
  const hasDecimals = num % 1 !== 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: hasDecimals ? 2 : 0,
    minimumFractionDigits: hasDecimals ? 2 : 0,
  }).format(num);
}

export function toDateInputValue(value) {
  const d = parseBackendDate(value);
  if (!d) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function initials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}
