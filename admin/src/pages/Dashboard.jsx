import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/Table';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { DollarSign, Users, Calendar, TrendingUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../lib/utils';

const COLORS = ['#977669', '#bfa094', '#d2bab0', '#e0cec7', '#eaddd7'];

export default function Dashboard() {
  const { stats, recentBookings, fetchDashboardStats, fetchRecentBookings } = useDashboardStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentBookings(10);
  }, [fetchDashboardStats, fetchRecentBookings]);

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'warning',
      confirmed: 'default',
      'checked-in': 'success',
      'checked-out': 'secondary',
      cancelled: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  const getPaymentBadge = (status) => {
    const variants = {
      pending: 'warning',
      'reservation-paid': 'default',
      'fully-paid': 'success',
      refunded: 'destructive',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-brown-900">Dashboard</h1>
        <p className="text-brown-600 mt-1">
          Welcome back! Here's what's happening with your lodge.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-brown-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brown-900">
              {stats ? formatCurrency(stats.totalRevenue) : '₱0'}
            </div>
            <p className="text-xs text-brown-600 mt-1">
              {stats?.revenueGrowth >= 0 ? '+' : ''}
              {stats?.revenueGrowth?.toFixed(1) || '0'}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-brown-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brown-900">
              {stats?.totalBookings || 0}
            </div>
            <p className="text-xs text-brown-600 mt-1">
              {stats?.activeBookings || 0} active bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-brown-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brown-900">
              {stats?.totalUsers || 0}
            </div>
            <p className="text-xs text-brown-600 mt-1">
              {stats?.newUsersThisMonth || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-brown-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-brown-900">
              {stats?.occupancyRate?.toFixed(1) || '0'}%
            </div>
            <p className="text-xs text-brown-600 mt-1">
              Based on available rooms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart - Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center text-brown-600">
              {stats ? (
                <div className="text-center">
                  <p className="text-lg font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-brown-900 mt-2">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <p className="text-sm mt-2">Revenue trend chart coming soon</p>
                </div>
              ) : (
                <p>Loading revenue data...</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.bookingsByStatus || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {(stats?.bookingsByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Room Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue by Room Type</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.revenueByRoom || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0cec7" />
              <XAxis
                dataKey="roomName"
                stroke="#977669"
                tick={{ fill: '#977669', fontSize: 12 }}
              />
              <YAxis
                stroke="#977669"
                tick={{ fill: '#977669', fontSize: 12 }}
                tickFormatter={(value) => `₱${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e0cec7',
                  borderRadius: '8px',
                }}
                formatter={(value) => [formatCurrency(value), 'Revenue']}
              />
              <Bar dataKey="revenue" fill="#977669" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking #</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!recentBookings || recentBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-brown-600">
                    No bookings yet
                  </TableCell>
                </TableRow>
              ) : (
                recentBookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell className="font-medium">
                      {booking.bookingNumber}
                    </TableCell>
                    <TableCell>
                      {booking.user?.name || booking.guestName}
                    </TableCell>
                    <TableCell>{booking.room?.name || 'N/A'}</TableCell>
                    <TableCell>{formatDate(booking.checkInDate)}</TableCell>
                    <TableCell>{formatDate(booking.checkOutDate)}</TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>{getPaymentBadge(booking.paymentStatus)}</TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(booking.totalAmount || 0)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
