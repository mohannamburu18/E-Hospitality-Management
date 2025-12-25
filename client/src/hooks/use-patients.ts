import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertPatient } from "@shared/routes";

export function useCurrentPatient() {
  return useQuery({
    queryKey: [api.patients.get.path],
    queryFn: async () => {
      const res = await fetch(api.patients.get.path, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch patient profile");
      return api.patients.get.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertPatient) => {
      const res = await fetch(api.patients.create.path, {
        method: api.patients.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 401) throw new Error("Unauthorized");
        if (res.status === 400) throw new Error("Invalid data");
        throw new Error("Failed to create patient profile");
      }
      return api.patients.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.patients.get.path] }),
  });
}
