'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FaUser, FaPlus, FaSignOutAlt, FaTrash } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import truncate from 'html-truncate';
import DOMPurify from 'dompurify';

interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

interface Forum {
    id: number;
    title: string;
    description: string;
    tag: string;
    author: User; // This should be a User object
}

export default function MainPage() {
    
    const [forums, setForums] = useState<Forum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const router = useRouter();
    console.log(session?.user);

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
            router.push('/'); // Redirect to login page after sign-out
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    // Function to truncate description HTML content by word limit while preserving tags
    const truncateDescription = (html: string, wordLimit: number) => {
        const sanitizedHtml = DOMPurify.sanitize(html);
        return truncate(sanitizedHtml, wordLimit, { ellipsis: '...' });
    };

    const handleDeleteForum = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this forum?')) {
            try {
                await axios.delete(`/api/forums/update/${id}`);
                setForums((prevForums) => prevForums.filter((forum) => forum.id !== id));
            } catch (error) {
                console.error('Error deleting forum:', error);
                setError('Failed to delete forum.');
            }
        }
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-gray-100 pt-20">
                {/* Sidebar */}
                <motion.aside
                    className={clsx(
                        'fixed top-20 left-0 h-full w-64 bg-gray-50 text-gray-800 p-4 z-40',
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
                                className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaUser className="mr-3 text-xl" />
                                My Profile
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={() => handleNavigation('/forums/create')}
                                className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPlus className="mr-3 text-xl" />
                                Create Forums
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={handleSignOut}
                                className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSignOutAlt className="mr-3 text-xl" />
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
            <div className="relative min-h-screen bg-gray-100 pt-20">
                {/* Sidebar */}
                <motion.aside
                    className={clsx(
                        'fixed top-20 left-0 h-full w-64 bg-gray-50 text-gray-800 p-4 z-40',
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
                                className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaUser className="mr-3 text-xl" />
                                My Profile
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={() => handleNavigation('/forums/create')}
                                className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaPlus className="mr-3 text-xl" />
                                Create Forums
                            </motion.button>
                        </li>
                        <li>
                            <motion.button
                                onClick={handleSignOut}
                                className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaSignOutAlt className="mr-3 text-xl" />
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
        <div className="flex min-h-screen bg-gray-100 pt-20">
            {/* Sidebar */}
            <motion.aside
                className={clsx(
                    'fixed top-20 left-0 h-full w-64 bg-gray-50 text-gray-800 p-4 z-40',
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
                            className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaUser className="mr-3 text-xl" />
                            My Profile
                        </motion.button>
                    </li>
                    <li>
                        <motion.button
                            onClick={() => handleNavigation('/forums/create')}
                            className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPlus className="mr-3 text-xl" />
                            Create Forums
                        </motion.button>
                    </li>
                    <li>
                        <motion.button
                            onClick={handleSignOut}
                            className="flex items-center p-3 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaSignOutAlt className="mr-3 text-xl" />
                            Sign Out
                        </motion.button>
                    </li>
                </ul>
            </motion.aside>
    
            {/* Main Content */}
            <div className="flex-grow ml-64 p-4">
                <motion.h2
                    className="text-3xl font-bold text-gray-800 mb-6"
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
                                className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex justify-between items-start"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex-1 pr-4">
                                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">{forum.title}</h3>
                                    <div
                                        className="text-gray-600 mb-4"
                                        dangerouslySetInnerHTML={{ __html: truncateDescription(forum.description, 60) }}
                                    ></div>
                                    <div className="text-gray-500 mb-4">
                                        Created by: <span className="font-medium">{forum.author.username}</span>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <motion.button
                                            onClick={() => handleReadMore(forum.id)}
                                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Read More →
                                        </motion.button>
                                        {session?.user.isAdmin && (
                                            <motion.button
                                                onClick={() => handleDeleteForum(forum.id)}
                                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <FaTrash className="inline-block mr-2" />
                                                Delete
                                            </motion.button>
                                        )}
                                    </div>
                                </div>
                                <div className="flex-shrink-0">
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
