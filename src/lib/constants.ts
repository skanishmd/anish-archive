export const SITE = {
  title: 'Sk Anish Md',
  description: 'Computational Oncologist specializing in AI-driven Circadian Therapeutics. Structural Bioinformatics × Creative Writing.',
  url: 'https://skanishmd.dev',
  author: 'Sk Anish Md',
} as const;

export const NAV_ITEMS = [
  { label: 'ARCHIVE', href: '/archive' },
  { label: 'TIMELINE', href: '/timeline' },
  { label: 'ABOUT', href: '/about' },
] as const;

export const SOCIAL_LINKS = [
  { label: 'GITHUB', href: 'https://github.com/skanishmd', icon: '↗' },
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/skanishmd/', icon: '↗' },
  { label: 'INSTAGRAM', href: 'https://www.instagram.com/sk4nishmd', icon: '↗' },
  { label: 'EMAIL', href: 'mailto:skanishmd321@gmail.com', icon: '↗' },
] as const;

export type ContentType = 'observation' | 'project' | 'research' | 'writing' | 'achievement' | 'experiment' | 'creative';
export type ContentStatus = 'published' | 'in-progress' | 'archived';

export const TYPE_COLORS: Record<ContentType, string> = {
  research: 'text-signal-research border-signal-research',
  project: 'text-signal-project border-signal-project',
  writing: 'text-signal-writing border-signal-writing',
  achievement: 'text-signal-achievement border-signal-achievement',
  creative: 'text-signal-creative border-signal-creative',
  experiment: 'text-signal-experiment border-signal-experiment',
  observation: 'text-signal-writing border-signal-writing',
} as const;

export const TYPE_LABELS: Record<ContentType, string> = {
  research: 'RESEARCH',
  project: 'PROJECT',
  writing: 'WRITING',
  achievement: 'ACHIEVEMENT',
  creative: 'CREATIVE',
  experiment: 'EXPERIMENT',
  observation: 'OBSERVATION',
} as const;

export const STATUS_COLORS: Record<ContentStatus, string> = {
  published: 'text-success',
  'in-progress': 'text-warning',
  archived: 'text-ash',
} as const;
