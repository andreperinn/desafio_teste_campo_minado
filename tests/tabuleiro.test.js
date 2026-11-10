const CampoMinado = require('../src/CampoMinado');
const { LINHAS, COLUNAS, paraCadaCasa, minasNoRodape } = require('./helpers/tabuleiros');

describe('Criação do tabuleiro', () => {
  let jogo;

  beforeEach(() => {
    jogo = new CampoMinado();
  });

  test('CT01 - o tabuleiro deve ter 18 linhas e 14 colunas', () => {
    expect(jogo.linhas).toBe(18);
    expect(jogo.colunas).toBe(14);
  });

  test('CT02 - o tabuleiro deve ter 40 minas', () => {
    expect(jogo.totalMinas).toBe(40);
    expect(jogo.obterMinas()).toHaveLength(40);
  });

  test('CT03 - a partida deve começar com o estado "jogando"', () => {
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT04 - todas as 252 casas devem começar ocultas', () => {
    paraCadaCasa((l, c) => {
      expect(jogo.estaRevelada(l, c)).toBe(false);
    });
  });

  test('CT05 - nenhuma casa deve começar com bandeira e devem restar 40 bandeiras', () => {
    paraCadaCasa((l, c) => {
      expect(jogo.temBandeira(l, c)).toBe(false);
    });
    expect(jogo.bandeirasRestantes()).toBe(40);
  });

  test('CT06 - a visão inicial do tabuleiro deve ser uma matriz 18 x 14 só com "#"', () => {
    const visao = jogo.tabuleiroVisivel();

    expect(visao).toHaveLength(LINHAS);
    visao.forEach((linha) => {
      expect(linha).toHaveLength(COLUNAS);
      linha.forEach((casa) => expect(casa).toBe('#'));
    });
  });

  test('CT07 - alterar a matriz retornada por tabuleiroVisivel não deve alterar o jogo', () => {
    const jogoFixo = new CampoMinado({ minas: minasNoRodape() });
    const visao = jogoFixo.tabuleiroVisivel();

    visao[0][0] = '0';
    visao[15][0] = '*';

    expect(jogoFixo.tabuleiroVisivel()[0][0]).toBe('#');
    expect(jogoFixo.tabuleiroVisivel()[15][0]).toBe('#');
    expect(jogoFixo.estaRevelada(0, 0)).toBe(false);
  });
});
