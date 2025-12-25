import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertDoctor } from "@shared/routes";

export function useDoctors() {
  return useQuery({
    queryKey: [api.doctors.list.path],
    queryFn: async () => {
      const res = await fetch(api.doctors.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch doctors");
      return api.doctors.list.responses[200].parse(await res.json());
    },
  });
}

export function useDoctor(id: number) {
  return useQuery({
    queryKey: [api.doctors.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.doctors.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch doctor");
      return api.doctors.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateDoctor() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertDoctor) => {
      const res = await fetch(api.doctors.create.path, {
        method: api.doctors.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 400) throw new Error("Invalid data");
        throw new Error("Failed to create doctor profile");
      }
      return api.doctors.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.doctors.list.path] }),
  });
}
