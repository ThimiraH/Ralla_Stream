import { ClockIcon } from "@heroicons/react/24/outline";

export default function RecentlyWatched() {
  // Dummy Data
  const recent = [
    { ep: "Episode 12", title: "Arise", time: "20 mins left" },
    { ep: "Episode 11", title: "A knight who defends", time: "Watched" },
    { ep: "Episode 10", title: "What is this?", time: "Watched" },
  ];

  return (
    <div className="bg-[#111] rounded-xl overflow-hidden border border-gray-800 p-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
        <ClockIcon className="w-4 h-4" /> Recently Watched
      </h3>
      <div className="space-y-2">
        {recent.map((item, i) => (
            <div key={i} className="flex justify-between items-center text-sm p-2 bg-gray-800/30 rounded hover:bg-gray-800 cursor-pointer transition">
                <div>
                    <span className="text-blue-400 font-bold text-xs mr-2">{item.ep}</span>
                    <span className="text-gray-300 text-xs">{item.title}</span>
                </div>
                <span className="text-[10px] text-gray-500">{item.time}</span>
            </div>
        ))}
      </div>
    </div>
  );
}