import Image from 'next/image';

export default function Spinner() {
  return (
    <div className="flex flex-col justify-center items-center h-full w-full gap-6">
      
      {/* Brand Logo */}
      <div className="relative w-20 h-20 animate-pulse drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">
         <Image 
            src="/Ralla-Logo.png" 
            alt="Loading..." 
            fill 
            className="object-contain"
         />
      </div>

      {/* The Wave Bars */}
      <div className="flex items-center gap-1.5 h-12">
        {/* Bar 1 */}
        <div className="w-2 h-full bg-blue-600 rounded-full animate-wave"></div>
        
        {/* Bar 2 (Delay 0.1s) */}
        <div 
            className="w-2 h-full bg-cyan-400 rounded-full animate-wave" 
            style={{ animationDelay: '0.1s' }}
        ></div>
        
        {/* Bar 3 (Delay 0.2s) */}
        <div 
            className="w-2 h-full bg-purple-500 rounded-full animate-wave" 
            style={{ animationDelay: '0.2s' }}
        ></div>
        
        {/* Bar 4 (Delay 0.3s) */}
        <div 
            className="w-2 h-full bg-fuchsia-500 rounded-full animate-wave" 
            style={{ animationDelay: '0.3s' }}
        ></div>
        
        {/* Bar 5 (Delay 0.4s) */}
        <div 
            className="w-2 h-full bg-blue-700 rounded-full animate-wave" 
            style={{ animationDelay: '0.4s' }}
        ></div>
      </div>

      <p className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-500 text-xs font-bold tracking-[0.3em] uppercase animate-pulse">
        Loading Ralla...
      </p>

    </div>
  );
}