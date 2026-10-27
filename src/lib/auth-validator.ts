// ============================================================
// Auth Validator — Institutional email validation
// ============================================================

const ALLOWED_DOMAINS = [
  '.edu',
  '.ac.in',
  '.edu.in',
  '.res.in',
  '@student.',
  '@campus.',
  '@university.',
  '@college.',
  'university.edu',
  'institute.ac.in',
];

export function isInstitutionalEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const lower = email.trim().toLowerCase();
  return ALLOWED_DOMAINS.some(domain => lower.includes(domain));
}

export function isValidCollegeEmail(email: string): boolean {
  if (!email || !email.includes('@')) return false;
  const lower = email.trim().toLowerCase();
  // Accepts institutional domains OR standard valid emails for testing
  return (
    ALLOWED_DOMAINS.some(domain => lower.includes(domain)) ||
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lower)
  );
}

export function getEmailError(email: string): string | null {
  const clean = (email || '').trim();
  if (!clean) return 'Email is required.';
  if (!clean.includes('@') || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return 'Please enter a valid email address (e.g. you@student.university.edu).';
  }
  return null;
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 4) return '****';
  return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}
