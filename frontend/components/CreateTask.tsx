"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { TextField, Button, CircularProgress } from "@mui/material";

interface Props {
  projectId?: string;
  onTaskCreated?: () => void;
}

const CreateTask = ({ projectId, onTaskCreated }: Props) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title) return alert("El título es obligatorio");
    if (!projectId) return alert("No se ha definido el proyecto");

    setLoading(true);
    try {
      await api.post(`/api/v1/projects/${projectId}/tasks`, {
        title,
        status: "pending",
      });
      setTitle("");
      if (onTaskCreated) onTaskCreated();
      alert("Tarea creada con éxito");
    } catch (err) {
      // console.error("Error al crear la tarea:", err);
      // alert("Error al crear la tarea");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
      <TextField
        label="Nueva tarea"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <Button
        onClick={handleSubmit}
        disabled={loading || !projectId}
        variant="contained"
      >
        {loading ? <CircularProgress size={20} /> : "Agregar"}
      </Button>
    </div>
  );
};

export default CreateTask;
