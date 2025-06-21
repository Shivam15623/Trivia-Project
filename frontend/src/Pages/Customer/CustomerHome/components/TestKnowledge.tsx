import { selectAuth } from "@/redux/AuthSlice/authSlice";

import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const TestKnowledge = () => {
  const navigate=useNavigate()
  const {user}=useSelector(selectAuth)
  const userRole=user?.role
  return (
    <section className="py-20 patt text-black">
      <div className="max-w-[978px]  bg-white p-4 mx-auto border-4 border-[#a90000]">
        <div className="grid md:grid-cols-2 items-center gap-12">
          {/* Left Content */}
          <div className="max-w-xl mx-auto md:mx-0">
            <h2 className="text-3xl md:text-4xl font-bold text-[#a90000] mb-6">
              Test your knowledge
            </h2>
            <p className="text-base md:text-lg text-black mb-8">
              It’s a fun cultural game for all ages. It challenges your
              knowledge across various categories — based on what you choose!
            </p>
            <button onClick={()=>navigate(`/${userRole}/CreateGame`)} className="px-6 py-3 rounded-full font-semibold bg-[#a90000] text-white hover:bg-[#880000] transition duration-200 w-full md:w-52">
              Create a game
            </button>
          </div>

          {/* Right Image */}
          <figure className="flex justify-center md:justify-end">
            <img
              src="/personImage.png"
              alt="Person playing trivia"
              className="w-[90%] md:w-[80%] max-w-sm"
            />
          </figure>
        </div>
      </div>
    </section>
  );
};

export default TestKnowledge;
