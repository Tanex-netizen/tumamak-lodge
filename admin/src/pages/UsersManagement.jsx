import { useState, useEffect } from 'react';
import useUserStore from '../store/userStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Badge } from '../components/ui/Badge';
import { Dialog } from '../components/ui/Dialog';
import { Table } from '../components/ui/Table';
import { Alert } from '../components/ui/Alert';
import { formatDate } from '../lib/utils';

const UsersManagement = () => {
  const { users, loading, error, fetchUsers, updateUserRole, toggleUserStatus, getUserDetails } = useUserStore();
  
  const [filters, setFilters] = useState({
    role: '',
    isActive: '',
    search: '',
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers]);

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilters = () => {
    fetchUsers(filters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      role: '',
      isActive: '',
      search: '',
    };
    setFilters(resetFilters);
    fetchUsers(resetFilters);
  };

  const handleViewDetails = async (user) => {
    const details = await getUserDetails(user._id);
    if (details) {
      setSelectedUser(details);
      setShowDetailsDialog(true);
    }
  };

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setShowRoleDialog(true);
  };

  const handleToggleStatus = (user) => {
    setSelectedUser(user);
    setShowStatusDialog(true);
  };

  const handleConfirmRoleUpdate = async () => {
    if (selectedUser && newRole) {
      const result = await updateUserRole(selectedUser._id, newRole);
      if (result.success) {
        setShowRoleDialog(false);
        setSelectedUser(null);
      }
    }
  };

  const handleConfirmToggleStatus = async () => {
    if (selectedUser) {
      const result = await toggleUserStatus(selectedUser._id);
      if (result.success) {
        setShowStatusDialog(false);
        setSelectedUser(null);
      }
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-100 text-red-800',
      staff: 'bg-blue-100 text-blue-800',
      customer: 'bg-green-100 text-green-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-brown-900">Users Management</h1>
        <p className="text-brown-600 mt-2">Manage all users and their roles</p>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Search
              </label>
              <Input
                type="text"
                placeholder="Name or email..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Role
              </label>
              <Select
                value={filters.role}
                onChange={(e) => handleFilterChange('role', e.target.value)}
              >
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="customer">Customer</option>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Status
              </label>
              <Select
                value={filters.isActive}
                onChange={(e) => handleFilterChange('isActive', e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleApplyFilters}>Apply Filters</Button>
            <Button onClick={handleResetFilters} variant="outline">
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({users?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p className="text-brown-600">Loading users...</p>
            </div>
          ) : !users || users.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-brown-600">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          {user.profileImage ? (
                            <img
                              src={user.profileImage}
                              alt={user.firstName}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-brown-200 flex items-center justify-center">
                              <span className="text-brown-700 font-medium">
                                {user.firstName?.[0]}
                                {user.lastName?.[0]}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-brown-900">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || 'N/A'}</td>
                      <td>
                        <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                      </td>
                      <td>
                        <Badge
                          className={
                            user.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>{formatDate(user.createdAt)}</td>
                      <td>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(user)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditRole(user)}
                          >
                            Edit Role
                          </Button>
                          <Button
                            size="sm"
                            variant={user.isActive ? 'outline' : 'default'}
                            onClick={() => handleToggleStatus(user)}
                          >
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog
        isOpen={showDetailsDialog}
        onClose={() => setShowDetailsDialog(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              {selectedUser.profileImage ? (
                <img
                  src={selectedUser.profileImage}
                  alt={selectedUser.firstName}
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-brown-200 flex items-center justify-center">
                  <span className="text-brown-700 text-2xl font-medium">
                    {selectedUser.firstName?.[0]}
                    {selectedUser.lastName?.[0]}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-brown-900">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <p className="text-brown-600">{selectedUser.email}</p>
              </div>
            </div>

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">Phone</p>
                  <p className="font-medium text-brown-900">{selectedUser.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Role</p>
                  <Badge className={getRoleColor(selectedUser.role)}>{selectedUser.role}</Badge>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Status</p>
                  <Badge
                    className={
                      selectedUser.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }
                  >
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Joined</p>
                  <p className="font-medium text-brown-900">
                    {formatDate(selectedUser.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            {selectedUser.address && (
              <div className="border-t border-brown-200 pt-4">
                <h4 className="font-medium text-brown-900 mb-2">Address</h4>
                <p className="text-brown-700">{selectedUser.address}</p>
              </div>
            )}

            <div className="border-t border-brown-200 pt-4">
              <h4 className="font-medium text-brown-900 mb-2">Account Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-brown-600">User ID</p>
                  <p className="font-medium text-brown-900 text-xs">{selectedUser._id}</p>
                </div>
                <div>
                  <p className="text-sm text-brown-600">Last Updated</p>
                  <p className="font-medium text-brown-900">
                    {formatDate(selectedUser.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Dialog>

      {/* Edit Role Dialog */}
      <Dialog
        isOpen={showRoleDialog}
        onClose={() => setShowRoleDialog(false)}
        title="Edit User Role"
      >
        <div className="space-y-4">
          <div>
            <p className="text-sm text-brown-600 mb-2">
              User: {selectedUser?.firstName} {selectedUser?.lastName}
            </p>
            <label className="block text-sm font-medium text-brown-700 mb-2">New Role</label>
            <Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="customer">Customer</option>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRoleUpdate}>Update Role</Button>
          </div>
        </div>
      </Dialog>

      {/* Toggle Status Dialog */}
      <Dialog
        isOpen={showStatusDialog}
        onClose={() => setShowStatusDialog(false)}
        title={selectedUser?.isActive ? 'Deactivate User' : 'Activate User'}
      >
        <div className="space-y-4">
          <p className="text-brown-700">
            Are you sure you want to {selectedUser?.isActive ? 'deactivate' : 'activate'}{' '}
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>
            ?
          </p>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmToggleStatus}>
              {selectedUser?.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
