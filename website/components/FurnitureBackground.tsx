'use client'

import { useEffect, useState } from 'react'

// Furniture SVG components that morph from sketch to solid
const furnitureItems = [
  {
    id: 'sink',
    name: '싱크대',
    viewBox: '0 0 200 150',
    sketch: `
      <g stroke="#B8956C" stroke-width="1.5" fill="none" stroke-dasharray="5,3" opacity="0.6">
        <rect x="10" y="40" width="180" height="100" rx="2"/>
        <rect x="30" y="50" width="60" height="40" rx="4"/>
        <circle cx="60" cy="70" r="15"/>
        <rect x="110" y="50" width="60" height="40" rx="4"/>
        <circle cx="140" cy="70" r="15"/>
        <line x1="10" y1="100" x2="190" y2="100"/>
        <rect x="20" y="105" width="40" height="30" rx="2"/>
        <rect x="80" y="105" width="40" height="30" rx="2"/>
        <rect x="140" y="105" width="40" height="30" rx="2"/>
      </g>
    `,
    solid: `
      <g>
        <rect x="10" y="40" width="180" height="100" rx="2" fill="#E8E4DD"/>
        <rect x="10" y="40" width="180" height="55" rx="2" fill="#D4CFC7"/>
        <rect x="30" y="50" width="60" height="40" rx="4" fill="#A8B4B8"/>
        <circle cx="60" cy="70" r="15" fill="#8B8680"/>
        <rect x="110" y="50" width="60" height="40" rx="4" fill="#A8B4B8"/>
        <circle cx="140" cy="70" r="15" fill="#8B8680"/>
        <line x1="10" y1="100" x2="190" y2="100" stroke="#B8956C" stroke-width="2"/>
        <rect x="20" y="105" width="40" height="30" rx="2" fill="#D4CFC7" stroke="#B8956C" stroke-width="1"/>
        <rect x="80" y="105" width="40" height="30" rx="2" fill="#D4CFC7" stroke="#B8956C" stroke-width="1"/>
        <rect x="140" y="105" width="40" height="30" rx="2" fill="#D4CFC7" stroke="#B8956C" stroke-width="1"/>
        <circle cx="40" cy="120" r="3" fill="#B8956C"/>
        <circle cx="100" cy="120" r="3" fill="#B8956C"/>
        <circle cx="160" cy="120" r="3" fill="#B8956C"/>
      </g>
    `,
    position: { top: '10%', left: '5%' },
    size: { width: 200, height: 150 },
    delay: 0,
  },
  {
    id: 'wardrobe',
    name: '붙박이장',
    viewBox: '0 0 180 220',
    sketch: `
      <g stroke="#B8956C" stroke-width="1.5" fill="none" stroke-dasharray="5,3" opacity="0.6">
        <rect x="10" y="10" width="160" height="200" rx="2"/>
        <line x1="90" y1="10" x2="90" y2="210"/>
        <line x1="10" y1="70" x2="90" y2="70"/>
        <line x1="90" y1="70" x2="170" y2="70"/>
        <line x1="10" y1="140" x2="90" y2="140"/>
        <line x1="90" y1="140" x2="170" y2="140"/>
        <circle cx="80" cy="110" r="4"/>
        <circle cx="100" cy="110" r="4"/>
        <rect x="20" y="150" width="60" height="50" rx="1"/>
        <rect x="100" y="150" width="60" height="50" rx="1"/>
      </g>
    `,
    solid: `
      <g>
        <rect x="10" y="10" width="160" height="200" rx="2" fill="#E8E4DD" stroke="#B8956C" stroke-width="2"/>
        <line x1="90" y1="10" x2="90" y2="210" stroke="#D4CFC7" stroke-width="2"/>
        <rect x="12" y="12" width="76" height="56" fill="#D4CFC7"/>
        <rect x="92" y="12" width="76" height="56" fill="#D4CFC7"/>
        <rect x="12" y="72" width="76" height="66" fill="#F5F2ED"/>
        <rect x="92" y="72" width="76" height="66" fill="#F5F2ED"/>
        <rect x="12" y="142" width="76" height="66" fill="#D4CFC7"/>
        <rect x="92" y="142" width="76" height="66" fill="#D4CFC7"/>
        <circle cx="80" cy="105" r="5" fill="#B8956C"/>
        <circle cx="100" cy="105" r="5" fill="#B8956C"/>
        <rect x="20" y="155" width="60" height="45" rx="1" fill="#C4B5A5" stroke="#B8956C"/>
        <rect x="100" y="155" width="60" height="45" rx="1" fill="#C4B5A5" stroke="#B8956C"/>
      </g>
    `,
    position: { top: '15%', right: '8%' },
    size: { width: 160, height: 200 },
    delay: 0.5,
  },
  {
    id: 'shoerack',
    name: '신발장',
    viewBox: '0 0 150 180',
    sketch: `
      <g stroke="#B8956C" stroke-width="1.5" fill="none" stroke-dasharray="5,3" opacity="0.6">
        <rect x="10" y="10" width="130" height="160" rx="2"/>
        <line x1="10" y1="50" x2="140" y2="50"/>
        <line x1="10" y1="90" x2="140" y2="90"/>
        <line x1="10" y1="130" x2="140" y2="130"/>
        <ellipse cx="50" cy="30" rx="20" ry="8"/>
        <ellipse cx="100" cy="30" rx="20" ry="8"/>
        <ellipse cx="50" cy="70" rx="20" ry="8"/>
        <ellipse cx="100" cy="70" rx="20" ry="8"/>
        <ellipse cx="50" cy="110" rx="20" ry="8"/>
        <ellipse cx="100" cy="110" rx="20" ry="8"/>
        <ellipse cx="50" cy="150" rx="20" ry="8"/>
        <ellipse cx="100" cy="150" rx="20" ry="8"/>
      </g>
    `,
    solid: `
      <g>
        <rect x="10" y="10" width="130" height="160" rx="2" fill="#E8E4DD" stroke="#B8956C" stroke-width="2"/>
        <rect x="12" y="12" width="126" height="36" fill="#D4CFC7"/>
        <rect x="12" y="52" width="126" height="36" fill="#F5F2ED"/>
        <rect x="12" y="92" width="126" height="36" fill="#D4CFC7"/>
        <rect x="12" y="132" width="126" height="36" fill="#F5F2ED"/>
        <ellipse cx="50" cy="30" rx="22" ry="10" fill="#8B7355"/>
        <ellipse cx="100" cy="30" rx="22" ry="10" fill="#6B5B4F"/>
        <ellipse cx="50" cy="70" rx="22" ry="10" fill="#9B8565"/>
        <ellipse cx="100" cy="70" rx="22" ry="10" fill="#8B7355"/>
        <ellipse cx="50" cy="110" rx="22" ry="10" fill="#7B6B5F"/>
        <ellipse cx="100" cy="110" rx="22" ry="10" fill="#AB9575"/>
        <ellipse cx="50" cy="150" rx="22" ry="10" fill="#8B7355"/>
        <ellipse cx="100" cy="150" rx="22" ry="10" fill="#6B5B4F"/>
      </g>
    `,
    position: { bottom: '20%', left: '8%' },
    size: { width: 130, height: 160 },
    delay: 1,
  },
  {
    id: 'vanity',
    name: '화장대',
    viewBox: '0 0 160 200',
    sketch: `
      <g stroke="#B8956C" stroke-width="1.5" fill="none" stroke-dasharray="5,3" opacity="0.6">
        <ellipse cx="80" cy="50" rx="50" ry="40"/>
        <rect x="20" y="90" width="120" height="60" rx="2"/>
        <rect x="20" y="150" width="40" height="40" rx="1"/>
        <rect x="100" y="150" width="40" height="40" rx="1"/>
        <circle cx="40" cy="170" r="5"/>
        <circle cx="120" cy="170" r="5"/>
        <rect x="65" y="95" width="30" height="20" rx="1"/>
      </g>
    `,
    solid: `
      <g>
        <ellipse cx="80" cy="50" rx="50" ry="40" fill="#D4CFC7" stroke="#B8956C" stroke-width="2"/>
        <ellipse cx="80" cy="50" rx="42" ry="32" fill="#E8F4F8"/>
        <rect x="20" y="90" width="120" height="60" rx="2" fill="#E8E4DD" stroke="#B8956C" stroke-width="2"/>
        <rect x="25" y="95" width="35" height="50" fill="#D4CFC7"/>
        <rect x="100" y="95" width="35" height="50" fill="#D4CFC7"/>
        <rect x="65" y="95" width="30" height="25" rx="1" fill="#F5F2ED" stroke="#B8956C"/>
        <rect x="20" y="150" width="40" height="40" rx="1" fill="#D4CFC7" stroke="#B8956C" stroke-width="1.5"/>
        <rect x="100" y="150" width="40" height="40" rx="1" fill="#D4CFC7" stroke="#B8956C" stroke-width="1.5"/>
        <circle cx="40" cy="170" r="6" fill="#B8956C"/>
        <circle cx="120" cy="170" r="6" fill="#B8956C"/>
      </g>
    `,
    position: { bottom: '15%', right: '10%' },
    size: { width: 140, height: 180 },
    delay: 1.5,
  },
  {
    id: 'fridge',
    name: '냉장고장',
    viewBox: '0 0 140 220',
    sketch: `
      <g stroke="#B8956C" stroke-width="1.5" fill="none" stroke-dasharray="5,3" opacity="0.6">
        <rect x="10" y="10" width="120" height="200" rx="2"/>
        <line x1="10" y1="80" x2="130" y2="80"/>
        <rect x="15" y="15" width="110" height="60" rx="1"/>
        <rect x="15" y="85" width="110" height="120" rx="1"/>
        <line x1="110" y1="30" x2="110" y2="60"/>
        <line x1="110" y1="100" x2="110" y2="180"/>
        <rect x="20" y="95" width="80" height="15" rx="1"/>
        <rect x="20" y="115" width="80" height="15" rx="1"/>
        <rect x="20" y="135" width="80" height="15" rx="1"/>
      </g>
    `,
    solid: `
      <g>
        <rect x="10" y="10" width="120" height="200" rx="2" fill="#E8E4DD" stroke="#B8956C" stroke-width="2"/>
        <rect x="12" y="12" width="116" height="66" fill="#F5F2ED" stroke="#D4CFC7"/>
        <rect x="12" y="82" width="116" height="126" fill="#F8F7F4" stroke="#D4CFC7"/>
        <line x1="10" y1="80" x2="130" y2="80" stroke="#B8956C" stroke-width="2"/>
        <rect x="105" y="25" width="8" height="40" rx="2" fill="#B8956C"/>
        <rect x="105" y="95" width="8" height="100" rx="2" fill="#B8956C"/>
        <rect x="20" y="92" width="80" height="18" rx="2" fill="#E8F4F8" stroke="#D4CFC7"/>
        <rect x="20" y="115" width="80" height="18" rx="2" fill="#E8E4DD" stroke="#D4CFC7"/>
        <rect x="20" y="138" width="80" height="18" rx="2" fill="#E8F4F8" stroke="#D4CFC7"/>
        <rect x="20" y="161" width="80" height="18" rx="2" fill="#E8E4DD" stroke="#D4CFC7"/>
      </g>
    `,
    position: { top: '25%', left: '50%', transform: 'translateX(-50%)' },
    size: { width: 120, height: 200 },
    delay: 2,
  },
]

