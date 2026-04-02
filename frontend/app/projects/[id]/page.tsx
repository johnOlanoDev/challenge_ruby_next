import ProjectDetailClient from "@/components/ProjectDetailClient";
import { api } from "@/lib/api";

interface ProjectParams {
  params: { id: string };
}

const ProjectDetailPage = async ({ params }: ProjectParams) => {
  const resolvedParams = await params;
  const projectId = resolvedParams.id;

  let project: any = { name: "", created_at: "", tasks: [] };
  try {
    const { data } = await api.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/projects/${projectId}`,
    );
    project = data;
  } catch (err) {
    console.error("Error cargando el proyecto:", err);
  }

  return <ProjectDetailClient project={project} projectId={projectId} />;
};

export default ProjectDetailPage;
