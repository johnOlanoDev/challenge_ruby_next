"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Typography,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  Box,
  CircularProgress,
} from "@mui/material";

const ProjectsPage = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get("/api/v1/projects");
        setProjects(data);
      } catch (err) {
        console.error("Error al cargar proyectos:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este proyecto?")) return;
    try {
      await api.delete(`/api/v1/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Proyectos</Typography>
        <Button variant="contained" component={Link} href="/projects/new">
          Crear Proyecto
        </Button>
      </Box>

      {projects.length === 0 ? (
        <Typography>No hay proyectos aún</Typography>
      ) : (
        <List>
          {projects.map((p) => (
            <ListItem key={p.id} sx={{ mb: 1 }}>
              <Card sx={{ width: "100%" }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Typography
                      variant="h6"
                      component={Link}
                      href={`/projects/${p.id}`}
                      sx={{ textDecoration: "none", color: "inherit" }}
                    >
                      {p.name}
                    </Typography>
                    <Typography color="text.secondary">
                      {p.tasks.length}{" "}
                      {p.tasks.length === 1 ? "tarea" : "tareas"} – Creado:{" "}
                      {new Date(p.created_at).toLocaleString()}{" "}
                      {/* Solo en cliente */}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Button
                      variant="outlined"
                      component={Link}
                      href={`/projects/${p.id}`}
                    >
                      Ver detalle
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(p.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default ProjectsPage;
