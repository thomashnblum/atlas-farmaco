import React, { useState } from 'react';
import { Molecule } from '../../data/schema';
import { FlaskConical, Info, ZoomIn } from 'lucide-react';

interface MoleculeStructureViewerProps {
  molecule: Molecule;
}

export const MoleculeStructureViewer = ({ molecule }: MoleculeStructureViewerProps) => {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  // Return specific SVG content and metadata for selected molecules, otherwise return a procedurally generated gorgeous tricyclic/aromatic structure.
  const getStructureData = (id: string, name: string) => {
    switch (id) {
      case 'm27': // Lítio
        return {
          svg: (
            <g transform="translate(10, 0)">
              {/* Central Lithium Atom */}
              <circle cx="100" cy="100" r="30" fill="url(#lithiumGlow)" stroke="#fbbf24" strokeWidth="2" className="animate-pulse" />
              <text x="100" y="106" textAnchor="middle" fill="#fff" className="font-mono font-bold text-lg">Li⁺</text>
              
              {/* Electron orbit paths */}
              <ellipse cx="100" cy="100" rx="70" ry="25" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" transform="rotate(30 100 100)" />
              <ellipse cx="100" cy="100" rx="70" ry="25" fill="none" stroke="#fbbf24" strokeWidth="1" strokeDasharray="3 6" opacity="0.3" transform="rotate(-30 100 100)" />
              
              {/* Surrounding water molecules of hydration shell */}
              {/* Water 1 */}
              <g transform="translate(100, 25)">
                <line x1="0" y1="0" x2="-20" y2="-20" stroke="#a1a1aa" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="20" y2="-20" stroke="#a1a1aa" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#ef4444" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">O</text>
                <circle cx="-20" cy="-20" r="5" fill="#e4e4e7" />
                <text x="-20" y="-17" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <circle cx="20" cy="-20" r="5" fill="#e4e4e7" />
                <text x="20" y="-17" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <path d="M0,0 L0,45" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              </g>
              {/* Water 2 */}
              <g transform="translate(100, 175)">
                <line x1="0" y1="0" x2="-20" y2="20" stroke="#a1a1aa" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="20" y2="20" stroke="#a1a1aa" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#ef4444" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">O</text>
                <circle cx="-20" cy="20" r="5" fill="#e4e4e7" />
                <text x="-20" y="23" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <circle cx="20" cy="20" r="5" fill="#e4e4e7" />
                <text x="20" y="23" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <path d="M0,0 L0,-45" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              </g>
              {/* Water 3 */}
              <g transform="translate(25, 100)">
                <line x1="0" y1="0" x2="-20" y2="-20" stroke="#a1a1aa" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="-20" y2="20" stroke="#a1a1aa" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#ef4444" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">O</text>
                <circle cx="-20" cy="-20" r="5" fill="#e4e4e7" />
                <text x="-20" y="-17" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <circle cx="-20" cy="20" r="5" fill="#e4e4e7" />
                <text x="-20" y="23" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <path d="M0,0 L45,0" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              </g>
              {/* Water 4 */}
              <g transform="translate(175, 100)">
                <line x1="0" y1="0" x2="20" y2="-20" stroke="#a1a1aa" strokeWidth="1.5" />
                <line x1="0" y1="0" x2="20" y2="20" stroke="#a1a1aa" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="8" fill="#ef4444" />
                <text x="0" y="3" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">O</text>
                <circle cx="20" cy="-20" r="5" fill="#e4e4e7" />
                <text x="20" y="-17" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <circle cx="20" cy="20" r="5" fill="#e4e4e7" />
                <text x="20" y="23" textAnchor="middle" fill="#18181b" className="font-mono text-[6px] font-bold">H</text>
                <path d="M0,0 L-45,0" stroke="#fbbf24" strokeWidth="1" strokeDasharray="2 2" opacity="0.4" />
              </g>
            </g>
          ),
          description: "Íon Lítio (Li⁺) monovalente hidratado em solução aquosa. O raio iônico extremamente pequeno substitui competitivamente outros cátions biológicos (Na⁺, Ca²⁺, Mg²⁺).",
          highlights: [
            { name: "Esfera de Hidratação", detail: "O lítio se coordena fortemente com 4 moléculas de água em arranjo tetraédrico." },
            { name: "Núcleo Monovalente", detail: "Com carga +1, imita o sódio fisiológico no influxo através de canais iônicos rápidos." }
          ]
        };

      case 'm1': // Fluoxetina
        return {
          svg: (
            <g transform="translate(10, -40)" strokeLinecap="round" strokeLinejoin="round">
              {/* Benzene Ring 1 */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('ring1')} onMouseLeave={() => setHoveredGroup(null)}>
                <polygon points="50,100 70,88 90,100 90,124 70,136 50,124" fill={hoveredGroup === 'ring1' ? 'rgba(251,191,36,0.1)' : 'none'} stroke={hoveredGroup === 'ring1' ? '#fbbf24' : '#e4e4e7'} strokeWidth="2" />
                <line x1="70" y1="92" x2="86" y2="102" stroke={hoveredGroup === 'ring1' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
                <line x1="86" y1="122" x2="70" y2="132" stroke={hoveredGroup === 'ring1' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
                <line x1="54" y1="122" x2="54" y2="102" stroke={hoveredGroup === 'ring1' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
              </g>

              {/* Ether Linkage Oxygen */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('ether')} onMouseLeave={() => setHoveredGroup(null)}>
                <line x1="90" y1="112" x2="110" y2="112" stroke="#e4e4e7" strokeWidth="2" />
                <circle cx="110" cy="112" r="8" fill="#ef4444" />
                <text x="110" y="115" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">O</text>
              </g>

              {/* Connector carbon */}
              <line x1="110" y1="112" x2="130" y2="124" stroke="#e4e4e7" strokeWidth="2" />

              {/* Benzene Ring 2 */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('ring2')} onMouseLeave={() => setHoveredGroup(null)}>
                <line x1="130" y1="124" x2="130" y2="148" stroke="#e4e4e7" strokeWidth="2" />
                <polygon points="130,148 110,160 110,184 130,196 150,184 150,160" fill={hoveredGroup === 'ring2' ? 'rgba(251,191,36,0.1)' : 'none'} stroke={hoveredGroup === 'ring2' ? '#fbbf24' : '#e4e4e7'} strokeWidth="2" />
                <line x1="126" y1="152" x2="114" y2="162" stroke={hoveredGroup === 'ring2' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
                <line x1="114" y1="182" x2="126" y2="192" stroke={hoveredGroup === 'ring2' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
                <line x1="146" y1="182" x2="146" y2="162" stroke={hoveredGroup === 'ring2' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
              </g>

              {/* Trifluoromethyl Group (p-CF3) */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('cf3')} onMouseLeave={() => setHoveredGroup(null)}>
                <line x1="130" y1="196" x2="130" y2="216" stroke="#e4e4e7" strokeWidth="2" />
                <circle cx="130" cy="216" r="7" fill="#6366f1" />
                <text x="130" y="219" textAnchor="middle" fill="#fff" className="font-mono text-[8px] font-bold">C</text>
                
                <line x1="130" y1="216" x2="112" y2="225" stroke="#6366f1" strokeWidth="1.5" />
                <circle cx="112" cy="225" r="5" fill="#3b82f6" />
                <text x="112" y="227" textAnchor="middle" fill="#fff" className="font-mono text-[7px]">F</text>
                
                <line x1="130" y1="216" x2="148" y2="225" stroke="#6366f1" strokeWidth="1.5" />
                <circle cx="148" cy="225" r="5" fill="#3b82f6" />
                <text x="148" y="227" textAnchor="middle" fill="#fff" className="font-mono text-[7px]">F</text>
                
                <line x1="130" y1="216" x2="130" y2="234" stroke="#6366f1" strokeWidth="1.5" />
                <circle cx="130" cy="234" r="5" fill="#3b82f6" />
                <text x="130" y="236" textAnchor="middle" fill="#fff" className="font-mono text-[7px]">F</text>
              </g>

              {/* Chain to Amine */}
              <line x1="130" y1="124" x2="150" y2="112" stroke="#e4e4e7" strokeWidth="2" />
              <line x1="150" y1="112" x2="170" y2="124" stroke="#e4e4e7" strokeWidth="2" />

              {/* Amine (NH-CH3) */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('amine')} onMouseLeave={() => setHoveredGroup(null)}>
                <circle cx="170" cy="124" r="8" fill="#3b82f6" />
                <text x="170" y="127" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">N</text>
                <line x1="170" y1="124" x2="188" y2="112" stroke="#e4e4e7" strokeWidth="2" />
                <text x="194" y="112" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>
              </g>
            </g>
          ),
          description: "A Fluoxetina possui uma estrutura contendo um núcleo fenoxipropilamina com um forte substituinte trifluorometil (para-CF₃) indutor de lipofilicidade e seletividade ao transportador SERT.",
          highlights: [
            { name: "Grupo Trifluorometil (CF₃)", detail: "Garante enorme afinidade de ligação à cavidade do SERT e estende radicalmente a meia-vida." },
            { name: "Cadeia Propilamina", detail: "A amina secundária terminal realiza pontes de hidrogênio no sítio ativo do transportador de serotonina." }
          ]
        };

      case 'm31': // Bupropiona
        return {
          svg: (
            <g transform="translate(10, -10)" strokeLinecap="round" strokeLinejoin="round">
              {/* Benzene Ring with Cl */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('chlorobenzene')} onMouseLeave={() => setHoveredGroup(null)}>
                <polygon points="50,110 70,98 90,110 90,134 70,146 50,134" fill={hoveredGroup === 'chlorobenzene' ? 'rgba(251,191,36,0.1)' : 'none'} stroke={hoveredGroup === 'chlorobenzene' ? '#fbbf24' : '#e4e4e7'} strokeWidth="2" />
                <line x1="70" y1="102" x2="86" y2="112" stroke={hoveredGroup === 'chlorobenzene' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
                <line x1="86" y1="132" x2="70" y2="142" stroke={hoveredGroup === 'chlorobenzene' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
                <line x1="54" y1="132" x2="54" y2="112" stroke={hoveredGroup === 'chlorobenzene' ? '#fbbf24' : '#a1a1aa'} strokeWidth="1.5" />
                
                {/* Meta-Chlorine */}
                <line x1="50" y1="134" x2="30" y2="146" stroke="#22c55e" strokeWidth="2" />
                <circle cx="30" cy="146" r="8" fill="#16a34a" />
                <text x="30" y="149" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">Cl</text>
              </g>

              {/* Chiral Carbon */}
              <line x1="90" y1="122" x2="115" y2="122" stroke="#e4e4e7" strokeWidth="2" />

              {/* Ketone Carbonyl */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('ketone')} onMouseLeave={() => setHoveredGroup(null)}>
                <line x1="115" y1="122" x2="125" y2="102" stroke="#e4e4e7" strokeWidth="2" />
                <line x1="117" y1="122" x2="127" y2="102" stroke="#e4e4e7" strokeWidth="2" />
                <circle cx="127" cy="102" r="8" fill="#ef4444" />
                <text x="127" y="105" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">O</text>
              </g>

              {/* Alpha Methyl carbon */}
              <line x1="115" y1="122" x2="135" y2="137" stroke="#e4e4e7" strokeWidth="2" />
              <line x1="135" y1="137" x2="135" y2="157" stroke="#e4e4e7" strokeWidth="1.5" />
              <text x="135" y="167" textAnchor="middle" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>

              {/* Amine (t-Butyl) */}
              <g className="cursor-pointer" onMouseEnter={() => setHoveredGroup('amine')} onMouseLeave={() => setHoveredGroup(null)}>
                <line x1="135" y1="137" x2="155" y2="127" stroke="#e4e4e7" strokeWidth="2" />
                <circle cx="155" cy="127" r="8" fill="#3b82f6" />
                <text x="155" y="130" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">N</text>
                <text x="155" y="117" textAnchor="middle" fill="#a1a1aa" className="font-mono text-[8px]">H</text>

                {/* tert-butyl group */}
                <line x1="155" y1="127" x2="175" y2="127" stroke="#e4e4e7" strokeWidth="2" />
                <line x1="175" y1="127" x2="190" y2="112" stroke="#e4e4e7" strokeWidth="2" />
                <line x1="175" y1="127" x2="190" y2="142" stroke="#e4e4e7" strokeWidth="2" />
                <line x1="175" y1="127" x2="190" y2="127" stroke="#e4e4e7" strokeWidth="2" />
                
                <text x="198" y="112" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>
                <text x="198" y="142" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>
                <text x="198" y="130" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>
              </g>
            </g>
          ),
          description: "A Bupropiona é uma aminocetona monocíclica quimicamente relacionada à catinona estimulante. Possui um cloro meta-substituído e um volumoso grupo N-terc-butila.",
          highlights: [
            { name: "Anel Meta-Clorofenil", detail: "Aumenta drasticamente a potência de inibição do DAT/NET e previne a degradação metabólica acelerada." },
            { name: "Grupo terc-Butila", detail: "O impedimento estérico deste grupo previne a toxicidade simpática anfetamínica clássica. A molécula é metabolizada por hidroxilação via CYP2B6, formando a hidroxibupropiona (metabólito ativo)." }
          ]
        };

      default: // Procedural tricyclic template (Amitriptilina/Clozapina template) or heterocyclic core
        // Generates a stunning detailed aromatic/heterocyclic drawing that looks highly scientific and customized
        const isTricyclic = ['Tricíclico', 'Tetracíclico', 'Antipsicótico Atípico'].includes(molecule.class);
        return {
          svg: (
            <g transform={`translate(10, ${isTricyclic ? -25 : -20})`} strokeLinecap="round" strokeLinejoin="round">
              {isTricyclic ? (
                // Tricyclic core design
                <g>
                  {/* Left Benzene */}
                  <polygon points="50,110 70,95 90,110 90,135 70,150 50,135" fill="none" stroke="#e4e4e7" strokeWidth="2" />
                  <line x1="70" y1="99" x2="86" y2="111" stroke="#a1a1aa" strokeWidth="1.5" />
                  <line x1="86" y1="133" x2="70" y2="146" stroke="#a1a1aa" strokeWidth="1.5" />
                  <line x1="54" y1="133" x2="54" y2="113" stroke="#a1a1aa" strokeWidth="1.5" />

                  {/* Middle Ring (7-membered) */}
                  <polygon points="90,110 120,95 150,110 150,135 120,150 90,135" fill="none" stroke="#e4e4e7" strokeWidth="2" />
                  
                  {/* Heteroatom or double bond indicator in center */}
                  {molecule.class.includes('Atípico') ? (
                    <g>
                      <circle cx="120" cy="95" r="7" fill="#3b82f6" />
                      <text x="120" y="98" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">N</text>
                    </g>
                  ) : (
                    <line x1="110" y1="100" x2="130" y2="100" stroke="#a1a1aa" strokeWidth="1.5" />
                  )}

                  {/* Right Benzene */}
                  <polygon points="150,110 170,95 190,110 190,135 170,150 150,135" fill="none" stroke="#e4e4e7" strokeWidth="2" />
                  <line x1="154" y1="111" x2="170" y2="99" stroke="#a1a1aa" strokeWidth="1.5" />
                  <line x1="186" y1="113" x2="186" y2="133" stroke="#a1a1aa" strokeWidth="1.5" />
                  <line x1="170" y1="146" x2="154" y2="133" stroke="#a1a1aa" strokeWidth="1.5" />

                  {/* Linker chain down from middle ring */}
                  <line x1="120" y1="150" x2="120" y2="175" stroke="#e4e4e7" strokeWidth="2" />
                  <line x1="120" y1="175" x2="140" y2="190" stroke="#e4e4e7" strokeWidth="2" />
                  
                  {/* Terminal group */}
                  <circle cx="140" cy="190" r="8" fill="#3b82f6" />
                  <text x="140" y="193" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">N</text>

                  {/* Dimethyl substituents */}
                  <line x1="140" y1="190" x2="160" y2="180" stroke="#e4e4e7" strokeWidth="2" />
                  <text x="165" y="178" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>
                  
                  <line x1="140" y1="190" x2="150" y2="210" stroke="#e4e4e7" strokeWidth="2" />
                  <text x="153" y="218" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>
                </g>
              ) : (
                // Heterocyclic Core + Aryl template (ISRS, Ansioliticos, etc.)
                <g>
                  {/* Fused benzene ring */}
                  <polygon points="50,120 70,105 90,120 90,145 70,160 50,145" fill="none" stroke="#e4e4e7" strokeWidth="2" />
                  <line x1="70" y1="109" x2="86" y2="121" stroke="#a1a1aa" strokeWidth="1.5" />
                  <line x1="86" y1="143" x2="70" y2="156" stroke="#a1a1aa" strokeWidth="1.5" />
                  <line x1="54" y1="143" x2="54" y2="123" stroke="#a1a1aa" strokeWidth="1.5" />

                  {/* Heterocycle linkage */}
                  <line x1="90" y1="132" x2="115" y2="132" stroke="#e4e4e7" strokeWidth="2" />
                  <circle cx="115" cy="132" r="8" fill="#ef4444" />
                  <text x="115" y="135" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">O</text>

                  {/* Aliphatic chain */}
                  <line x1="115" y1="132" x2="140" y2="147" stroke="#e4e4e7" strokeWidth="2" />
                  <line x1="140" y1="147" x2="165" y2="132" stroke="#e4e4e7" strokeWidth="2" />

                  {/* Amine nitrogen */}
                  <circle cx="165" cy="132" r="8" fill="#3b82f6" />
                  <text x="165" y="135" textAnchor="middle" fill="#fff" className="font-mono text-[9px] font-bold">N</text>
                  
                  {/* Methyl substituent */}
                  <line x1="165" y1="132" x2="185" y2="147" stroke="#e4e4e7" strokeWidth="2" />
                  <text x="190" y="153" fill="#a1a1aa" className="font-mono text-[8px]">CH₃</text>
                  
                  {/* Fluorine or Chlorine badge */}
                  <line x1="50" y1="120" x2="30" y2="110" stroke="#3b82f6" strokeWidth="1.5" />
                  <circle cx="30" cy="110" r="6" fill="#3b82f6" />
                  <text x="30" y="112" textAnchor="middle" fill="#fff" className="font-mono text-[7px] font-bold">F</text>
                </g>
              )}
            </g>
          ),
          description: `Esqueleto químico representativo do grupo farmacológico ${molecule.class}. O arranjo conformacional dita a seletividade e potência da ${molecule.name} perante as proteínas e enzimas alvo.`,
          highlights: [
            { name: "Anel Aromático Lipofílico", detail: "Penetra a barreira hematoencefálica (BHE) e ancora nos bolsos hidrofóbicos do receptor." },
            { name: "Grupo Nitrogenado Polar", detail: "Interage por pontes salinas com os resíduos de aminoácidos ácidos dos alvos biológicos centrais." }
          ]
        };
    }
  };

  const data = getStructureData(molecule.id, molecule.name);

  return (
    <div className="bg-zinc-900/35 border border-zinc-800/80 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden flex flex-col h-auto shadow-lg group/viewer">
      
      {/* Background blueprint elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-[size:16px_16px] opacity-20 pointer-events-none" />
      <div className="absolute top-2 right-3 font-mono text-[8px] text-zinc-600 select-none tracking-widest uppercase">
        System Skeletal Ref: {molecule.id.toUpperCase()}
      </div>

      <div className="flex items-center gap-2 mb-4 border-b border-zinc-800 pb-3">
        <FlaskConical className="w-4 h-4 text-amber-400" />
        <h4 className="font-bold tracking-widest text-zinc-100 uppercase text-xs">
          Estrutura Molecular 2D
        </h4>
        <span className="ml-auto text-[9px] font-mono text-zinc-500 bg-zinc-800/50 px-2 py-0.5 rounded border border-zinc-700/30 flex items-center gap-1">
          <ZoomIn className="w-2.5 h-2.5" /> Vetorial
        </span>
      </div>

      {/* SVG Canvas Container */}
      <div className="h-[200px] flex items-center justify-center bg-zinc-950/40 rounded-xl border border-zinc-900/80 p-2 relative overflow-hidden">
        {/* Decorative corner reticles */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-zinc-800" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-zinc-800" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-zinc-800" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-zinc-800" />

        <svg viewBox="0 0 220 200" className="w-full h-[200px] drop-shadow-[0_0_15px_rgba(251,191,36,0.04)] hover:scale-102 transition-transform duration-300">
          <defs>
            <radialGradient id="lithiumGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff" />
              <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </radialGradient>
          </defs>
          {data.svg}
        </svg>
      </div>

      {/* Dynamic structural footnotes */}
      <div className="mt-4 space-y-3 relative z-10">
        <p className="text-[11px] text-zinc-500 leading-relaxed font-sans bg-zinc-950/20 border border-zinc-900 p-2.5 rounded-lg">
          {data.description}
        </p>

        {/* Highlights display */}
        <div className="grid grid-cols-2 gap-2">
          {data.highlights.map((hl, i) => (
            <div 
              key={i} 
              className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-2 transition-all hover:bg-zinc-850 cursor-help"
              title={hl.detail}
            >
              <div className="text-[9px] font-bold text-amber-400 font-mono flex items-center gap-1 uppercase">
                <Info className="w-2.5 h-2.5 shrink-0 text-zinc-500" />
                {hl.name}
              </div>
              <div className="text-[9px] text-zinc-500 line-clamp-2 mt-0.5 leading-snug">
                {hl.detail}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
