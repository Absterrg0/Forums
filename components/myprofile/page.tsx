'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';

interface UpdateUserResponse {
    msg?: string; // For error messages
    // Define other fields based on your response schema if needed
}


interface Forum {
    id: number;
    title: string;
    description: string; // HTML content
    tag: string;
    authorId: number;
}

interface UserProfile {
    id: number;
    name: string;
    email: string;
    username: string;
    password?: string; // Optional, only if updating password is needed
}

export default function MyProfile() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [forums, setForums] = useState<Forum[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        async function fetchProfileAndForums() {
            if (!session?.user?.id) return;

            try {
                const profileResponse = await axios.get<UserProfile>(`/api/user/details`);
                setProfile(profileResponse.data);
            } catch (error) {
                console.error("Error fetching profile", error);
                setError("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfileAndForums();
    }, [session?.user?.id]);

    useEffect(() => {
        async function fetchForums() {
          if (!profile?.id) return;
      
          try {
            const forumsResponse = await axios.get<Forum[]>(`/api/forums/details`);
            console.log("Forums Response:", forumsResponse.data); // Add this line
            setForums(forumsResponse.data);
          } catch (error) {
            console.error("Error fetching forums", error);
            setError("Failed to load forums.");
          }
        }
      
        if (profile) {
          fetchForums();
        }
      }, [profile]);
      

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (profile) {
            setProfile({
                ...profile,
                [e.target.name]: e.target.value,
            });
        }
    };

    const handleSaveChanges = async () => {
        if (!profile) return;
        try {
            const response = await axios.put<UpdateUserResponse>(`/api/user/${profile.id}`, profile); // Fixed URL
    
            if (response.data.msg) {
                alert(response.data.msg);
            } else {
                alert('Profile updated successfully!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Username already exists. Please try a different one');
        }
    };
    
    

    const handleDelete = async (forumId: number) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this forum?');
        if (!confirmDelete) return;

        try {
            await axios.delete(`/api/forums/${forumId}`);
            setForums(forums.filter((forum) => forum.id !== forumId));
            alert('Forum deleted successfully!');
        } catch (error) {
            console.error('Error deleting forum:', error);
            alert('Failed to delete forum.');
        }
    };

    const handleSignOut = async () => {
        try {
            await signOut({ redirect: false });
            router.push('/');
        } catch (error) {
            console.error('Error during sign-out:', error);
        }
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
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
                    </div>
                </div>
            </div>
        );
    }

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
            <div className="ml-64 p-4">
                <motion.h2
                    className="text-3xl font-bold text-gray-800 mb-6 mt-5"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                    My Profile
                </motion.h2>
                {profile && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-md p-6 mb-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">User Details</h3>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Name:</label>
                            <input
                                type="text"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Username:</label>
                            <input
                                type="text"
                                name="username"
                                value={profile.username}
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-600 mb-2">Password:</label>
                            <input
                                type="password"
                                name="password"
                                placeholder='Enter new password (leave blank if unchanged)'
                                onChange={handleInputChange}
                                className="w-full border border-gray-300 rounded-lg p-2"
                            />
                        </div>
                        <motion.button
                            onClick={handleSaveChanges}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Save Changes
                        </motion.button>
                    </div>
                )}
                <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-6"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                >
                    My Forums
                </motion.h2>
                <div className="space-y-6">
                    {forums.length === 0 ? (
                        <p className="text-center text-gray-600">No forums created by you.</p>
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
                                    <div className="text-gray-600 mb-4" dangerouslySetInnerHTML={{ __html: forum.description }}></div>
                                    <motion.button
                                        onClick={() => router.push(`/forums/${forum.id}`)}
                                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Read More →
                                    </motion.button>
                                    <motion.button
                                        onClick={() => handleDelete(forum.id)}
                                        className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors duration-300 mx-3"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        Delete
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
