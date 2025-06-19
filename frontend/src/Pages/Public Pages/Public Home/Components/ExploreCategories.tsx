import { Link } from "react-router-dom"


const ExploreCategories = () => {
  return (
    <section id="categories" className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Explore Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Choose from our diverse range of categories to test your knowledge
            across different subjects.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      
          <div className="category-card h-64 card-hover">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='%23ff100f'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M65,35 L50,20 L35,35 L35,65 L50,80 L65,65 Z' fill='%23ff100f' fill-opacity='0.7'/%3E%3C/svg%3E" alt="Science" className="w-full h-full object-cover"/>
            <div className="category-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="category-icon bg-white/20 p-4 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Science</h3>
              <p className="text-sm opacity-90 mt-1">Physics, Chemistry, Biology</p>
            </div>
          </div>

 
          <div className="category-card h-64 card-hover">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='%23ffc070'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M30,20 L70,20 L70,80 L30,80 Z' fill='%23ffc070' fill-opacity='0.7'/%3E%3C/svg%3E" alt="History" className="w-full h-full object-cover"/>            <div className="category-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="category-icon bg-white/20 p-4 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">History</h3>
              <p className="text-sm opacity-90 mt-1">Ancient, Medieval, Modern</p>
            </div>
          </div>

    
          <div className="category-card h-64 card-hover">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='%23a90000'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%23a90000' fill-opacity='0.7'/%3E%3C/svg%3E" alt="Pop Culture" className="w-full h-full object-cover"/>
            <div className="category-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="category-icon bg-white/20 p-4 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Pop Culture</h3>
              <p className="text-sm opacity-90 mt-1">Movies, Music, TV Shows</p>
            </div>
          </div>


          <div className="category-card h-64 card-hover">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='%23ff100f'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M20,20 L80,20 L80,80 L20,80 Z' fill='%23ff100f' fill-opacity='0.7'/%3E%3C/svg%3E" alt="Geography" className="w-full h-full object-cover"/>
            <div className="category-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="category-icon bg-white/20 p-4 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Geography</h3>
              <p className="text-sm opacity-90 mt-1">
                Countries, Landmarks, Nature
              </p>
            </div>
          </div>

   
          <div className="category-card h-64 card-hover">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='%23ffc070'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Ccircle cx='50' cy='50' r='30' fill='%23ffc070' fill-opacity='0.7'/%3E%3C/svg%3E" alt="Sports" className="w-full h-full object-cover"/>
            <div className="category-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="category-icon bg-white/20 p-4 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Sports</h3>
              <p className="text-sm opacity-90 mt-1">
                Football, Basketball, Olympics
              </p>
            </div>
          </div>

        
          <div className="category-card h-64 card-hover">
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' fill='%23a90000'%3E%3Crect width='100' height='100' fill='%23f3f4f6'/%3E%3Cpath d='M30,30 L70,30 L50,70 Z' fill='%23a90000' fill-opacity='0.7'/%3E%3C/svg%3E" alt="Food &amp; Drink" className="w-full h-full object-cover"/>
            <div className="category-overlay"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <div className="category-icon bg-white/20 p-4 rounded-full mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Food &amp; Drink</h3>
              <p className="text-sm opacity-90 mt-1">Cuisine, Beverages, Recipes</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="#" className="inline-flex items-center text-[#a90000] font-bold hover:text-red-800 transition-colors">
            View All Categories
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ExploreCategories