# Desafio de Teste — Campo Minado

Casos de teste automatizados, escritos em **JavaScript** com **Jest**, para testar um jogo de **Campo Minado** com tabuleiro de **18 x 14** e **40 bombas** também escrito em JavaScript.

Este repositório contém **somente os casos de teste**. O código do jogo não faz parte da entrega: ele deve ser implementado a partir da especificação abaixo e passar em todos os testes.

---

## 1. Especificação do desafio

### Tabuleiro

| Item | Valor |
| --- | --- |
| Linhas | 18 (índices de `0` a `17`) |
| Colunas | 14 (índices de `0` a `13`) |
| Total de casas | 252 |
| Minas (bombas) | 40 |
| Casas sem mina | 212 |

As coordenadas são sempre informadas como `(linha, coluna)`, começando em `0`.

### Regras do jogo

1. **Criação da partida:** as 40 minas são sorteadas em posições diferentes no momento em que a partida é criada. Também é possível informar as 40 posições no construtor (é assim que os testes deixam o tabuleiro previsível). Não existe proteção para a primeira jogada: se a primeira casa revelada tiver mina, a partida é perdida.
2. **Revelar casa com mina:** a partida termina em **derrota**. Todas as minas passam a ficar reveladas; as casas sem mina que ainda estavam fechadas continuam ocultas.
3. **Revelar casa sem mina:** a casa mostra quantas minas existem nas até 8 casas vizinhas (horizontal, vertical e diagonal). A própria casa não entra na contagem.
4. **Abertura em cascata:** se a casa revelada tiver `0` minas vizinhas, todas as vizinhas são abertas automaticamente, e o processo se repete para cada nova casa com `0`. A cascata para nas casas numeradas e nunca abre minas nem casas com bandeira.
5. **Bandeiras:**
   - só podem ser colocadas em casas ocultas (em casa revelada a jogada é ignorada);
   - alternar a bandeira de uma casa coloca ou remove a marcação;
   - podem existir no máximo 40 bandeiras ao mesmo tempo (a 41ª é ignorada);
   - casa com bandeira não pode ser revelada (a jogada é ignorada, inclusive se houver mina nela).
6. **Revelar casa já aberta:** a jogada é ignorada, sem erro.
7. **Vitória:** acontece quando as 212 casas sem mina estão reveladas. Bandeiras não são necessárias, e marcar todas as minas com bandeira **não** dá vitória.
8. **Fim de partida:** depois de vitória ou derrota, `revelar` e `alternarBandeira` lançam erro e o estado da partida não muda mais.
9. **Coordenadas inválidas:** fora do tabuleiro, não inteiras ou não numéricas lançam erro em todos os métodos que recebem coordenadas, sem alterar a partida.

### Interface esperada

O jogo deve ficar no arquivo `src/CampoMinado.js`, exportando a classe com `module.exports = CampoMinado;`.

| Membro | Tipo | Descrição |
| --- | --- | --- |
| `new CampoMinado()` | construtor | Cria a partida sorteando 40 minas. |
| `new CampoMinado({ minas })` | construtor | Cria a partida com as minas nas posições informadas. `minas` é um array com exatamente 40 pares `[linha, coluna]`, sem repetição e dentro do tabuleiro. Caso contrário, lança erro. |
| `linhas` | propriedade | `18` |
| `colunas` | propriedade | `14` |
| `totalMinas` | propriedade | `40` |
| `obterMinas()` | método | Retorna uma **cópia** da lista de posições das minas (`[[linha, coluna], ...]`, em qualquer ordem). |
| `temMina(linha, coluna)` | método | `true` se a casa tem mina. |
| `minasVizinhas(linha, coluna)` | método | Número de minas nas casas vizinhas (`0` a `8`). |
| `revelar(linha, coluna)` | método | Revela a casa, aplicando as regras 2, 3, 4, 6 e 7. |
| `alternarBandeira(linha, coluna)` | método | Coloca ou remove a bandeira da casa (regra 5). |
| `estaRevelada(linha, coluna)` | método | `true` se a casa está aberta. |
| `temBandeira(linha, coluna)` | método | `true` se a casa está com bandeira. |
| `bandeirasRestantes()` | método | `40` menos a quantidade de bandeiras colocadas. |
| `obterEstado()` | método | `'jogando'`, `'vitoria'` ou `'derrota'`. |
| `tabuleiroVisivel()` | método | Retorna uma **nova** matriz 18 x 14 de strings com o que o jogador vê: `'#'` casa oculta, `'F'` bandeira, `'*'` mina revelada e `'0'` a `'8'` casa aberta com o número de minas vizinhas. |

