import React, { useState, useEffect, useRef } from 'react';
import { Brain, Sliders, Layers, Info, Trash2, RotateCcw } from 'lucide-react';

// Informações pedagógicas validadas e estruturadas
interface GraphNode {
  id: string;
  label: string;
  type: 'molecule' | 'receptor' | 'enzyme';
  color: string;
  tooltip: string;
  // Physics properties
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface GraphConnection {
  from: string;
  to: string;
  strength: number;
}

const ALL_NODES_DATA: Omit<GraphNode, 'x' | 'y' | 'vx' | 'vy' | 'radius'>[] = [
  // MOLÉCULAS (Yellow/Amber #f59e0b)
  { id: 'fluoxetina', label: 'FLUOXETINA', type: 'molecule', color: '#f59e0b', tooltip: 'Antidepressivo ISRS pioneiro. Inibe fortemente o CYP2D6 e antagoniza receptores 5-HT2C.' },
  { id: 'escitalopram', label: 'ESCITALOPRAM', type: 'molecule', color: '#f59e0b', tooltip: 'Antidepressivo ISRS sênior com máxima seletividade pelo transportador SERT.' },
  { id: 'sertralina', label: 'SERTRALINA', type: 'molecule', color: '#f59e0b', tooltip: 'Antidepressivo ISRS com ação acessória de bloqueio do DAT (Dopamina).' },
  { id: 'amitriptilina', label: 'AMITRIPTILINA', type: 'molecule', color: '#f59e0b', tooltip: 'Antidepressivo Tricíclico. Potente ação sobre H1, M1, Alpha-1, SERT e NET.' },
  { id: 'venlafaxina', label: 'VENLAFAXINA', type: 'molecule', color: '#f59e0b', tooltip: 'Antidepressivo de ação dual (IRSN) modulando Serotonina e Noradrenalina.' },
  { id: 'bupropiona', label: 'BUPROPIONA', type: 'molecule', color: '#f59e0b', tooltip: 'Inibidor de Recaptação de Noradrenalina e Dopamina (IRND), inibidor potente do CYP2D6.' },
  { id: 'quetiapina', label: 'QUETIAPINA', type: 'molecule', color: '#f59e0b', tooltip: 'Antipsicótico atípico. Alta afinidade por H1 (sedativo) e bloqueio 5-HT2A e D2.' },
  { id: 'olanzapina', label: 'OLANZAPINA', type: 'molecule', color: '#f59e0b', tooltip: 'Antipsicótico atípico com ação antagonista multirreceptora e depuração via CYP1A2.' },
  { id: 'risperidona', label: 'RISPERIDONA', type: 'molecule', color: '#f59e0b', tooltip: 'Antipsicótico atípico potente em D2 e 5-HT2A. Metabolizado pelo CYP2D6.' },
  { id: 'mirtazapina', label: 'MIRTAZAPINA', type: 'molecule', color: '#f59e0b', tooltip: 'Antidepressivo NaSSA. Bloqueador de auto-receptores Alpha-2 e receptores H1 e 5-HT2C.' },
  { id: 'litio', label: 'LÍTIO', type: 'molecule', color: '#f59e0b', tooltip: 'Estabilizador de humor clássico. Atuação intracelular direta (não metabólica).' },

  // ALVOS / RECEPTORES (Pink/Red #ec4899)
  { id: 'sert', label: 'SERT', type: 'receptor', color: '#ec4899', tooltip: 'Transportador de Serotonina pós-sináptico. Bloqueado por ISRS e Tricíclicos.' },
  { id: 'net', label: 'NET', type: 'receptor', color: '#ec4899', tooltip: 'Transportador de Noradrenalina. Amplifica tônus adrenérgico no córtex cerebral.' },
  { id: 'dat', label: 'DAT', type: 'receptor', color: '#ec4899', tooltip: 'Transportador de Dopamina. Modula energia motora e circuitos de recompensa.' },
  { id: 'ht2a', label: '5-HT2A', type: 'receptor', color: '#ec4899', tooltip: 'Receptor de Serotonina. Seu bloqueio reduz sintomas extrapiramidais e ansiedade.' },
  { id: 'ht2c', label: '5-HT2C', type: 'receptor', color: '#ec4899', tooltip: 'Receptor serotoninérgico associado ao controle de apetite e modulação dopaminérgica.' },
  { id: 'ht1a', label: '5-HT1A', type: 'receptor', color: '#ec4899', tooltip: 'Autorreceptor e receptor pós-sináptico. Principal alvo ansiolítico e mimetizador de humor.' },
  { id: 'd2', label: 'D2', type: 'receptor', color: '#ec4899', tooltip: 'Receptor Dopaminérgico pós-sináptico central. Ajuste direto em transtornos psicóticos.' },
  { id: 'h1', label: 'H1', type: 'receptor', color: '#ec4899', tooltip: 'Receptor de Histamina. A inibição gera sonolência profunda e apetite metabólico.' },
  { id: 'alpha1', label: 'ALPHA-1', type: 'receptor', color: '#ec4899', tooltip: 'Receptor Noradrenérgico vascular. O bloqueio induz redução pressórica e síncopes.' },

  // ENZIMAS (Sky Blue #38bdf8)
  { id: 'cyp2d6', label: 'CYP2D6', type: 'enzyme', color: '#38bdf8', tooltip: 'Enzima hepática clássica que processa antipsicóticos e tricíclicos.' },
  { id: 'cyp3a4', label: 'CYP3A4', type: 'enzyme', color: '#38bdf8', tooltip: 'Principal citocromo hepático. Responsável pelo processamento da Quetiapina.' },
  { id: 'cyp1a2', label: 'CYP1A2', type: 'enzyme', color: '#38bdf8', tooltip: 'Via depuradora da Olanzapina, induzida pelo fumo/tabaco.' },
  { id: 'cyp2c19', label: 'CYP2C19', type: 'enzyme', color: '#38bdf8', tooltip: 'Isoenzima hepática que decompõe o Escitalopram e Sertralina.' }
];

const ALL_CONNECTIONS: GraphConnection[] = [
  // Fluoxetina
  { from: 'fluoxetina', to: 'sert', strength: 1.8 },
  { from: 'fluoxetina', to: 'ht2c', strength: 1.2 },
  { from: 'fluoxetina', to: 'cyp2d6', strength: 2.2 },

  // Escitalopram
  { from: 'escitalopram', to: 'sert', strength: 2.5 },
  { from: 'escitalopram', to: 'cyp2c19', strength: 1.3 },

  // Sertralina
  { from: 'sertralina', to: 'sert', strength: 1.9 },
  { from: 'sertralina', to: 'dat', strength: 1.0 },
  { from: 'sertralina', to: 'cyp2c19', strength: 1.1 },

  // Amitriptilina
  { from: 'amitriptilina', to: 'sert', strength: 1.7 },
  { from: 'amitriptilina', to: 'net', strength: 1.6 },
  { from: 'amitriptilina', to: 'h1', strength: 2.4 },
  { from: 'amitriptilina', to: 'alpha1', strength: 1.8 },
  { from: 'amitriptilina', to: 'ht2a', strength: 1.5 },
  { from: 'amitriptilina', to: 'cyp2d6', strength: 1.2 },
  { from: 'amitriptilina', to: 'cyp2c19', strength: 1.3 },

  // Venlafaxina
  { from: 'venlafaxina', to: 'sert', strength: 1.9 },
  { from: 'venlafaxina', to: 'net', strength: 1.3 },
  { from: 'venlafaxina', to: 'cyp2d6', strength: 1.4 },

  // Bupropiona
  { from: 'bupropiona', to: 'net', strength: 1.4 },
  { from: 'bupropiona', to: 'dat', strength: 1.2 },
  { from: 'bupropiona', to: 'cyp2d6', strength: 2.1 },

  // Quetiapina
  { from: 'quetiapina', to: 'h1', strength: 2.3 },
  { from: 'quetiapina', to: 'ht2a', strength: 1.8 },
  { from: 'quetiapina', to: 'd2', strength: 1.0 },
  { from: 'quetiapina', to: 'alpha1', strength: 1.5 },
  { from: 'quetiapina', to: 'cyp3a4', strength: 1.6 },

  // Olanzapina
  { from: 'olanzapina', to: 'ht2a', strength: 2.1 },
  { from: 'olanzapina', to: 'd2', strength: 1.4 },
  { from: 'olanzapina', to: 'h1', strength: 2.0 },
  { from: 'olanzapina', to: 'cyp1a2', strength: 1.5 },

  // Risperidona
  { from: 'risperidona', to: 'ht2a', strength: 2.3 },
  { from: 'risperidona', to: 'd2', strength: 2.0 },
  { from: 'risperidona', to: 'alpha1', strength: 1.6 },
  { from: 'risperidona', to: 'cyp2d6', strength: 1.4 },

  // Mirtazapina
  { from: 'mirtazapina', to: 'h1', strength: 2.4 },
  { from: 'mirtazapina', to: 'ht2a', strength: 1.7 },
  { from: 'mirtazapina', to: 'ht2c', strength: 1.5 },

  // Lítio
  { from: 'litio', to: 'ht1a', strength: 0.8 }
];

export default function HeroVisual() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // States
  const [zoom, setZoom] = useState<number>(115); // slider representation (80 to 200)
  const [filterType, setFilterType] = useState<{
    molecule: boolean;
    receptor: boolean;
    enzyme: boolean;
  }>({
    molecule: true,
    receptor: true,
    enzyme: true
  });

  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 600, height: 420 });
  const prevDimensionsRef = useRef({ width: 600, height: 420 });

  // Physics dynamic nodes reference to persist state over renders
  const nodesRef = useRef<GraphNode[]>([]);
  const draggedNodeIdRef = useRef<string | null>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Particles traveling across connections to represent synaptical active flow
  const particlesRef = useRef<{
    from: string;
    to: string;
    progress: number; // 0 to 1
    speed: number;
    color: string;
  }[]>([]);

  // Initialize nodes only once or on reset
  const initNodesInFrame = (w: number, h: number) => {
    const initialized: GraphNode[] = ALL_NODES_DATA.map((data, idx) => {
      // Golden spiral distribution or uniform placement around center with random offset
      const angle = (idx / ALL_NODES_DATA.length) * Math.PI * 2;
      const r = Math.min(w, h) * (0.18 + Math.random() * 0.18);
      
      const x = w / 2 + Math.cos(angle) * r;
      const y = h / 2 + Math.sin(angle) * r;

      return {
        ...data,
        x,
        y,
        vx: 0,
        vy: 0,
        radius: data.type === 'molecule' ? 7 : 5.5
      };
    });
    nodesRef.current = initialized;
  };

  // Re-adjust node coordinates if container changes dramatically
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        let width = entry.contentRect.width || 500;
        let height = Math.max(280, width * 0.7); // respect sweet 4:3 or customized aspect ratio
        
        setDimensions({ width, height });

        if (nodesRef.current.length === 0) {
          initNodesInFrame(width, height);
        } else {
          // Proportionally scale nodes positions
          const scaleX = width / prevDimensionsRef.current.width;
          const scaleY = height / prevDimensionsRef.current.height;
          nodesRef.current.forEach(node => {
            node.x = Math.max(10, Math.min(width - 10, node.x * scaleX));
            node.y = Math.max(10, Math.min(height - 10, node.y * scaleY));
          });
        }
        prevDimensionsRef.current = { width, height };
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Periodic particle emission
  useEffect(() => {
    const interval = setInterval(() => {
      if (nodesRef.current.length === 0) return;

      // Filter connections where both endpoints are visible/toggled
      const activeConns = ALL_CONNECTIONS.filter((conn) => {
        const fromNode = nodesRef.current.find(n => n.id === conn.from);
        const toNode = nodesRef.current.find(n => n.id === conn.to);
        if (!fromNode || !toNode) return false;
        return filterType[fromNode.type] && filterType[toNode.type];
      });

      if (activeConns.length > 0 && particlesRef.current.length < 35) {
        // Emit 1-2 random active flowing synapse signals
        const conn = activeConns[Math.floor(Math.random() * activeConns.length)];
        const fromNode = nodesRef.current.find(n => n.id === conn.from);
        const particleColor = fromNode?.type === 'molecule' ? '#fbbf24' : '#ef4444';

        particlesRef.current.push({
          from: conn.from,
          to: conn.to,
          progress: 0,
          speed: 0.007 + Math.random() * 0.012,
          color: particleColor
        });
      }
    }, 450);

    return () => clearInterval(interval);
  }, [filterType]);

  // Main high-precision React render looping for dynamic physical simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const runPhysicsAndDraw = () => {
      const { width, height } = dimensions;
      const nodes = nodesRef.current;

      // Ensure nodes initialized
      if (nodes.length === 0) {
        initNodesInFrame(width, height);
      }

      // --- 1. PHYSICS COMPUTATION (Spring engine) ---
      const charge = zoom * -2.4; // Repulsion constant scaled by slider
      const kAttract = 0.024; // Attraction stiffness
      const restLength = 85;  // Default rest length for connected lines
      const centerPull = 0.008; // Weak gravity pull
      const dampingForce = 0.84; // Drag to avoid wild chaos

      const enabledTypes = new Set<string>();
      if (filterType.molecule) enabledTypes.add('molecule');
      if (filterType.receptor) enabledTypes.add('receptor');
      if (filterType.enzyme) enabledTypes.add('enzyme');

      // Add Repulsion forces between node pairs (Coumlomb-like repulsion)
      for (let i = 0; i < nodes.length; i++) {
        const n1 = nodes[i];
        if (!enabledTypes.has(n1.type)) continue;

        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          if (!enabledTypes.has(n2.type)) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          // Epsilon to avoid zero division arithmetics
          const distSq = dx * dx + dy * dy + 0.1;
          const dist = Math.sqrt(distSq);

          if (dist < 220) {
            // Repulsion formula F = k / dist^2
            const force = charge / distSq;
            const fx = (dx / dist) * force;
            const fy = (dy / dist) * force;

            n1.vx += fx;
            n1.vy += fy;
            n2.vx -= fx;
            n2.vy -= fy;
          }
        }
      }

      // Add Spring Hooke's Attraction Along Active Mapped Links
      ALL_CONNECTIONS.forEach((conn) => {
        const n1 = nodes.find(n => n.id === conn.from);
        const n2 = nodes.find(n => n.id === conn.to);

        if (!n1 || !n2) return;
        if (!enabledTypes.has(n1.type) || !enabledTypes.has(n2.type)) return;

        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        
        // Hooke's Law: Force proportional to displacement from equilibrium restLength
        const displacement = dist - restLength;
        const force = kAttract * displacement * conn.strength;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        n1.vx += fx;
        n1.vy += fy;
        n2.vx -= fx;
        n2.vy -= fy;
      });

      // Weak centering force & velocity integration
      nodes.forEach((node) => {
        if (!enabledTypes.has(node.type)) return;

        // Skip calculations if node is actively dragged by pointer
        if (node.id === draggedNodeIdRef.current) {
          node.x = mouseRef.current.x;
          node.y = mouseRef.current.y;
          node.vx = 0;
          node.vy = 0;
          return;
        }

        // Target center position
        const targetX = width / 2;
        const targetY = height / 2;
        
        node.vx += (targetX - node.x) * centerPull;
        node.vy += (targetY - node.y) * centerPull;

        // Damp and update
        node.vx *= dampingForce;
        node.vy *= dampingForce;

        node.x += node.vx;
        node.y += node.vy;

        // Soft screen constraint boundary walls
        const margin = 28;
        if (node.x < margin) { node.x = margin; node.vx *= -0.2; }
        if (node.x > width - margin) { node.x = width - margin; node.vx *= -0.2; }
        if (node.y < margin) { node.y = margin; node.vy *= -0.2; }
        if (node.y > height - margin) { node.y = height - margin; node.vy *= -0.2; }
      });


      // --- 2. CANVAS DRAW ACTIONS ---
      ctx.clearRect(0, 0, width, height);

      // Draw subtle micro dots medical background grid
      ctx.strokeStyle = '#18181b'; // zinc-900 border matching
      ctx.lineWidth = 0.55;
      const gridSize = 24;
      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          ctx.fillStyle = '#27272a'; // zinc-800
          ctx.fillRect(x, y, 1.2, 1.2);
        }
      }

      // Draw Connection lines first
      ALL_CONNECTIONS.forEach((conn) => {
        const fromNode = nodes.find(n => n.id === conn.from);
        const toNode = nodes.find(n => n.id === conn.to);

        if (!fromNode || !toNode) return;
        if (!enabledTypes.has(fromNode.type) || !enabledTypes.has(toNode.type)) return;

        // Compute if path is currently destacado (highlighted) by hovered item
        const isPathHighlighted = hoveredNode && (hoveredNode.id === fromNode.id || hoveredNode.id === toNode.id);

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);

        if (isPathHighlighted) {
          ctx.strokeStyle = fromNode.type === 'molecule' ? 'rgba(245, 158, 11, 0.85)' : 'rgba(236, 72, 153, 0.85)';
          ctx.lineWidth = 2.2;
        } else {
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.16)'; // clear semi-transparent white constellation lines
          ctx.lineWidth = 0.95;
        }
        ctx.stroke();
      });

      // Update and draw traveling synaptic chemical signal particles
      const activeParticles = particlesRef.current;
      particlesRef.current = activeParticles.filter((part) => {
        const f = nodes.find(n => n.id === part.from);
        const t = nodes.find(n => n.id === part.to);

        if (!f || !t || !enabledTypes.has(f.type) || !enabledTypes.has(t.type)) return false;

        part.progress += part.speed;
        if (part.progress >= 1.0) return false; // arrived

        const currX = f.x + (t.x - f.x) * part.progress;
        const currY = f.y + (t.y - f.y) * part.progress;

        // Draw particle pulse glow
        ctx.beginPath();
        ctx.arc(currX, currY, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = part.color;
        ctx.shadowBlur = 4;
        ctx.shadowColor = part.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset glow

        return true;
      });

      // Draw actual nodes
      nodes.forEach((node) => {
        if (!enabledTypes.has(node.type)) return;

        const isCurrentHovered = hoveredNode && hoveredNode.id === node.id;
        const isNeighbor = hoveredNode && ALL_CONNECTIONS.some(conn => 
          (conn.from === node.id && conn.to === hoveredNode.id) || 
          (conn.to === node.id && conn.from === hoveredNode.id)
        );

        // Radar pulsate glow or high opacity outline for interactions
        if (isCurrentHovered) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + 7, 0, Math.PI * 2);
          ctx.fillStyle = `${node.color}15`; // hex with alpha
          ctx.fill();

          ctx.strokeStyle = `${node.color}50`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // Draw outer node ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#09090b'; // dark interior fill
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = isCurrentHovered ? 2.8 : 1.7;
        ctx.stroke();

        // Core dot
        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Draw Monospace Label badge
        ctx.font = isCurrentHovered ? 'bold 10px monospace' : '9px monospace';
        
        // Dynamic label coloring to highlight connections in mesh
        if (isCurrentHovered) {
          ctx.fillStyle = '#ffffff';
        } else if (isNeighbor) {
          ctx.fillStyle = '#d4d4d8'; // zinc-300
        } else if (hoveredNode) {
          ctx.fillStyle = '#52525b'; // dimmed zinc-600
        } else {
          ctx.fillStyle = '#a1a1aa'; // zinc-405 default
        }

        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        
        // Pad label nicely to the right of node
        ctx.fillText(node.label, node.x + 10, node.y);
      });

      animId = requestAnimationFrame(runPhysicsAndDraw);
    };

    runPhysicsAndDraw();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [dimensions, zoom, filterType, hoveredNode]);

  // Pointer event action trackers (Mouse down, move, up)
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Support dual touch & select coordinates correctly
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      if (e.cancelable) {
        e.preventDefault();
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Detect click over nodes
    const clickedNode = nodesRef.current.find((n) => {
      // Toggle category check
      if (!filterType[n.type]) return false;

      const dx = n.x - x;
      const dy = n.y - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Node touch targets are padded for quick fingers
      return distance <= n.radius + 15;
    });

    if (clickedNode) {
      draggedNodeIdRef.current = clickedNode.id;
      mouseRef.current = { x, y };
      setHoveredNode(clickedNode);
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if ('touches' in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
      if (e.cancelable) {
        e.preventDefault();
      }
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    mouseRef.current = { x, y };

    // If not dragging, process simple hover highlights
    if (!draggedNodeIdRef.current) {
      const hovered = nodesRef.current.find((n) => {
        if (!filterType[n.type]) return false;
        const dx = n.x - x;
        const dy = n.y - y;
        return Math.sqrt(dx * dx + dy * dy) <= n.radius + 8;
      });

      setHoveredNode(hovered || null);
    }
  };

  const handlePointerUp = () => {
    draggedNodeIdRef.current = null;
  };

  // Re-cluster completely on reset trigger
  const handleResetCluster = () => {
    initNodesInFrame(dimensions.width, dimensions.height);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto bg-zinc-950/65 border border-zinc-800/85 rounded-2xl p-4 md:p-6 shadow-2xl backdrop-blur-md overflow-hidden animate-fade-in flex flex-col gap-4">
      
      {/* 1. RELATIONAL MEDICAL CANVAS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-900 pb-3">
        <div className="space-y-0.5">
          <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest font-bold uppercase text-amber-500">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
            ATLAS RELACIONAL INTERATIVO
          </span>
          <p className="text-[10px] text-zinc-500">Arraste para mover, use filtros no painel.</p>
        </div>

        {/* Categories togglers to selectively filter out elements */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterType(prev => ({ ...prev, molecule: !prev.molecule }))}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 border border-zinc-900 ${
              filterType.molecule 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-md' 
                : 'text-zinc-600 bg-zinc-950 hover:text-zinc-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-amber-500 ${!filterType.molecule && 'opacity-30'}`}></span>
            MOLÉCULAS
          </button>
          
          <button
            onClick={() => setFilterType(prev => ({ ...prev, receptor: !prev.receptor }))}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 border border-zinc-900 ${
              filterType.receptor 
                ? 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-md' 
                : 'text-zinc-600 bg-zinc-950 hover:text-zinc-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-pink-500 ${!filterType.receptor && 'opacity-30'}`}></span>
            RECEPTORES
          </button>

          <button
            onClick={() => setFilterType(prev => ({ ...prev, enzyme: !prev.enzyme }))}
            className={`px-2 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1 border border-zinc-900 ${
              filterType.enzyme 
                ? 'bg-sky-500/10 text-sky-450 border-sky-500/20 shadow-md' 
                : 'text-zinc-600 bg-zinc-950 hover:text-zinc-400'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full bg-sky-400 ${!filterType.enzyme && 'opacity-30'}`}></span>
            ENZIMAS
          </button>
        </div>
      </div>

      {/* 2. THE SIMULATION WINDOW */}
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden bg-[#050508] border border-zinc-900 rounded-xl cursor-grab active:cursor-grabbing select-none"
        style={{ height: `${dimensions.height}px` }}
      >
        {/* Floating details overlay on hovered item */}
        {hoveredNode && (
          <div className="absolute top-3 left-3 z-[20] p-3 bg-[#0a0a0f]/95 border border-zinc-800 rounded-xl max-w-[210px] pointer-events-none text-[10px] space-y-1.5 animate-fade-in shadow-xl select-none">
            <span className="font-mono font-extrabold tracking-tight block uppercase text-xs" style={{ color: hoveredNode.color }}>
              {hoveredNode.label}
            </span>
            <span className="inline-block px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider font-bold bg-white/5 text-zinc-400 uppercase">
              {hoveredNode.type === 'molecule' ? 'Princípio Ativo' : hoveredNode.type === 'receptor' ? 'Alvo Receptogênico' : 'Citocromo CYP450'}
            </span>
            <p className="text-zinc-400 leading-snug font-sans">
              {hoveredNode.tooltip}
            </p>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          className="block w-full h-full"
        />

        {/* Legend panel matching Vercel style exactly */}
        <div className="absolute bottom-2.5 left-2.5 bg-zinc-950/80 border border-zinc-900/40 p-2.5 rounded-lg select-none text-[9px] text-zinc-500 font-mono space-y-1">
          <span className="text-[8px] text-zinc-400 block font-bold mb-1 border-b border-zinc-900 pb-0.5">CLASSES</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
            MOLÉCULAS
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0"></span>
            RECEPTORES / ALVOS
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
            ENZIMAS (CYP450)
          </div>
        </div>

        {/* Refresh tool utility */}
        <button
          onClick={handleResetCluster}
          title="Resetar Rede"
          className="absolute bottom-2.5 right-2.5 p-1.5 rounded-lg bg-zinc-950/80 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all cursor-pointer"
        >
          <RotateCcw size={13} />
        </button>
      </div>

      {/* 3. SIMULATION CONTROLS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center bg-zinc-900/30 p-3.5 border border-zinc-900 rounded-xl">
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono tracking-wider font-bold text-zinc-400 flex items-center justify-between">
            <span>AFASTAMENTO (REPUXÃO DA REDE)</span>
            <span className="text-amber-400">{zoom}%</span>
          </label>
          <input
            type="range"
            min="60"
            max="180"
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-amber-500 h-1 bg-zinc-950 rounded-lg cursor-pointer"
          />
        </div>

        <div className="text-[10px] text-zinc-500 leading-snug space-y-1">
          <div className="flex items-center gap-1 text-zinc-400 font-bold">
            <Info size={11} className="text-amber-500" />
            <span>Mecânica de Spring Layout Ativo</span>
          </div>
          <p className="font-sans">
            A atração molecular é calculada em tempo real com constantes Ki baseadas em afinidades bibliográficas clássicas (Stahl). Arraste os nós de fármacos para sentir as forças de ligação!
          </p>
        </div>
      </div>
      
    </div>
  );
}
