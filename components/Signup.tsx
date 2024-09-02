"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post("/api/auth/", {
                name,
                username,
                email,
                password
            });

            if (response.status === 200) {
                router.push('/api/auth/signin');
            }
        } catch (err: any) {
            if (err.response && err.response.data.msg === "Username already exists") {
                setError("Username already exists. Please choose a different username.");
            } else {
                setError("Error while signing up. Please try again.");
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-900">
            <div className="bg-zinc-950 rounded-lg shadow-lg max-w-md w-full p-8 space-y-6">
                <h1 className="text-center text-white text-4xl font-bold">Sign Up</h1>
                <p className="text-center text-white text-sm">
                    Create an account to access all the features
                </p>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="space-y-4" onSubmit={handleSignUp}>
                    <div className="space-y-2">
                        <label className="text-white block text-sm font-medium">Name:</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter your name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white block text-sm font-medium">Username:</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white block text-sm font-medium">Email Address:</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter email"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-white block text-sm font-medium">Password:</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="password"
                            placeholder="Enter password"
                            required
                        />
                    </div>
                    <div className="text-center">
                        <button
                            className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-md shadow-md hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </div>
                    <div className="text-center text-white">
                        <p className="mb-2 text-sm">Already have an account?</p>
                        <button
                            onClick={() => router.push('/api/auth/signin')}
                            className="text-blue-500 hover:underline focus:outline-none text-sm font-semibold"
                        >
                            Sign In
                        </button>
                    </div>
                </form>
                {loading && (
                    <div className="absolute inset-0 flex justify-center items-center bg-zinc-900 bg-opacity-75 rounded-lg">
                        <div className="w-12 h-12 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
                    </div>
                )}
            </div>
        </div>
    );
}
