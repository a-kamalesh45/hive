'use client';

import { useState, useEffect, useCallback } from 'react';
import { cn } from '../lib/utils';

const HexagonBackground = ({
    className,
    children,
    hexagonSize = 140, // Greatly increased size for the large pattern look
    hexagonMargin = 4,
    ...props
}) => {
    const hexagonWidth = hexagonSize;
    const hexagonHeight = hexagonSize * 1.1;
    const rowSpacing = hexagonSize * 0.8;
    const baseMarginTop = -36 - 0.275 * (hexagonSize - 100);
    const computedMarginTop = baseMarginTop + hexagonMargin;
    const oddRowMarginLeft = -(hexagonSize / 2);
    const evenRowMarginLeft = hexagonMargin / 2;

    const [gridDimensions, setGridDimensions] = useState({ rows: 0, columns: 0 });
    const [filledHexes, setFilledHexes] = useState(new Set());

    // Calculate grid and randomize filled "honey" cells
    const updateGridDimensions = useCallback(() => {
        // Reduce buffer slightly as hexes are bigger now
        const rows = Math.ceil(window.innerHeight / rowSpacing) + 1;
        const columns = Math.ceil(window.innerWidth / hexagonWidth) + 1;
        setGridDimensions({ rows, columns });

        const totalHexes = rows * columns;
        const newFilled = new Set();
        // Adjusted percentage for large hexes to not look too crowded
        for (let i = 0; i < totalHexes * 0.15; i++) {
            const r = Math.floor(Math.random() * rows);
            const c = Math.floor(Math.random() * columns);
            newFilled.add(`${r}-${c}`);
        }
        setFilledHexes(newFilled);
    }, [rowSpacing, hexagonWidth]);

    useEffect(() => {
        updateGridDimensions();
        window.addEventListener('resize', updateGridDimensions);
        return () => window.removeEventListener('resize', updateGridDimensions);
    }, [updateGridDimensions]);

    return (
        // Updated gradient background to be warmer beige/off-white
        <div
            className={cn(
                'relative w-full h-full overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#FAF6E8] to-[#F5ECD8]',
                className
            )}
            {...props}
        >
            <style>{`:root { --hexagon-margin: ${hexagonMargin}px; }`}</style>

            {/* Hexagon Grid */}
            <div className="absolute inset-0 z-0">
                {Array.from({ length: gridDimensions.rows }).map((_, rowIndex) => (
                    <div
                        key={`row-${rowIndex}`}
                        style={{
                            marginTop: computedMarginTop,
                            marginLeft: ((rowIndex + 1) % 2 === 0 ? evenRowMarginLeft : oddRowMarginLeft) - 10,
                        }}
                        className="inline-flex whitespace-nowrap"
                    >
                        {Array.from({ length: gridDimensions.columns }).map((_, colIndex) => {
                            const isFilled = filledHexes.has(`${rowIndex}-${colIndex}`);

                            return (
                                <div
                                    key={`hexagon-${rowIndex}-${colIndex}`}
                                    style={{
                                        width: hexagonWidth,
                                        height: hexagonHeight,
                                        marginLeft: hexagonMargin,
                                    }}
                                    className={cn(
                                        'relative inline-block',
                                        '[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]',
                                        // Very subtle border for empty hexes
                                        "before:content-[''] before:absolute before:inset-0 before:transition-all before:duration-500",
                                        isFilled
                                            ? "before:bg-transparent"
                                            : "before:bg-amber-900/5", // Lighter, warmer border

                                        // Inner fill for "honey" hexes - warmer gold tones
                                        "after:content-[''] after:absolute after:inset-[2px]",
                                        'after:[clip-path:polygon(50%_0%,100%_25%,100%_75%,50%_100%,0%_75%,0%_25%)]',
                                        isFilled
                                            ? "after:bg-gradient-to-br after:from-[#E6C785] after:to-[#D4AF5F] after:opacity-90"
                                            : "after:bg-transparent",

                                        // No hover effect in the static image design
                                    )}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            
            {/* Removed Floating Bees Layer */}

            {/* Subtle warm vignette effect */}
            <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_50%_50%,transparent_20%,rgba(245,236,216,0.6)_100%)] pointer-events-none" />

            {/* Content Container */}
            <div className="relative z-30 w-full h-full">
                {children}
            </div>
        </div>
    );
};

export { HexagonBackground };