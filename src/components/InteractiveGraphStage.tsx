import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import { compile } from 'mathjs';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  TrendingUp,
  Layers,
  Crosshair,
  Sliders,
} from 'lucide-react';
import { GraphConfiguration, GraphKeyPoint, GraphParameter } from '../types/math';

interface InteractiveGraphStageProps {
  graphConfig: GraphConfiguration;
  activeStepHighlight?: GraphKeyPoint;
  activeStepNumber?: number;
  onSelectPoint?: (point: GraphKeyPoint) => void;
}

export const InteractiveGraphStage: React.FC<InteractiveGraphStageProps> = ({
  graphConfig,
  activeStepHighlight,
  activeStepNumber,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [parameters, setParameters] = useState<GraphParameter[]>(graphConfig.parameters);
  const [customPrimaryExpr, setCustomPrimaryExpr] = useState<string>(graphConfig.primaryExpression);
  const [customSecondaryExpr, setCustomSecondaryExpr] = useState<string>(
    graphConfig.secondaryExpression || ''
  );

  const [xDomain, setXDomain] = useState<[number, number]>(graphConfig.xDomain);
  const [yDomain, setYDomain] = useState<[number, number]>(graphConfig.yDomain);

  const [showTangent, setShowTangent] = useState<boolean>(Boolean(graphConfig.showTangentAtX !== undefined));
  const [tangentX, setTangentX] = useState<number>(graphConfig.showTangentAtX ?? 1);
  const [showArea, setShowArea] = useState<boolean>(Boolean(graphConfig.showAreaUnderCurve));
  const [showKeyPoints, setShowKeyPoints] = useState<boolean>(true);

  const [hoverCoord, setHoverCoord] = useState<{
    x: number;
    yPrimary: number | null;
    ySecondary: number | null;
    slope: number | null;
  } | null>(null);

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ clientX: number; clientY: number; xDom: [number, number]; yDom: [number, number] } | null>(
    null
  );

  // Sync state when a new problem is loaded
  useEffect(() => {
    setParameters(graphConfig.parameters);
    setCustomPrimaryExpr(graphConfig.primaryExpression);
    setCustomSecondaryExpr(graphConfig.secondaryExpression || '');
    setXDomain(graphConfig.xDomain);
    setYDomain(graphConfig.yDomain);
    setShowTangent(graphConfig.showTangentAtX !== undefined);
    setTangentX(graphConfig.showTangentAtX ?? 1);
  }, [graphConfig]);

  // Build scope from current parameter values
  const paramScope = useMemo(() => {
    const scope: Record<string, number> = {
      e: Math.E,
      pi: Math.PI,
    };
    for (const p of parameters) {
      scope[p.symbol] = p.value;
    }
    return scope;
  }, [parameters]);

  // Compile primary & secondary functions safely
  const evalPrimary = useCallback(
    (xVal: number): number | null => {
      try {
        const compiled = compile(customPrimaryExpr);
        const result = compiled.evaluate({ ...paramScope, x: xVal });
        if (typeof result === 'number' && Number.isFinite(result)) {
          return result;
        }
        return null;
      } catch {
        return null;
      }
    },
    [customPrimaryExpr, paramScope]
  );

  const evalSecondary = useCallback(
    (xVal: number): number | null => {
      if (!customSecondaryExpr.trim()) return null;
      try {
        const compiled = compile(customSecondaryExpr);
        const result = compiled.evaluate({ ...paramScope, x: xVal });
        if (typeof result === 'number' && Number.isFinite(result)) {
          return result;
        }
        return null;
      } catch {
        return null;
      }
    },
    [customSecondaryExpr, paramScope]
  );

  // Compute numerical derivative f'(x)
  const evalSlope = useCallback(
    (xVal: number): number | null => {
      const h = 0.0001;
      const y1 = evalPrimary(xVal - h);
      const y2 = evalPrimary(xVal + h);
      if (y1 === null || y2 === null) return null;
      return (y2 - y1) / (2 * h);
    },
    [evalPrimary]
  );

  // Dynamically detect live roots, y-intercept, and local extrema across visible domain
  const liveDetectedPoints = useMemo(() => {
    const pts: GraphKeyPoint[] = [];
    // 1. y-intercept at x = 0
    const y0 = evalPrimary(0);
    if (y0 !== null && y0 >= yDomain[0] && y0 <= yDomain[1]) {
      pts.push({
        x: 0,
        y: Number(y0.toFixed(2)),
        label: `y-Int (0, ${Number(y0.toFixed(2))})`,
        kind: 'intercept',
      });
    }

    // Scan across xDomain for sign changes (roots) and slope sign changes (vertices)
    const steps = 300;
    const dx = (xDomain[1] - xDomain[0]) / steps;
    let prevX = xDomain[0];
    let prevY = evalPrimary(prevX);
    let prevSlope = evalSlope(prevX);

    for (let i = 1; i <= steps; i++) {
      const currX = xDomain[0] + i * dx;
      const currY = evalPrimary(currX);
      const currSlope = evalSlope(currX);

      // Root detection
      if (prevY !== null && currY !== null) {
        if ((prevY <= 0 && currY >= 0) || (prevY >= 0 && currY <= 0)) {
          if (Math.abs(currY - prevY) < (yDomain[1] - yDomain[0])) {
            const frac = Math.abs(prevY) / (Math.abs(prevY) + Math.abs(currY) || 1);
            const rootX = prevX + frac * dx;
            if (Math.abs(rootX) > 0.05 || y0 !== 0) {
              pts.push({
                x: Number(rootX.toFixed(2)),
                y: 0,
                label: `Root (${Number(rootX.toFixed(2))}, 0)`,
                kind: 'root',
              });
            }
          }
        }
      }

      // Vertex / local extremum detection
      if (prevSlope !== null && currSlope !== null) {
        if (
          (prevSlope < 0 && currSlope >= 0) ||
          (prevSlope > 0 && currSlope <= 0)
        ) {
          if (Math.abs(currSlope - prevSlope) < 20) {
            const frac = Math.abs(prevSlope) / (Math.abs(prevSlope) + Math.abs(currSlope) || 1);
            const vertX = prevX + frac * dx;
            const vertY = evalPrimary(vertX);
            if (vertY !== null && vertY >= yDomain[0] && vertY <= yDomain[1]) {
              pts.push({
                x: Number(vertX.toFixed(2)),
                y: Number(vertY.toFixed(2)),
                label: `Vertex (${Number(vertX.toFixed(2))}, ${Number(vertY.toFixed(2))})`,
                kind: 'vertex',
              });
            }
          }
        }
      }

      // Intersection between primary and secondary
      if (customSecondaryExpr.trim()) {
        const sPrev = evalSecondary(prevX);
        const sCurr = evalSecondary(currX);
        if (prevY !== null && currY !== null && sPrev !== null && sCurr !== null) {
          const diffPrev = prevY - sPrev;
          const diffCurr = currY - sCurr;
          if ((diffPrev <= 0 && diffCurr >= 0) || (diffPrev >= 0 && diffCurr <= 0)) {
            const frac = Math.abs(diffPrev) / (Math.abs(diffPrev) + Math.abs(diffCurr) || 1);
            const intX = prevX + frac * dx;
            const intY = evalPrimary(intX);
            if (intY !== null) {
              pts.push({
                x: Number(intX.toFixed(2)),
                y: Number(intY.toFixed(2)),
                label: `Meet (${Number(intX.toFixed(2))}, ${Number(intY.toFixed(2))})`,
                kind: 'intersection',
              });
            }
          }
        }
      }

      prevX = currX;
      prevY = currY;
      prevSlope = currSlope;
    }

    // Deduplicate close points
    const unique: GraphKeyPoint[] = [];
    for (const p of pts) {
      if (!unique.some((u) => Math.hypot(u.x - p.x, u.y - p.y) < 0.35 && u.kind === p.kind)) {
        unique.push(p);
      }
    }
    return unique.slice(0, 7);
  }, [evalPrimary, evalSecondary, evalSlope, xDomain, yDomain, customSecondaryExpr]);

  // Compute Riemann area approximation when showArea is active
  const riemannArea = useMemo(() => {
    if (!showArea) return null;
    const a = 0;
    const b = tangentX;
    const n = 24;
    const dx = (b - a) / n;
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const midX = a + (i + 0.5) * dx;
      const y = evalPrimary(midX);
      if (y !== null) sum += y * dx;
    }
    return sum;
  }, [showArea, tangentX, evalPrimary]);

  // Draw coordinate system, curves, tangent, area, and points on high-DPI canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const [xMin, xMax] = xDomain;
    const [yMin, yMax] = yDomain;

    const toScreenX = (x: number) => ((x - xMin) / (xMax - xMin)) * width;
    const toScreenY = (y: number) => height - ((y - yMin) / (yMax - yMin)) * height;

    // 1. Clear background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);

    // 2. Grid lines
    const xRange = xMax - xMin;
    const yRange = yMax - yMin;
    const xStep = xRange > 24 ? 5 : xRange > 12 ? 2 : 1;
    const yStep = yRange > 24 ? 5 : yRange > 12 ? 2 : 1;

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#F1F5F9';

    // Minor grid
    const minorXStep = xStep / 2;
    for (let x = Math.ceil(xMin / minorXStep) * minorXStep; x <= xMax; x += minorXStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();
    }
    const minorYStep = yStep / 2;
    for (let y = Math.ceil(yMin / minorYStep) * minorYStep; y <= yMax; y += minorYStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();
    }

    // Major grid
    ctx.strokeStyle = '#E2E8F0';
    ctx.fillStyle = '#64748B';
    ctx.font = '500 11px "IBM Plex Mono", monospace';

    const originX = Math.min(Math.max(toScreenX(0), 28), width - 28);
    const originY = Math.min(Math.max(toScreenY(0), 20), height - 20);

    for (let x = Math.ceil(xMin / xStep) * xStep; x <= xMax; x += xStep) {
      const sx = toScreenX(x);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (Math.abs(x) > 0.001) {
        ctx.textAlign = 'center';
        ctx.fillText(Number(x.toFixed(1)).toString(), sx, originY + 15);
      }
    }

    for (let y = Math.ceil(yMin / yStep) * yStep; y <= yMax; y += yStep) {
      const sy = toScreenY(y);
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      if (Math.abs(y) > 0.001) {
        ctx.textAlign = 'right';
        ctx.fillText(Number(y.toFixed(1)).toString(), originX - 7, sy + 4);
      }
    }

    // 3. Coordinate Axes (x=0, y=0)
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 1.5;
    if (xMin <= 0 && xMax >= 0) {
      const sx0 = toScreenX(0);
      ctx.beginPath();
      ctx.moveTo(sx0, 0);
      ctx.lineTo(sx0, height);
      ctx.stroke();
    }
    if (yMin <= 0 && yMax >= 0) {
      const sy0 = toScreenY(0);
      ctx.beginPath();
      ctx.moveTo(0, sy0);
      ctx.lineTo(width, sy0);
      ctx.stroke();
    }

    // 4. Optional Area Under Curve (Riemann rectangles from 0 to tangentX)
    if (showArea) {
      const a = 0;
      const b = tangentX;
      const n = 24;
      const dx = (b - a) / n;
      const sy0 = toScreenY(0);

      for (let i = 0; i < n; i++) {
        const rx = a + i * dx;
        const midX = rx + 0.5 * dx;
        const ry = evalPrimary(midX);
        if (ry !== null) {
          const sx1 = toScreenX(rx);
          const sx2 = toScreenX(rx + dx);
          const sy = toScreenY(ry);
          ctx.fillStyle = ry >= 0 ? 'rgba(2, 132, 199, 0.16)' : 'rgba(217, 119, 6, 0.16)';
          ctx.strokeStyle = ry >= 0 ? 'rgba(2, 132, 199, 0.45)' : 'rgba(217, 119, 6, 0.45)';
          ctx.lineWidth = 1;
          const topY = Math.min(sy, sy0);
          const rectH = Math.abs(sy0 - sy);
          ctx.fillRect(Math.min(sx1, sx2), topY, Math.abs(sx2 - sx1), rectH);
          ctx.strokeRect(Math.min(sx1, sx2), topY, Math.abs(sx2 - sx1), rectH);
        }
      }
    }

    // 5. Secondary Curve (if present)
    if (customSecondaryExpr.trim()) {
      ctx.save();
      ctx.strokeStyle = '#D97706'; // Amber 600
      ctx.lineWidth = 2.25;
      ctx.setLineDash([6, 5]);
      ctx.beginPath();
      let started = false;
      const samples = 350;
      for (let i = 0; i <= samples; i++) {
        const x = xMin + (i / samples) * (xMax - xMin);
        const y = evalSecondary(x);
        if (y !== null && y >= yMin - yRange && y <= yMax + yRange) {
          const sx = toScreenX(x);
          const sy = toScreenY(y);
          if (!started) {
            ctx.moveTo(sx, sy);
            started = true;
          } else {
            ctx.lineTo(sx, sy);
          }
        } else {
          started = false;
        }
      }
      ctx.stroke();
      ctx.restore();
    }

    // 6. Primary Curve f(x)
    ctx.save();
    ctx.strokeStyle = '#0284C7'; // Vibrant Azure
    ctx.lineWidth = 3;
    ctx.beginPath();
    let startedPrimary = false;
    const samples = 450;
    for (let i = 0; i <= samples; i++) {
      const x = xMin + (i / samples) * (xMax - xMin);
      const y = evalPrimary(x);
      if (y !== null && y >= yMin - yRange * 2 && y <= yMax + yRange * 2) {
        const sx = toScreenX(x);
        const sy = toScreenY(y);
        if (!startedPrimary) {
          ctx.moveTo(sx, sy);
          startedPrimary = true;
        } else {
          ctx.lineTo(sx, sy);
        }
      } else {
        startedPrimary = false;
      }
    }
    ctx.stroke();
    ctx.restore();

    // 7. Optional Tangent Slope Line at x = tangentX
    if (showTangent) {
      const ty = evalPrimary(tangentX);
      const slope = evalSlope(tangentX);
      if (ty !== null && slope !== null) {
        ctx.save();
        ctx.strokeStyle = '#059669'; // Emerald 600
        ctx.lineWidth = 2;
        const x1 = xMin;
        const y1 = ty + slope * (x1 - tangentX);
        const x2 = xMax;
        const y2 = ty + slope * (x2 - tangentX);
        ctx.beginPath();
        ctx.moveTo(toScreenX(x1), toScreenY(y1));
        ctx.lineTo(toScreenX(x2), toScreenY(y2));
        ctx.stroke();

        // Draw point of tangency
        const tsx = toScreenX(tangentX);
        const tsy = toScreenY(ty);
        ctx.fillStyle = '#059669';
        ctx.beginPath();
        ctx.arc(tsx, tsy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 8. Key Points (Roots, Vertices, Intercepts, Intersections)
    if (showKeyPoints) {
      for (const pt of liveDetectedPoints) {
        const sx = toScreenX(pt.x);
        const sy = toScreenY(pt.y);
        if (sx < 10 || sx > width - 10 || sy < 10 || sy > height - 10) continue;

        const color =
          pt.kind === 'vertex'
            ? '#7C3AED'
            : pt.kind === 'intersection'
            ? '#DC2626'
            : pt.kind === 'root'
            ? '#0284C7'
            : '#475569';

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label callout
        ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
        ctx.fillStyle = '#0F172A';
        ctx.textAlign = 'left';
        ctx.fillText(pt.label, sx + 9, sy - 7);
      }
    }

    // 9. Active Step Highlight Point (with target ring)
    if (activeStepHighlight) {
      const actualY = evalPrimary(activeStepHighlight.x) ?? activeStepHighlight.y;
      const sx = toScreenX(activeStepHighlight.x);
      const sy = toScreenY(actualY);

      if (sx >= 0 && sx <= width && sy >= 0 && sy <= height) {
        ctx.save();
        // Outer target ring
        ctx.strokeStyle = '#0284C7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, 12, 0, Math.PI * 2);
        ctx.stroke();

        // Inner dot
        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.arc(sx, sy, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Callout box for active step
        const tagText = `Step ${activeStepNumber ?? ''}: ${activeStepHighlight.label}`;
        ctx.font = '600 12px "Plus Jakarta Sans", sans-serif';
        const textWidth = ctx.measureText(tagText).width;
        const boxX = Math.min(Math.max(sx - textWidth / 2 - 10, 8), width - textWidth - 28);
        const boxY = sy > 52 ? sy - 38 : sy + 18;

        ctx.fillStyle = '#0F172A';
        ctx.beginPath();
        ctx.roundRect(boxX, boxY, textWidth + 20, 26, 6);
        ctx.fill();

        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'left';
        ctx.fillText(tagText, boxX + 10, boxY + 17);
        ctx.restore();
      }
    }

    // 10. Hover Crosshair
    if (hoverCoord) {
      const sx = toScreenX(hoverCoord.x);
      ctx.save();
      ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      if (hoverCoord.yPrimary !== null) {
        const sy = toScreenY(hoverCoord.yPrimary);
        ctx.fillStyle = '#0284C7';
        ctx.beginPath();
        ctx.arc(sx, sy, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      ctx.restore();
    }
  }, [
    xDomain,
    yDomain,
    evalPrimary,
    evalSecondary,
    evalSlope,
    customSecondaryExpr,
    showTangent,
    tangentX,
    showArea,
    showKeyPoints,
    liveDetectedPoints,
    activeStepHighlight,
    activeStepNumber,
    hoverCoord,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width;

    if (isDragging && dragStartRef.current) {
      const dxPx = e.clientX - dragStartRef.current.clientX;
      const dyPx = e.clientY - dragStartRef.current.clientY;
      const xSpan = dragStartRef.current.xDom[1] - dragStartRef.current.xDom[0];
      const ySpan = dragStartRef.current.yDom[1] - dragStartRef.current.yDom[0];
      const shiftX = -(dxPx / rect.width) * xSpan;
      const shiftY = (dyPx / rect.height) * ySpan;

      setXDomain([dragStartRef.current.xDom[0] + shiftX, dragStartRef.current.xDom[1] + shiftX]);
      setYDomain([dragStartRef.current.yDom[0] + shiftY, dragStartRef.current.yDom[1] + shiftY]);
      return;
    }

    const mathX = xDomain[0] + relX * (xDomain[1] - xDomain[0]);
    const snappedX = Math.round(mathX * 20) / 20;
    const yPrimary = evalPrimary(snappedX);
    const ySecondary = evalSecondary(snappedX);
    const slope = evalSlope(snappedX);

    setHoverCoord({
      x: snappedX,
      yPrimary,
      ySecondary,
      slope,
    });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    dragStartRef.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      xDom: [...xDomain] as [number, number],
      yDom: [...yDomain] as [number, number],
    };
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
    dragStartRef.current = null;
    setHoverCoord(null);
  };

  const handleZoom = (factor: number) => {
    const xCenter = (xDomain[0] + xDomain[1]) / 2;
    const yCenter = (yDomain[0] + yDomain[1]) / 2;
    const xHalf = ((xDomain[1] - xDomain[0]) / 2) * factor;
    const yHalf = ((yDomain[1] - yDomain[0]) / 2) * factor;
    setXDomain([xCenter - xHalf, xCenter + xHalf]);
    setYDomain([yCenter - yHalf, yCenter + yHalf]);
  };

  const handleResetAll = () => {
    setParameters(graphConfig.parameters);
    setCustomPrimaryExpr(graphConfig.primaryExpression);
    setCustomSecondaryExpr(graphConfig.secondaryExpression || '');
    setXDomain(graphConfig.xDomain);
    setYDomain(graphConfig.yDomain);
  };

  const updateParameterValue = (symbol: string, newValue: number) => {
    setParameters((prev) =>
      prev.map((p) => (p.symbol === symbol ? { ...p, value: newValue } : p))
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
      {/* Top Stage Header & Live Coordinate Readout */}
      <div className="px-5 py-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50/70">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">
            Interactive Coordinate Stage
          </span>
          <span className="text-slate-300" aria-hidden="true">
            ·
          </span>
          <span className="text-xs font-mono text-sky-700 truncate">
            {graphConfig.primaryLabel}
          </span>
          {customSecondaryExpr.trim() && (
            <>
              <span className="text-slate-300" aria-hidden="true">
                ·
              </span>
              <span className="text-xs font-mono text-amber-700 truncate">
                {graphConfig.secondaryLabel || `g(x) = ${customSecondaryExpr}`}
              </span>
            </>
          )}
        </div>

        {/* Zoom & Layer Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setShowKeyPoints((v) => !v)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showKeyPoints
                ? 'bg-sky-50 border-sky-200 text-sky-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5" />
            Key Points
          </button>
          <button
            type="button"
            onClick={() => setShowTangent((v) => !v)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showTangent
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Slope Line
          </button>
          <button
            type="button"
            onClick={() => setShowArea((v) => !v)}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              showArea
                ? 'bg-sky-50 border-sky-200 text-sky-800'
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Integral Area
          </button>
          <div className="h-4 w-px bg-slate-200 mx-0.5" />
          <button
            type="button"
            onClick={() => handleZoom(0.75)}
            title="Zoom In"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom(1.33)}
            title="Zoom Out"
            className="p-1.5 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={handleResetAll}
            title="Reset Graph & Sliders"
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-200 rounded-lg transition-colors flex items-center gap-1 whitespace-nowrap shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </div>

      {/* Canvas Container */}
      <div className="relative w-full h-[360px] sm:h-[410px] select-none bg-white">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          className={`w-full h-full block ${isDragging ? 'cursor-grabbing' : 'cursor-crosshair'}`}
        />

        {/* Floating Live Telemetry Bar inside Canvas */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
          <div className="bg-slate-900/90 text-white px-3 py-1.5 rounded-lg text-xs font-mono tabular-nums flex items-center gap-3 shadow-sm">
            {hoverCoord ? (
              <>
                <span>x = {hoverCoord.x.toFixed(2)}</span>
                <span className="text-slate-400">·</span>
                <span className="text-sky-300">
                  f(x) = {hoverCoord.yPrimary !== null ? hoverCoord.yPrimary.toFixed(2) : 'undef'}
                </span>
                {hoverCoord.slope !== null && (
                  <>
                    <span className="text-slate-400">·</span>
                    <span className="text-emerald-300">
                      slope = {hoverCoord.slope.toFixed(2)}
                    </span>
                  </>
                )}
              </>
            ) : (
              <span className="text-slate-300">
                Hover curve to inspect coordinates & slope · Drag to pan
              </span>
            )}
          </div>

          {riemannArea !== null && (
            <div className="bg-sky-900/90 text-sky-100 px-3 py-1.5 rounded-lg text-xs font-mono tabular-nums">
              ∫ Area [0 → {tangentX.toFixed(1)}] ≈ {riemannArea.toFixed(2)} sq units
            </div>
          )}
        </div>
      </div>

      {/* Interactive Parameter Sliders & Custom Formula Editor */}
      <div className="p-5 border-t border-slate-200 bg-slate-50/50 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-900">
              Live Parameter Sandbox — Drag Sliders to See How the Equation Reacts
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono tabular-nums whitespace-nowrap">
            {liveDetectedPoints.length} key features detected
          </span>
        </div>

        {/* Parameter Sliders Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {parameters.map((param) => (
            <div
              key={param.symbol}
              className="bg-white border border-slate-200 rounded-xl p-3.5 flex flex-col justify-between gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`slider-${param.symbol}`}
                  className="text-xs font-semibold text-slate-800 truncate"
                >
                  {param.label}
                </label>
                <span className="text-xs font-mono font-semibold text-sky-700 tabular-nums whitespace-nowrap">
                  {param.symbol} = {param.value} ({param.unit})
                </span>
              </div>
              <input
                id={`slider-${param.symbol}`}
                type="range"
                min={param.min}
                max={param.max}
                step={param.step}
                value={param.value}
                onChange={(e) => updateParameterValue(param.symbol, parseFloat(e.target.value))}
                className="w-full math-slider my-1"
              />
              <p className="text-[11px] text-slate-500 leading-snug">{param.description}</p>
            </div>
          ))}

          {(showTangent || showArea) && (
            <div className="bg-white border border-emerald-200 rounded-xl p-3.5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor="slider-tangent-x"
                  className="text-xs font-semibold text-emerald-900 truncate"
                >
                  Probe Position (x₀)
                </label>
                <span className="text-xs font-mono font-semibold text-emerald-700 tabular-nums whitespace-nowrap">
                  x₀ = {tangentX.toFixed(2)} (units)
                </span>
              </div>
              <input
                id="slider-tangent-x"
                type="range"
                min={xDomain[0] + 0.5}
                max={xDomain[1] - 0.5}
                step={0.1}
                value={tangentX}
                onChange={(e) => setTangentX(parseFloat(e.target.value))}
                className="w-full math-slider my-1"
              />
              <p className="text-[11px] text-slate-500 leading-snug">
                Slope at x₀:{' '}
                <strong className="font-mono text-emerald-700">
                  {evalSlope(tangentX)?.toFixed(2) ?? '0.00'}
                </strong>{' '}
                · Height f(x₀):{' '}
                <strong className="font-mono text-slate-700">
                  {evalPrimary(tangentX)?.toFixed(2) ?? '0.00'}
                </strong>
              </p>
            </div>
          )}
        </div>

        {/* Custom Function Input Row */}
        <div className="pt-2 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-sky-700 whitespace-nowrap">
              f(x) =
            </span>
            <input
              type="text"
              value={customPrimaryExpr}
              onChange={(e) => setCustomPrimaryExpr(e.target.value)}
              placeholder="e.g. a * x^2 + b * x + c"
              className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-amber-700 whitespace-nowrap">
              g(x) =
            </span>
            <input
              type="text"
              value={customSecondaryExpr}
              onChange={(e) => setCustomSecondaryExpr(e.target.value)}
              placeholder="Optional 2nd curve (e.g. 2 * x + 1)"
              className="w-full px-3 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