---

## 2. Funcionamento dos casos de teste

### Como executar

Requisitos: Node.js 18 ou superior.

```bash
npm install
npm test
```

Enquanto `src/CampoMinado.js` não existir, todos os testes falham com `Cannot find module '../src/CampoMinado'`. Esse é o comportamento esperado: os testes só passam quando o jogo é implementado.

### Organização

```
tests/
├── helpers/tabuleiros.js   # tabuleiros prontos e funções auxiliares
├── tabuleiro.test.js       # CT01 a CT07 - criação do tabuleiro
├── minas.test.js           # CT08 a CT24 - sorteio, validação e contagem de minas
├── revelar.test.js         # CT25 a CT32 - revelar casas e cascata
├── bandeiras.test.js       # CT33 a CT38 - bandeiras
├── fimDeJogo.test.js       # CT39 a CT50 - derrota e vitória
└── coordenadas.test.js     # CT51 a CT53 - validação de coordenadas
```

### Como os testes deixam o jogo previsível

O sorteio das minas é aleatório, então a maior parte dos testes cria a partida com as minas em posições fixas usando `new CampoMinado({ minas })`. Os tabuleiros prontos ficam em `tests/helpers/tabuleiros.js`:

- **`minasNoRodape()`**: as 40 minas ocupam as linhas 15 e 16 inteiras e as colunas 0 a 11 da linha 17. Revelar `(0, 0)` abre em cascata as linhas 0 a 14 (210 casas); depois disso, faltam só `(17, 12)` e `(17, 13)` para a vitória.
- **`completarMinas(lista)`**: recebe algumas minas escolhidas pelo teste e completa até 40 a partir da última casa `(17, 13)` para trás, sem interferir na parte de cima do tabuleiro.

Os testes do modo aleatório (CT08 a CT11, CT24 e CT50) não dependem de onde as minas caem: eles verificam propriedades que precisam valer em qualquer sorteio.

### Casos de teste

#### Criação do tabuleiro — `tabuleiro.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT01 | Criar uma partida | `linhas` = 18 e `colunas` = 14 |
| CT02 | Criar uma partida | `totalMinas` = 40 e `obterMinas()` com 40 posições |
| CT03 | Criar uma partida | Estado `'jogando'` |
| CT04 | Criar uma partida | As 252 casas ocultas |
| CT05 | Criar uma partida | Nenhuma bandeira e `bandeirasRestantes()` = 40 |
| CT06 | Consultar `tabuleiroVisivel()` no início | Matriz 18 x 14 preenchida com `'#'` |
| CT07 | Alterar a matriz retornada por `tabuleiroVisivel()` | O jogo não é alterado |

#### Minas — `minas.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT08 | Sorteio das minas | 40 minas em posições diferentes |
| CT09 | Sorteio das minas | Todas as posições são inteiras e estão dentro do tabuleiro |
| CT10 | Comparar `temMina` com `obterMinas()` | `temMina` é `true` exatamente nas 40 posições sorteadas |
| CT11 | Criar 5 partidas | As posições das minas não são todas iguais |
| CT12 | Informar 40 posições no construtor | O jogo usa exatamente essas posições |
| CT13 | Informar 39 minas | Lança erro |
| CT14 | Informar 41 minas | Lança erro |
| CT15 | Informar minas repetidas | Lança erro |
| CT16 | Informar mina fora do tabuleiro (`[18,0]`, `[0,14]`, `[-1,0]`, `[0,-1]`) | Lança erro |
| CT17 | Alterar a lista retornada por `obterMinas()` | O jogo não é alterado |
| CT18 | Casa `(5,5)` cercada por 8 minas | `minasVizinhas` = 8 |
| CT19 | Canto `(0,0)` com 3 minas vizinhas | `minasVizinhas` = 3 |
| CT20 | Borda `(0,7)` com 5 minas vizinhas | `minasVizinhas` = 5 |
| CT21 | Canto inferior direito no tabuleiro `minasNoRodape` | `(17,13)` = 2 e `(17,12)` = 4 |
| CT22 | Casas sem minas ao redor | `minasVizinhas` = 0 |
| CT23 | Casa com mina e sem minas ao redor | A própria mina não é contada (0); as vizinhas indicam 1 |
| CT24 | Tabuleiro sorteado, todas as 252 casas | A contagem bate com as minas das 8 vizinhas |

