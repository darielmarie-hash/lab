// Shared quiz→tag rules for the Find Your Match quiz.
// Used by worker.js (Cloudflare Worker, live webhook) and backfill.mjs (one-off historical run).
// Tag names follow the taxonomy that already exists in the workspace: quiz_<category>_<value>.

export const TAG_CATEGORIES = [
  'texture',
  'porosity',
  'length',
  'concern',
  'lifestyle',
  'color',
  'recommended',
];

export const COMPLETED_TAG = 'quiz_completed_2026_summer';
export const TAG_COLOR = '#48cdfe';

// Emails matching any of these are test traffic and never get tagged.
export const SKIP_EMAIL_PATTERNS = [/^quiztest\+/i];

const slug = (value) => String(value).toLowerCase().trim().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

// A submission counts as a completed quiz only when the two load-bearing answers
// are present: texture (first real question) and recommended (computed at the end).
// This filters out the preview rows, contact-only rows, and mid-quiz partials
// that show up in the raw form_submissions feed.
export function isCompleteSubmission(data) {
  if (!data || data.preview === 'true' || data.preview === true) return false;
  return Boolean(data.texture && data.recommended);
}

export function isTestEmail(email) {
  if (!email) return false;
  return SKIP_EMAIL_PATTERNS.some((re) => re.test(email));
}

// Answers → tag names, e.g. {texture: 'deep_wave'} → ['quiz_texture_deep_wave', ...].
// Only categories present in the submission produce a tag; COMPLETED_TAG is always added.
export function tagNamesFor(data) {
  const names = [];
  for (const cat of TAG_CATEGORIES) {
    if (data[cat] !== undefined && data[cat] !== null && data[cat] !== '') {
      names.push(`quiz_${cat}_${slug(data[cat])}`);
    }
  }
  names.push(COMPLETED_TAG);
  return names;
}

// 'quiz_texture_deep_wave' → 'texture'; non-quiz tags → null.
// Lets callers replace a stale same-category tag when someone retakes the quiz
// with a different answer (latest submission wins), without touching other tags.
export function categoryOfTag(name) {
  const m = /^quiz_([a-z]+)_/.exec(name);
  return m && TAG_CATEGORIES.includes(m[1]) ? m[1] : null;
}
