const CampoMinado = require('../src/CampoMinado');
const {
  LINHAS,
  COLUNAS,
  minasNoRodape,
  completarMinas,
  vizinhos,
  ordenar,
  paraCadaCasa,
} = require('./helpers/tabuleiros');

describe('Sorteio das minas (modo aleatório)', () => {
  test('CT08 - deve sortear 40 minas em posições diferentes', () => {
    const jogo = new CampoMinado();
    const minas = jogo.obterMinas();
    const unicas = new Set(minas.map(([l, c]) => `${l},${c}`));

    expect(minas).toHaveLength(40);
    expect(unicas.size).toBe(40);
  });

  test('CT09 - todas as minas sorteadas devem estar dentro do tabuleiro', () => {
    const jogo = new CampoMinado();

    jogo.obterMinas().forEach(([l, c]) => {
      expect(Number.isInteger(l)).toBe(true);
      expect(Number.isInteger(c)).toBe(true);
      expect(l).toBeGreaterThanOrEqual(0);
      expect(l).toBeLessThan(LINHAS);
      expect(c).toBeGreaterThanOrEqual(0);
      expect(c).toBeLessThan(COLUNAS);
    });
  });

  test('CT10 - temMina deve ser verdadeiro exatamente nas 40 posições sorteadas', () => {
    const jogo = new CampoMinado();
    const posicoes = new Set(jogo.obterMinas().map(([l, c]) => `${l},${c}`));
    let totalComMina = 0;

    paraCadaCasa((l, c) => {
      const temMina = jogo.temMina(l, c);
      expect(temMina).toBe(posicoes.has(`${l},${c}`));
      if (temMina) totalComMina++;
    });

    expect(totalComMina).toBe(40);
  });

  test('CT11 - partidas diferentes devem ter minas em posições diferentes', () => {
    const disposicoes = new Set();

    for (let i = 0; i < 5; i++) {
      const jogo = new CampoMinado();
      disposicoes.add(JSON.stringify(ordenar(jogo.obterMinas())));
    }

    expect(disposicoes.size).toBeGreaterThan(1);
  });
});

describe('Minas em posições definidas (modo fixo)', () => {
  test('CT12 - deve usar exatamente as 40 posições informadas', () => {
    const minas = minasNoRodape();
    const jogo = new CampoMinado({ minas });

    expect(ordenar(jogo.obterMinas())).toEqual(ordenar(minas));
    expect(jogo.temMina(15, 0)).toBe(true);
    expect(jogo.temMina(17, 11)).toBe(true);
    expect(jogo.temMina(17, 12)).toBe(false);
    expect(jogo.temMina(0, 0)).toBe(false);
  });

  test('CT13 - deve lançar erro se forem informadas menos de 40 minas', () => {
    const minas = minasNoRodape().slice(0, 39);

    expect(() => new CampoMinado({ minas })).toThrow();
  });

  test('CT14 - deve lançar erro se forem informadas mais de 40 minas', () => {
    const minas = [...minasNoRodape(), [0, 0]];

    expect(() => new CampoMinado({ minas })).toThrow();
  });

  test('CT15 - deve lançar erro se houver minas repetidas na mesma posição', () => {
    const minas = minasNoRodape();
    minas[39] = [15, 0];

    expect(() => new CampoMinado({ minas })).toThrow();
  });

  test.each([
    [[18, 0]],
    [[0, 14]],
    [[-1, 0]],
    [[0, -1]],
  ])('CT16 - deve lançar erro se uma mina estiver fora do tabuleiro: %j', (posicaoInvalida) => {
    const minas = minasNoRodape();
    minas[39] = posicaoInvalida;

    expect(() => new CampoMinado({ minas })).toThrow();
  });

  test('CT17 - alterar a lista retornada por obterMinas não deve alterar o jogo', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });
    const lista = jogo.obterMinas();

    lista.length = 0;

    expect(jogo.obterMinas()).toHaveLength(40);
    expect(jogo.temMina(15, 0)).toBe(true);
  });
});

describe('Contagem de minas vizinhas', () => {
  test('CT18 - casa cercada por 8 minas deve indicar 8', () => {
    const jogo = new CampoMinado({
      minas: completarMinas([
        [4, 4], [4, 5], [4, 6],
        [5, 4], [5, 6],
        [6, 4], [6, 5], [6, 6],
      ]),
    });

    expect(jogo.minasVizinhas(5, 5)).toBe(8);
  });

  test('CT19 - canto superior esquerdo com 3 minas vizinhas deve indicar 3', () => {
    const jogo = new CampoMinado({
      minas: completarMinas([[0, 1], [1, 0], [1, 1]]),
    });

    expect(jogo.minasVizinhas(0, 0)).toBe(3);
  });

  test('CT20 - casa na borda superior com 5 minas vizinhas deve indicar 5', () => {
    const jogo = new CampoMinado({
      minas: completarMinas([[0, 6], [0, 8], [1, 6], [1, 7], [1, 8]]),
    });

    expect(jogo.minasVizinhas(0, 7)).toBe(5);
  });

  test('CT21 - casas no canto inferior direito devem considerar só os vizinhos existentes', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    expect(jogo.minasVizinhas(17, 13)).toBe(2);
    expect(jogo.minasVizinhas(17, 12)).toBe(4);
  });

  test('CT22 - casa sem minas ao redor deve indicar 0', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    expect(jogo.minasVizinhas(0, 0)).toBe(0);
    expect(jogo.minasVizinhas(7, 7)).toBe(0);
    expect(jogo.minasVizinhas(13, 13)).toBe(0);
  });

  test('CT23 - a contagem não deve incluir a própria casa', () => {
    const jogo = new CampoMinado({ minas: completarMinas([[5, 5]]) });

    expect(jogo.minasVizinhas(5, 5)).toBe(0);
    expect(jogo.minasVizinhas(4, 4)).toBe(1);
    expect(jogo.minasVizinhas(6, 6)).toBe(1);
  });

  test('CT24 - em um tabuleiro sorteado, cada casa deve contar corretamente as minas das 8 vizinhas', () => {
    const jogo = new CampoMinado();
    const posicoes = new Set(jogo.obterMinas().map(([l, c]) => `${l},${c}`));

    paraCadaCasa((l, c) => {
      const esperado = vizinhos(l, c).filter(([vl, vc]) => posicoes.has(`${vl},${vc}`)).length;
      expect(jogo.minasVizinhas(l, c)).toBe(esperado);
    });
  });
});