#### Revelar casas — `revelar.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT25 | Revelar casa numerada `(14,5)` | Só ela abre e mostra `'3'` |
| CT26 | Revelar casa com 0 minas vizinhas `(0,0)` | Cascata abre as linhas 0 a 14 (210 casas) |
| CT27 | Revelar `(0,0)` cercado por uma parede de minas | Abrem só as 9 casas do quadrado 3 x 3, com os números corretos |
| CT28 | Visão do tabuleiro após a cascata | Linhas 0 a 13 com `'0'`, linha 14 com `2 3 ... 3 2`, linhas 15 a 17 com `'#'` |
| CT29 | Revelar casa já revelada | Nada muda e nenhum erro é lançado |
| CT30 | Revelar casa com bandeira | A casa não abre e a bandeira continua |
| CT31 | Revelar mina com bandeira | A casa não abre e não há derrota |
| CT32 | Cascata passando por casa com bandeira | A casa com bandeira não abre (209 casas abertas) |

#### Bandeiras — `bandeiras.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT33 | Colocar bandeira em casa oculta | `temBandeira` = `true`, restam 39, visão mostra `'F'` |
| CT34 | Alternar a bandeira duas vezes | Bandeira removida, restam 40, visão mostra `'#'` |
| CT35 | Colocar bandeira em casa com mina | Bandeira colocada, partida continua |
| CT36 | Colocar bandeira em casa revelada | Nada muda |
| CT37 | Tentar colocar a 41ª bandeira | Não é colocada e restam 0 |
| CT38 | Remover uma bandeira no limite e colocar outra | A nova bandeira é colocada |

#### Fim de jogo — `fimDeJogo.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT39 | Revelar mina na primeira jogada | Estado `'derrota'` |
| CT40 | Derrota | As 40 minas ficam reveladas e aparecem como `'*'` |
| CT41 | Derrota | Casas sem mina ainda fechadas continuam `'#'` |
| CT42 | Revelar depois da derrota | Lança erro e o estado continua `'derrota'` |
| CT43 | Colocar bandeira depois da derrota | Lança erro |
| CT44 | Revelar as 212 casas sem mina | Estado `'vitoria'` |
| CT45 | Faltando uma casa sem mina | Estado continua `'jogando'` |
| CT46 | Colocar bandeira em todas as 40 minas | Estado continua `'jogando'` |
| CT47 | Vencer com bandeiras sobre minas | Estado `'vitoria'` |
| CT48 | Revelar depois da vitória | Lança erro e o estado continua `'vitoria'` |
| CT49 | Colocar bandeira depois da vitória | Lança erro |
| CT50 | Tabuleiro sorteado, revelar todas as casas sem mina | Estado `'vitoria'` |

#### Coordenadas — `coordenadas.test.js`

| ID | Cenário | Resultado esperado |
| --- | --- | --- |
| CT51 | Chamar `revelar`, `alternarBandeira`, `estaRevelada`, `temBandeira`, `temMina` e `minasVizinhas` com coordenadas inválidas (`-1`, `18`, `14`, `1.5`, `'1'`, `undefined`) | Todos lançam erro |
| CT52 | Usar as coordenadas dos 4 cantos | São aceitas |
| CT53 | Jogada com coordenada inválida | A partida não é alterada |

---

## 3. Colaboradores

| Colaborador | GitHub |
| --- | --- |
| andreperinn | [@andreperinn](https://github.com/andreperinn) |
