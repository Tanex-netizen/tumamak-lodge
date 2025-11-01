import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-brown-900 text-brown-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-4">Tumamak Lodge</h3>
            <p className="text-brown-200 text-sm">
              Find Comfort in a Foreign Land. Experience the perfect blend of
              comfort and hospitality.
            </p>
            {/* Social icons removed per request */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/rooms"
                  className="text-brown-200 hover:text-white transition-colors"
                >
                  Our Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/vehicles"
                  className="text-brown-200 hover:text-white transition-colors"
                >
                  Vehicles
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="text-brown-200 hover:text-white transition-colors"
                >
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-brown-200 text-sm">
              <li>Room Booking</li>
              <li>Vehicle Rental</li>
              <li>24/7 Customer Service</li>
              <li>Free WiFi</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-brown-200 text-sm">
              <li className="flex items-start space-x-2">
                <FiMapPin className="mt-1 flex-shrink-0" />
                <span>Brgy Siquijor Near Port Area</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiPhone />
                <span>09975067760 / 09993480253 / 09850015923</span>
              </li>
              <li className="flex items-center space-x-2">
                <FiMail />
                <span>lodgetumamak@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-brown-800 mt-8 pt-8 text-center text-brown-300 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Tumamak Lodge. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
