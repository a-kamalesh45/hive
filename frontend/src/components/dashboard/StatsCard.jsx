const StatsCard = ({ stat, index }) => {
    const Icon = stat.icon;

    const iconColors = [
        'text-amber-600 bg-amber-50',
        'text-orange-600 bg-orange-50',
        'text-yellow-600 bg-yellow-50',
        'text-amber-700 bg-amber-100'
    ];

    return (
        <div
            className="group relative bg-white/90 backdrop-blur-sm border border-amber-100 rounded-2xl p-6 hover:shadow-xl hover:border-amber-300 transition-all duration-300 overflow-hidden"
            style={{
                animationDelay: `${index * 100}ms`
            }}
        >
            {/* Hexagonal accent in corner */}
            <div
                className="absolute -top-8 -right-8 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity"
                style={{
                    clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                }}
            >
                <div className="w-full h-full bg-gradient-to-br from-amber-300 to-yellow-400"></div>
            </div>

            <div className="relative">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${iconColors[index % 4]} rounded-xl shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className={`w-6 h-6 ${iconColors[index % 4].split(' ')[0]}`} strokeWidth={2} />
                    </div>
                </div>
                <div>
                    <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <p className="text-sm text-gray-600 font-medium">{stat.name}</p>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
