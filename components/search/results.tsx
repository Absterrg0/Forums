'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';

interface Forum {
    id: number;
    title: string;
    description: string; // HTML content
    tag: string;
}

const SearchResults = () => {
    const [results, setResults] = useState<Forum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const query = searchParams.get('query') || '';
    const router = useRouter();

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await axios.get<Forum[]>('/api/forums/search', {
                    params: { tag: query },
                });
                setResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
                setError('Failed to load search results.');
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    const handleSignOut = async () => {
        try {
            await axios.post('/api/auth/signout');
            router.push('/login');
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <motion.aside
                className={clsx(
                    'fixed top-20 left-0 h-full w-64 bg-gray-50 text-gray-800 p-6 z-40',
                    'transition-transform duration-300 ease-in-out',
                    'shadow-md'
                )}
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
            >
                <h2 className="text-2xl font-bold mb-8 text-center">Menu</h2>
                <ul className="space-y-4">
                    <li>
                        <motion.button
                            onClick={() => router.push('/myprofile')}
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
                            onClick={() => router.push('/forums/create')}
                            className="flex items-center p-2 text-gray-800 hover:bg-blue-300 rounded-lg transition-colors duration-300 w-full text-left"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaPlus className="mr-2 text-xl" />
                            Create Forum
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
            <div className="flex-grow ml-64 p-8 mt-16">
                <motion.h2
                    className="text-3xl font-bold text-gray-800 mb-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                    >
                        Search Results for &quot;{query}&quot;
                    </motion.h2>
    
                    {loading ? (
                        <div className="flex items-center justify-center min-h-screen">
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                                ></motion.div>
                                <p className="mt-4 text-xl text-gray-700">Loading...</p>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-500">
                            <h1 className="text-2xl font-semibold">{error}</h1>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-8">
                            {results.map((forum) => (
                                <motion.div
                                    key={forum.id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-lg p-6 flex flex-col"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4">{forum.title}</h3>
                                    <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: forum.description }}></div>
                                    <div className="flex justify-between items-center">
                                        <motion.button
                                            onClick={() => router.push(`/forums/${forum.id}`)}
                                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Read More →
                                        </motion.button>
                                        <span className="text-blue-600 font-semibold">{forum.tag}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-600">No results found.</p>
                    )}
                </div>
            </div>
        );
    };
    
    export default SearchResults;
