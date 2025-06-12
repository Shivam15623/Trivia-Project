import { Button } from "@/components/ui/button";

import { Sparkles } from "lucide-react";

const CreateGameHero = () => {
  return (
    <div className="bg-[#FFF9F4]">
      <section className="w-full  orange-gradient moon-banner z-0 text-white">
        <div className="relative text-white z-[1] py-24 px-4 sm:px-6 lg:px-8 bg-simjim-banner bg-no-repeat bg-cover bg-bottom">
          <div className="max-w-5xl mx-auto text-center space-y-10">
            <div>
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight">
                Create a Game
              </h1>
              <p className="mt-6 text-lg xl:text-2xl 2xl:text-4xl font-cairo leading-relaxed max-w-3xl mx-auto">
                An interactive team game to test your{" "}
                <span className="text-white/90">
                  knowledge, culture, and teamwork
                </span>
                .
              </p>
            </div>

            <div className="space-y-6 text-lg xl:text-2xl 2xl:text-4xl font-cairo leading-relaxed">
              <p>
                To start a new challenge, tap{" "}
                <span className="font-bold">( New Game )</span>
              </p>
              <p>
                To continue a past game, head to{" "}
                <span className="font-bold">( My Games )</span>
              </p>
            </div>

            <div className="mt-16 flex justify-center">
              <Button className="relative bg-white text-[#a90000] hover:bg-[#fff5f5] text-xl font-bold px-10 py-6 rounded-full shadow-xl transition-all duration-300 flex items-center gap-3">
                <a href="#createGame">
                  <Sparkles className="w-6 h-6" />
                  Create a Game
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CreateGameHero;
