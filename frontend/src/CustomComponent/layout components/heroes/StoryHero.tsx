import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

const StoryHero = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full orange-gradient moon-banner text-white relative">
      <div className="relative bg-no-repeat bg-cover bg-bottom md:bg-top bg-simjim-banner">
        <div className="max-w-4xl mx-auto px-6 py-28 flex flex-col items-center text-center space-y-10">
          {/* Logo */}
          <figure className="w-48 sm:w-64">
            <img
              src="/Trivial logo.png"
              alt="Trivial Logo"
              className="mx-auto"
            />
          </figure>

          {/* Heading */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
            The answer is on you,
            <br />
            the question is on us.
          </h2>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-white/90">
            6 categories · 36 questions · 3 aids
          </p>

          {/* CTA Button */}

          <Button
            onClick={() => navigate("/customer/play")}
            className="bg-white text-[#a90000] hover:bg-[#fff2f2] transition-all duration-300 text-2xl font-bold px-10 py-6 rounded-[40px] shadow-xl"
          >
            Create a Game
          </Button>
        </div>
      </div>
    </section>
  );
};

export default StoryHero;
