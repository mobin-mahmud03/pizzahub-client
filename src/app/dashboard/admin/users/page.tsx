'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'sonner';
import { Users, Search } from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (userSearch) params.append('search', userSearch);
      if (userRoleFilter !== 'All') params.append('role', userRoleFilter);

      const res = await api.get(`/admin/users?${params.toString()}`);
      if (res.data.success) {
        setUsers(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load users', err);
      toast.error('Failed to load users list.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userRoleFilter]);

  const handleToggleBlock = async (userId: string, currentBlocked: boolean) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/block`);
      if (res.data.success) {
        toast.success(res.data.message || (currentBlocked ? 'User unblocked' : 'User blocked'));
        fetchUsers();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user block status.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
            Manage Registered Users
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Search across customer and vendor accounts, view subscription tiers, and moderate account access
        </p>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3 z-10" />
          <Input
            type="text"
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search users by name, email, or business name..."
            className="h-10 pl-10 pr-4 rounded-xl text-xs"
          />
        </div>

        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-xl border border-input bg-card text-xs text-foreground focus:ring-2 focus:ring-red-500"
        >
          <option value="All">All Roles</option>
          <option value="customer">Customers</option>
          <option value="vendor">Vendors</option>
          <option value="admin">Admins</option>
        </select>

        <Button
          onClick={fetchUsers}
          className="h-10 px-4 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 text-white"
        >
          Search
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between gap-4">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            No users match the search criteria.
          </div>
        ) : (
          <Table className="text-xs">
            <TableHeader className="bg-muted">
              <TableRow className="border-b border-border">
                <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">User</TableHead>
                <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Role</TableHead>
                <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Subscription</TableHead>
                <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Status</TableHead>
                <TableHead className="py-3 px-4 text-right text-muted-foreground font-bold uppercase tracking-wider">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-border">
              {users.map((u) => (
                <TableRow key={u._id} className="hover:bg-muted/40 transition-colors">
                  <TableCell className="py-3 px-4">
                    <div className="font-bold text-foreground">{u.name}</div>
                    <div className="text-muted-foreground">{u.email}</div>
                    {u.businessName && <div className="text-orange-600 text-[10px]">{u.businessName}</div>}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    <span className="capitalize font-semibold text-foreground/90">{u.role}</span>
                  </TableCell>
                  <TableCell className="py-3 px-4 capitalize">
                    {u.role === 'vendor' ? (
                      <span className={u.subscriptionPlan === 'premium' ? 'text-amber-500 font-bold' : 'text-muted-foreground'}>
                        {u.subscriptionPlan}
                      </span>
                    ) : (
                      '—'
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4">
                    {u.isBlocked ? (
                      <Badge variant="outline" className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-700 border-red-200">Blocked</Badge>
                    ) : (
                      <Badge variant="outline" className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border-emerald-200">Active</Badge>
                    )}
                  </TableCell>
                  <TableCell className="py-3 px-4 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-[11px] cursor-pointer transition-colors ${
                          u.isBlocked
                            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                            : 'bg-red-100 text-red-700 hover:bg-red-200'
                        }`}
                      >
                        {u.isBlocked ? 'Unblock User' : 'Block User'}
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
