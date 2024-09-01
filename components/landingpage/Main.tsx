'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ThreeDCardDemo } from "./Threecard";

export default function PageContent() {
    const router = useRouter();
    const handleGetStarted = () =>{
        router.push('/signup')
    }
    return (
        <div className="min-h-screen bg-gradient-to-r from-purple-50 via-purple-100 to-purple-200 py-16 px-8">
            {/* Main Content Section */}
            <div className="flex flex-col items-center max-w-6xl mx-auto text-center p-8">
                {/* Text Section */}
                <motion.div 
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="mb-16 lg:mb-24 px-4"
                >
                    <blockquote className="text-4xl font-semibold italic text-purple-900 mb-4">
                        "Transforming ideas into reality through collaboration and creativity."
                    </blockquote>
                    <p className="text-lg leading-relaxed text-gray-800 mb-8">
                        Welcome to a dynamic hub where technology meets innovation. Engage in thought-provoking discussions, collaborate on cutting-edge projects, and connect with like-minded individuals. Join us in shaping the future of tech with a community that values creativity and progress.
                    </p>
                    <motion.button
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05, backgroundColor: '#6d28d9' }}  // Slightly enlarge and change background color on hover
                        whileTap={{ scale: 0.95 }}  // Slightly shrink on click
                        transition={{ type: 'spring', stiffness: 300 }}
                        className="bg-purple-800 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-purple-900 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-purple-400"
                        onClick={handleGetStarted}
                    >
                        Get Started
                    </motion.button>
                </motion.div>

                {/* 3D Card Component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                    className="flex justify-center w-full"
                >
                    <ThreeDCardDemo />
                </motion.div>
            </div>

            {/* About Our Forums */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                className="mt-24 text-center max-w-3xl mx-auto px-4"
            >
                <h2 className="text-3xl font-bold text-purple-800 mb-6">About Our Forums</h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    Our forums are designed to foster communication and collaboration among tech enthusiasts and professionals. Whether you’re looking to discuss the latest trends, seek advice, or collaborate on projects, you’ll find a welcoming community ready to support you. Join us today and be part of a network where knowledge and creativity meet.
                </p>
            </motion.div>

            {/* What is Mukti Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.6 }}
                className="mt-24 text-center max-w-3xl mx-auto px-4"
            >
                <h2 className="text-3xl font-bold text-purple-800 mb-6">What is Mukti?</h2>
                <p className="text-lg leading-relaxed text-gray-700">
                    Mukti is a dynamic club run by Het Joshi that delves into the world of open source software. We explore how open source solutions can offer viable and innovative alternatives to proprietary software. Our mission is to demonstrate the benefits of open source, including transparency, collaboration, and freedom, and to encourage more individuals and organizations to embrace these solutions for a more open and equitable tech landscape.
                </p>
            </motion.div>
        </div>
    );
}
