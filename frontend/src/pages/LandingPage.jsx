import { HexagonBackground } from '../components/hexabg';
import { MagnifyingGlassCircleIcon, ChartBarSquareIcon, ChatBubbleOvalLeftEllipsisIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const LandingPage = () => {
    return (
        <HexagonBackground>
            {/* Main container: pt-32 preserves space for your existing navbar */}
            <div className="relative w-full min-h-screen flex flex-col items-center justify-between px-4 sm:px-6 lg:px-8 pt-32 pb-12 overflow-hidden">

                {/* --- Hero Section --- */}
                <div className="max-w-5xl mx-auto w-full flex flex-col items-center text-center z-10 mt-8 md:mt-16">
                    
                    {/* Badge / Pill */}
                    <div className="inline-flex items-center px-4 py-1.5 mb-8 rounded-full border border-gray-900/10 bg-white/50 backdrop-blur-sm">
                        <span className="flex h-2 w-2 rounded-full bg-[#DCA54C] mr-2 animate-pulse"></span>
                        <span className="text-sm font-semibold text-gray-700 tracking-wide uppercase">System v1.0 Live</span>
                    </div>

                    {/* Main Heading */}
                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-none mb-6 drop-shadow-sm">
                        <span className="text-[#DCA54C]">HIVE</span>
                        <span className="block text-4xl md:text-6xl mt-2 font-extrabold text-gray-800">
                            Query Management
                        </span>
                    </h1>

                    <p className="max-w-2xl text-lg md:text-xl text-gray-600 leading-relaxed font-medium mb-10">
                        The central nervous system for your team's support workflow. 
                        Organize, track, and resolve queries with <span className="text-gray-900 font-bold">insect-like precision</span>.
                    </p>

                    {/* CTA Button with Glow Effect */}
                    <button className="group relative px-10 py-4 bg-[#DCA54C] text-[#1A1A1A] text-lg font-bold rounded-full shadow-[0_0_20px_rgba(220,165,76,0.3)] hover:shadow-[0_0_30px_rgba(220,165,76,0.5)] transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
                        <span className="relative z-10 flex items-center gap-2">
                            Initialize System
                            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        {/* Hover shine effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
                    </button>
                </div>

                {/* --- Feature Cards Section --- */}
                <div className="w-full max-w-6xl mx-auto mt-16 md:mt-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                        {/* Card 1 */}
                        <div className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#DCA54C] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"/>
                            
                            <div className="flex flex-col items-start h-full">
                                <div className="p-3 mb-4 rounded-2xl bg-gray-900/5 group-hover:bg-[#DCA54C]/10 transition-colors">
                                    <MagnifyingGlassCircleIcon className="w-8 h-8 text-gray-800 group-hover:text-[#DCA54C] transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Deep Search</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Filter through thousands of tickets instantly using our hive-mind indexing algorithms.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#DCA54C] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"/>
                            
                            <div className="flex flex-col items-start h-full">
                                <div className="p-3 mb-4 rounded-2xl bg-gray-900/5 group-hover:bg-[#DCA54C]/10 transition-colors">
                                    <ChartBarSquareIcon className="w-8 h-8 text-gray-800 group-hover:text-[#DCA54C] transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Live Analytics</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Visual dashboards that track resolution times and team performance in real-time.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative p-8 rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#DCA54C] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-3xl"/>
                            
                            <div className="flex flex-col items-start h-full">
                                <div className="p-3 mb-4 rounded-2xl bg-gray-900/5 group-hover:bg-[#DCA54C]/10 transition-colors">
                                    <ChatBubbleOvalLeftEllipsisIcon className="w-8 h-8 text-gray-800 group-hover:text-[#DCA54C] transition-colors" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Swarm Sync</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">
                                    Seamless collaboration tools allowing your team to swarm on complex issues together.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </HexagonBackground>
    );
};

export default LandingPage;