import mongoose, { Schema } from "mongoose";

const HoverSubItemSchema = new Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    url: { type: String },
    description: { type: String },
  },
  { _id: false }
);

const HighlightTokenSchema = new Schema(
  {
    id: { type: String, required: true },
    phrase: { type: String, required: true },
    url: { type: String },
    subItems: [HoverSubItemSchema],
    color: { type: String },
  },
  { _id: false }
);

// Profile Model
const ProfileSchema = new Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: "" },
    titles: [{ type: String }],
    bio: { type: String, default: "" },
    highlights: [HighlightTokenSchema],
    avatarUrl: { type: String, default: "" },
    secondaryImageUrl: { type: String, default: "" },
    resumeDownloadUrl: { type: String, default: "" },
    googleScholarUrl: { type: String, default: "" },
    currentCitations: { type: Number, default: 0 },
    stats: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
  },
  { timestamps: true }
);

// Resume Categories & Items Model
const ResumeItemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    period: { type: String, required: true },
    location: { type: String },
    description: { type: String },
    highlights: [HighlightTokenSchema],
    tags: [{ type: String }],
    link: { type: String },
  },
  { _id: false }
);

const ResumeCategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
    order: { type: Number, default: 0 },
    subtitle: { type: String },
    summary: { type: String },
    items: [ResumeItemSchema],
  },
  { timestamps: true }
);

// Publication Model
const PublicationSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    authors: { type: String, required: true },
    publishedIn: { type: String, required: true },
    year: { type: Schema.Types.Mixed, required: true },
    doi: { type: String },
    url: { type: String },
    citationCount: { type: Number, default: 0 },
    abstract: { type: String },
    figures: [
      {
        url: { type: String, required: true },
        caption: { type: String },
      },
    ],
    highlights: [HighlightTokenSchema],
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Project Model
const ProjectBlockSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: ["title", "subtitle", "text", "image", "video", "callout"],
      required: true,
    },
    content: { type: String, required: true },
    caption: { type: String },
    highlight: { type: Boolean, default: false },
    url: { type: String },
    subItems: [HoverSubItemSchema],
  },
  { _id: false }
);

const ProjectSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subtitle: { type: String, default: "" },
    summary: { type: String, default: "" },
    thumbnail: { type: String, default: "" },
    category: { type: String, default: "General" },
    tags: [{ type: String }],
    demoUrl: { type: String },
    githubUrl: { type: String },
    paperUrl: { type: String },
    featured: { type: Boolean, default: false },
    blocks: [ProjectBlockSchema],
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

// Award Model
const AwardSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    issuedDate: { type: String, required: true },
    issuedBy: { type: String, required: true },
    description: { type: String, default: "" },
    certificateUrl: { type: String },
    thumbnail: { type: String },
    badgeText: { type: String },
    link: { type: String },
    blocks: [ProjectBlockSchema],
  },
  { timestamps: true }
);

// Gallery Category & Item Models
const GalleryCategorySchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { timestamps: true }
);

const GalleryItemSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String },
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    categories: [{ type: String }],
    date: { type: String },
  },
  { timestamps: true }
);

// Site Config Model
const SiteConfigSchema = new Schema(
  {
    siteName: { type: String, default: "Farhan Labib" },
    primaryAccent: { type: String, default: "#10b981" },
    googleScholarUrl: { type: String, default: "https://scholar.google.com" },
    totalPublicationCitations: { type: String, default: "145+" },
    emails: [{ type: String }],
    phoneNumbers: [{ type: String }],
    addresses: [{ type: String }],
    socialLinks: [
      {
        id: { type: String },
        platform: { type: String },
        url: { type: String },
        iconName: { type: String },
        color: { type: String },
      },
    ],
    footerText: { type: String, default: "" },
  },
  { timestamps: true }
);

// Contact Message Model
const ContactMessageSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    createdAt: { type: String, default: () => new Date().toISOString() },
  },
  { timestamps: true }
);

export const ProfileModel =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
export const ResumeCategoryModel =
  mongoose.models.ResumeCategory || mongoose.model("ResumeCategory", ResumeCategorySchema);
export const PublicationModel =
  mongoose.models.Publication || mongoose.model("Publication", PublicationSchema);
export const ProjectModel =
  mongoose.models.Project || mongoose.model("Project", ProjectSchema);
export const AwardModel =
  mongoose.models.Award || mongoose.model("Award", AwardSchema);
export const GalleryCategoryModel =
  mongoose.models.GalleryCategory || mongoose.model("GalleryCategory", GalleryCategorySchema);
export const GalleryItemModel =
  mongoose.models.GalleryItem || mongoose.model("GalleryItem", GalleryItemSchema);
export const SiteConfigModel =
  mongoose.models.SiteConfig || mongoose.model("SiteConfig", SiteConfigSchema);
export const ContactMessageModel =
  mongoose.models.ContactMessage || mongoose.model("ContactMessage", ContactMessageSchema);
