'use client';

import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Users,
  Store,
  Pizza,
  Clock,
  DollarSign,
  Search,
  CheckCircle2,
  XCircle,
  Ban,
  Unlock,
  Trash2,
  Activity,
  Layers,
  FileText,
} from 'lucide-react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface AdminStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalOrders: number;
  totalTransactions: number;
  totalRevenue: number;
  recentTransactions: any[];
}

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'items' | 'transactions'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters for Users
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');

  // Search & Filters for Items
  const [itemSearch, setItemSearch] = useState('');
  const [itemStatusFilter, setItemStatusFilter] = useState('All');

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.data);
      }
    } catch (err: any) {
      console.error('Failed to load stats', err);
      toast.error('Failed to load dashboard statistics.');
    }
  };

  const fetchUsers = async () => {
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
    }
  };

  const fetchMenuItems = async () => {
    try {
      const params = new URLSearchParams();
      if (itemSearch) params.append('search', itemSearch);
      if (itemStatusFilter !== 'All') params.append('status', itemStatusFilter);

      const res = await api.get(`/admin/menu-items?${params.toString()}`);
      if (res.data.success) {
        setMenuItems(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load menu items', err);
      toast.error('Failed to load menu items.');
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions');
      if (res.data.success) {
        setTransactions(res.data.data || []);
      }
    } catch (err: any) {
      console.error('Failed to load transactions', err);
      toast.error('Failed to load transactions.');
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setIsLoading(true);
      await Promise.all([fetchStats(), fetchUsers(), fetchMenuItems(), fetchTransactions()]);
      setIsLoading(false);
    };
    loadAll();
  }, []);

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
  }, [userRoleFilter]);

  useEffect(() => {
    if (activeTab === 'items') fetchMenuItems();
  }, [itemStatusFilter]);

  // Toggle user block status
  const handleToggleBlock = async (userId: string, currentBlocked: boolean) => {
    try {
      const res = await api.patch(`/admin/users/${userId}/block`);
      if (res.data.success) {
        toast.success(res.data.message);
        fetchUsers();
        fetchStats();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user block status.');
    }
  };

  // Moderate item status (Approve / Reject)
  const handleItemStatus = async (itemId: string, status: string) => {
    try {
      const res = await api.patch(`/admin/menu-items/${itemId}/status`, { status });
      if (res.data.success) {
        toast.success(`Menu item status changed to ${status}.`);
        fetchMenuItems();
        fetchStats();
      }
    } catch (err: any) {
      toast.error('Failed to update status.');
    }
  };

  // Delete item
  const handleDeleteItem = (itemId: string) => {
    toast('Are you sure you want to permanently delete this menu item?', {
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await api.delete(`/admin/menu-items/${itemId}`);
            if (res.data.success) {
              toast.success('Menu item deleted.');
              fetchMenuItems();
              fetchStats();
            }
          } catch (err: any) {
            toast.error(err.response?.data?.message || 'Failed to delete menu item.');
          }
        },
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {},
      },
    });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-8 h-8 text-red-600" />
          <h1 className="text-3xl font-extrabold text-foreground font-serif tracking-tight">
            Admin Control Center
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Monitor platform metrics, moderate menu items, manage registered users, and audit transactions
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3 overflow-x-auto text-sm font-semibold">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'overview' ? 'bg-red-600 text-white shadow-xs' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'users' ? 'bg-red-600 text-white shadow-xs' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Manage Users ({stats?.totalUsers || 0})
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'items' ? 'bg-red-600 text-white shadow-xs' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Review Menu Items ({stats?.pendingMenuItems || 0} Pending)
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
            activeTab === 'transactions' ? 'bg-red-600 text-white shadow-xs' : 'text-muted-foreground hover:bg-muted'
          }`}
        >
          Platform Transactions
        </button>
      </div>

      {/* 1. OVERVIEW & CHARTS TAB */}
      {activeTab === 'overview' && stats && (
        <div className="space-y-8">
          {/* Key Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Total Users</span>
              <div className="text-3xl font-black text-foreground">{stats.totalUsers}</div>
              <p className="text-[11px] text-muted-foreground">
                {stats.totalVendors} Vendors • {stats.totalCustomers} Customers
              </p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Menu Items</span>
              <div className="text-3xl font-black text-foreground">{stats.totalMenuItems}</div>
              <p className="text-[11px] text-amber-500 font-semibold">
                {stats.pendingMenuItems} Pending Review
              </p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Total Food Orders</span>
              <div className="text-3xl font-black text-foreground">{stats.totalOrders}</div>
              <p className="text-[11px] text-emerald-500 font-semibold">Dispatched Orders</p>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl shadow-xs space-y-1">
              <span className="text-xs font-bold uppercase text-muted-foreground">Platform Revenue</span>
              <div className="text-3xl font-black text-red-600">{formatCurrency(stats.totalRevenue)}</div>
              <p className="text-[11px] text-muted-foreground">From Vendor Premium upgrades</p>
            </div>
          </div>

          {/* Visual Data Chart Section */}
          <div className="bg-card border border-border p-6 rounded-3xl shadow-xs space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-foreground">Platform Activity Distribution</h3>
                <p className="text-xs text-muted-foreground">Breakdown of platform users and catalog approval status</p>
              </div>
              <Activity className="w-5 h-5 text-red-500" />
            </div>

            {/* Custom Bar Graphs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User Roles</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Customers ({stats.totalCustomers})</span>
                      <span>{Math.round((stats.totalCustomers / (stats.totalUsers || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(stats.totalCustomers / (stats.totalUsers || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Vendors / Restaurants ({stats.totalVendors})</span>
                      <span>{Math.round((stats.totalVendors / (stats.totalUsers || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500 rounded-full"
                        style={{ width: `${(stats.totalVendors / (stats.totalUsers || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Menu Approval Ratio</p>
                <div className="space-y-2 text-xs">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Live / Approved Items ({stats.totalMenuItems - stats.pendingMenuItems})</span>
                      <span>{Math.round(((stats.totalMenuItems - stats.pendingMenuItems) / (stats.totalMenuItems || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${((stats.totalMenuItems - stats.pendingMenuItems) / (stats.totalMenuItems || 1)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>Pending Verification ({stats.pendingMenuItems})</span>
                      <span>{Math.round((stats.pendingMenuItems / (stats.totalMenuItems || 1)) * 100)}%</span>
                    </div>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(stats.pendingMenuItems / (stats.totalMenuItems || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MANAGE USERS TAB */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Search & Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                placeholder="Search users by name, email, or business name..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-card text-xs text-foreground focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={userRoleFilter}
              onChange={(e) => setUserRoleFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-input bg-card text-xs text-foreground focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Roles</option>
              <option value="customer">Customers</option>
              <option value="vendor">Vendors</option>
              <option value="admin">Admins</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
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
          </div>
        </div>
      )}

      {/* 3. REVIEW MENU ITEMS TAB */}
      {activeTab === 'items' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-3" />
              <input
                type="text"
                value={itemSearch}
                onChange={(e) => setItemSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchMenuItems()}
                placeholder="Search menu items..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-card text-xs text-foreground focus:ring-2 focus:ring-red-500"
              />
            </div>

            <select
              value={itemStatusFilter}
              onChange={(e) => setItemStatusFilter(e.target.value)}
              className="py-2 px-3 rounded-xl border border-input bg-card text-xs text-foreground focus:ring-2 focus:ring-red-500"
            >
              <option value="All">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item._id} className="bg-card border border-border rounded-2xl overflow-hidden p-4 space-y-3 flex flex-col justify-between">
                <div>
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800'}
                    alt={item.itemName}
                    className="w-full h-40 rounded-xl object-cover"
                  />
                  <div className="flex items-center justify-between pt-2">
                    <h3 className="font-bold text-foreground text-sm truncate">{item.itemName}</h3>
                    <span className="font-black text-red-600 text-sm">{formatCurrency(item.price)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
                  <div className="text-[11px] text-muted-foreground pt-1">
                    Vendor: <span className="font-semibold text-foreground">{item.vendorId?.businessName || item.vendorId?.name}</span>
                  </div>
                  <div className="pt-1">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-muted text-foreground">
                      Status: {item.status}
                    </span>
                  </div>
                </div>

                {/* Moderation Actions */}
                <div className="pt-3 border-t border-border flex items-center justify-between gap-2">
                  {item.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => handleItemStatus(item._id, 'approved')}
                        className="w-1/2 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleItemStatus(item._id, 'rejected')}
                        className="w-1/2 py-1.5 rounded-lg text-xs font-bold text-red-600 border border-red-500/30 hover:bg-red-50 cursor-pointer"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleItemStatus(item._id, item.status === 'approved' ? 'inactive' : 'approved')}
                        className="py-1 px-2.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted"
                      >
                        {item.status === 'approved' ? 'Set Inactive' : 'Set Approved'}
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item._id)}
                        className="text-red-500 hover:text-red-700 text-xs font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TRANSACTIONS TAB (Read-only as required) */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-foreground">Platform Transaction Ledger</h2>
              <p className="text-xs text-muted-foreground">Immutable audit logs from Stripe Checkout sessions</p>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-muted text-foreground">
              Read-Only Security Enforced
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-xs">
            <Table className="text-xs">
              <TableHeader className="bg-muted">
                <TableRow className="border-b border-border">
                  <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Vendor / Restaurant</TableHead>
                  <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Plan</TableHead>
                  <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Status</TableHead>
                  <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Stripe Session ID</TableHead>
                  <TableHead className="py-3 px-4 text-muted-foreground font-bold uppercase tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-border">
                {transactions.map((t) => (
                  <TableRow key={t._id} className="hover:bg-muted/40 transition-colors">
                    <TableCell className="py-3 px-4 font-bold text-foreground">
                      {t.vendorId?.businessName || t.vendorId?.name || 'Partner Pizzeria'}
                    </TableCell>
                    <TableCell className="py-3 px-4 uppercase font-bold text-orange-600">
                      {t.plan}
                    </TableCell>
                    <TableCell className="py-3 px-4 font-black text-foreground">
                      {formatCurrency(t.amount)}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <Badge variant="outline" className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border-emerald-200 capitalize">
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground font-mono text-[10px] truncate max-w-xs">
                      {t.stripeSessionId}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-muted-foreground">
                      {formatDate(t.createdAt)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
