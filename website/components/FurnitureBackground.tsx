'use client'

import { useEffect, useState } from 'react'

export default function FurnitureBackground() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 0.3
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  const sketchOpacity = Math.max(0, 1 - progress / 60)
  const solidOpacity = Math.min(1, (progress - 20) / 60)

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dadam-cream via-dadam-white to-dadam-cream" />

      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `
          linear-gradient(rgba(184, 149, 108, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(184, 149, 108, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px'
      }} />

      {/* Floating gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-dadam-ai-primary/5 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] bg-dadam-ai-secondary/5 rounded-full blur-[100px] animate-float" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-dadam-gold/3 rounded-full blur-[120px]" />

      {/* Sketch Layer - Elegant line drawings */}
      <svg
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: sketchOpacity }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="sketchGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#B8956C" stopOpacity="0.4"/>
            <stop offset="100%" stopColor="#8B7355" stopOpacity="0.2"/>
          </linearGradient>
        </defs>

        {/* Kitchen Cabinet - Left */}
        <g transform="translate(80, 200)" stroke="url(#sketchGradient)" strokeWidth="1" fill="none" strokeDasharray="8,4">
          <rect x="0" y="0" width="280" height="180" rx="2"/>
          <rect x="0" y="0" width="280" height="60"/>
          <line x1="140" y1="0" x2="140" y2="180"/>
          <rect x="10" y="70" width="120" height="100" rx="1"/>
          <rect x="150" y="70" width="120" height="100" rx="1"/>
          <circle cx="60" cy="30" r="20"/>
          <circle cx="220" cy="30" r="20"/>
        </g>

        {/* Wardrobe - Right */}
        <g transform="translate(1520, 150)" stroke="url(#sketchGradient)" strokeWidth="1" fill="none" strokeDasharray="8,4">
          <rect x="0" y="0" width="320" height="450" rx="2"/>
          <line x1="160" y1="0" x2="160" y2="450"/>
          <line x1="0" y1="150" x2="320" y2="150"/>
          <line x1="0" y1="300" x2="320" y2="300"/>
          <circle cx="150" cy="225" r="8"/>
          <circle cx="170" cy="225" r="8"/>
        </g>

        {/* Dresser - Bottom Left */}
        <g transform="translate(150, 700)" stroke="url(#sketchGradient)" strokeWidth="1" fill="none" strokeDasharray="8,4">
          <ellipse cx="120" cy="40" rx="80" ry="35"/>
          <rect x="20" y="80" width="200" height="120" rx="2"/>
          <line x1="20" y1="120" x2="220" y2="120"/>
          <line x1="20" y1="160" x2="220" y2="160"/>
          <rect x="40" y="200" width="60" height="80" rx="1"/>
          <rect x="140" y="200" width="60" height="80" rx="1"/>
        </g>

        {/* Shoe Cabinet - Bottom Right */}
        <g transform="translate(1480, 680)" stroke="url(#sketchGradient)" strokeWidth="1" fill="none" strokeDasharray="8,4">
          <rect x="0" y="0" width="260" height="300" rx="2"/>
          <line x1="0" y1="75" x2="260" y2="75"/>
          <line x1="0" y1="150" x2="260" y2="150"/>
          <line x1="0" y1="225" x2="260" y2="225"/>
          <line x1="130" y1="0" x2="130" y2="300"/>
        </g>

        {/* Refrigerator Cabinet - Center Top */}
        <g transform="translate(800, 80)" stroke="url(#sketchGradient)" strokeWidth="1" fill="none" strokeDasharray="8,4">
          <rect x="0" y="0" width="200" height="350" rx="2"/>
          <line x1="0" y1="100" x2="200" y2="100"/>
          <rect x="170" y="20" width="15" height="60" rx="4"/>
          <rect x="170" y="120" width="15" height="200" rx="4"/>
        </g>
      </svg>

      {/* Solid Layer - Filled furniture silhouettes */}
      <svg
        className="absolute inset-0 w-full h-full transition-opacity duration-1000"
        style={{ opacity: solidOpacity }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="furnitureGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8E4DD"/>
            <stop offset="100%" stopColor="#D4CFC7"/>
          </linearGradient>
          <linearGradient id="furnitureGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F5F2ED"/>
            <stop offset="100%" stopColor="#E8E4DD"/>
          </linearGradient>
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2D2A26" floodOpacity="0.08"/>
          </filter>
        </defs>

        {/* Kitchen Cabinet - Left */}
        <g transform="translate(80, 200)" filter="url(#softShadow)">
          <rect x="0" y="0" width="280" height="180" rx="4" fill="url(#furnitureGradient1)"/>
          <rect x="0" y="0" width="280" height="60" rx="4" fill="#D4CFC7"/>
          <rect x="2" y="62" width="136" height="116" fill="url(#furnitureGradient2)"/>
          <rect x="142" y="62" width="136" height="116" fill="url(#furnitureGradient2)"/>
          <circle cx="60" cy="30" r="22" fill="#A8B4B8"/>
          <circle cx="220" cy="30" r="22" fill="#A8B4B8"/>
          <circle cx="60" cy="30" r="8" fill="#8B8680"/>
          <circle cx="220" cy="30" r="8" fill="#8B8680"/>
          <rect x="60" y="110" width="20" height="8" rx="4" fill="#B8956C"/>
          <rect x="200" y="110" width="20" height="8" rx="4" fill="#B8956C"/>
        </g>

        {/* Wardrobe - Right */}
        <g transform="translate(1520, 150)" filter="url(#softShadow)">
          <rect x="0" y="0" width="320" height="450" rx="4" fill="url(#furnitureGradient1)"/>
          <rect x="2" y="2" width="156" height="146" fill="#D4CFC7"/>
          <rect x="162" y="2" width="156" height="146" fill="#D4CFC7"/>
          <rect x="2" y="152" width="156" height="146" fill="url(#furnitureGradient2)"/>
          <rect x="162" y="152" width="156" height="146" fill="url(#furnitureGradient2)"/>
          <rect x="2" y="302" width="156" height="146" fill="#D4CFC7"/>
          <rect x="162" y="302" width="156" height="146" fill="#D4CFC7"/>
          <circle cx="150" cy="225" r="10" fill="#B8956C"/>
          <circle cx="170" cy="225" r="10" fill="#B8956C"/>
        </g>

        {/* Dresser - Bottom Left */}
        <g transform="translate(150, 700)" filter="url(#softShadow)">
          <ellipse cx="120" cy="40" rx="85" ry="38" fill="#D4CFC7" stroke="#B8956C" strokeWidth="2"/>
          <ellipse cx="120" cy="40" rx="70" ry="28" fill="#E8F4F8"/>
          <rect x="20" y="80" width="200" height="120" rx="4" fill="url(#furnitureGradient1)"/>
          <rect x="22" y="82" width="196" height="38" fill="#D4CFC7"/>
          <rect x="22" y="122" width="196" height="38" fill="url(#furnitureGradient2)"/>
          <rect x="22" y="162" width="196" height="36" fill="#D4CFC7"/>
          <rect x="40" y="200" width="60" height="80" rx="2" fill="url(#furnitureGradient1)" stroke="#B8956C" strokeWidth="1"/>
          <rect x="140" y="200" width="60" height="80" rx="2" fill="url(#furnitureGradient1)" stroke="#B8956C" strokeWidth="1"/>
          <circle cx="70" cy="240" r="6" fill="#B8956C"/>
          <circle cx="170" cy="240" r="6" fill="#B8956C"/>
        </g>

        {/* Shoe Cabinet - Bottom Right */}
        <g transform="translate(1480, 680)" filter="url(#softShadow)">
          <rect x="0" y="0" width="260" height="300" rx="4" fill="url(#furnitureGradient1)"/>
          <rect x="2" y="2" width="126" height="73" fill="#D4CFC7"/>
          <rect x="132" y="2" width="126" height="73" fill="#D4CFC7"/>
          <rect x="2" y="77" width="126" height="73" fill="url(#furnitureGradient2)"/>
          <rect x="132" y="77" width="126" height="73" fill="url(#furnitureGradient2)"/>
          <rect x="2" y="152" width="126" height="73" fill="#D4CFC7"/>
          <rect x="132" y="152" width="126" height="73" fill="#D4CFC7"/>
          <rect x="2" y="227" width="126" height="71" fill="url(#furnitureGradient2)"/>
          <rect x="132" y="227" width="126" height="71" fill="url(#furnitureGradient2)"/>
        </g>

        {/* Refrigerator Cabinet - Center Top */}
        <g transform="translate(800, 80)" filter="url(#softShadow)">
          <rect x="0" y="0" width="200" height="350" rx="4" fill="url(#furnitureGradient1)"/>
          <rect x="2" y="2" width="196" height="96" fill="#F5F2ED"/>
          <rect x="2" y="102" width="196" height="246" fill="url(#furnitureGradient2)"/>
          <rect x="168" y="15" width="18" height="70" rx="6" fill="#B8956C"/>
          <rect x="168" y="115" width="18" height="220" rx="6" fill="#B8956C"/>
        </g>
      </svg>

      {/* Elegant labels */}
      <div className="absolute inset-0 pointer-events-none transition-opacity duration-700" style={{ opacity: solidOpacity > 0.7 ? 1 : 0 }}>
        <span className="absolute left-[220px] top-[400px] text-xs text-dadam-gray/60 tracking-widest uppercase">Kitchen</span>
        <span className="absolute right-[200px] top-[620px] text-xs text-dadam-gray/60 tracking-widest uppercase">Wardrobe</span>
        <span className="absolute left-[250px] bottom-[80px] text-xs text-dadam-gray/60 tracking-widest uppercase">Vanity</span>
        <span className="absolute right-[280px] bottom-[80px] text-xs text-dadam-gray/60 tracking-widest uppercase">Shoe Cabinet</span>
        <span className="absolute left-1/2 -translate-x-1/2 top-[450px] text-xs text-dadam-gray/60 tracking-widest uppercase">Refrigerator</span>
      </div>

      {/* Progress indicator - minimal */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-3 opacity-40">
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 h-1 rounded-full transition-all duration-300"
              style={{
                backgroundColor: progress > i * 20 ? '#B8956C' : '#D4CFC7',
                transform: progress > i * 20 ? 'scale(1.2)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
