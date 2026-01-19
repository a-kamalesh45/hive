import { HexagonBackground } from '../components/hexabg';
// Using slightly different icons to better match the reference image look
import { MagnifyingGlassCircleIcon, ChartBarSquareIcon, ChatBubbleOvalLeftEllipsisIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
    return (
        <HexagonBackground>
            {/* Main container with padding for navbar space */}
            <div className="relative w-full min-h-screen flex flex-col px-4 sm:px-6 lg:px-8 pt-32 pb-12">

                {/* Main Hero Content - Centered text layout */}
                <div className="max-w-4xl mx-auto w-full grow flex flex-col justify-center items-start text-left">
                    
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tight leading-[1.1] mb-6">
                        HIVE: Your Query
                        <br />
                        Management Ecosystem
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium mb-10">
                        Organize, Track, and Resolve with Intelligence
                    </p>

                    {/* Single Gold CTA Button */}
                    <button className="px-10 py-4 bg-[#DCA54C] hover:bg-[#C8933F] text-[#1A1A1A] text-lg font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        Get Started
                    </button>

                </div>

                {/* Bottom Feature Section - Simple centered icons and text */}
                <div className="w-full max-w-5xl mx-auto mt-auto pt-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 justify-items-center">

                        {/* Feature 1: Search & Filter */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="p-4 mb-4 rounded-full border-2 border-gray-900/80 group-hover:border-[#DCA54C] transition-colors duration-300">
                                <MagnifyingGlassCircleIcon className="w-8 h-8 text-gray-900 group-hover:text-[#DCA54C] transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
                        </div>

                        {/* Feature 2: Analytics & Reports */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="p-4 mb-4 rounded-full border-2 border-gray-900/80 group-hover:border-[#DCA54C] transition-colors duration-300">
                                <ChartBarSquareIcon className="w-8 h-8 text-gray-900 group-hover:text-[#DCA54C] transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Analytics & Reports</h3>
                        </div>

                        {/* Feature 3: Collaborate */}
                        <div className="flex flex-col items-center text-center group">
                            <div className="p-4 mb-4 rounded-full border-2 border-gray-900/80 group-hover:border-[#DCA54C] transition-colors duration-300">
                                <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-gray-900 group-hover:text-[#DCA54C] transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Collaborate</h3>
                        </div>

                    </div>
                </div>
            </div>
        </HexagonBackground>
    );
};

export default LandingPage;