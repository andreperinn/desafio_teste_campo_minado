const CampoMinado = require('../src/CampoMinado');
const {
  COLUNAS,
  minasNoRodape,
  completarMinas,
  contarReveladas,
} = require('./helpers/tabuleiros');

describe('Revelar casas', () => {
  test('CT25 - revelar uma casa numerada deve abrir somente ela', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    jogo.revelar(14, 5);

    expect(jogo.estaRevelada(14, 5)).toBe(true);
    expect(contarReveladas(jogo)).toBe(1);
    expect(jogo.tabuleiroVisivel()[14][5]).toBe('3');
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT26 - revelar uma casa com 0 minas vizinhas deve abrir as vizinhas em cascata', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    jogo.revelar(0, 0);

    for (let l = 0; l <= 14; l++) {
      for (let c = 0; c < COLUNAS; c++) {
        expect(jogo.estaRevelada(l, c)).toBe(true);
      }
    }
    expect(contarReveladas(jogo)).toBe(210);
  });

  test('CT27 - a cascata deve parar nas casas numeradas e nunca abrir minas', () => {
    // Minas formam uma "parede" em volta do quadrado 3 x 3 do canto superior esquerdo.
    const jogo = new CampoMinado({
      minas: completarMinas([
        [0, 3], [1, 3], [2, 3],
        [3, 0], [3, 1], [3, 2], [3, 3],
      ]),
    });

    jogo.revelar(0, 0);

    for (let l = 0; l <= 2; l++) {
      for (let c = 0; c <= 2; c++) {
        expect(jogo.estaRevelada(l, c)).toBe(true);
      }
    }
    expect(contarReveladas(jogo)).toBe(9);
    expect(jogo.estaRevelada(0, 3)).toBe(false);
    expect(jogo.estaRevelada(3, 0)).toBe(false);
    expect(jogo.estaRevelada(0, 4)).toBe(false);
    expect(jogo.estaRevelada(4, 0)).toBe(false);

    const visao = jogo.tabuleiroVisivel();
    expect(visao[0].slice(0, 4)).toEqual(['0', '0', '2', '#']);
    expect(visao[1].slice(0, 4)).toEqual(['0', '0', '3', '#']);
    expect(visao[2].slice(0, 4)).toEqual(['2', '3', '5', '#']);
    expect(visao[3].slice(0, 4)).toEqual(['#', '#', '#', '#']);
  });

  test('CT28 - a visão do tabuleiro após a cascata deve mostrar os números corretos', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    jogo.revelar(0, 0);
    const visao = jogo.tabuleiroVisivel();

    for (let l = 0; l <= 13; l++) {
      expect(visao[l]).toEqual(Array(COLUNAS).fill('0'));
    }
    expect(visao[14]).toEqual(['2', '3', '3', '3', '3', '3', '3', '3', '3', '3', '3', '3', '3', '2']);
    expect(visao[15]).toEqual(Array(COLUNAS).fill('#'));
    expect(visao[16]).toEqual(Array(COLUNAS).fill('#'));
    expect(visao[17]).toEqual(Array(COLUNAS).fill('#'));
  });

  test('CT29 - revelar uma casa já revelada não deve alterar nada nem lançar erro', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    jogo.revelar(14, 5);
    expect(() => jogo.revelar(14, 5)).not.toThrow();
    expect(contarReveladas(jogo)).toBe(1);

    jogo.revelar(0, 0);
    expect(() => jogo.revelar(0, 0)).not.toThrow();
    expect(contarReveladas(jogo)).toBe(210);
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT30 - revelar uma casa com bandeira não deve abri-la', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    jogo.alternarBandeira(0, 0);
    jogo.revelar(0, 0);

    expect(jogo.estaRevelada(0, 0)).toBe(false);
    expect(jogo.temBandeira(0, 0)).toBe(true);
    expect(contarReveladas(jogo)).toBe(0);
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT31 - revelar uma mina com bandeira não deve causar derrota', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    jogo.alternarBandeira(15, 0);
    jogo.revelar(15, 0);

    expect(jogo.estaRevelada(15, 0)).toBe(false);
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT32 - a cascata não deve abrir casas com bandeira', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    jogo.alternarBandeira(5, 5);
    jogo.revelar(0, 0);

    expect(jogo.estaRevelada(5, 5)).toBe(false);
    expect(jogo.temBandeira(5, 5)).toBe(true);
    expect(jogo.tabuleiroVisivel()[5][5]).toBe('F');
    expect(contarReveladas(jogo)).toBe(209);
  });
});
