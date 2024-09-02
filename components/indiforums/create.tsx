'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function Create() {
    const [title, setTitle] = useState('');
    const [tag, setTag] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user) {
            console.error('User not authenticated');
            return;
        }

        setLoading(true);

        try {
            await axios.post('/api/forums', { 
                title, 
                description, 
                tag,
                authorId: session.user.id // Changed to authorId to match the expected backend field
            });
            router.push('/forums');
        } catch (error) {
            console.error('Error creating forum:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100 pt-16">
            {loading ? (
                <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75 rounded-lg">
                    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex-grow p-6 md:p-8">
                    <div className="mx-auto bg-white p-6 md:p-8 rounded-lg shadow-lg max-w-3xl">
                        <h1 className="text-3xl font-bold mb-6">Create a New Forum</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="title" className="block text-lg font-medium text-gray-700">Title</label>
                                <input
                                    id="title"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="tag" className="block text-lg font-medium text-gray-700">Tag</label>
                                <input
                                    id="tag"
                                    type="text"
                                    value={tag}
                                    onChange={(e) => setTag(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block text-lg font-medium text-gray-700">Description</label>
                                <textarea
                                    id="description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={6}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Publish
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
