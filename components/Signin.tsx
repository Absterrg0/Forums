"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function SignIn() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                username,
                password
            });

            if (result?.error) {
                setError(result.error); // Set error message if there is an issue
            } else if (result?.ok) {
                router.push('/'); // Redirect to a dashboard or home page after successful sign-in
            }
        } catch (err) {
            setError("Error while signing in. Please try again."); // Generic error message
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-zinc-900">
            <div className="relative bg-zinc-950 rounded-lg shadow-lg max-w-md w-full p-8">
                <h1 className="text-center text-white text-3xl mb-4 font-semibold">Sign In</h1>
                <p className="text-center text-white mb-6 text-sm">
                    Access your account to continue
                </p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form className="space-y-4" onSubmit={handleSignIn}>
                    <div className="space-y-1">
                        <label className="text-white block text-sm font-medium">Username:</label>
                        <input
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 rounded-md bg-zinc-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            type="text"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="space-y-1">
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
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </div>
                    <div className="text-center text-white mt-4">
                        <p className="mb-2 text-sm">Don&apos;t have an account?</p>
                        <button
                            onClick={() => router.push('/signup')}
                            className="text-blue-500 hover:underline focus:outline-none text-sm"
                        >
                            Sign Up
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
