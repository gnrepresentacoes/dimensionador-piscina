# Dimensionador de Bomba de Calor · GN Representações

Programa de desktop (Windows, offline) para dimensionar bomba de calor de piscina e gerar um PDF
de uma página para enviar ao cliente. Catálogo Syllent, lógica da planilha técnica.

## Como usar

1. Preencha cliente, piscina e condições de uso. O cálculo e a prévia do PDF atualizam na hora.
2. Em **Equipamento**, a primeira linha é a seleção automática; clique em outra para usá-la no PDF.
3. **Gerar PDF** salva o arquivo na pasta configurada (padrão `Documentos\Dimensionamentos`).
   Clique no caminho da pasta, no rodapé da prévia, para trocar.
4. O número do orçamento avança sozinho a cada PDF gerado; os últimos dados da piscina ficam
   guardados para o próximo atendimento.

## Regras de negócio

Tudo fica em `src/renderer/config.js` e pode ser editado sem mexer no restante:

- `marca`: nome e fabricante exibidos.
- `fatores`: capa (1,01 / 1,10), tipo (aberta 1,10 / fechada 1,03), vento (1,05 / 1,15 / 1,30),
  acessórios (2.000 kcal por m² de prainha ou borda, por metro de cascata ou borda).
- `constantes`: conversões e critérios de aceite (menos de 8 h/dia e menos de 48 h no primeiro
  aquecimento), máximo de 13 máquinas.
- `modelos`: catálogo com BTU, kW elétrico e vazão. Troque aqui para outros produtos.
- `motobombas`: vazão por altura manométrica.
- `clima`: temperatura média mensal do ar por UF (capital), usada na projeção de custo anual.

Fórmula: `kcal = ΔT × litros × fator capa × fator tipo × fator vento + acessórios`. A seleção
percorre o catálogo de 1 a 13 máquinas e aceita a primeira combinação dentro dos critérios.

## Desenvolvimento

```
npm install
npm start        # abre o programa
npm test         # confere a fórmula, abre o app em modo de teste, gera um PDF e encerra
npm run dist     # gera o instalador em dist/Dimensionador-Setup-<versão>.exe
```

Estrutura: `src/main.js` (janela, PDF via printToPDF, configuração em `%APPDATA%`),
`src/preload.js` (ponte), `src/renderer/` (tela, cálculo puro em `calc.js`), `assets/` (logos),
`build/icon.png` (ícone).
