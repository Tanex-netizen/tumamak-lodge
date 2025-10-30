import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { useRoomStore } from '../store/roomStore';
import RoomCard from '../components/RoomCard';

const HomePage = () => {
  const { rooms, fetchRooms } = useRoomStore();

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const featuredRooms = rooms.slice(0, 6);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        <div className="absolute inset-0 bg-[url('/header.jpg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-brown-900/60"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Tumamak Lodge
            </h1>
            <p className="text-2xl md:text-3xl text-brown-100 mb-4">
              Find Comfort in a Foreign Land
            </p>
            <p className="text-lg text-brown-50 mb-8 max-w-2xl">
              Experience the perfect blend of comfort and hospitality. Book your
              stay with us and create unforgettable memories.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/rooms">
                <Button size="lg" className="text-lg px-8 py-6">
                  Book Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-brown-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-brown-900 mb-6">
                About Us
              </h2>
              <p className="text-brown-700 mb-4 text-lg leading-relaxed">
                Welcome to Tumamak Lodge, where comfort meets nature. Our lodge
                offers a serene and welcoming environment for travelers seeking a
                peaceful retreat.
              </p>
              <p className="text-brown-700 mb-6 text-lg leading-relaxed">
                With modern amenities and traditional hospitality, we ensure your
                stay is memorable and comfortable. Experience the warmth of our
                service and the beauty of our surroundings.
              </p>
              <Link to="/rooms">
                <Button size="lg">Explore Our Rooms</Button>
              </Link>
            </div>
            <div className="relative h-96 rounded-lg overflow-hidden shadow-xl">
              <img
                src="/header.jpg"
                alt="Tumamak Lodge"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Rooms */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brown-900 mb-4">
              Our Rooms
            </h2>
            <p className="text-brown-600 text-lg max-w-2xl mx-auto">
              Choose from our carefully designed rooms, each offering comfort and
              modern amenities for a pleasant stay.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredRooms.map((room) => (
              <div key={room._id}>
                <RoomCard room={room} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/rooms">
              <Button size="lg" variant="outline">
                View All Rooms
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Location & Directions Section */}
      <section className="py-20 bg-brown-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-brown-900 mb-4">
              Find Us
            </h2>
            <p className="text-brown-600 text-lg">
              We're easy to locate and looking forward to welcoming you
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Directions - Left Side */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-brown-900 mb-4">
                  How to Get Here
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-brown-800 text-lg">
                        <strong>Arrive at the port</strong>
                      </p>
                      <p className="text-brown-600">
                        Disembark and head to the main exit
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-brown-800 text-lg">
                        <strong>Walk straight ahead</strong>
                      </p>
                      <p className="text-brown-600">
                        Continue walking straight from the port exit
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-brown-800 text-lg">
                        <strong>Turn left</strong>
                      </p>
                      <p className="text-brown-600">
                        You'll see the lodge area on your left
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-brown-600 text-white rounded-full flex items-center justify-center font-bold">
                      4
                    </div>
                    <div>
                      <p className="text-brown-800 text-lg">
                        <strong>Welcome to Tumamak Lodge!</strong>
                      </p>
                      <p className="text-brown-600">
                        Our friendly staff will be ready to assist you
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brown-200">
                <p className="text-brown-700 mb-2">
                  <strong>Need help?</strong>
                </p>
                <p className="text-brown-600">
                  Call us at <span className="font-semibold">09850015923</span> for assistance
                </p>
              </div>
            </div>

            {/* Map - Right Side */}
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-2xl">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1633.2685808955441!2d123.5134836516337!3d9.21695635301232!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33ab15c5a23c954d%3A0x416c8b4094f687d8!2sTumamak%20Lodge!5e1!3m2!1sen!2sph!4v1761051971368!5m2!1sen!2sph" 
                  width="100%" 
                  height="450" 
                  style={{ border: 0 }}
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Tumamak Lodge Location"
                ></iframe>
              </div>
              <div className="mt-4 text-center">
                <a 
                  href="https://www.google.com/maps/place/Tumamak+Lodge/@9.2169564,9.2169564,17z/data=!3m1!4b1!4m6!3m5!1s0x33ab15c5a23c954d:0x416c8b4094f687d8!8m2!3d9.2169564!4d123.5134836!16s%2Fg%2F11y2xqg5qb?entry=ttu&g_ep=EgoyMDI1MDEyOS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-brown-600 hover:text-brown-800 font-semibold"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
