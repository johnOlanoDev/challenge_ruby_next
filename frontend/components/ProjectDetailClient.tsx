"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import CreateTask from "@/components/CreateTask";
import {
  Typography,
  Box,
  Divider,
  CircularProgress,
  Select,
  MenuItem,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  FormControl,
  InputLabel,
} from "@mui/material";

interface Props {
  projectId: string;
}

const ProjectDetailClient = ({ projectId }: Props) => {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const router = useRouter();

  const fetchProject = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/api/v1/projects/${projectId}`);
      setProject(data);
    } catch (err) {
      console.error("Error al cargar proyecto:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const handleTaskCreated = async () => {
    await fetchProject();
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await api.patch(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
        status,
      });
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("¿Seguro que deseas eliminar esta tarea?")) return;
    try {
      await api.delete(`/api/v1/projects/${projectId}/tasks/${taskId}`);
      fetchProject();
    } catch (err) {
      console.error(err);
    }
  };

  const goToHome = () => {
    router.push("/");
  };

  const filteredTasks = useMemo(() => {
    if (!project) return [];
    return project.tasks.filter((t: any) => {
      const statusMatch = statusFilter === "all" || t.status === statusFilter;
      const priorityMatch =
        priorityFilter === "all" || t.priority === priorityFilter;
      return statusMatch && priorityMatch;
    });
  }, [project, statusFilter, priorityFilter]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  if (!project) return <Typography>No se encontró el proyecto</Typography>;

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">{project.name}</Typography>
        <Button variant="contained" color="primary" onClick={goToHome}>
          Ir al inicio
        </Button>
      </Box>
      <Typography color="text.secondary">
        Creado: {project.created_at}
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h6" mb={1}>
        Agregar tarea
      </Typography>
      <CreateTask projectId={projectId} onTaskCreated={handleTaskCreated} />

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" mb={2}>
        Tareas
      </Typography>

      {/* Filtros */}
      <Box display="flex" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={statusFilter}
            label="Estado"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="pending">Pendiente</MenuItem>
            <MenuItem value="in_progress">En progreso</MenuItem>
            <MenuItem value="completed">Completada</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Prioridad</InputLabel>
          <Select
            value={priorityFilter}
            label="Prioridad"
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <MenuItem value="all">Todas</MenuItem>
            <MenuItem value="low">Baja</MenuItem>
            <MenuItem value="medium">Media</MenuItem>
            <MenuItem value="high">Alta</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {filteredTasks.length === 0 ? (
        <Typography color="text.secondary">
          No hay tareas que mostrar
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Título</TableCell>
              <TableCell>Prioridad</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredTasks.map((t: any) => (
              <TableRow key={t.id}>
                <TableCell>{t.title}</TableCell>
                <TableCell>{t.priority || "Media"}</TableCell>
                <TableCell>
                  <Select
                    value={t.status}
                    onChange={(e) => handleStatusChange(t.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="pending">Pendiente</MenuItem>
                    <MenuItem value="in_progress">En progreso</MenuItem>
                    <MenuItem value="completed">Completada</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    component={Button}
                    onClick={() =>
                      router.push(`/projects/${projectId}/tasks/${t.id}/edit`)
                    }
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => handleDeleteTask(t.id)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default ProjectDetailClient;
