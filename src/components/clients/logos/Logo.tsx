import React, { useState, useEffect } from 'react';
import type { LogoProps } from './types';

interface LogoComponentProps extends LogoProps {
  svgPath: string;
  name: string;
}

export const Logo: React.FC<LogoComponentProps> = ({ 
  svgPath,
  name,
  className = "w-full h-full" 
}) => {
  const [svgContent, setSvgContent] = useState<string>('');
  const [viewBox, setViewBox] = useState<string>('0 0 200 100');

  useEffect(() => {
    fetch(svgPath)
      .then(response => response.text())
      .then(text => {
        // Extract the viewBox from the original SVG
        const viewBoxMatch = text.match(/viewBox=["']([^"']+)["']/);
        if (viewBoxMatch) {
          setViewBox(viewBoxMatch[1]);
        }
        
        // Extract the SVG content between the svg tags
        const content = text.match(/<svg[^>]*>([\s\S]*?)<\/svg>/)?.[1] || '';
        setSvgContent(content);
      })
      .catch(error => console.error(`Error loading ${name} logo:`, error));
  }, [svgPath, name]);

  return (
    <svg 
      viewBox={viewBox}
      className={className}
      preserveAspectRatio="xMidYMid contain"
      dangerouslySetInnerHTML={{ __html: svgContent }}
      aria-label={`${name} logo`}
    />
  );
};