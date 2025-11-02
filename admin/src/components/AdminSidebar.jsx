import { NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Bed,
  Calendar,
  Users,
  DollarSign,
  Car,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useNotificationStore } from '../store/notificationStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/rooms', icon: Bed, label: 'Rooms' },
  { to: '/bookings', icon: Calendar, label: 'Bookings', badge: 'pendingBookings' },
  { to: '/walk-in', icon: UserPlus, label: 'Walk-in Bookings' },
  { to: '/vehicle-rentals', icon: Car, label: 'Vehicle Rentals', badge: 'pendingRentals' },
  { to: '/users', icon: Users, label: 'Users', badge: 'newUsers' },
  { to: '/revenue', icon: DollarSign, label: 'Revenue Analytics' },
  { to: '/contacts', icon: MessageSquare, label: 'Contact Messages', badge: 'unreadMessages' },
];

export default function AdminSidebar() {
  const { counts, fetchNotificationCounts } = useNotificationStore();

  useEffect(() => {
    // Fetch notification counts on mount
    fetchNotificationCounts();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      fetchNotificationCounts();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchNotificationCounts]);

  return (
    <aside className="w-64 bg-brown-50 border-r border-brown-200 min-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const badgeCount = item.badge ? counts[item.badge] : 0;
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors relative',
                  isActive
                    ? 'bg-white text-brown-900 border-l-4 border-brown-700 shadow-sm'
                    : 'text-brown-700 hover:bg-brown-100'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-red-600 rounded-full">
                  {badgeCount > 99 ? '99+' : badgeCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
