import React, { useRef, useEffect, useState } from 'react';
import { overlayConfig } from './overlayConfig';

// ViewportClamp: purpose-built for a single target viewport 1920x1080 (vMix).
// Keeps a fixed top gap (fixedTop) for branding/header. Starts shrinking remaining content
// earlier (using earlyThreshold) BEFORE it would collide with the top or remove the gap.
// "Shrinking" is done with a uniform scale limited by maxScaleDown.
// This is intentionally simple and not a general responsive system.
// Assumptions:
//  - The page is rendered only inside a 1920x1080 browser surface.
//  - Content width <= designWidth.
//  - We only scale downward (never up) and preserve the fixedTop region unscaled.
// Props:
//  fixedTop: number of pixels reserved at top that must never be eaten by scaling.
//  earlyThreshold: extra vertical buffer that triggers earlier scaling (space above table).
//  maxScaleDown: lower bound (e.g. 0.85) to avoid unreadable tiny text.
//  designWidth/designHeight: reference dimensions (optional, default 1920x1080).
//  center: whether to center horizontally; vertical is anchored below fixedTop.

export default function ViewportClamp({
  children,
  fixedTop = 120,
  earlyThreshold = 40, // reduced buffer so scaling starts later
  maxScaleDown = 0.8, // keep text larger
  designWidth = 1920,
  designHeight = 1080,
  center = false,
  style = {},
  contentWidth = 'design' // 'design' or 'auto' for natural width
}) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    function recompute() {
      const viewportW = 1920; // fixed target
      const viewportH = 1080; // fixed target

      let contentH = designHeight;
      let contentW = designWidth;
      if (innerRef.current) {
        const rect = innerRef.current.getBoundingClientRect();
        contentH = rect.height || designHeight;
        contentW = rect.width || designWidth;
      }

      // Available height below fixedTop minus early threshold buffer.
      const availableH = viewportH - fixedTop - earlyThreshold;

      let desiredScale = 1;
      if (contentH > availableH) {
        desiredScale = availableH / contentH;
      }
      if (desiredScale < maxScaleDown) desiredScale = maxScaleDown;
      if (desiredScale > 1) desiredScale = 1; // never upscale
      if (scale !== desiredScale) {
        // Debug: log scale transitions to help tune vertical compression.
        // eslint-disable-next-line no-console
        console.log('[ViewportClamp] scale updated', { contentH, availableH, desiredScale });
      }
      setScale(desiredScale);
    }
    // allow paint first
    requestAnimationFrame(recompute);
    window.addEventListener('resize', recompute);
    return () => window.removeEventListener('resize', recompute);
  }, [fixedTop, earlyThreshold, maxScaleDown, designWidth, designHeight]);

  return (
    <div
      ref={outerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: overlayConfig.backgroundColor,
        ...style
      }}
    >
      <div style={{ height: fixedTop, width: '100%', pointerEvents: 'none' }} />
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
            width: contentWidth === 'auto' ? 'auto' : designWidth,
            maxWidth: designWidth,
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
