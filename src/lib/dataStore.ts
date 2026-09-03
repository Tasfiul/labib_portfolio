import { connectDB } from "./db";
import {
  ProfileModel,
  ResumeCategoryModel,
  PublicationModel,
  ProjectModel,
  AwardModel,
  GalleryCategoryModel,
  GalleryItemModel,
  SiteConfigModel,
  ContactMessageModel,
} from "./models";
import {
  initialProfile,
  initialResumeCategories,
  initialPublications,
  initialProjects,
  initialAwards,
  initialGalleryCategories,
  initialGallery,
  initialSiteConfig,
  initialMessages,
} from "./seedData";
import {
  ProfileData,
  ResumeCategory,
  Publication,
  Project,
  Award,
  GalleryCategory,
  GalleryItem,
  SiteConfig,
  ContactMessage,
} from "@/types";

// In-memory fallback state with seeded values
interface LocalStore {
  profile: ProfileData;
  resumeCategories: ResumeCategory[];
  publications: Publication[];
  projects: Project[];
  awards: Award[];
  galleryCategories: GalleryCategory[];
  gallery: GalleryItem[];
  siteConfig: SiteConfig;
  messages: ContactMessage[];
}

declare global {
  // eslint-disable-next-line no-var
  var __localDataStore: LocalStore | undefined;
}

if (!global.__localDataStore) {
  global.__localDataStore = {
    profile: JSON.parse(JSON.stringify(initialProfile)),
    resumeCategories: JSON.parse(JSON.stringify(initialResumeCategories)),
    publications: JSON.parse(JSON.stringify(initialPublications)),
    projects: JSON.parse(JSON.stringify(initialProjects)),
    awards: JSON.parse(JSON.stringify(initialAwards)),
    galleryCategories: JSON.parse(JSON.stringify(initialGalleryCategories)),
    gallery: JSON.parse(JSON.stringify(initialGallery)),
    siteConfig: JSON.parse(JSON.stringify(initialSiteConfig)),
    messages: JSON.parse(JSON.stringify(initialMessages)),
  };
} else {
  // Sync name & siteConfig if previously cached
  if (global.__localDataStore.profile?.name === "Sudipto Mondal" || !global.__localDataStore.profile?.name) {
    global.__localDataStore.profile = JSON.parse(JSON.stringify(initialProfile));
  }
  if (global.__localDataStore.siteConfig?.siteName === "Sudipto." || !global.__localDataStore.siteConfig?.siteName) {
    global.__localDataStore.siteConfig = JSON.parse(JSON.stringify(initialSiteConfig));
  }
}

const memoryStore = global.__localDataStore;

// --- Profile ---
export async function getProfile(): Promise<ProfileData> {
  const db = await connectDB();
  if (db) {
    let doc = await ProfileModel.findOne().lean();
    if (!doc || doc.name === "Sudipto Mondal") {
      doc = await ProfileModel.findOneAndUpdate({}, { $set: initialProfile }, { upsert: true, new: true }).lean();
    }
    return JSON.parse(JSON.stringify(doc));
  }
  if (memoryStore.profile.name === "Sudipto Mondal") {
    memoryStore.profile = JSON.parse(JSON.stringify(initialProfile));
  }
  return memoryStore.profile;
}

export async function updateProfile(data: Partial<ProfileData>): Promise<ProfileData> {
  const db = await connectDB();
  if (db) {
    const updated = await ProfileModel.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true }).lean();
    return JSON.parse(JSON.stringify(updated));
  }
  memoryStore.profile = { ...memoryStore.profile, ...data };
  return memoryStore.profile;
}

// --- Resume Categories ---
export async function getResumeCategories(): Promise<ResumeCategory[]> {
  const db = await connectDB();
  if (db) {
    let list = await ResumeCategoryModel.find().sort({ order: 1 }).lean();
    if (list.length === 0) {
      await ResumeCategoryModel.insertMany(initialResumeCategories);
      list = await ResumeCategoryModel.find().sort({ order: 1 }).lean();
    }
    return JSON.parse(JSON.stringify(list));
  }
  return memoryStore.resumeCategories.sort((a, b) => a.order - b.order);
}

export async function saveResumeCategories(categories: ResumeCategory[]): Promise<ResumeCategory[]> {
  const db = await connectDB();
  if (db) {
    await ResumeCategoryModel.deleteMany({});
    await ResumeCategoryModel.insertMany(categories);
    const list = await ResumeCategoryModel.find().sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(list));
  }
  memoryStore.resumeCategories = JSON.parse(JSON.stringify(categories));
  return memoryStore.resumeCategories;
}

// --- Publications ---
export async function getPublications(): Promise<Publication[]> {
  const db = await connectDB();
  if (db) {
    let list = await PublicationModel.find().lean();
    if (list.length === 0) {
      await PublicationModel.insertMany(initialPublications);
      list = await PublicationModel.find().lean();
    }
    return JSON.parse(JSON.stringify(list));
  }
  return memoryStore.publications;
}

export async function savePublications(publications: Publication[]): Promise<Publication[]> {
  const db = await connectDB();
  if (db) {
    await PublicationModel.deleteMany({});
    await PublicationModel.insertMany(publications);
    const list = await PublicationModel.find().lean();
    return JSON.parse(JSON.stringify(list));
  }
  memoryStore.publications = JSON.parse(JSON.stringify(publications));
  return memoryStore.publications;
}

