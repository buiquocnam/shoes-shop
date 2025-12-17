import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminUsersApi } from "@/features/admin/users/services/users.api";
import { adminQueryKeys } from "@/features/shared";
import { User } from "@/types/global";
import { UserUpdate } from "../types";



 export const useGetUsers = () => {
  return useQuery<User[]>({
    queryKey: adminQueryKeys.users.list(),
    queryFn: () => adminUsersApi.getUsers(),
  });
};


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<User, Error, UserUpdate>({
    mutationFn: (user) => adminUsersApi.updateUser(user),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminQueryKeys.users.list(),
      });
    },
  });
};

export const useDeleteUser = () => {
  return useMutation<boolean, Error, string>({
    mutationFn: (id) => adminUsersApi.deleteUser(id),
  });
};  