'use client';

import { motion } from 'framer-motion';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();

  const handleCreateForum = () => {
    router.push('/create');
  };

  const handleMuktiClick = () => {
    router.push('/mukti');
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      className="bg-white border-b border-gray-200 shadow-md fixed top-0 left-0 right-0 z-50"
    >
      <div className="mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo Section */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold ml-6 text-gray-800"
        >
          MuktiForums
        </motion.div>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          <motion.a
            href="/forums"
            className={clsx(
              'text-gray-700 hover:text-blue-600',
              'transition-colors duration-300',
              'text-lg font-medium'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Forums
          </motion.a>

          <motion.button
            onClick={handleMuktiClick}
            className={clsx(
              'bg-green-500 text-white py-2 px-4 rounded-md flex items-center space-x-2',
              'hover:bg-green-600 transition-colors duration-300',
              'text-lg font-medium'
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-semibold">Mukti</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
