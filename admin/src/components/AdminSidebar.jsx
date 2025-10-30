import { NavLink } from 'react-router-dom';
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

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/rooms', icon: Bed, label: 'Rooms' },
  { to: '/bookings', icon: Calendar, label: 'Bookings' },
  { to: '/walk-in', icon: UserPlus, label: 'Walk-in Bookings' },
  { to: '/vehicle-rentals', icon: Car, label: 'Vehicle Rentals' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/revenue', icon: DollarSign, label: 'Revenue Analytics' },
  { to: '/contacts', icon: MessageSquare, label: 'Contact Messages' },
];

export default function AdminSidebar() {
  return (
    <aside className="w-64 bg-brown-50 border-r border-brown-200 min-h-[calc(100vh-4rem)] sticky top-16">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-white text-brown-900 border-l-4 border-brown-700 shadow-sm'
                    : 'text-brown-700 hover:bg-brown-100'
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
