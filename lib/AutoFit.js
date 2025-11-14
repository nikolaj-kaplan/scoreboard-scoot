import React, { useRef, useEffect, useState } from 'react';

// AutoFit: scales its children down so that their designed dimensions fit inside the parent viewport
// Usage: wrap the whole overlay content inside <AutoFit designWidth={1920} designHeight={1080}>...</AutoFit>
// It applies a CSS transform scale and centers the content. Prevents scrollbars in constrained hosts (vMix browser).

export default function AutoFit({ children, designWidth = 1920, designHeight = 1080, style = {}, center = true, shrinkBufferY = 0, fixedTop = 0 }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function recompute() {
      const viewportW = window.innerWidth;
  // Reserve a vertical buffer so scaling begins before content hits top edge
  // Effective height for scaling excludes reserved fixedTop space
  const viewportH = (window.innerHeight - shrinkBufferY - fixedTop);

      // Measure actual content height if rendered
      let contentH = designHeight;
      let contentW = designWidth;
      if (innerRef.current) {
        const rect = innerRef.current.getBoundingClientRect();
        // Use natural (unscaled) desired dimensions; fallback to design
        contentH = rect.height || designHeight;
        contentW = rect.width || designWidth;
      }

      // Compute scale so content fits inside viewport (not necessarily designHeight)
      const scaleW = viewportW / contentW;
      const scaleH = viewportH / contentH;
      const s = Math.min(scaleW, scaleH, 1); // do not upscale beyond 1 (avoid blur)
      setScale(s);
    }
  // Run after paint so measurements are accurate
  setTimeout(recompute, 0);
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [designWidth, designHeight, children, shrinkBufferY]);

  return (
    <div
      ref={outerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#000',
        ...style
      }}
    >
      {fixedTop > 0 && (
        <div style={{ height: fixedTop, width: '100%', pointerEvents: 'none' }} />
      )}
      <div
        style={{
          position: 'absolute',
          top: fixedTop,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          alignItems: center ? 'center' : 'flex-start',
          justifyContent: center ? 'center' : 'flex-start'
        }}
      >
      <div
        ref={innerRef}
        style={{
          width: designWidth,
          // Natural top; overlays manage their own spacing
          // height intentionally auto so natural height can be less than designHeight
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          willChange: 'transform',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale'
        }}
      >
        {children}
      </div>
      </div>
    </div>
  );
}
