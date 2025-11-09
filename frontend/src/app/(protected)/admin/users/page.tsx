"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { adminAPI } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Users, Shield, Building, FileText, Mail, Calendar } from "lucide-react";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.accessToken) {
      loadUsers();
    }
  }, [session]);

  async function loadUsers() {
    try {
      const token = session?.accessToken as string;
      if (!token) return;

      const data = await adminAPI.getUsers(token, { limit: 100 });
      setUsers(data.users || []);
      setTotal(data.total);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function toggleAdmin(userId: number, currentStatus: boolean) {
    try {
      const token = session?.accessToken as string;
      if (!token) return;

      await adminAPI.updateUser(userId, { is_admin: !currentStatus }, token);
      await loadUsers(); // Reload data
    } catch (error) {
      console.error("Failed to update user:", error);
      alert("Failed to update user. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-gray-500 mt-2">{total} total users registered</p>
          </div>
        </div>
      </div>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Manage user accounts and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-gray-50">
                <tr className="text-left text-sm text-gray-500">
                  <th className="p-3 font-medium">User</th>
                  <th className="p-3 font-medium">Email</th>
                  <th className="p-3 font-medium">Organizations</th>
                  <th className="p-3 font-medium">Invoices</th>
                  <th className="p-3 font-medium">Joined</th>
                  <th className="p-3 font-medium">Last Login</th>
                  <th className="p-3 font-medium">Role</th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="text-sm hover:bg-gray-50">
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                          {user.is_admin ? (
                            <Shield className="h-4 w-4 text-purple-600" />
                          ) : (
                            <Users className="h-4 w-4 text-gray-600" />
                          )}
                        </div>
                        <span className="font-medium">{user.name || 'No name'}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-xs">{user.email}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <Building className="h-3.5 w-3.5 text-gray-400" />
                        <span>{user.org_count || 0}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5 text-gray-400" />
                        <span>{user.invoice_count || 0}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{formatDate(user.created_at)}</td>
                    <td className="p-3 text-gray-600">
                      {user.last_login ? formatDate(user.last_login) : 'Never'}
                    </td>
                    <td className="p-3">
                      {user.is_admin ? (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          Admin
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-medium">
                          User
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleAdmin(user.id, user.is_admin)}
                      >
                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

