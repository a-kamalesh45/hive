import {
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon
} from '@heroicons/react/24/outline';

const Contact = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-20 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Have a question? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Contact Info Cards */}
                    <div className="bg-slate-900 bg-opacity-50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all duration-300 text-center">
                        <div className="w-14 h-14 bg-linear-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                            <EnvelopeIcon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Email Us</h3>
                        <p className="text-slate-400 mb-4">Our team is here to help</p>
                        <a href="mailto:support@querymgmt.com" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            support@querymgmt.com
                        </a>
                    </div>

                    <div className="bg-slate-900 bg-opacity-50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all duration-300 text-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                            <PhoneIcon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Call Us</h3>
                        <p className="text-slate-400 mb-4">Mon-Fri from 8am to 6pm</p>
                        <a href="tel:+1234567890" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                            +1 (234) 567-890
                        </a>
                    </div>

                    <div className="bg-slate-900 bg-opacity-50 backdrop-blur-md border border-slate-800 rounded-2xl p-8 hover:border-slate-700 transition-all duration-300 text-center">
                        <div className="w-14 h-14 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center mb-4 mx-auto">
                            <MapPinIcon className="w-7 h-7 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">Visit Us</h3>
                        <p className="text-slate-400 mb-4">Come say hello</p>
                        <p className="text-indigo-400">
                            123 Business Ave, Suite 100<br />San Francisco, CA 94102
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-slate-900 bg-opacity-50 backdrop-blur-md border border-slate-800 rounded-2xl p-8">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-2">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        className="w-full px-4 py-3 bg-slate-950 bg-opacity-50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                        placeholder="John"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-2">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        className="w-full px-4 py-3 bg-slate-950 bg-opacity-50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full px-4 py-3 bg-slate-950 bg-opacity-50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    className="w-full px-4 py-3 bg-slate-950 bg-opacity-50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows="5"
                                    className="w-full px-4 py-3 bg-slate-950 bg-opacity-50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200 resize-none"
                                    placeholder="Tell us more about your inquiry..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3.5 px-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 transform hover:scale-105"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
