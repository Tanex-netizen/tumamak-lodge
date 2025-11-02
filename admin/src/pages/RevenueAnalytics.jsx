import { useState, useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Alert } from '../components/ui/Alert';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency, formatDate } from '../lib/utils';

const RevenueAnalytics = () => {
  const { stats, fetchDashboardStats, fetchRevenueData } = useDashboardStore();
  
  const [dateRange, setDateRange] = useState('30');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [revenueData, setRevenueData] = useState([]);
  const [revenueByRoomData, setRevenueByRoomData] = useState([]);
  const [paymentTypeData, setPaymentTypeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Calculate date range based on selection
  const getDateRange = () => {
    const end = new Date();
    const start = new Date();
    
    switch (dateRange) {
      case '7':
        start.setDate(end.getDate() - 7);
        break;
      case '30':
        start.setDate(end.getDate() - 30);
        break;
      case '90':
        start.setDate(end.getDate() - 90);
        break;
      case 'custom':
        return { startDate, endDate };
      default:
        start.setDate(end.getDate() - 30);
    }
    
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await fetchDashboardStats();
      const range = getDateRange();
      await loadRevenueData(range.startDate, range.endDate);
    } catch (err) {
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const loadRevenueData = async (start, end) => {
    try {
      // Mock revenue over time data (replace with actual API call)
      const mockRevenueData = generateMockRevenueData(start, end);
      setRevenueData(mockRevenueData);

      // Mock revenue by room data
      if (stats?.revenueByRoom) {
        setRevenueByRoomData(stats.revenueByRoom);
      }

      // Mock payment type breakdown
      const mockPaymentData = [
        { name: 'Reservation Fees', value: 45000, color: '#977669' },
        { name: 'Full Payments', value: 155000, color: '#d2bab0' },
      ];
      setPaymentTypeData(mockPaymentData);
    } catch (err) {
      console.error('Error loading revenue data:', err);
    }
  };

  const generateMockRevenueData = (start, end) => {
    const data = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    for (let i = 0; i <= daysDiff; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.floor(Math.random() * 15000) + 5000,
        reservations: Math.floor(Math.random() * 3000) + 1000,
      });
    }
    
    return data;
  };

  const handleDateRangeChange = (value) => {
    setDateRange(value);
    if (value !== 'custom') {
      loadData();
    }
  };

  const handleApplyCustomRange = () => {
    if (startDate && endDate) {
      loadRevenueData(startDate, endDate);
    }
  };

  const handleExportData = () => {
    // Create CSV content
    const csvContent = [
      ['Date', 'Total Revenue', 'Reservation Fees'],
      ...revenueData.map(row => [
        row.date,
        row.revenue,
        row.reservations,
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `revenue-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-brown-900">Revenue Analytics</h1>
          <p className="text-brown-600 mt-2">Track and analyze revenue performance</p>
        </div>
        <Button onClick={handleExportData}>Export Data</Button>
      </div>

      {error && (
        <Alert variant="error" className="mb-6">
          {error}
        </Alert>
      )}

      {/* Date Range Selector */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Date Range</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-brown-700 mb-2">
                Quick Select
              </label>
              <Select value={dateRange} onChange={(e) => handleDateRangeChange(e.target.value)}>
                <option value="7">Last 7 Days</option>
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="custom">Custom Range</option>
              </Select>
            </div>

            {dateRange === 'custom' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">
                    Start Date
                  </label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brown-700 mb-2">
                    End Date
                  </label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleApplyCustomRange} className="w-full">
                    Apply
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-brown-600">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-brown-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-brown-900 mt-2">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {stats?.revenueGrowth >= 0 ? '+' : ''}
                    {stats?.revenueGrowth?.toFixed(1) || 0}% from last month
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-brown-600">Reservation Fees</p>
                  <p className="text-3xl font-bold text-brown-900 mt-2">
                    {formatCurrency(stats?.revenueBreakdown?.reservationFees || 0)}
                  </p>
                  <p className="text-sm text-brown-600 mt-1">
                    {stats?.revenueBreakdown?.total > 0 
                      ? ((stats.revenueBreakdown.reservationFees / stats.revenueBreakdown.total) * 100).toFixed(1)
                      : 0}% of total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-brown-600">Room Revenue</p>
                  <p className="text-3xl font-bold text-brown-900 mt-2">
                    {formatCurrency(stats?.revenueBreakdown?.roomRevenue || 0)}
                  </p>
                  <p className="text-sm text-brown-600 mt-1">
                    {stats?.revenueBreakdown?.total > 0 
                      ? ((stats.revenueBreakdown.roomRevenue / stats.revenueBreakdown.total) * 100).toFixed(1)
                      : 0}% of total
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-brown-600">Rental Revenue</p>
                  <p className="text-3xl font-bold text-brown-900 mt-2">
                    {formatCurrency(stats?.revenueBreakdown?.rentalRevenue || 0)}
                  </p>
                  <p className="text-sm text-brown-600 mt-1">
                    {stats?.revenueBreakdown?.total > 0 
                      ? ((stats.revenueBreakdown.rentalRevenue / stats.revenueBreakdown.total) * 100).toFixed(1)
                      : 0}% of total
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Over Time Chart */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0cec7" />
                  <XAxis
                    dataKey="date"
                    stroke="#977669"
                    tick={{ fill: '#977669', fontSize: 12 }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }}
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
                    formatter={(value) => [formatCurrency(value), '']}
                    labelFormatter={(label) => formatDate(label)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#977669"
                    strokeWidth={2}
                    name="Total Revenue"
                    dot={{ fill: '#977669', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="reservations"
                    stroke="#d2bab0"
                    strokeWidth={2}
                    name="Reservation Fees"
                    dot={{ fill: '#d2bab0', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue by Room */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue by Room Type</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={revenueByRoomData}>
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

            {/* Payment Type Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Type Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={paymentTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e0cec7',
                        borderRadius: '8px',
                      }}
                      formatter={(value) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Summary Table */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Revenue Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-brown-200">
                    <tr>
                      <th className="text-left py-3 px-4 text-brown-700 font-medium">Room Type</th>
                      <th className="text-right py-3 px-4 text-brown-700 font-medium">
                        Total Bookings
                      </th>
                      <th className="text-right py-3 px-4 text-brown-700 font-medium">
                        Total Revenue
                      </th>
                      <th className="text-right py-3 px-4 text-brown-700 font-medium">
                        Avg. Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueByRoomData.map((room, index) => (
                      <tr key={index} className="border-b border-brown-100">
                        <td className="py-3 px-4 text-brown-900">{room.roomName}</td>
                        <td className="py-3 px-4 text-right text-brown-900">{room.bookings || 0}</td>
                        <td className="py-3 px-4 text-right font-medium text-brown-900">
                          {formatCurrency(room.revenue)}
                        </td>
                        <td className="py-3 px-4 text-right text-brown-900">
                          {formatCurrency(room.revenue / (room.bookings || 1))}
                        </td>
                      </tr>
                    ))}
                    <tr className="font-bold bg-brown-50">
                      <td className="py-3 px-4 text-brown-900">Total</td>
                      <td className="py-3 px-4 text-right text-brown-900">
                        {revenueByRoomData.reduce((sum, room) => sum + (room.bookings || 0), 0)}
                      </td>
                      <td className="py-3 px-4 text-right text-brown-900">
                        {formatCurrency(
                          revenueByRoomData.reduce((sum, room) => sum + room.revenue, 0)
                        )}
                      </td>
                      <td className="py-3 px-4 text-right text-brown-900">-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default RevenueAnalytics;
