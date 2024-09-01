'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

interface Forum {
    id: number;
    title: string;
    description: string;
    tag: string;
    authorId: number;
}

export default function MainPage() {
    const [forums, setForums] = useState<Forum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        async function fetchForums() {
            try {
                const response = await axios.get<Forum[]>('/api/forums');
                setForums(response.data);
            } catch (error) {
                console.error("Error fetching forums", error);
                setError("Failed to load forums.");
            } finally {
                setLoading(false);
            }
        }
        fetchForums();
    }, []);

    const handleReadMore = (id: number) => {
        router.push(`/forums/${id}`);
    };

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/login'); // Redirect to login page after sign-out
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    const truncateDescription = (description: string, wordLimit: number) => {
        const words = description.split(' ');
        if (words.length <= wordLimit) {
            return description;
        }
        return words.slice(0, wordLimit).join(' ') + '...';
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-gray-100 pt-16">
                {/* Sidebar */}
                <motion.aside
                    className={clsx(
                        'fixed top-16 left-0 h-full w-64 bg-gray-50 text-gray-800 p-4 z-40',
                        'transition-transform duration-300 ease-in-out',
                        'shadow-md'
                    )}
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-center mt-4">Menu</h2>
                    <ul className="space-y-4">
                        <li>
                            <motion.button
                                onClick={() => handleNavigation('/myprofile')}
                                className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaUser className="mr-2 text-xl" />
                                My Profile
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={() => handleNavigation('/forums/create')}
                                className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPlus className="mr-2 text-xl" />
                                Create Forums
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={handleSignOut}
                                className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSignOutAlt className="mr-2 text-xl" />
                                Sign Out
                            </motion.button>
                        </li>
                    </ul>
                </motion.aside>
    
                {/* Main Content */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center">
                        <motion.div
                            className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, ease: 'easeInOut' }}
                        ></motion.div>
                        <p className="mt-4 text-xl text-gray-700">Loading...</p>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-100 pt-16">
                {/* Sidebar */}
                <motion.aside
                    className={clsx(
                        'fixed top-16 left-0 h-full w-64 bg-gray-50 text-gray-800 p-4 z-40',
                        'transition-transform duration-300 ease-in-out',
                        'shadow-md'
                    )}
                    initial={{ x: '-100%' }}
                    animate={{ x: 0 }}
                >
                    <h2 className="text-2xl font-bold mb-6 text-center mt-4">Menu</h2>
                    <ul className="space-y-4">
                        <li>
                            <motion.button
                                onClick={() => handleNavigation('/myprofile')}
                                className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaUser className="mr-2 text-xl" />
                                My Profile
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={() => handleNavigation('/forums/create')}
                                className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPlus className="mr-2 text-xl" />
                                Create Forums
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={handleSignOut}
                                className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSignOutAlt className="mr-2 text-xl" />
                                Sign Out
                            </motion.button>
                        </li>
                    </ul>
                </motion.aside>

                {/* Main Content */}
                <div className="flex-grow ml-64 p-4 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100 pt-16">
            {/* Sidebar */}
            <motion.aside
                className={clsx(
                    'fixed top-16 left-0 h-full w-64 bg-gray-50 text-gray-800 p-4 z-40',
                    'transition-transform duration-300 ease-in-out',
                    'shadow-md'
                )}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
            >
                <h2 className="text-2xl font-bold mb-6 text-center mt-4">Menu</h2>
                <ul className="space-y-4">
                    <li>
                        <motion.button
                            onClick={() => handleNavigation('/myprofile')}
                            className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaUser className="mr-2 text-xl" />
                            My Profile
                        </motion.button>
                    </li>
                    <li>
                        <motion.button
                            onClick={() => handleNavigation('/forums/create')}
                            className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPlus className="mr-2 text-xl" />
                            Create Forums
                        </motion.button>
                    </li>
                    <li>
                        <motion.button
                            onClick={handleSignOut}
                            className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSignOutAlt className="mr-2 text-xl" />
                            Sign Out
                        </motion.button>
                    </li>
                </ul>
            </motion.aside>

            {/* Main Content */}
            <div className="flex-grow ml-64 p-4">
                <motion.h2
                    className="text-3xl font-bold text-gray-800 mb-6 mt-5 flex justify-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                    Discover
                </motion.h2>
                <div className="space-y-6">
                    {forums.length === 0 ? (
                        <p className="text-center text-gray-600">No forums available.</p>
                    ) : (
                        forums.map((forum) => (
                            <motion.div
                                key={forum.id}
                                className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-6 flex justify-between"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{forum.title}</h3>
                                    <p className="text-gray-600 mb-4">{truncateDescription(forum.description, 40)}</p>
                                    <div className="text-gray-500 mb-4">
                                        Created by: {session?.user.name}
                                    </div>
                                    <motion.button
                                        onClick={() => handleReadMore(forum.id)}
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Read More →
                                    </motion.button>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-blue-600 font-semibold">{forum.tag}</span>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
