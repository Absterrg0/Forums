import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import NavBar from '@/components/landingpage/NavBar';

const SearchResults = dynamic(() => import("@/components/search/results"), {
    suspense: true,
});

const SearchResultsPage = () => {
    return (
        <>
        <NavBar></NavBar>
        <Suspense fallback={<div>Loading...</div>}>
            <SearchResults />
        </Suspense>
        </>
    );
};

export default SearchResultsPage;
