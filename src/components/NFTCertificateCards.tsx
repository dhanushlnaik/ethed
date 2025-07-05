import React from 'react'

export default function NFTCertificateCards() {
  // Example cards, replace with dynamic data.
  const certs = [
    { id: 'nft1', name: 'Web3 Fundamentals', imageUrl: '/nft1.svg', rarity: 'Rare' },
    { id: 'nft2', name: 'Smart Contract Developer', imageUrl: '/nft2.svg', rarity: 'Epic' },
  ]
  return (
    <div className="flex gap-6 flex-wrap justify-center items-end">
      {certs.map(c => (
        <div key={c.id} className="glass-card flex flex-col items-center w-44 p-4 rounded-xl shadow-lg border border-white/20 hover:scale-[1.03] transition-transform duration-300 group">
          <img src={c.imageUrl} alt={c.name} className="w-24 h-24 rounded-lg mb-2 object-cover bg-gradient-to-br from-cyan-400/20 to-purple-400/20" />
          <div className="text-base font-semibold text-white">{c.name}</div>
          <div className="mt-1 text-xs text-purple-400">{c.rarity}</div>
        </div>
      ))}
    </div>
  )
}
