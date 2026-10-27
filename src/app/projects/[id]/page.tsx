import { getProjects } from "@/lib/dataStore";
import ProjectDetailClient from "./ProjectDetailClient";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const projects = await getProjects();
  const project = projects.find((p) => p.slug === id || p.id === id);
  if (!project) notFound();
  return <ProjectDetailClient project={project} />;
}