// --- Projects ---
export async function getProjects(): Promise<Project[]> {
  const db = await connectDB();
  if (db) {
    let list = await ProjectModel.find().lean();
    if (list.length === 0) {
      await ProjectModel.insertMany(initialProjects);
      list = await ProjectModel.find().lean();
    }
    return JSON.parse(JSON.stringify(list));
  }
  return memoryStore.projects;
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  const db = await connectDB();
  if (db) {
    await ProjectModel.deleteMany({});
    await ProjectModel.insertMany(projects);
    const list = await ProjectModel.find().lean();
    return JSON.parse(JSON.stringify(list));
  }
  memoryStore.projects = JSON.parse(JSON.stringify(projects));
  return memoryStore.projects;
}

// --- Awards ---
export async function getAwards(): Promise<Award[]> {
  const db = await connectDB();
  if (db) {
    let list = await AwardModel.find().lean();
    if (list.length === 0) {
      await AwardModel.insertMany(initialAwards);
      list = await AwardModel.find().lean();
    }
    return JSON.parse(JSON.stringify(list));
  }
  return memoryStore.awards;
}

export async function saveAwards(awards: Award[]): Promise<Award[]> {
  const db = await connectDB();
  if (db) {
    await AwardModel.deleteMany({});
    await AwardModel.insertMany(awards);
    const list = await AwardModel.find().lean();
    return JSON.parse(JSON.stringify(list));
  }
  memoryStore.awards = JSON.parse(JSON.stringify(awards));
  return memoryStore.awards;
}

// --- Gallery ---
export async function getGalleryCategories(): Promise<GalleryCategory[]> {
  const db = await connectDB();
  if (db) {
    let list = await GalleryCategoryModel.find().lean();
    if (list.length === 0) {
      await GalleryCategoryModel.insertMany(initialGalleryCategories);
      list = await GalleryCategoryModel.find().lean();
    }
    return JSON.parse(JSON.stringify(list));
  }
  return memoryStore.galleryCategories;
}

export async function saveGalleryCategories(categories: GalleryCategory[]): Promise<GalleryCategory[]> {
  const db = await connectDB();
  if (db) {
    await GalleryCategoryModel.deleteMany({});
    await GalleryCategoryModel.insertMany(categories);
    const list = await GalleryCategoryModel.find().lean();
    return JSON.parse(JSON.stringify(list));
  }
  memoryStore.galleryCategories = JSON.parse(JSON.stringify(categories));
  return memoryStore.galleryCategories;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const db = await connectDB();
  if (db) {
    let list = await GalleryItemModel.find().lean();
    if (list.length === 0) {
      await GalleryItemModel.insertMany(initialGallery);
      list = await GalleryItemModel.find().lean();
    }
    return JSON.parse(JSON.stringify(list));
  }
  return memoryStore.gallery;
}

export async function saveGalleryItems(items: GalleryItem[]): Promise<GalleryItem[]> {
  const db = await connectDB();
  if (db) {
    await GalleryItemModel.deleteMany({});
    await GalleryItemModel.insertMany(items);
    const list = await GalleryItemModel.find().lean();
    return JSON.parse(JSON.stringify(list));
  }
  memoryStore.gallery = JSON.parse(JSON.stringify(items));
  return memoryStore.gallery;
}

// --- Site Config ---
export async function getSiteConfig(): Promise<SiteConfig> {
  const db = await connectDB();
  if (db) {
    let doc = await SiteConfigModel.findOne().lean();
    if (!doc) {
      doc = await SiteConfigModel.create(initialSiteConfig);
    }
    return JSON.parse(JSON.stringify(doc));
  }
  return memoryStore.siteConfig;
}

export async function updateSiteConfig(data: Partial<SiteConfig>): Promise<SiteConfig> {
  const db = await connectDB();
  if (db) {
    const updated = await SiteConfigModel.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true }).lean();
    return JSON.parse(JSON.stringify(updated));
  }
  memoryStore.siteConfig = { ...memoryStore.siteConfig, ...data };
  return memoryStore.siteConfig;
}

// --- Messages ---
export async function getMessages(): Promise<ContactMessage[]> {
  const db = await connectDB();
  if (db) {
    let list = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
    if (list.length === 0) {
      await ContactMessageModel.insertMany(initialMessages);
      list = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
    }
    return JSON.parse(JSON.stringify(list));
  }
  return memoryStore.messages.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function addMessage(msg: Omit<ContactMessage, "id" | "read" | "createdAt">): Promise<ContactMessage> {
  const newMsg: ContactMessage = {
    id: "msg-" + Date.now(),
    name: msg.name,
    email: msg.email,
    subject: msg.subject,
    message: msg.message,
    read: false,
    createdAt: new Date().toISOString(),
  };

  const db = await connectDB();
  if (db) {
    await ContactMessageModel.create(newMsg);
  } else {
    memoryStore.messages.unshift(newMsg);
  }
  return newMsg;
}

export async function markMessageRead(id: string, read: boolean): Promise<boolean> {
  const db = await connectDB();
  if (db) {
    await ContactMessageModel.updateOne({ id }, { $set: { read } });
  } else {
    const item = memoryStore.messages.find((m) => m.id === id);
    if (item) item.read = read;
  }
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const db = await connectDB();
  if (db) {
    await ContactMessageModel.deleteOne({ id });
  } else {
    memoryStore.messages = memoryStore.messages.filter((m) => m.id !== id);
  }
  return true;
}
