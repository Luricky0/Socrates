import React from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
}

export const MathText: React.FC<MathTextProps> = ({ text }) => {
  if (!text) return null;

  // Split text by block math $$...$$ first, then inline math $...$
  const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2).trim();
          try {
            const html = katex.renderToString(math, { 
              displayMode: true, 
              throwOnError: false 
            });
            return (
              <div 
                key={index} 
                className="math-card"
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            );
          } catch (err) {
            return (
              <div key={index} className="math-card font-mono">
                {math}
              </div>
            );
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1).trim();
          try {
            const html = katex.renderToString(math, { 
              displayMode: false, 
              throwOnError: false 
            });
            return (
              <span 
                key={index} 
                className="inline-math"
                style={{ padding: '0 2px' }}
                dangerouslySetInnerHTML={{ __html: html }} 
              />
            );
          } catch (err) {
            return (
              <code key={index} className="font-mono">
                {math}
              </code>
            );
          }
        } else {
          // Process plain text and handle simple **bold** tags
          const boldParts = part.split(/(\*\*.*?\*\*)/g);
          return (
            <React.Fragment key={index}>
              {boldParts.map((bp, bidx) => {
                if (bp.startsWith('**') && bp.endsWith('**')) {
                  return (
                    <strong key={bidx} style={{ color: '#0f172a', fontWeight: '700' }}>
                      {bp.slice(2, -2)}
                    </strong>
                  );
                }
                
                // Return plain text with newline mappings for lists/returns
                return bp.split('\n').map((line, lidx) => (
                  <React.Fragment key={lidx}>
                    {lidx > 0 && <br />}
                    {line}
                  </React.Fragment>
                ));
              })}
            </React.Fragment>
          );
        }
      })}
    </>
  );
};
