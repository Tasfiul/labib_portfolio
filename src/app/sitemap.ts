import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/dataStore";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/resume",
    "/publications",
    "/projects",
    "/awards",
    "/gallery",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  try {
    const projects = await getProjects();
    const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
      url: `${baseUrl}/projects/${p.slug || p.id}`,
      lastModified: p.createdAt ? new Date(p.createdAt) : now,
      changeFrequency: "monthly",
      priority: 0.7,
    }));
    return [...staticRoutes, ...projectRoutes];
  } catch {
    return staticRoutes;
  }
}
