"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";

interface Task {
  id: number;
  title: string;
  project_name: string;
  status: string;
  priority: string;
  created_at: string;
}

const TasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");

  const statusMap: Record<string, string> = {
    pending: "PENDIENTE",
    in_progress: "EN PROGRESO",
    completed: "COMPLETADA",
    "": "-",
    null: "-",
  };

  const priorityMap: Record<string, string> = {
    low: "BAJA",
    medium: "MEDIA",
    high: "ALTA",
    "": "-",
    null: "-",
  };

  useEffect(() => {
    setLoading(true);
    api
      .get("/api/v1/tasks")
      .then((res) => setTasks(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => statusFilter === "all" || t.status === statusFilter)
      .filter((t) => priorityFilter === "all" || t.priority === priorityFilter)
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
  }, [tasks, statusFilter, priorityFilter]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4">Tareas</Typography>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          mb={3}
        >
          <Button variant="contained" component={Link} href="/projects/">
            Ir al inicio
          </Button>
          <Button variant="contained" component={Link} href="/projects/new">
            Crear Proyecto
          </Button>
        </Box>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Estado</InputLabel>
          <Select
            value={statusFilter}
            label="Estado"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="pending">PENDIENTE</MenuItem>
            <MenuItem value="in_progress">EN PROGRESO</MenuItem>
            <MenuItem value="completed">COMPLETADA</MenuItem>
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
            <MenuItem value="low">BAJA</MenuItem>
            <MenuItem value="medium">MEDIA</MenuItem>
            <MenuItem value="high">ALTA</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Proyecto</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Prioridad</TableCell>
            <TableCell>Creado</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredTasks.map((task) => (
            <TableRow key={task.id}>
              <TableCell>{task.title}</TableCell>
              <TableCell>{task.project_name}</TableCell>
              <TableCell>{statusMap[task.status]}</TableCell>
              <TableCell>{priorityMap[task.priority]}</TableCell>
              <TableCell>
                {new Date(task.created_at).toLocaleString("es-PE")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
};

export default TasksPage;
