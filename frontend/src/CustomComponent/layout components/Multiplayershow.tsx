

const TeamBattles = () => {
  return (
    <section className="py-20 bg-gray-100 text-black">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#a90000] leading-tight">
        Multiplayer Team Battle
      </h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 px-6">
        {/* Team A */}
        <div className="w-full md:w-1/3 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-[#a90000] tracking-wide">
            Team A
          </h3>
          <div className="relative">
            <img
              src="/92c950db-f741-4ff0-acd2-a61660de6208.jpg"
              alt="Team A"
              className="mx-auto w-44 h-44 object-contain border-4 border-[#a90000] rounded-full shadow-lg transition-transform duration-300 hover:scale-105 p-2"
            />
          </div>
        </div>

        {/* VS Text */}
        <div className="text-center text-4xl font-bold text-[#f67280] leading-none">
          VS
          <p className="text-sm font-medium mt-2 text-gray-800">Turn-based | Score points</p>
        </div>

        {/* Team B */}
        <div className="w-full md:w-1/3 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-[#a90000] tracking-wide">
            Team B
          </h3>
          <div className="relative">
            <img
              src="/4ac54796-8655-45b3-9a34-3922864b7bab.jpg"
              alt="Team B"
              className="mx-auto w-44 h-44 object-contain border-4 border-[#a90000] rounded-full shadow-lg transition-transform duration-300 hover:scale-105 p-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamBattles;
