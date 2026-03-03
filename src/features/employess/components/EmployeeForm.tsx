import { Controller, useForm } from "react-hook-form";
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
  // status: z.enum(["Active", "Inactive"]),
  status: z.union([z.literal(""), z.enum(["Active", "Inactive"]) ])
            .refine(val => val != "", "Status required"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData; // 🔥 edit mode ke liye
}

export default function EmployeeForm({ onSubmit, defaultValues }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      department: "",
      // status: "Active",
      // status: "",
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

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

      {/* ✅ Department controlled */}
      <Controller
        name="department"
        control={control}
        render={({ field }) => (
          <TextField
            label="Department"
            select
            {...field}
            value={field.value ?? ""}  // ✅ important
            error={!!errors.department}
            helperText={errors.department?.message}
          >
            <MenuItem value="IT">IT</MenuItem>
            <MenuItem value="HR">HR</MenuItem>
            <MenuItem value="Finance">Finance</MenuItem>
          </TextField>
        )}
      />

      {/* ✅ Status controlled */}
      <Controller
        name="status"
        control={control}
        render={({ field }) => (
          <TextField
            label="Status"
            select
            {...field}
            value={field.value ?? ""} // ✅ important
          >
            <MenuItem value="Active">Active</MenuItem>
            <MenuItem value="Inactive">Inactive</MenuItem>
          </TextField>
        )}
      />

      <Button type="submit" variant="contained">Save</Button>
    </Box>
  );
}
