import { StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function TrendingSidebar() {
  // Dummy Data (Backend එක හැදුවම මේක API එකෙන් ගමු)
  const trendingItems = [
    { id: 1, title: "Renegade Immortal", rating: 8.5, genre: "Action, Adventure", img: "https://wallpaperaccess.com/full/2063931.jpg" },
    { id: 2, title: "Battle Through The Heavens", rating: 9.2, genre: "Fantasy, Arts", img: "https://wallpaperaccess.com/full/2063931.jpg" },
    { id: 3, title: "Perfect World", rating: 8.0, genre: "Adventure", img: "https://wallpaperaccess.com/full/2063931.jpg" },
    { id: 4, title: "Swallowed Star", rating: 9.2, genre: "Sci-Fi", img: "https://wallpaperaccess.com/full/2063931.jpg" },
    { id: 5, title: "Soul Land", rating: 8.8, genre: "Action", img: "https://wallpaperaccess.com/full/2063931.jpg" },
  ];

  return (
    <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800">
      <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-[#1a1a1a]">
         <h3 className="font-bold text-white text-sm">Popular This Week</h3>
      </div>
      
      <div className="flex flex-col">
        {trendingItems.map((item, index) => (
            <div key={item.id} className="flex gap-3 p-3 hover:bg-gray-800/50 transition border-b border-gray-800/50 last:border-none cursor-pointer group">
                {/* Rank Number */}
                <div className={`text-2xl font-bold flex items-center justify-center w-8 ${index < 3 ? "text-blue-500" : "text-gray-600"}`}>
                    {index + 1}
                </div>
                
                {/* Image */}
                <div className="w-12 h-16 bg-gray-700 rounded overflow-hidden shrink-0">
                    <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-300" />
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-sm font-bold text-gray-200 line-clamp-1 group-hover:text-blue-400 transition">{item.title}</h4>
                    <p className="text-[10px] text-gray-500 mb-1">{item.genre}</p>
                    <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                        <StarIcon className="w-3 h-3" /> {item.rating}
                    </div>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}