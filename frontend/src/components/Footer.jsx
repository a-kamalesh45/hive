const Footer = () => {
    const footerLinks = {
        Product: [
            { name: 'Features', href: '#features' },
            { name: 'Pricing', href: '#pricing' },
            { name: 'Dashboard', href: '#dashboard' },
            { name: 'Integrations', href: '#' },
        ],
        Company: [
            { name: 'About', href: '#' },
            { name: 'Blog', href: '#' },
            { name: 'Careers', href: '#' },
            { name: 'Press', href: '#' },
        ],
        Resources: [
            { name: 'Documentation', href: '#' },
            { name: 'Help Center', href: '#' },
            { name: 'API Reference', href: '#' },
            { name: 'Community', href: '#' },
        ],
        Legal: [
            { name: 'Privacy', href: '#' },
            { name: 'Terms', href: '#' },
            { name: 'Security', href: '#' },
            { name: 'Cookies', href: '#' },
        ],
    };

    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-8">
                    {/* Brand Column */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">QM</span>
                            </div>
                            <span className="text-gray-900 font-bold text-lg">HIVE</span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">
                            Query management platform for modern teams.
                        </p>
                    </div>

                    {/* Link Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h3 className="text-gray-900 font-medium mb-4 text-sm">{category}</h3>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <a
                                            href={link.href}
                                            className="text-gray-600 hover:text-gray-900 text-sm transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-600 text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} HIVE. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                Privacy Policy
                            </a>
                            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                                Terms of Service
                            </a>
                            <a href="#" className="text-slate-400 hover:text-white text-sm transition-colors">
                                Cookie Settings
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
