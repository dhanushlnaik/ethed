import React from 'react'

export default function GlassProgressBars({ data }: { data: { label: string, value: number, max: number }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col w-52">
          <span className="text-xs text-cyan-100">{d.label}</span>
          <div className="relative h-2 bg-white/10 rounded-lg mt-1 overflow-hidden">
            <div
              className="absolute left-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 rounded-lg transition-all"
              style={{ width: `${Math.round((d.value / d.max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
