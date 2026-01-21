const BeeCard = ({ rank, medal, gradient, accent, data, large }) => {
  return (
    <div
      className={`flex flex-col items-center text-center 
      ${large ? "w-56" : "w-44"} 
      transition-transform duration-300 hover:-translate-y-2`}
    >

      {/* Hex Avatar */}
      <div className="relative mb-4">
        <div
          className={`clip-hexagon ${large ? "w-28 h-28" : "w-24 h-24"}
          bg-gradient-to-br ${gradient}
          flex items-center justify-center
          text-white font-black ${large ? "text-3xl" : "text-2xl"}
          shadow-xl border border-white/20`}
        >
          {data.name.charAt(0).toUpperCase()}
        </div>

        <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-lg">
          {medal}
        </div>
      </div>

      <h4 className="text-lg font-bold text-white">{data.name}</h4>
      <p className="text-xs text-white/50 truncate w-full">
        {data.email}
      </p>

      <div className="mt-4 px-5 py-3 rounded-xl bg-white/5 backdrop-blur border border-white/10">
        <p className={`text-2xl font-extrabold ${accent}`}>
          {data.resolvedCount}
        </p>
        <p className="text-[10px] uppercase tracking-widest text-white/50">
          Resolved
        </p>
      </div>
    </div>
  );
};
export default BeeCard;