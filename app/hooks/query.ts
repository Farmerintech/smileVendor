import {
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { apiRequest } from '../lib/api';
import { useAppStore } from '../store/useAppStore';

export function useCrudQuery<T>({
  queryKey,
  url,
  enabled = true,
}: {
  queryKey: string[];
  url: string;
  enabled?: boolean;
}) {
  const queryClient = useQueryClient();
  const isLoggedIn = useAppStore((s) => s.user.isLoggedIn);

  const canRun = enabled && isLoggedIn;

  const query = useQuery<T>({
    queryKey,
    queryFn: () => apiRequest<T>({ url }),
    enabled: canRun,
  });

  const create = useMutation({
    mutationFn: (data: Partial<T>) =>
      apiRequest<T>({ url, method: 'POST', data }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey }),
  });

  const update = useMutation({
    mutationFn: ({ id, data }: any) =>
      apiRequest<T>({
        url: `${url}/${id}`,
        method: 'PUT',
        data,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey }),
  });

  const remove = useMutation({
    mutationFn: (id: string) =>
      apiRequest<void>({
        url: `${url}/${id}`,
        method: 'DELETE',
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey }),
  });

  return {
    ...query,
    create: create.mutate,
    update: update.mutate,
    remove: remove.mutate,
    isCreating: create.isPending,
    isUpdating: update.isPending,
    isDeleting: remove.isPending,
  };
}
