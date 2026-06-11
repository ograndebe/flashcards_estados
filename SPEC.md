# Especificacao Funcional - Flashcards Estados Brasileiros

## Visao Geral

Jogo de flashcards para auxiliar na memorizacao dos 26 estados brasileiros + Distrito Federal, cobrindo tres dimensoes: **nome do estado**, **capital** e **sigla**. O jogo utiliza repeticao espacada adaptativa baseada em pontuacao, rodando inteiramente no navegador com HTML/CSS/JavaScript vanilla.

---

## Entidades

### Estado

Cada estado possui tres atributos:

| Atributo | Exemplo |
|----------|---------|
| Nome     | Amazonas |
| Capital  | Manaus |
| Sigla    | AM |

Os 27 estados sao fixos e carregados de um dataset estatico embutido no codigo.

### Progresso do Estado (Score)

Armazenado em `localStorage`. Cada estado acumula pontos ao longo das sessoes.

| Campo   | Descricao |
|---------|-----------|
| score   | Pontuacao acumulada (inicia em 0) |

O score **nunca diminui** — o jogador acumula pontos com acertos, e a pontuacao persiste entre sessoes (dias).

---

## Mecanica do Jogo

### Fluxo de uma Rodada

Uma rodada = uma jogada completa com todos os 27 estados.

1. Ordenar estados por score crescente (menor score = mais dificil = aparece primeiro).
2. Estados empatados (mesmo score) sao embaralhados aleatoriamente entre si.
3. Para cada estado:
   - **Sorteia-se o atributo apresentado** (nome, capital ou sigla) aleatoriamente.
   - O jogador deve responder **2 perguntas** correspondentes aos outros 2 atributos.
   - Cada pergunta apresenta **3 opcoes** (1 correta + 2 incorretas, sorteadas de outros estados).
4. Ao final da rodada, exibe-se o resultado: pontuacao obtida vs pontuacao maxima, e percentual de acerto.

### Ordem dos Estados

- Os estados sao sempre apresentados do **mais dificil** (menor score acumulado) para o **mais facil** (maior score acumulado).
- Estados com mesmo score sao **embaralhados aleatoriamente** antes da apresentacao.
- Isso garante que estados menos praticados aparecam primeiro, otimizando o aprendizado.

### Exemplo de Perguntas

Apresentado: **AM**

| Pergunta 1 | Pergunta 2 |
|------------|------------|
| Qual o nome do estado? | Qual a capital? |
| (A) Amazonas ✓ | (A) Belo Horizonte |
| (B) Amapa | (B) Manaus ✓ |
| (C) Acre | (C) Porto Velho |

### Pontuacao

A cada estado respondido na rodada:

| Acertos | Pontos ganhos |
|---------|----------------|
| 2 de 2  | +2             |
| 1 de 2  | +1             |
| 0 de 2  | +0             |

Pontos sao **acumulados** ao score do estado no `localStorage`.

### Geracao de Alternativas Incorretas

Para cada pergunta, sao selecionados 2 estados aleatorios (diferentes do estado atual e diferentes entre si) para fornecer as respostas incorretas. As 3 opcoes (1 correta + 2 incorretas) sao embaralhadas na apresentacao.

### Feedback Imediato

Apos responder cada pergunta, o jogador ve imediatamente se acertou ou errou. As respostas corretas sao destacadas visualmente (ex: verde para acerto, vermelho para erro, com destaque da resposta correta).

---

## Tela de Resultados (Fim de Rodada)

Ao final da rodada (todos os 27 estados apresentados), exibe-se:

| Indicador | Calculo |
|-----------|---------|
| Acertos totais | Soma de acertos nas 54 perguntas (27 estados × 2 perguntas) |
| Pontuacao maxima da rodada | 54 acertos possiveis |
| Pontuacao obtida | Numero de acertos do jogador |
| Percentual de acerto | `(acertos / 54) * 100` |

Alem disso, mostra uma tabela/listagem com o score atualizado de cada estado apos a rodada.

---

## Persistencia

- O score de cada estado e armazenado em `localStorage`.
- Ao iniciar o jogo, os scores sao carregados do `localStorage`. Se nao existirem, todos iniciam com 0.
- Nao ha reset automatico — o progresso acumula indefinidamente ate que o jogador limpe manualmente.

---

## Interface

### Layout

- Cabecalho com titulo do jogo e indicador de progresso na rodada (ex: "Estado 5 de 27").
- Card do estado com o atributo sorteado em destaque.
- Dois blocos de perguntas (um para cada atributo nao revelado), cada um com 3 botoes de resposta.
- Indicacao visual de acerto/erro apos cada resposta.
- Botao "Proximo" para avancar apos responder.
- Tela de resultados ao final da rodada com botao "Jogar novamente".

### Estados

**Sem estado** — a UI reflete apenas:
- Durante a rodada: qual estado esta sendo exibido e o progresso.
- Ao final da rodada: o resultado geral.

---

## Regras de Negocio

1. O atributo sorteado para exibicao nunca coincide com os atributos perguntados.
2. As alternativas incorretas nunca incluem o estado atual nem se repetem entre si.
3. O jogador nao pode pular perguntas — deve responder ambas antes de avancar.
4. O score de um estado nunca diminui, apenas aumenta ou permanece igual.
5. A ordem dos estados recalculada a cada rodada com base nos scores mais recentes.

---

## Dataset

Os 27 estados brasileiros com nome, capital e sigla serao definidos como um array de objetos no codigo JavaScript. Exemplo:

```js
const ESTADOS = [
  { nome: "Acre",        capital: "Rio Branco",    sigla: "AC" },
  { nome: "Alagoas",     capital: "Maceio",        sigla: "AL" },
  { nome: "Amapa",        capital: "Macapa",       sigla: "AP" },
  // ... 24 restantes
];
```
