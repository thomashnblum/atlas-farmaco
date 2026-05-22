import fs from 'fs';
import path from 'path';
import { molecules, receptors, enzymes, pdInteractions, pkInteractions } from '../src/data/mockData';

const escapeSql = (str: string | undefined | null) => {
  if (str === undefined || str === null) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
};

const arrayToSql = (arr: string[] | undefined) => {
  if (!arr || arr.length === 0) return "'{}'";
  const escaped = arr.map(s => `"${s.replace(/"/g, '""')}"`).join(',');
  return `'{${escaped}}'`;
};

const jsonToSql = (obj: any) => {
  if (!obj) return "'{}'::jsonb";
  return `'${JSON.stringify(obj).replace(/'/g, "''")}'::jsonb`;
};

let sql = `-- SCRIPT DE POPULAÇÃO DO BANCO DE DADOS (SEED)\n\n`;

// Moléculas
sql += `\n-- 1. Inserindo Moléculas\n`;
sql += `INSERT INTO molecules (id, name, trade_names, class, clinical_axes, mechanisms, notes, side_effects, contraindications, routes, psychiatry_use, off_label_uses, on_label_uses, profile_symbols) VALUES \n`;
const molValues = molecules.map(m => {
  return `(${escapeSql(m.id)}, ${escapeSql(m.name)}, ${arrayToSql(m.tradeNames)}, ${escapeSql(m.class)}, ${arrayToSql(m.clinicalAxes)}, ${escapeSql(m.mechanisms)}, ${escapeSql(m.notes)}, ${arrayToSql(m.sideEffects)}, ${arrayToSql(m.contraindications)}, ${arrayToSql(m.routes)}, ${escapeSql(m.psychiatryUse)}, ${jsonToSql(m.offLabelUses)}, ${jsonToSql(m.onLabelUses)}, ${arrayToSql(m.profileSymbols)})`;
});
sql += molValues.join(',\n') + `\nON CONFLICT (id) DO NOTHING;\n`;

// Receptores
sql += `\n-- 2. Inserindo Receptores\n`;
sql += `INSERT INTO receptors (id, name, type, neurotransmitter_system, description) VALUES \n`;
const recValues = receptors.map(r => {
  return `(${escapeSql(r.id)}, ${escapeSql(r.name)}, ${escapeSql(r.type)}, ${escapeSql(r.neurotransmitterSystem)}, ${escapeSql(r.description)})`;
});
sql += recValues.join(',\n') + `\nON CONFLICT (id) DO NOTHING;\n`;

// Enzimas
sql += `\n-- 3. Inserindo Enzimas\n`;
sql += `INSERT INTO enzymes (id, name, description, location) VALUES \n`;
const enzValues = enzymes.map(e => {
  return `(${escapeSql(e.id)}, ${escapeSql(e.name)}, ${escapeSql(e.description)}, ${escapeSql(e.location)})`;
});
sql += enzValues.join(',\n') + `\nON CONFLICT (id) DO NOTHING;\n`;

// PD Interactions
sql += `\n-- 4. Inserindo Interações Farmacodinâmicas\n`;
sql += `INSERT INTO pd_interactions (molecule_id, receptor_id, action_type, affinity_ki, notes, sources) VALUES \n`;
const pdValues = pdInteractions.map(pd => {
  return `(${escapeSql(pd.moleculeId)}, ${escapeSql(pd.receptorId)}, ${escapeSql(pd.actionType)}, ${pd.affinityKi !== null && pd.affinityKi !== undefined ? pd.affinityKi : 'NULL'}, ${escapeSql(pd.notes)}, ${arrayToSql(pd.sources)})`;
});
sql += pdValues.join(',\n') + `\nON CONFLICT (molecule_id, receptor_id) DO NOTHING;\n`;

// PK Interactions
sql += `\n-- 5. Inserindo Interações Farmacocinéticas\n`;
sql += `INSERT INTO pk_interactions (molecule_id, enzyme_id, role, notes, sources) VALUES \n`;
const pkValues = pkInteractions.map(pk => {
  return `(${escapeSql(pk.moleculeId)}, ${escapeSql(pk.enzymeId)}, ${escapeSql(pk.role)}, ${escapeSql(pk.notes)}, ${arrayToSql(pk.sources)})`;
});
sql += pkValues.join(',\n') + `\nON CONFLICT (molecule_id, enzyme_id) DO NOTHING;\n`;

fs.writeFileSync(path.join(process.cwd(), 'scripts', 'seed.sql'), sql);
console.log('Arquivo seed.sql gerado com sucesso!');
