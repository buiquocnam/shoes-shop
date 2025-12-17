"use client";

import { useGetUsers } from '@/features/admin/users/hooks/useUsers';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/features/admin/users/components/columns';
import { User } from '@/types/global';
import Loading from '@/features/admin/components/Loading';
import { UserForm } from '@/features/admin/users/components/UserForm';


const AdminUsersPage = () => {
  const { data, isLoading } = useGetUsers();
  const users: User[] = data || [];

  if (isLoading) {
    return <Loading />;
  }


  return (
    <div className="p-8 space-y-6">
        <h1 className="text-3xl font-semibold">Manage Users</h1>
      <DataTable
        columns={columns}
        data={users}
        pagination={{
          currentPage: 1,
          totalPages: 1,
          totalElements: users.length,
          pageSize: 10,
        }}
      />
    </div>
  );
};

export default AdminUsersPage;