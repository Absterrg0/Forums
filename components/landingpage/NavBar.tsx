'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Import a user icon

export default function NavBar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignup = () => {
    router.push('/signup');
  };

  const handleSignIn = () => {
    router.push('/api/auth/signin');
  };

  const handleProfile = () => {
    router.push('/profile');
  };

  const handleSignOut = () => {
    signOut();
  };

  const handleDiscussion = () => {
    router.push('/forums/create');
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="bg-white border-b border-gray-200 shadow-lg"
    >
      <div className="mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo Section */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-gray-800"
        >
          MuktiForums
        </motion.div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <motion.a
            href="/forums"
            className={clsx(
              'text-gray-700 hover:text-gray-900',
              'transition-colors duration-300'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Forums
          </motion.a>
          {/* New Mukti Div */}
          <motion.div
            className={clsx(
              'text-gray-700 hover:text-gray-900 font-semibold',
              'transition-colors cursor-pointer duration-300'
            )}
            onClick={() => router.push('/mukti')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Mukti
          </motion.div>
          {session ? (
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.1 }}
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={clsx('flex items-center cursor-pointer')}
              >
                {/* User Icon */}
                <FaUserCircle className="text-gray-700 text-2xl" />
                <span className="ml-2 text-gray-700">
                  {session.user.name}
                </span>
              </motion.div>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg z-50"
                >
                  <button
                    onClick={handleProfile}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleDiscussion}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Create Forum
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <motion.button
                onClick={handleSignIn}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'text-gray-700 hover:text-gray-900',
                  'transition-colors duration-300'
                )}
              >
                Sign In
              </motion.button>
              <motion.button
                onClick={handleSignup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={clsx(
                  'bg-blue-500 text-white py-2 px-4 rounded-md',
                  'hover:bg-blue-600 transition-colors duration-300'
                )}
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
