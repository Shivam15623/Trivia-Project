

const CTASection = () => {
  return (
    <section className="py-16 md:py-24 orange-gradient text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Test Your Knowledge?
        </h2>
        <p className="text-xl max-w-2xl mx-auto mb-8 opacity-90">
          Join thousands of players and start your trivia journey today. Play
          solo or create a team!
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/Signup"
            className="cta-button bg-white text-[#a90000] text-lg font-bold px-8 py-4 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
          >
            Sign Up Free
          </a>
          <a
            href="#"
            className="bg-[#a90000] hover:bg-red-800 text-white text-lg font-bold px-8 py-4 rounded-full shadow-lg border-2 border-white/30 transition-colors"
          >
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
