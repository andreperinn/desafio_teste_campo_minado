const CampoMinado = require('../src/CampoMinado');
const { minasNoRodape, contarReveladas } = require('./helpers/tabuleiros');

const COORDENADAS_INVALIDAS = [
  [-1, 0],
  [0, -1],
  [18, 0],
  [0, 14],
  [18, 14],
  [1.5, 0],
  [0, 2.5],
  ['1', 0],
  [undefined, undefined],
];

const METODOS = [
  'revelar',
  'alternarBandeira',
  'estaRevelada',
  'temBandeira',
  'temMina',
  'minasVizinhas',
];

describe('Validação de coordenadas', () => {
  test.each(METODOS)('CT51 - %s deve lançar erro para coordenadas fora do tabuleiro ou inválidas', (metodo) => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    COORDENADAS_INVALIDAS.forEach(([l, c]) => {
      expect(() => jogo[metodo](l, c)).toThrow();
    });
  });

  test('CT52 - as quatro casas dos cantos devem ser aceitas como coordenadas válidas', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    expect(() => jogo.minasVizinhas(0, 0)).not.toThrow();
    expect(() => jogo.minasVizinhas(0, 13)).not.toThrow();
    expect(() => jogo.minasVizinhas(17, 0)).not.toThrow();
    expect(() => jogo.minasVizinhas(17, 13)).not.toThrow();
  });

  test('CT53 - uma jogada com coordenada inválida não deve alterar a partida', () => {
    const jogo = new CampoMinado({ minas: minasNoRodape() });

    expect(() => jogo.revelar(18, 0)).toThrow();
    expect(() => jogo.alternarBandeira(0, 14)).toThrow();

    expect(contarReveladas(jogo)).toBe(0);
    expect(jogo.bandeirasRestantes()).toBe(40);
    expect(jogo.obterEstado()).toBe('jogando');
  });
});
