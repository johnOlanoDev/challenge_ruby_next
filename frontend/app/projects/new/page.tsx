"use client";

import { useForm } from "react-hook-form";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";

const CreateProjectPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: { name: string }) => {
    if (!data.name) return;
    setLoading(true);
    try {
      const res = await api.post("/api/v1/projects", data);
      alert("Proyecto creado");
      router.push(`/projects/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Error al crear el proyecto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 5,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h1" textAlign="center">
        Crear Proyecto
      </Typography>

      <TextField
        label="Nombre del proyecto"
        {...register("name", { required: true })}
        error={!!errors.name}
        helperText={errors.name ? "El nombre es obligatorio" : ""}
        fullWidth
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={loading}
        sx={{ py: 1.5 }}
      >
        {loading ? <CircularProgress size={24} /> : "Crear Proyecto"}
      </Button>
    </Box>
  );
};

export default CreateProjectPage;
