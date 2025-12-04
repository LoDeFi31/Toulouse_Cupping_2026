
import React, { useState, useRef, useEffect, useMemo } from 'react';
import { AROMA_CATEGORIES, ITEM_COLOR_OVERRIDES, AROMA_TRANSLATIONS } from '../constants';
import { Button } from './UI';
import { Language } from '../types';

interface FlavorWheelProps {
  onBack: () => void;
  dict: any;
  language: Language;
}

const getContrastColor = (hexcolor: string) => {
  if (!hexcolor) return '#000000';
  const r = parseInt(hexcolor.substr(1, 2), 16);
  const g = parseInt(hexcolor.substr(3, 2), 16);
  const b = parseInt(hexcolor.substr(5, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#1E1B18' : '#FFFFFF';
};

const FlavorWheel: React.FC<FlavorWheelProps> = ({ onBack, dict, language }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const lastAngle = useRef(0);
  const velocity = useRef(0);
  const requestRef = useRef<number>(0);

  // Helper to translate aroma terms
  const t = (term: string) => {
    if (language === 'fr') return term;
    if (AROMA_TRANSLATIONS[term] && AROMA_TRANSLATIONS[term][language as 'en' | 'es']) {
        return AROMA_TRANSLATIONS[term][language as 'en' | 'es'];
    }
    return term;
  };

  const flatItems = useMemo(() => {
    let items: { name: string; originalName: string; color: string; category: string; startAngle: number; endAngle: number; midAngle: number }[] = [];
    let totalItems = 0;
    AROMA_CATEGORIES.forEach(cat => totalItems += cat.items.length);
    const anglePerItem = 360 / totalItems;
    let currentAngle = 0;

    AROMA_CATEGORIES.forEach(cat => {
        cat.items.forEach(item => {
            const endAngle = currentAngle + anglePerItem;
            items.push({
                name: t(item), // Translated name for display
                originalName: item, // Original ID for color lookup
                color: ITEM_COLOR_OVERRIDES[item] || cat.color,
                category: t(cat.name), // Translated Category
                startAngle: currentAngle,
                endAngle: endAngle,
                midAngle: currentAngle + (anglePerItem / 2)
            });
            currentAngle = endAngle;
        });
    });
    return items;
  }, [language]); // Re-calculate when language changes

  const getPointerAngle = (e: React.PointerEvent | PointerEvent) => {
    const centerY = window.innerHeight / 2;
    const centerX = 0; 
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    return angle;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // IMPORTANT: Prevent default browser actions (scrolling) on touch devices
    e.preventDefault();
    setIsDragging(true);
    lastAngle.current = getPointerAngle(e);
    velocity.current = 0;
    if (svgRef.current) svgRef.current.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // Prevent default to stop Pull-to-refresh or navigation swipes
    e.preventDefault();
    if (!isDragging) return;
    const currentAngle = getPointerAngle(e);
    let delta = currentAngle - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    setRotation(prev => prev + delta);
    velocity.current = delta;
    lastAngle.current = currentAngle;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (svgRef.current) svgRef.current.releasePointerCapture(e.pointerId);
  };

  useEffect(() => {
    const animate = () => {
      if (!isDragging && Math.abs(velocity.current) > 0.05) {
        setRotation(prev => prev + velocity.current);
        velocity.current *= 0.92;
        requestRef.current = requestAnimationFrame(animate);
      }
    };
    if (!isDragging) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDragging, velocity.current]);

  const activeItem = useMemo(() => {
    let normalizedRotation = rotation % 360;
    if (normalizedRotation < 0) normalizedRotation += 360;
    const targetAngle = (360 - normalizedRotation) % 360;
    return flatItems.find(item => targetAngle >= item.startAngle && targetAngle < item.endAngle) || flatItems[0];
  }, [rotation, flatItems]);

  return (
    <div className="fixed inset-0 z-50 bg-surface overflow-hidden flavor-wheel-container transition-colors duration-500" style={{ touchAction: 'none' }}>
      {/* Close Button: Moved down to account for Dynamic Island/Safe Area */}
      <div className="absolute top-4 right-6 z-[60] pt-safe mt-2">
        <Button variant="filled" onClick={onBack}>{dict.close}</Button>
      </div>

      <div 
        className="absolute top-1/2 left-0 -translate-y-1/2"
        style={{ width: '73vh', height: '73vh', left: '-36.5vh', cursor: isDragging ? 'grabbing' : 'grab', touchAction: 'none' }}
      >
        <svg
            ref={svgRef}
            viewBox="-50 -50 100 100"
            className="w-full h-full drop-shadow-2xl text-surface"
            style={{ transform: `rotate(${rotation}deg)`, transition: isDragging ? 'none' : 'transform 0.1s linear', touchAction: 'none' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            {flatItems.map((item, i) => {
                const startRad = (item.startAngle) * Math.PI / 180;
                const endRad = (item.endAngle) * Math.PI / 180;
                const x1 = 50 * Math.cos(startRad);
                const y1 = 50 * Math.sin(startRad);
                const x2 = 50 * Math.cos(endRad);
                const y2 = 50 * Math.sin(endRad);
                const largeArc = (item.endAngle - item.startAngle) > 180 ? 1 : 0;
                const d = `M 0 0 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;
                
                const midRad = (item.midAngle) * Math.PI / 180;
                const textR = 35;
                const tx = textR * Math.cos(midRad);
                const ty = textR * Math.sin(midRad);
                const textRot = item.midAngle;

                return (
                    <g key={i}>
                        <path d={d} fill={item.color} stroke="currentColor" strokeWidth="0.2" />
                        <text
                            x={tx} y={ty} textAnchor="middle" dominantBaseline="middle"
                            fill={getContrastColor(item.color)} fontSize="2.5" fontWeight="bold"
                            transform={`rotate(${textRot}, ${tx}, ${ty})`} style={{ pointerEvents: 'none' }}
                        >
                            {item.name}
                        </text>
                    </g>
                );
            })}
            <circle cx="0" cy="0" r="10" className="fill-surface-container-high" />
            <circle cx="0" cy="0" r="2" className="fill-primary" />
        </svg>
      </div>

      <div className="absolute top-1/2 left-0 z-40 pointer-events-none transform -translate-y-1/2 flex items-center">
         <div className="w-0 h-0 border-t-[15px] border-t-transparent border-b-[15px] border-b-transparent border-r-[25px] border-r-on-surface drop-shadow-lg ml-[calc(36.5vh-2px)]"></div>
         <div className="h-[2px] w-[10vw] bg-on-surface/20"></div>
      </div>

      {/* Info Panel: Adjusted positioning with pt-safe */}
      <div className="absolute top-28 right-6 w-auto flex flex-col items-end text-right pointer-events-none z-30 pt-safe mt-4">
        <div className="animate-slideInRight space-y-4 flex flex-col items-end">
            <span className="inline-block px-4 py-1 rounded-full bg-surface-container-high border border-outline/20 text-on-surface-variant text-sm uppercase tracking-widest mb-2 backdrop-blur-md shadow-sm">
                {activeItem?.category || dict.category}
            </span>
            <h2 className="text-5xl md:text-6xl font-black text-on-surface leading-tight drop-shadow-md transition-all duration-200" style={{ color: activeItem?.color }}>
                {activeItem?.name || dict.aroma}
            </h2>
            <div className="w-24 h-2 bg-on-surface/10 rounded-full my-6">
                <div className="h-full rounded-full transition-all duration-300" style={{ width: '60%', backgroundColor: activeItem?.color }} />
            </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-surface/90 pointer-events-none z-10"></div>
    </div>
  );
};

export default FlavorWheel;
