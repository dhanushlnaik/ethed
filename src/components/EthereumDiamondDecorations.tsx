import React from 'react'

// CSS-only 3D Ethereum diamond floating decorations
export default function EthereumDiamondDecorations() {
  // You can use more sophisticated random placement/animation if desired
  return (
    <>
      <div className="absolute left-6 top-32 z-0 animate-floatSlow">
        <DiamondSVG size={56} color="#00D4FF" shadow />
      </div>
      <div className="absolute right-12 top-1/2 z-0 animate-floatFast">
        <DiamondSVG size={40} color="#8B5CF6" />
      </div>
      <div className="absolute left-1/2 bottom-10 z-0 animate-floatMedium">
        <DiamondSVG size={32} color="#0EA5E9" />
      </div>
      <style jsx global>{`
        @keyframes floatSlow { 0% { transform: translateY(0px) } 50% { transform: translateY(-16px) } 100% { transform: translateY(0px) } }
        @keyframes floatFast { 0% { transform: translateY(0px) } 50% { transform: translateY(10px) } 100% { transform: translateY(0px) } }
        @keyframes floatMedium { 0% { transform: translateY(0px) } 50% { transform: translateY(-8px) } 100% { transform: translateY(0px) } }
        .animate-floatSlow { animation: floatSlow 7s ease-in-out infinite; }
        .animate-floatFast { animation: floatFast 4s ease-in-out infinite; }
        .animate-floatMedium { animation: floatMedium 5.5s ease-in-out infinite; }
      `}</style>
    </>
  )
}

function DiamondSVG({ size = 40, color = '#00D4FF', shadow = false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60" fill="none">
      <polygon points="30,2 58,18 30,58 2,18" fill={color} opacity="0.85" />
      <polygon points="30,10 50,20 30,54 10,20" fill={color} opacity="0.45" />
      {shadow && <ellipse cx="30" cy="60" rx="18" ry="4" fill={color} opacity="0.15" />}
    </svg>
  )
}
