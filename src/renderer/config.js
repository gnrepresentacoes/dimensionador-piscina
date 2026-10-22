/* Configuracao: marca, fatores, catalogo, motobombas e clima. Editavel. */
window.DIM_CONFIG = {
 "marca": {
  "nome": "GN Representações",
  "fabricante": "Syllent",
  "titulo": "Dimensionador de bomba de calor",
  "subtitulo": ""
 },
 "fatores": {
  "capa": {
   "sim": 1.01,
   "nao": 1.1
  },
  "tipo": {
   "aberta": 1.1,
   "fechada": 1.03
  },
  "vento": {
   "fraco": 1.05,
   "moderado": 1.15,
   "forte": 1.3
  },
  "acessorioKcal": {
   "cascata": 2000,
   "prainha": 2000,
   "infinita": 2000
  }
 },
 "constantes": {
  "btuPorKcal": 3.96567,
  "kcalPorKwh": 860,
  "maxMaquinas": 13,
  "limiteHorasDia": 8,
  "limitePrimeiroAquecH": 48,
  "alturaManometricaPadrao": 8,
  "alturasManometricas": [4, 6, 8, 10, 12, 14],
  "horasRecirculacaoPadrao": 8
 },
 "modelos": [
  {
   "id": "sbc025-evolve",
   "nome": "SBC025/EV EVOLVE",
   "linha": "Evolve",
   "btu": 26000,
   "kw": 1.55,
   "vazao": 2.8
  },
  {
   "id": "sbc035-evolve",
   "nome": "SBC035/EV EVOLVE",
   "linha": "Evolve",
   "btu": 32400,
   "kw": 1.78,
   "vazao": 3
  },
  {
   "id": "sbc045-evolve",
   "nome": "SBC045/EV EVOLVE",
   "linha": "Evolve",
   "btu": 44300,
   "kw": 2.03,
   "vazao": 4.5
  },
  {
   "id": "sbc025-evpro",
   "nome": "SBC025/EVPRO",
   "linha": "Evolve Pro",
   "btu": 26200,
   "kw": 1.55,
   "vazao": 2.5
  },
  {
   "id": "sbc035-evpro",
   "nome": "SBC035/EVPRO",
   "linha": "Evolve Pro",
   "btu": 34100,
   "kw": 1.78,
   "vazao": 3.5
  },
  {
   "id": "sbc045-evpro",
   "nome": "SBC045/EVPRO",
   "linha": "Evolve Pro",
   "btu": 45000,
   "kw": 2.03,
   "vazao": 4.5
  },
  {
   "id": "sbc060-evpro",
   "nome": "SBC060/EVPRO",
   "linha": "Evolve Pro",
   "btu": 58300,
   "kw": 2.6,
   "vazao": 5.5
  },
  {
   "id": "sbc075-evpro",
   "nome": "SBC075/EVPRO",
   "linha": "Evolve Pro",
   "btu": 71600,
   "kw": 3.2,
   "vazao": 6.5
  },
  {
   "id": "sbc100-evpro",
   "nome": "SBC100/EVPRO",
   "linha": "Evolve Pro",
   "btu": 96200,
   "kw": 4.45,
   "vazao": 9
  },
  {
   "id": "sbc120-evpro",
   "nome": "SBC120/EVPRO",
   "linha": "Evolve Pro",
   "btu": 120000,
   "kw": 4.76,
   "vazao": 12
  }
 ],
 "motobombas": [
  { "id": "pf-025", "linha": "Pré-Filtro Autoescorvante", "cv": "1/4", "modelo220": "PF42M025-220/AS", "modelo120": "PF42M025-120/AS", "fase": "monofásica", "mcaMax": 9.0, "kg": 6.5, "filtro": "SYL 200",
   "vazao": { "2": 12.8, "4": 10.7, "6": 7.5, "8": 4.0, "10": 0 } },
  { "id": "pf-033", "linha": "Pré-Filtro Autoescorvante", "cv": "1/3", "modelo220": "PF42M033-220/AS", "modelo120": "PF42M033-120/AS", "fase": "monofásica", "mcaMax": 10.0, "kg": 6.7, "filtro": "SYL 300",
   "vazao": { "2": 13.3, "4": 11.1, "6": 8.4, "8": 5.3, "10": 0 } },
  { "id": "pf-050", "linha": "Pré-Filtro Autoescorvante", "cv": "1/2", "modelo220": "PF42M050-220/AS", "modelo120": "PF42M050-120/AS", "fase": "monofásica", "mcaMax": 11.2, "kg": 7.0, "filtro": "SYL 400",
   "vazao": { "2": 18.2, "4": 14.2, "6": 11.1, "8": 8.4, "10": 4.5, "12": 0 } },
  { "id": "pf-075", "linha": "Pré-Filtro Autoescorvante", "cv": "3/4", "modelo220": "PF42M075-220/AS", "modelo120": "PF42M075-120/AS", "fase": "monofásica", "mcaMax": 14.5, "kg": 8.3, "filtro": "SYL 500",
   "vazao": { "4": 18.6, "6": 16.0, "8": 13.2, "10": 10.1, "12": 6.4, "14": 2.1, "16": 0 } },
  { "id": "pf-100", "linha": "Pré-Filtro Autoescorvante", "cv": "1,0", "modelo220": "PF42M100-220/AS", "modelo120": "PF42M100-120/AS", "fase": "monofásica", "mcaMax": 15.8, "kg": 8.9, "filtro": "SYL 600",
   "vazao": { "4": 19.5, "6": 17.5, "8": 14.9, "10": 11.7, "12": 8.3, "14": 4.5, "16": 0 } },
  { "id": "pf-150", "linha": "Pré-Filtro Autoescorvante", "cv": "1,5", "modelo220": "PF42M150-220/AS", "modelo120": "PF42M150-120/AS", "fase": "monofásica", "mcaMax": 18.5, "kg": 9.3, "filtro": "SYL 750",
   "vazao": { "4": 20.5, "6": 19.0, "8": 17.1, "10": 14.3, "12": 11.6, "14": 8.4, "16": 5.1, "18": 1.8, "20": 0 } },
  { "id": "pf-200", "linha": "Pré-Filtro Autoescorvante", "cv": "2,0", "modelo220": "PF48M200-220/AS", "modelo120": "", "fase": "monofásica", "mcaMax": 19.0, "kg": 15.8, "filtro": "SYL 750",
   "vazao": { "4": 36.5, "6": 32.8, "8": 28.4, "10": 24.7, "12": 20.8, "14": 14.9, "16": 8.7, "18": 2.4, "20": 0 } },
  { "id": "pf-300", "linha": "Pré-Filtro Autoescorvante", "cv": "3,0", "modelo220": "PF48M300-220/AS", "modelo120": "", "fase": "monofásica", "mcaMax": 21.6, "kg": 15.8, "filtro": "SYL 1000",
   "vazao": { "4": 44.1, "6": 41.0, "8": 37.9, "10": 34.4, "12": 30.7, "14": 26.8, "16": 22.2, "18": 17.3, "20": 10.2, "22": 0 } },
  { "id": "pf-075t", "linha": "Pré-Filtro Autoescorvante", "cv": "3/4", "modelo220": "PF42T075-220/AST", "modelo120": "PF42T075-380/AST (380 V)", "fase": "trifásica", "mcaMax": 14.0, "kg": 9.7, "filtro": "SYL 500",
   "vazao": { "2": 18.6, "4": 17.0, "6": 14.9, "8": 12.3, "10": 9.0, "12": 5.2, "14": 0 } },
  { "id": "pf-100t", "linha": "Pré-Filtro Autoescorvante", "cv": "1,0", "modelo220": "PF42T100-220/AST", "modelo120": "PF42T100-380/AST (380 V)", "fase": "trifásica", "mcaMax": 15.3, "kg": 10.3, "filtro": "SYL 600",
   "vazao": { "2": 20.4, "4": 18.9, "6": 16.6, "8": 13.9, "10": 10.7, "12": 7.2, "14": 3.0, "16": 0 } },
  { "id": "pf-200t", "linha": "Pré-Filtro Autoescorvante", "cv": "2,0", "modelo220": "PF48T200-220/AST", "modelo120": "PF48T200-380/AST (380 V)", "fase": "trifásica", "mcaMax": 19.0, "kg": 15.5, "filtro": "SYL 750",
   "vazao": { "4": 36.5, "6": 32.8, "8": 28.4, "10": 24.7, "12": 20.8, "14": 14.9, "16": 8.7, "18": 2.4, "20": 0 } },
  { "id": "pf-300t", "linha": "Pré-Filtro Autoescorvante", "cv": "3,0", "modelo220": "PF48T300-220/AST", "modelo120": "PF48T300-380/AST (380 V)", "fase": "trifásica", "mcaMax": 21.6, "kg": 15.8, "filtro": "SYL 1000",
   "vazao": { "4": 44.1, "6": 41.0, "8": 37.8, "10": 34.4, "12": 30.7, "14": 26.8, "16": 22.2, "18": 17.3, "20": 10.2, "22": 0 } }
 ],
 "cloro": {
  "linha": "EcoChlor",
  "concentracaoBase": 2.6,
  "horasFiltracaoPadrao": 6,
  "fatores": { "aquecida": 0.3, "aberta": 0.3, "uso": { "familiar": 0, "condominio": 0.3, "academia": 0.5, "clube": 1 } },
  "usos": { "familiar": "Familiar", "condominio": "Condomínio / temporada", "academia": "Academia", "clube": "Clube" },
  "faixas": [
   { "min": 0, "max": 6, "qtd": 1, "modelo": "SEC18" },
   { "min": 7, "max": 12, "qtd": 1, "modelo": "SEC35" },
   { "min": 13, "max": 18, "qtd": 1, "modelo": "SEC50" },
   { "min": 19, "max": 24, "qtd": 1, "modelo": "SEC68" },
   { "min": 25, "max": 30, "qtd": 1, "modelo": "SEC85" },
   { "min": 31, "max": 36, "qtd": 1, "modelo": "SEC102" },
   { "min": 37, "max": 42, "qtd": 1, "modelo": "SEC127" },
   { "min": 43, "max": 48, "qtd": 2, "modelo": "SEC68" },
   { "min": 49, "max": 60, "qtd": 2, "modelo": "SEC85" },
   { "min": 61, "max": 72, "qtd": 2, "modelo": "SEC102" },
   { "min": 73, "max": 84, "qtd": 2, "modelo": "SEC127" },
   { "min": 85, "max": 90, "qtd": 3, "modelo": "SEC85" },
   { "min": 91, "max": 108, "qtd": 3, "modelo": "SEC102" },
   { "min": 109, "max": 126, "qtd": 3, "modelo": "SEC127" }
  ],
  "fonte": "Planilha Dimensionamento Gerador Syllent V2 04.26 (revenda)"
 },
 "motobombasFonte": "Syllent · folder Linha Piscina, Pré-Filtro Autoescorvante, abril/2025 (vazão em m³/h por altura manométrica total, 60 Hz); filtro de areia conforme a tabela de conjuntos do mesmo folder",
 "clima": {
  "AC": {
   "ref": "Rio Branco",
   "t": [
    25.3,
    25.11,
    25.06,
    24.9,
    24.37,
    24.26,
    24.86,
    26.63,
    28.02,
    27.87,
    26.65,
    25.61
   ]
  },
  "AL": {
   "ref": "Maceió",
   "t": [
    27.03,
    27.25,
    27.44,
    27.17,
    26.3,
    25.25,
    24.4,
    24.18,
    24.7,
    25.65,
    26.49,
    26.98
   ]
  },
  "AM": {
   "ref": "Manaus",
   "t": [
    26.47,
    26.21,
    26.17,
    26.13,
    26.18,
    26,
    26.27,
    27.55,
    28.95,
    29.16,
    28.41,
    27.09
   ]
  },
  "AP": {
   "ref": "Macapá",
   "t": [
    26.38,
    25.72,
    25.71,
    25.67,
    25.82,
    25.65,
    25.71,
    26.23,
    27.05,
    28.44,
    28.87,
    27.69
   ]
  },
  "BA": {
   "ref": "Salvador",
   "t": [
    26.97,
    27.15,
    27.27,
    26.65,
    25.42,
    24.33,
    23.51,
    23.43,
    24.2,
    25.42,
    26.28,
    26.85
   ]
  },
  "CE": {
   "ref": "Fortaleza",
   "t": [
    27.5,
    27.39,
    27.33,
    27.19,
    27.22,
    26.71,
    26.43,
    26.63,
    27.01,
    27.43,
    27.74,
    27.85
   ]
  },
  "DF": {
   "ref": "Brasília",
   "t": [
    22.39,
    22.34,
    22.11,
    21.48,
    20.21,
    19.67,
    20.16,
    22.27,
    24.85,
    25.18,
    23.21,
    22.6
   ]
  },
  "ES": {
   "ref": "Vitória",
   "t": [
    24.05,
    24.28,
    24.07,
    22.98,
    21.02,
    20.14,
    19.55,
    19.94,
    20.99,
    22.31,
    22.73,
    23.61
   ]
  },
  "GO": {
   "ref": "Goiânia",
   "t": [
    23.31,
    23.23,
    23.07,
    22.4,
    20.56,
    20.18,
    20.88,
    23.48,
    26.27,
    26.13,
    24.17,
    23.58
   ]
  },
  "MA": {
   "ref": "São Luís",
   "t": [
    27.15,
    26.59,
    26.43,
    26.38,
    26.66,
    26.58,
    26.64,
    27.51,
    28.02,
    28.17,
    28.26,
    28.03
   ]
  },
  "MG": {
   "ref": "Belo Horizonte",
   "t": [
    21.56,
    21.42,
    21.09,
    20.15,
    18.36,
    17.65,
    17.57,
    18.91,
    21.02,
    22.34,
    21.49,
    21.48
   ]
  },
  "MS": {
   "ref": "Campo Grande",
   "t": [
    25.06,
    25.05,
    24.84,
    23.45,
    20.08,
    19.32,
    19.42,
    21.59,
    24.19,
    25.45,
    25.3,
    25.46
   ]
  },
  "MT": {
   "ref": "Cuiabá",
   "t": [
    26.65,
    26.41,
    26.45,
    25.76,
    24.09,
    24.03,
    24.58,
    27.25,
    29.54,
    29.47,
    28.1,
    27.1
   ]
  },
  "PA": {
   "ref": "Belém",
   "t": [
    26.24,
    25.87,
    25.94,
    26.03,
    26.3,
    26.36,
    26.4,
    27.31,
    28.47,
    28.79,
    28.76,
    27.6
   ]
  },
  "PB": {
   "ref": "João Pessoa",
   "t": [
    27.52,
    27.65,
    27.59,
    27.16,
    26.38,
    25.32,
    24.52,
    24.5,
    25.27,
    26.39,
    27.17,
    27.59
   ]
  },
  "PE": {
   "ref": "Recife",
   "t": [
    27.13,
    27.32,
    27.38,
    26.96,
    26.18,
    25.09,
    24.28,
    24.11,
    24.7,
    25.75,
    26.65,
    27.14
   ]
  },
  "PI": {
   "ref": "Teresina",
   "t": [
    27.35,
    26.3,
    26.15,
    25.91,
    26.32,
    26.86,
    27.82,
    29.21,
    30.69,
    31.29,
    30.81,
    29.58
   ]
  },
  "PR": {
   "ref": "Curitiba",
   "t": [
    21.37,
    21.44,
    20.57,
    18.72,
    15.33,
    13.96,
    13.57,
    14.76,
    16.54,
    18.34,
    19.22,
    20.89
   ]
  },
  "RJ": {
   "ref": "Rio de Janeiro",
   "t": [
    25.67,
    25.83,
    25.41,
    24.32,
    22.31,
    21.51,
    20.95,
    21.25,
    21.96,
    22.93,
    23.43,
    24.71
   ]
  },
  "RN": {
   "ref": "Natal",
   "t": [
    27.38,
    27.69,
    27.85,
    27.77,
    27.48,
    26.71,
    25.99,
    25.8,
    26.03,
    26.54,
    26.97,
    27.31
   ]
  },
  "RO": {
   "ref": "Porto Velho",
   "t": [
    25.65,
    25.6,
    25.6,
    25.64,
    25.34,
    25.39,
    26.43,
    28.32,
    28.97,
    28.24,
    27.2,
    26.1
   ]
  },
  "RR": {
   "ref": "Boa Vista",
   "t": [
    29.4,
    29.99,
    30.41,
    28.99,
    26.88,
    26.07,
    25.93,
    26.48,
    27.3,
    28.14,
    28.59,
    28.74
   ]
  },
  "RS": {
   "ref": "Porto Alegre",
   "t": [
    24.47,
    24.63,
    23.25,
    20.5,
    16.6,
    14.48,
    13.57,
    15.11,
    16.65,
    19.07,
    20.82,
    23.01
   ]
  },
  "SC": {
   "ref": "Florianópolis",
   "t": [
    24.43,
    24.63,
    23.72,
    21.73,
    18.52,
    16.75,
    15.89,
    16.6,
    17.83,
    19.71,
    21.23,
    23.23
   ]
  },
  "SE": {
   "ref": "Aracaju",
   "t": [
    27.12,
    27.39,
    27.65,
    27.48,
    26.69,
    25.76,
    24.94,
    24.67,
    25.15,
    25.91,
    26.47,
    26.9
   ]
  },
  "SP": {
   "ref": "São Paulo",
   "t": [
    22.31,
    22.39,
    21.57,
    20.01,
    17.12,
    16.3,
    15.91,
    17.22,
    19.15,
    20.73,
    20.91,
    22.09
   ]
  },
  "TO": {
   "ref": "Palmas",
   "t": [
    25.66,
    25.42,
    25.55,
    25.55,
    25.42,
    24.69,
    25.34,
    27.31,
    29.45,
    29.07,
    27.2,
    26.29
   ]
  }
 }
};
