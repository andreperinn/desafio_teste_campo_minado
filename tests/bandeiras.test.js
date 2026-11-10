const CampoMinado = require('../src/CampoMinado');
const { minasNoRodape } = require('./helpers/tabuleiros');

describe('Bandeiras', () => {
  let jogo;

  beforeEach(() => {
    jogo = new CampoMinado({ minas: minasNoRodape() });
  });

  test('CT33 - deve colocar bandeira em uma casa oculta', () => {
    jogo.alternarBandeira(3, 4);

    expect(jogo.temBandeira(3, 4)).toBe(true);
    expect(jogo.estaRevelada(3, 4)).toBe(false);
    expect(jogo.bandeirasRestantes()).toBe(39);
    expect(jogo.tabuleiroVisivel()[3][4]).toBe('F');
  });

  test('CT34 - alternar a bandeira de novo deve removê-la', () => {
    jogo.alternarBandeira(3, 4);
    jogo.alternarBandeira(3, 4);

    expect(jogo.temBandeira(3, 4)).toBe(false);
    expect(jogo.bandeirasRestantes()).toBe(40);
    expect(jogo.tabuleiroVisivel()[3][4]).toBe('#');
  });

  test('CT35 - deve permitir colocar bandeira em uma casa que tem mina', () => {
    jogo.alternarBandeira(15, 0);

    expect(jogo.temBandeira(15, 0)).toBe(true);
    expect(jogo.bandeirasRestantes()).toBe(39);
    expect(jogo.obterEstado()).toBe('jogando');
  });

  test('CT36 - não deve colocar bandeira em uma casa já revelada', () => {
    jogo.revelar(14, 5);
    jogo.alternarBandeira(14, 5);

    expect(jogo.temBandeira(14, 5)).toBe(false);
    expect(jogo.bandeirasRestantes()).toBe(40);
    expect(jogo.tabuleiroVisivel()[14][5]).toBe('3');
  });

  test('CT37 - não deve permitir mais de 40 bandeiras', () => {
    let colocadas = 0;
    for (let l = 0; l <= 2 && colocadas < 40; l++) {
      for (let c = 0; c < 14 && colocadas < 40; c++) {
        jogo.alternarBandeira(l, c);
        colocadas++;
      }
    }
    expect(jogo.bandeirasRestantes()).toBe(0);

    jogo.alternarBandeira(3, 0);

    expect(jogo.temBandeira(3, 0)).toBe(false);
    expect(jogo.bandeirasRestantes()).toBe(0);
  });

  test('CT38 - ao remover uma bandeira no limite, deve ser possível colocar outra', () => {
    let colocadas = 0;
    for (let l = 0; l <= 2 && colocadas < 40; l++) {
      for (let c = 0; c < 14 && colocadas < 40; c++) {
        jogo.alternarBandeira(l, c);
        colocadas++;
      }
    }

    jogo.alternarBandeira(0, 0);
    expect(jogo.bandeirasRestantes()).toBe(1);

    jogo.alternarBandeira(3, 0);
    expect(jogo.temBandeira(3, 0)).toBe(true);
    expect(jogo.bandeirasRestantes()).toBe(0);
  });
});
