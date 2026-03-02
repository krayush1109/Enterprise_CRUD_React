import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import { useEffect } from "react";

// 🔹 Validation schema
const schema = z.object({
  fullName: z.string().min(2, "Minimum 2 characters required"),
  email: z.string().email("Invalid email format"),
  department: z.string().min(1, "Department required"),
  status: z.enum(["Active", "Inactive"]),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData; // 🔥 edit mode ke liye
}

export default function EmployeeForm({
  onSubmit,
  defaultValues,
}: Props) {

  const {
    register,
    handleSubmit,
    reset, // 🔥 Reset function
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
    // 🔥 agar edit mode hai toh fields pre-fill honge
  });

  useEffect(() => {
    if (defaultValues) {
      // 🔥 jab editEmployee change ho
      // form fields ko manually reset karo
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
    >

      <TextField
        label="Full Name"
        {...register("fullName")}
        error={!!errors.fullName}
        helperText={errors.fullName?.message}
      />

      <TextField
        label="Email"
        {...register("email")}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        label="Department"
        select
        {...register("department")}
        error={!!errors.department}
        helperText={errors.department?.message}
      >
        <MenuItem value="IT">IT</MenuItem>
        <MenuItem value="HR">HR</MenuItem>
        <MenuItem value="Finance">Finance</MenuItem>
      </TextField>

      <TextField
        label="Status"
        select
        {...register("status")}
      >
        <MenuItem value="Active">Active</MenuItem>
        <MenuItem value="Inactive">Inactive</MenuItem>
      </TextField>

      <Button type="submit" variant="contained">
        Save
      </Button>
    </Box>
  );
}