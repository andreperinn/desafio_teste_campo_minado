const CampoMinado = require('../src/CampoMinado');
const { minasNoRodape, paraCadaCasa } = require('./helpers/tabuleiros');

describe('Derrota', () => {
  let jogo;

  beforeEach(() => {
    jogo = new CampoMinado({ minas: minasNoRodape() });
  });

  test('CT39 - revelar uma mina, mesmo na primeira jogada, deve encerrar com derrota', () => {
    jogo.revelar(15, 0);

    expect(jogo.obterEstado()).toBe('derrota');
  });

  test('CT40 - na derrota todas as minas devem ser reveladas', () => {
    jogo.revelar(16, 7);
    const visao = jogo.tabuleiroVisivel();

    minasNoRodape().forEach(([l, c]) => {
      expect(jogo.estaRevelada(l, c)).toBe(true);
      expect(visao[l][c]).toBe('*');
    });
  });

  test('CT41 - na derrota as casas seguras ainda não abertas devem continuar ocultas', () => {
    jogo.revelar(15, 0);
    const visao = jogo.tabuleiroVisivel();

    expect(jogo.estaRevelada(0, 0)).toBe(false);
    expect(jogo.estaRevelada(17, 12)).toBe(false);
    expect(visao[0][0]).toBe('#');
    expect(visao[17][13]).toBe('#');
  });

  test('CT42 - depois da derrota, revelar deve lançar erro e o estado não deve mudar', () => {
    jogo.revelar(15, 0);

    expect(() => jogo.revelar(0, 0)).toThrow();
    expect(jogo.estaRevelada(0, 0)).toBe(false);
    expect(jogo.obterEstado()).toBe('derrota');
  });

  test('CT43 - depois da derrota, alternarBandeira deve lançar erro', () => {
    jogo.revelar(15, 0);

    expect(() => jogo.alternarBandeira(0, 0)).toThrow();
    expect(jogo.temBandeira(0, 0)).toBe(false);
  });
});

describe('Vitória', () => {
  let jogo;

  beforeEach(() => {
    jogo = new CampoMinado({ minas: minasNoRodape() });
  });

  test('CT44 - revelar todas as 212 casas sem mina deve dar vitória', () => {
    jogo.revelar(0, 0);
    jogo.revelar(17, 12);
    jogo.revelar(17, 13);

    expect(jogo.obterEstado()).toBe('vitoria');
  });

  test('CT45 - enquanto existir casa sem mina oculta a partida deve continuar', () => {
    jogo.revelar(0, 0);
    jogo.revelar(17, 12);

    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT46 - marcar todas as minas com bandeira não deve dar vitória', () => {
    minasNoRodape().forEach(([l, c]) => jogo.alternarBandeira(l, c));

    expect(jogo.bandeirasRestantes()).toBe(0);
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT47 - a vitória deve acontecer mesmo com bandeiras colocadas sobre minas', () => {
    jogo.alternarBandeira(15, 0);
    jogo.alternarBandeira(17, 11);

    jogo.revelar(0, 0);
    jogo.revelar(17, 12);
    jogo.revelar(17, 13);

    expect(jogo.obterEstado()).toBe('vitoria');
  });

  test('CT48 - depois da vitória, revelar deve lançar erro e o estado não deve mudar', () => {
    jogo.revelar(0, 0);
    jogo.revelar(17, 12);
    jogo.revelar(17, 13);

    expect(() => jogo.revelar(15, 0)).toThrow();
    expect(jogo.obterEstado()).toBe('vitoria');
  });

  test('CT49 - depois da vitória, alternarBandeira deve lançar erro', () => {
    jogo.revelar(0, 0);
    jogo.revelar(17, 12);
    jogo.revelar(17, 13);

    expect(() => jogo.alternarBandeira(15, 0)).toThrow();
  });

  test('CT50 - em um tabuleiro sorteado, abrir todas as casas sem mina deve dar vitória', () => {
    const sorteado = new CampoMinado();

    paraCadaCasa((l, c) => {
      if (!sorteado.temMina(l, c) && !sorteado.estaRevelada(l, c)) {
        expect(sorteado.obterEstado()).toBe('jogando');
        sorteado.revelar(l, c);
      }
    });

    expect(sorteado.obterEstado()).toBe('vitoria');
  });
});
