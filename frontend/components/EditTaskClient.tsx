"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

const EditTaskClient = () => {
  const { projectId, taskId } = useParams();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!projectId || !taskId) return;

    setFetching(true);
    api
      .get(`/api/v1/projects/${projectId}/tasks/${taskId}`)
      .then((res) => {
        setTitle(res.data.title);
        setPriority(res.data.priority || "medium");
        setStatus(res.data.status || "pending");
      })
      .catch((err) => {
        console.error(err);
        setError("Error al cargar la tarea");
      })
      .finally(() => setFetching(false));
  }, [projectId, taskId]);

  const handleSubmit = async () => {
    if (!title) return alert("El título es obligatorio");

    setLoading(true);
    try {
      await api.patch(`/api/v1/projects/${projectId}/tasks/${taskId}`, {
        task: { title, priority, status },
      });
      alert("Tarea actualizada con éxito");
      router.back();
    } catch (err) {
      console.error(err);
      alert("Error al actualizar la tarea");
    } finally {
      setLoading(false);
    }
  };

  if (!projectId || !taskId)
    return <Typography>Cargando parámetros...</Typography>;
  if (fetching)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <TextField
        label="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Prioridad</InputLabel>
        <Select
          value={priority}
          label="Prioridad"
          onChange={(e) => setPriority(e.target.value)}
        >
          <MenuItem value="low">Baja</MenuItem>
          <MenuItem value="medium">Media</MenuItem>
          <MenuItem value="high">Alta</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>Estado</InputLabel>
        <Select
          value={status}
          label="Estado"
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="pending">Pendiente</MenuItem>
          <MenuItem value="in_progress">En progreso</MenuItem>
          <MenuItem value="completed">Completada</MenuItem>
        </Select>
      </FormControl>

      <Button onClick={handleSubmit} disabled={loading} variant="contained">
        {loading ? <CircularProgress size={24} /> : "Guardar"}
      </Button>
    </Box>
  );
};

export default EditTaskClient;
