export function EthereumDiamonds() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating diamond */}
      <div className="absolute top-20 right-20 w-16 h-16 animate-float-slow">
        <div className="diamond-3d opacity-20"></div>
      </div>

      {/* Medium diamonds */}
      <div className="absolute top-1/3 left-10 w-8 h-8 animate-float-medium">
        <div className="diamond-3d opacity-30"></div>
      </div>

      <div className="absolute bottom-1/4 right-1/3 w-12 h-12 animate-float-fast">
        <div className="diamond-3d opacity-25"></div>
      </div>

      {/* Small accent diamonds */}
      <div className="absolute top-1/2 right-10 w-6 h-6 animate-float-slow">
        <div className="diamond-3d opacity-40"></div>
      </div>

      <div className="absolute bottom-20 left-1/4 w-10 h-10 animate-float-medium">
        <div className="diamond-3d opacity-35"></div>
      </div>
    </div>
  )
}
