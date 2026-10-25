export type AvatarGender = "male" | "female";

function svgDataUrl(svg: string): string {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const MALE_PLACEHOLDER = svgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="Member">
  <rect width="80" height="80" rx="40" fill="#E8F0FE"/>
  <circle cx="40" cy="30" r="14" fill="#4A6FA5"/>
  <path d="M16 68c4-14 14-22 24-22s20 8 24 22" fill="#4A6FA5"/>
</svg>`);

const FEMALE_PLACEHOLDER = svgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" role="img" aria-label="Member">
  <rect width="80" height="80" rx="40" fill="#FCE8F3"/>
  <circle cx="40" cy="30" r="14" fill="#B84D7A"/>
  <path d="M16 68c4-14 14-22 24-22s20 8 24 22" fill="#B84D7A"/>
</svg>`);

const FEMALE_NAME_RE =
  /\b(sara|sarah|maria|elena|priya|fatima|aisha|jane|emily|anna|sophia|olivia|emma|lisa|nina|rosa|helen|mary|jessica|amira|layla|zoe|mia|chloe)\b/i;

const MALE_NAME_RE =
  /\b(mohamed|mohammed|muhammad|ali|ahmed|omar|hassan|john|michael|marcus|sam|alex|james|david|mark|paul|daniel|ryan|kevin|carlos|jose|noah|liam|ethan)\b/i;

export function inferAvatarGender(seed: string, displayName?: string): AvatarGender {
  const name = displayName?.trim().toLowerCase() ?? "";
  if (name && FEMALE_NAME_RE.test(name)) return "female";
  if (name && MALE_NAME_RE.test(name)) return "male";

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash + seed.charCodeAt(i)) % 2;
  }
  return hash === 0 ? "male" : "female";
}

export function placeholderAvatarUrl(gender: AvatarGender): string {
  return gender === "female" ? FEMALE_PLACEHOLDER : MALE_PLACEHOLDER;
}

export function resolveUserAvatarUrl(options: {
  photoUrl?: string | null;
  seed: string;
  displayName?: string;
}): string {
  const trimmed = options.photoUrl?.trim();
  if (trimmed) return trimmed;
  const gender = inferAvatarGender(options.seed, options.displayName);
  return placeholderAvatarUrl(gender);
}
