import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "@/features/admin/users/services/users.api";
import { adminQueryKeys } from "@/features/shared";
import { User } from "@/types";
import { UserFilters } from "../types";
import { toast } from "sonner";

export const useGetUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: adminQueryKeys.users.list(filters),
    queryFn: () => adminUsersApi.getUsers(filters),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (user: Partial<User>) => adminUsersApi.updateUser(user),
    onSuccess: (_, variables) => {
      // Invalidate users list
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users.list(),
      });
      toast.success("Cập nhật người dùng thành công");
      queryClient.invalidateQueries({
        queryKey: [
          ...adminQueryKeys.users.key,
          "purchased-items",
          variables.id,
        ],
      });
    },
    onError: () => {
      toast.error("Cập nhật người dùng thất bại");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userIds: string[]) => adminUsersApi.deleteUser(userIds),
    onSuccess: () => {
      // Invalidate users list after deletion
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users.list(),
      });
      toast.success("Xóa người dùng thành công");
    },
    onError: () => {
      toast.error("Xóa người dùng thất bại");
    },
  });
};
