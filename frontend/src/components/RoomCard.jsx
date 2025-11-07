import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { FiStar, FiUsers } from 'react-icons/fi';
import { formatCurrency } from '../lib/utils';

const RoomCard = ({ room }) => {
  // Debug: Log room capacity
  // (debug log removed)
  
  // Resolve image URL: if stored URL is a server-relative path (/images/...),
  // prefix it with the backend origin (VITE_API_URL without /api). This keeps
  // dev server and production working the same way.
  const resolveImageSrc = (url) => {
    if (!url) return null;
    const api = import.meta.env.VITE_API_URL;
    const origin = api ? api.replace(/\/api\/?$/, '') : '';
    return url.startsWith('/images') ? `${origin}${url}` : url;
  };
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-64 overflow-hidden">
        <img
          src={
            resolveImageSrc(room.thumbnail) || resolveImageSrc(room.images?.[0]?.url) ||
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=600'
          }
          alt={room.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4 bg-brown-700 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {room.floor}
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-brown-900 mb-2">{room.name}</h3>
        <p className="text-brown-600 text-sm mb-4 line-clamp-2">
          {room.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1">
            <FiStar className="text-yellow-500 fill-yellow-500" />
            <span className="font-semibold text-brown-900">
              {room.averageRating > 0 ? room.averageRating.toFixed(1) : 'New'}
            </span>
            {room.totalReviews > 0 && (
              <span className="text-brown-600 text-sm">
                ({room.totalReviews})
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-brown-600">
            <FiUsers />
            <span className="text-sm">
              {room.capacity?.adults || 2} Adults
            </span>
          </div>
        </div>
        <div className="border-t border-brown-200 pt-4">
          <p className="text-3xl font-bold text-brown-800">
            {formatCurrency(room.price)}
            <span className="text-sm font-normal text-brown-600">/ 12h</span>
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Link to={`/rooms/${room._id}`} className="w-full">
          <Button className="w-full">View Details</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
