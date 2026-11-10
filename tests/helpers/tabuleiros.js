// Funções auxiliares usadas pelos casos de teste.
// Elas montam listas de minas em posições conhecidas para que os testes
// sejam determinísticos (sem depender do sorteio aleatório).

const LINHAS = 18;
const COLUNAS = 14;
const TOTAL_MINAS = 40;

/**
 * 40 minas concentradas no rodapé do tabuleiro:
 * - linha 15 inteira (14 minas)
 * - linha 16 inteira (14 minas)
 * - linha 17, colunas 0 a 11 (12 minas)
 *
 * Casas seguras: linhas 0 a 14 (210 casas) + (17,12) e (17,13) = 212 casas.
 * Revelar (0,0) abre em cascata as linhas 0 a 14 inteiras.
 */
function minasNoRodape() {
  const minas = [];
  for (let c = 0; c < COLUNAS; c++) minas.push([15, c]);
  for (let c = 0; c < COLUNAS; c++) minas.push([16, c]);
  for (let c = 0; c < 12; c++) minas.push([17, c]);
  return minas;
}

/**
 * Recebe algumas minas em posições escolhidas pelo teste e completa
 * até 40 minas, preenchendo a partir da última casa (17,13) para trás.
 * Com até 10 minas escolhidas, o preenchimento fica restrito às
 * linhas 15 a 17, sem interferir na parte de cima do tabuleiro.
 */
function completarMinas(minasEscolhidas) {
  const minas = minasEscolhidas.map(([l, c]) => [l, c]);
  const ocupadas = new Set(minas.map(([l, c]) => `${l},${c}`));

  for (let l = LINHAS - 1; l >= 0 && minas.length < TOTAL_MINAS; l--) {
    for (let c = COLUNAS - 1; c >= 0 && minas.length < TOTAL_MINAS; c--) {
      const chave = `${l},${c}`;
      if (!ocupadas.has(chave)) {
        ocupadas.add(chave);
        minas.push([l, c]);
      }
    }
  }
  return minas;
}

/** Lista as coordenadas vizinhas (até 8) de uma casa, dentro do tabuleiro. */
function vizinhos(linha, coluna) {
  const lista = [];
  for (let dl = -1; dl <= 1; dl++) {
    for (let dc = -1; dc <= 1; dc++) {
      if (dl === 0 && dc === 0) continue;
      const l = linha + dl;
      const c = coluna + dc;
      if (l >= 0 && l < LINHAS && c >= 0 && c < COLUNAS) lista.push([l, c]);
    }
  }
  return lista;
}

/** Ordena uma lista de coordenadas para permitir comparação com toEqual. */
function ordenar(coordenadas) {
  return coordenadas
    .map(([l, c]) => [l, c])
    .sort((a, b) => a[0] - b[0] || a[1] - b[1]);
}

/** Conta quantas casas do tabuleiro estão reveladas. */
function contarReveladas(jogo) {
  let total = 0;
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      if (jogo.estaRevelada(l, c)) total++;
    }
  }
  return total;
}

/** Percorre todas as casas do tabuleiro chamando fn(linha, coluna). */
function paraCadaCasa(fn) {
  for (let l = 0; l < LINHAS; l++) {
    for (let c = 0; c < COLUNAS; c++) {
      fn(l, c);
    }
  }
}

module.exports = {
  LINHAS,
  COLUNAS,
  TOTAL_MINAS,
  minasNoRodape,
  completarMinas,
  vizinhos,
  ordenar,
  contarReveladas,
  paraCadaCasa,
};