export default function FurnitureBackground() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 0
        return prev + 0.5
      })
    }, 50)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern opacity-30" />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-dadam-cream via-transparent to-dadam-ai-primary/5" />

      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-dadam-ai-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-dadam-ai-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      {/* Animated furniture SVGs */}
      {furnitureItems.map((item) => {
        const itemProgress = Math.max(0, Math.min(100, (progress - item.delay * 20) * 1.5))
        const sketchOpacity = Math.max(0, 1 - itemProgress / 50)
        const solidOpacity = Math.min(1, itemProgress / 50)

        return (
          <div
            key={item.id}
            className="absolute transition-all duration-1000"
            style={{
              ...item.position,
              width: item.size.width,
              height: item.size.height,
            }}
          >
            {/* Sketch version */}
            <svg
              viewBox={item.viewBox}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000"
              style={{ opacity: sketchOpacity }}
            >
              <g dangerouslySetInnerHTML={{ __html: item.sketch }} />
            </svg>

            {/* Solid version */}
            <svg
              viewBox={item.viewBox}
              className="absolute inset-0 w-full h-full transition-opacity duration-1000"
              style={{ opacity: solidOpacity }}
            >
              <g dangerouslySetInnerHTML={{ __html: item.solid }} />
            </svg>

            {/* Label */}
            <div
              className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap transition-opacity duration-500"
              style={{ opacity: solidOpacity > 0.5 ? 1 : 0 }}
            >
              <span className="text-xs text-dadam-gray bg-white/80 px-2 py-1 rounded-full">
                {item.name}
              </span>
            </div>
          </div>
        )
      })}

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
        <div className="w-32 h-1 bg-dadam-warm rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-dadam-ai-primary to-dadam-ai-secondary transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs text-dadam-gray">
          {progress < 50 ? '스케치' : '완성'}
        </span>
      </div>
    </div>
  )
}
