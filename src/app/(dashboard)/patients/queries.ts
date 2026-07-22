import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPatients, getPatient, createPatient, updatePatient } from "./actions";
import { PatientFormValues } from "./schema";
import { toast } from "sonner";

export function usePatients(params?: { search?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["patients", params],
    queryFn: () => getPatients(params),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: ["patients", id],
    queryFn: () => getPatient(id),
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PatientFormValues) => createPatient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      toast.success("Patient registered successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to register patient");
    }
  });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PatientFormValues> }) => updatePatient(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      queryClient.invalidateQueries({ queryKey: ["patients", variables.id] });
      toast.success("Patient updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update patient");
    }
  });
}
