'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { FaUser, FaPlus, FaSignOutAlt } from 'react-icons/fa';

// Interfaces
interface Forum {
    id: number;
    title: string;
    description: string;
    tag: string;
}

interface Comment {
    id: number;
    content: string;
    authorId: number;
    forumId: number;
    parentId?: number; // Nullable field
    createdAt: string; // ISO date string
    createdBy: string; // Author's name
    author: { name: string }
    replies?: Comment[] // Nested replies
}

export default function ForumDetails() {
    const { id } = useParams(); // Access the dynamic route parameter
    const [forum, setForum] = useState<Forum | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession(); // To get the user session

    useEffect(() => {
        async function fetchForumDetails() {
            if (!id) return;

            try {
                setLoading(true);
                setError(null);
                const response = await axios.get<Forum>(`/api/forums/update/${id}`);
                setForum(response.data);

                const commentsResponse = await axios.get<Comment[]>(`/api/forums/update/${id}/comments`);
                setComments(commentsResponse.data);
            } catch (error) {
                console.error('Error fetching forum details:', error);
                setError('Forum not found');
                //@ts-ignore
                if (error.response?.status === 404) {
                    router.push('/404'); // Redirect to a custom 404 page or handle appropriately
                }
            } finally {
                setLoading(false);
            }
        }

        fetchForumDetails();
    }, [id, router]);

    const handleCreate = () =>{
        router.push('/forums/create')
    }
    const handleSignOut = () => {
        // Implement sign-out logic here
        // e.g., signOut() from next-auth
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user || !forum) {
            console.error('User not authenticated or forum missing');
            return;
        }

        try {
            await axios.post(`/api/forums/update/${id}/comments`, {
                content: newComment,
                authorId: session.user.id,
                forumId: forum.id,
            });

            const response = await axios.get<Comment[]>(`/api/forums/update/${forum.id}/comments`);
            setComments(response.data);
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleReplySubmit = async (commentId: number) => {
        if (!session?.user || !forum || !replyContent[commentId]) {
            console.error('User not authenticated, forum missing, or reply content is empty');
            return;
        }

        try {
            await axios.post(`/api/forums/update/${id}/comments`, {
                content: replyContent[commentId],
                authorId: session.user.id,
                forumId: forum.id,
                parentId: commentId,
            });

            const response = await axios.get<Comment[]>(`/api/forums/update/${forum.id}/comments`);
            setComments(response.data);
            setReplyContent(prev => ({ ...prev, [commentId]: '' }));
        } catch (error) {
            console.error('Error creating reply:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-100">
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
                                onClick={handleCreate}
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

                {/* Loader */}
                <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75">
                    <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen bg-gray-100">
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
                                onClick={() => router.push('/create')}
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

                <div className="absolute inset-0 flex justify-center items-center bg-gray-100 bg-opacity-75">
                    <h1 className="text-2xl font-semibold text-red-500">{error}</h1>
                </div>
            </div>
        );
    }

    // Helper function to render replies
    const renderReplies = (parentId: number) => {
        return comments
            .filter(comment => comment.parentId === parentId)
            .map(reply => (
                <div key={reply.id} className="ml-4 mt-2 border-l-2 border-blue-200 pl-2">
                    <div className="flex items-start mb-2">
                        <span className="font-semibold">{reply.author.name}</span>
                        <p className="ml-2 text-gray-700">{reply.content}</p>
                    </div>
                    {renderReplies(reply.id)}
                </div>
            ));
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
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
                            onClick={() => router.push('/create')}
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
            <div className="flex-1 p-8 ml-64 bg-gray-100">
                {forum && (
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 mt-20">
                        <h1 className="flex justify-center text-3xl font-bold mb-2">{forum.title}</h1>
                        <p className="text-gray-700">{forum.description}</p>
                    </div>
                )}

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-4">Comments</h2>
                    {comments
                        .filter(comment => !comment.parentId) // Top-level comments only
                        .map(comment => (
                            <div key={comment.id} className="mb-4">
                                <div className="flex items-start mb-2">
                                    <span className="font-semibold">-{comment.author.name}</span>
                                    <p className="ml-2 text-gray-700"><br />{comment.content}</p>
                                </div>
                                <div className="ml-4 mt-2 border-l-2 border-blue-200 pl-2">
                                    {renderReplies(comment.id)}
                                </div>
                                <div className="mt-4">
                                    <textarea
                                        className="w-full p-2 border border-gray-300 rounded"
                                        placeholder="Write a reply..."
                                        value={replyContent[comment.id] || ''}
                                        onChange={(e) => setReplyContent(prev => ({ ...prev, [comment.id]: e.target.value }))}
                                    />
                                    <button
                                        className="mt-2 p-2 bg-blue-500 text-white rounded"
                                        onClick={() => handleReplySubmit(comment.id)}
                                    >
                                        Reply
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                    <h2 className="text-2xl font-bold mb-4">Add a Comment</h2>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            className="w-full p-2 border border-gray-300 rounded"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="mt-2 p-2 bg-blue-500 text-white rounded"
                        >
                            Submit Comment
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
