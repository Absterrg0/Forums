'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Forum {
    id: number;
    title: string;
    description: string;
    tag: string;
}

export default function Search() {
    const [query, setQuery] = useState('');
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        // Navigate to the search results page with the query parameter
        router.push(`/forums/search-results?query=${encodeURIComponent(query)}`);
    };

    return (
        <div className="max-w-xl mx-auto">
            <form onSubmit={handleSearch} className="relative">
                <label className="sr-only">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <svg className="w-5 h-5 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input
                        type="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        id="default-search"
                        className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Search forums by tag..."
                        required
                    />
                    <button
                        type="submit"
                        className="absolute inset-y-0 right-0 flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-r-lg"
                    >
                        Search
                    </button>
                </div>
            </form>
        </div>
    );
}
