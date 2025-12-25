import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertAppointment } from "@shared/routes";

export function useAppointments() {
  return useQuery({
    queryKey: [api.appointments.list.path],
    queryFn: async () => {
      const res = await fetch(api.appointments.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch appointments");
      return api.appointments.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAppointment) => {
      const res = await fetch(api.appointments.create.path, {
        method: api.appointments.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 400) throw new Error("Invalid data");
        throw new Error("Failed to book appointment");
      }
      return api.appointments.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] }),
  });
}

export function useUpdateAppointmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, notes }: { id: number; status: 'pending' | 'confirmed' | 'completed' | 'cancelled'; notes?: string }) => {
      const url = buildUrl(api.appointments.updateStatus.path, { id });
      const res = await fetch(url, {
        method: api.appointments.updateStatus.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, notes }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to update status");
      return api.appointments.updateStatus.responses[200].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.appointments.list.path] }),
  });
}
