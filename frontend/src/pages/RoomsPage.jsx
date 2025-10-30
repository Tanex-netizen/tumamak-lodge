import { useEffect } from 'react';
import { useRoomStore } from '../store/roomStore';
import RoomCard from '../components/RoomCard';
import { motion as Motion } from 'framer-motion';

const RoomsPage = () => {
  const { rooms, loading, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  return (
    <div className="min-h-screen bg-brown-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-brown-900 mb-4">Our Rooms</h1>
          <p className="text-brown-600 text-lg max-w-2xl mx-auto">
            Discover our comfortable and well-appointed rooms designed for your perfect stay.
          </p>
  </Motion.div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-brown-600">Loading rooms...</p>
          </div>
        ) : (
          <div className="space-y-16">
            {/* Ground Floor Section */}
            <div>
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-bold text-brown-800 mb-3">GROUND FLOOR</h2>
                <div className="h-1 w-24 bg-brown-600 mx-auto"></div>
              </Motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {rooms
                  .filter((room) => room.floor === 'Ground Floor')
                  .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                  .map((room, index) => (
                    <Motion.div
                      key={room._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RoomCard room={room} />
                    </Motion.div>
                  ))}
              </div>
            </div>

            {/* Upstairs Section */}
            <div>
              <Motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 text-center"
              >
                <h2 className="text-3xl font-bold text-brown-800 mb-3">UPSTAIRS</h2>
                <div className="h-1 w-24 bg-brown-600 mx-auto"></div>
              </Motion.div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {rooms
                  .filter((room) => room.floor === 'Upstairs')
                  .sort((a, b) => a.roomNumber.localeCompare(b.roomNumber))
                  .map((room, index) => (
                    <Motion.div
                      key={room._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <RoomCard room={room} />
                    </Motion.div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomsPage;
