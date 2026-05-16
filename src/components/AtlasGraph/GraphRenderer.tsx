import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3Force from 'd3-force';
import { buildAtlasGraphData, GraphData, GraphNode, GraphLink } from '../../services/graphBuilder';

interface Props {
  visibleGroups?: {
    molecule: boolean;
    receptor: boolean;
    enzyme: boolean;
  };
  onNodeSelect?: (node: GraphNode) => void;
  zoomToNodeId?: string | null;
  zoomTrigger?: number;
  repulsion?: number;
}

export const GraphRenderer = ({ visibleGroups, onNodeSelect, zoomToNodeId, zoomTrigger, repulsion = -300 }: Props) => {
  const fgRef = useRef<any>();
  const [baseData, setBaseData] = useState<GraphData>({ nodes: [], links: [] });
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (zoomToNodeId && zoomTrigger && zoomTrigger > 0) {
      const node = baseData.nodes.find(n => n.id === zoomToNodeId);
      if (node && fgRef.current) {
        fgRef.current.centerAt(node.x, node.y, 600);
        fgRef.current.zoom(3, 600);
      }
    }
  }, [zoomToNodeId, zoomTrigger, baseData.nodes]);
  
  useEffect(() => {
    setBaseData(buildAtlasGraphData());
  }, []);

  useEffect(() => {
    if (fgRef.current) {
      if (fgRef.current.d3Force('charge')) {
        fgRef.current.d3Force('charge').strength(repulsion);
      }
      
      const radiusForce = d3Force.forceCollide((node: any) => Math.sqrt((node.val || 1) * 4 / Math.PI) * 2.2);
      fgRef.current.d3Force('collide', radiusForce);
      
      if (fgRef.current.d3Force('link')) {
        fgRef.current.d3Force('link').distance(120);
      }

      if (typeof fgRef.current.d3ReheatSimulation === 'function') {
        fgRef.current.d3ReheatSimulation();
      }
    }
  }, [repulsion]);

  const data = useMemo(() => {
    if (!visibleGroups) return baseData;
    
    const filteredNodes = baseData.nodes.filter(n => visibleGroups[n.group]);
    const validNodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = baseData.links.filter(l => 
       validNodeIds.has((l.source as any).id || l.source) && 
       validNodeIds.has((l.target as any).id || l.target)
    );

    return { nodes: filteredNodes, links: filteredLinks };
  }, [baseData, visibleGroups]);

  // Compute connections for hover
  const neighbors = useMemo(() => {
    if (!hoverNode) return new Set<string>();
    const connected = new Set<string>();
    data.links.forEach(l => {
      const srcId = (l.source as GraphNode).id || l.source;
      const tgtId = (l.target as GraphNode).id || l.target;
      if (srcId === hoverNode.id) connected.add(tgtId as string);
      if (tgtId === hoverNode.id) connected.add(srcId as string);
    });
    return connected;
  }, [hoverNode, data.links]);

  useEffect(() => {
    const observeElement = containerRef.current;
    if (!observeElement) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    resizeObserver.observe(observeElement);
    return () => resizeObserver.unobserve(observeElement);
  }, []);

  const handleNodeClick = useCallback((node: GraphNode) => {
    // Center map on node
    const distance = 40;
    const distRatio = 1 + distance/Math.hypot(node.x!, node.y!, node.z || 0);

    fgRef.current?.centerAt(node.x, node.y, 1000);
    fgRef.current?.zoom(4, 1000);
    
    if (onNodeSelect) onNodeSelect(node);
  }, [fgRef, onNodeSelect]);

  const handleNodeHover = useCallback((node: GraphNode | null) => {
    setHoverNode(node);
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full bg-zinc-950 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 bg-zinc-900/80 backdrop-blur border border-zinc-800 p-4 rounded-lg shadow-2xl pointer-events-none">
        <h3 className="font-bold mb-3 text-xs uppercase tracking-wider text-zinc-500 font-mono">Legenda</h3>
        <div className="flex flex-col gap-3 text-xs text-zinc-500 font-mono tracking-wide">
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-[0_0_8px_#38BDF8]"></div> MOLÉCULAS</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#F43F5E] shadow-[0_0_8px_#F43F5E]"></div> ALVOS / RECEPTORES</div>
          <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-[#94A3B8]"></div> ENZIMAS (CYP450)</div>
        </div>
      </div>
      
      <ForceGraph2D
        ref={fgRef}
        width={dimensions.width}
        height={dimensions.height}
        graphData={data as any}
        nodeLabel="name"
        nodeColor={(node: any) => {
          if (hoverNode) {
            return (node.id === hoverNode.id || neighbors.has(node.id)) 
              ? node.color 
              : `${node.color}33`; // Add alpha
          }
          return node.color;
        }}
        nodeVal="val"
        linkColor={(link: any) => {
           const srcId = link.source.id || link.source;
           const tgtId = link.target.id || link.target;
           if (hoverNode) {
             return (srcId === hoverNode.id || tgtId === hoverNode.id)
               ? '#94a3b8' // Highlight link
               : '#33415533'; // Fade link
           }
           return '#334155';
        }}
        linkWidth={(link: any) => {
           const srcId = link.source.id || link.source;
           const tgtId = link.target.id || link.target;
           if (hoverNode && (srcId === hoverNode.id || tgtId === hoverNode.id)) return 2;
           return (link as GraphLink).width || 1;
        }}
        onNodeClick={handleNodeClick}
        onNodeHover={handleNodeHover as any}
        nodeCanvasObjectMode={() => "replace"}
        nodeCanvasObject={(node: any, ctx, globalScale) => {
          const radius = Math.sqrt((node.val || 1) * 4 / Math.PI);

          if (!Number.isFinite(node.x) || !Number.isFinite(node.y) || !Number.isFinite(radius)) {
            return;
          }

          let fillColor1 = '';
          let fillColor2 = '';
          let strokeColor = '';
          
          if (node.group === 'molecule') {
            fillColor1 = '#ffe066';
            fillColor2 = '#b8860b';
            strokeColor = '#7a5c00';
          } else if (node.group === 'receptor') {
            fillColor1 = '#ff6b6b';
            fillColor2 = '#8b0000';
            strokeColor = '#5c0000';
          } else {
            fillColor1 = '#c0c0c0';
            fillColor2 = '#555555';
            strokeColor = '#333333';
          }
          
          let opacity = 1;
          if (hoverNode && node.id !== hoverNode.id && !neighbors.has(node.id)) {
            opacity = 0.2; // faded
          }
          
          const oldAlpha = ctx.globalAlpha;
          ctx.globalAlpha = opacity;
          
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);
          
          const gradient = ctx.createRadialGradient(
            node.x - radius * 0.3, node.y - radius * 0.3, radius * 0.1,
            node.x, node.y, radius
          );
          
          gradient.addColorStop(0, fillColor1); // opaque highlight for 3D sphere
          gradient.addColorStop(1, fillColor2);
          
          ctx.fillStyle = gradient;
          ctx.fill();
          
          ctx.lineWidth = 1.5 / globalScale;
          ctx.strokeStyle = strokeColor;
          ctx.stroke();

          // Label
          const label = node.name.toUpperCase();
          const fontSize = 10/globalScale;

          if (hoverNode && node.id !== hoverNode.id && !neighbors.has(node.id)) {
            ctx.fillStyle = '#F8FAFC33'; // Faded text
          } else {
            ctx.fillStyle = '#F8FAFC';
          }

          ctx.font = `bold ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(label, node.x, node.y + radius + (8 / globalScale));
          
          ctx.globalAlpha = oldAlpha;
        }}
      />
    </div>
  );
};
