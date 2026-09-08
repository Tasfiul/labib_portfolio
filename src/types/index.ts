export interface HoverSubItem {
  id: string;
  label: string;
  url?: string;
  description?: string;
}

export interface HighlightToken {
  id: string;
  phrase: string;
  url?: string;
  subItems: HoverSubItem[];
  color?: string;
}

export interface ProfileData {
  id?: string;
  name: string;
  tagline: string;
  titles: string[]; // e.g. ["Research Scholar", "Founder & CTO: Edu-Explorer", "Graduate Student at RUET"]
  bio: string;
  highlights: HighlightToken[];
  avatarUrl: string;
  secondaryImageUrl?: string;
  resumeDownloadUrl?: string;
  googleScholarUrl?: string;
  currentCitations?: number;
  stats: { label: string; value: string }[];
}

export interface ResumeItem {
  id: string;
  title: string; // e.g. "Research Assistant"
  organization: string; // e.g. "RUET - SPB Research Group"
  period: string; // e.g. "2022 - Present"
  location?: string;
  description?: string;
  highlights?: HighlightToken[];
  tags?: string[];
  link?: string;
}

export interface ResumeCategory {
  id: string;
  name: string; // e.g. "Experience", "Education", "Skills", "Reviewer", "Volunteering", "Research Interests", "Memberships & Licenses", "About Me"
  slug: string;
  order: number;
  subtitle?: string;
  summary?: string;
  items: ResumeItem[];
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  publishedIn: string;
  year: number | string;
  doi?: string;
  url?: string;
  citationCount?: number;
  abstract?: string;
  figures: { url: string; caption?: string }[];
  highlights?: HighlightToken[];
  featured?: boolean;
}

export type BlockType = "title" | "subtitle" | "text" | "image" | "video" | "callout";

export interface ProjectBlock {
  id: string;
  type: BlockType;
  content: string; // Text content or Image/Video URL
  caption?: string;
  highlight?: boolean; // Highlight with theme accent
  url?: string; // Link for the block
  subItems?: HoverSubItem[];
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  summary: string;
  thumbnail: string;
  category: string;
  tags: string[];
  demoUrl?: string;
  githubUrl?: string;
  paperUrl?: string;
  featured?: boolean;
  blocks: ProjectBlock[];
  createdAt: string;
}

export interface Award {
  id: string;
  title: string;
  issuedDate: string; // e.g. "Nov 2025"
  issuedBy: string; // e.g. "World Robot Olympiad (WRO) / Formula SAE Japan"
  description: string;
  certificateUrl?: string;
  thumbnail?: string;
  badgeText?: string;
  link?: string;
  blocks?: ProjectBlock[];
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
}

export interface GalleryItem {
  id: string;
  title?: string;
  imageUrl: string;
  caption: string;
  categories: string[]; // category IDs or slugs
  date?: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconName?: string;
  color?: string;
}

export interface SiteConfig {
  id?: string;
  siteName: string;
  primaryAccent: string; // hex color or accent preset
  googleScholarUrl: string;
  totalPublicationCitations?: string;
  contactIntro?: string;
  emails: string[];
  phoneNumbers: string[];
  addresses: string[];
  socialLinks: SocialLink[];
  footerText: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}
