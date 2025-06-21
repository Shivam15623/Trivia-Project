import {
  BadgeDollarSign,
  FacebookIcon,
  InstagramIcon,
  TimerIcon,
  TwitterIcon,
  User,
  Users,
  YoutubeIcon,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const HomeFooter = () => {
  return (
    <footer className="bg-[#6b7280] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 orange-gradient rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">SJ</span>
              </div>
              <span className="text-2xl font-bold text-white">Trivia</span>
            </div>
            <p className="text-gray-300 mb-6">
              The ultimate trivia experience for solo players and teams.
              Challenge your knowledge across 6 categories!
            </p>
            <div className="flex space-x-4">
              <Link
                to="#"
                className="social-icon text-gray-300 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                <FacebookIcon className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="social-icon text-gray-300 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                <TwitterIcon className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="social-icon text-gray-300 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                <InstagramIcon className="w-5 h-5" />
              </Link>
              <Link
                to="#"
                className="social-icon text-gray-300 hover:text-white transition-colors bg-gray-700 hover:bg-gray-600 p-2 rounded-full"
              >
                <YoutubeIcon className="w-5 h-5" />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 relative pb-2 inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-1 orange-gradient rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="#how-to-play"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                  How to Play
                </Link>
              </li>
              <li>
                <Link
                  to="#categories"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 5l7 7-7 7"
                    ></path>
                  </svg>
                  Categories
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 relative pb-2 inline-block">
              Game Modes
              <span className="absolute bottom-0 left-0 w-1/2 h-1 orange-gradient rounded-full"></span>
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="#how-to-play"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <User className="h-4 w-4 mr-2" />
                  Solo Mode
                </Link>
              </li>
              <li>
                <Link
                  to="#how-to-play"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Team Mode
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Lifelines
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <BadgeDollarSign className="h-4 w-4 mr-2" />
                  Point System
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="footer-link text-gray-300 hover:text-white transition-colors flex items-center"
                >
                  <TimerIcon className="h-4 w-4 mr-2" />
                  Time Challenges
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2023 Trivia. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Cookie Policy
              </Link>
              <Link
                to="#"
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default HomeFooter;
