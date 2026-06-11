(function () {
    'use strict';

    // ==================== DADOS ====================

    var ESTADOS = [
        { nome: 'Acre', capital: 'Rio Branco', sigla: 'AC' },
        { nome: 'Alagoas', capital: 'Maceió', sigla: 'AL' },
        { nome: 'Amapá', capital: 'Macapá', sigla: 'AP' },
        { nome: 'Amazonas', capital: 'Manaus', sigla: 'AM' },
        { nome: 'Bahia', capital: 'Salvador', sigla: 'BA' },
        { nome: 'Ceará', capital: 'Fortaleza', sigla: 'CE' },
        { nome: 'Distrito Federal', capital: 'Brasília', sigla: 'DF' },
        { nome: 'Espírito Santo', capital: 'Vitória', sigla: 'ES' },
        { nome: 'Goiás', capital: 'Goiânia', sigla: 'GO' },
        { nome: 'Maranhão', capital: 'São Luís', sigla: 'MA' },
        { nome: 'Mato Grosso', capital: 'Cuiabá', sigla: 'MT' },
        { nome: 'Mato Grosso do Sul', capital: 'Campo Grande', sigla: 'MS' },
        { nome: 'Minas Gerais', capital: 'Belo Horizonte', sigla: 'MG' },
        { nome: 'Pará', capital: 'Belém', sigla: 'PA' },
        { nome: 'Paraíba', capital: 'João Pessoa', sigla: 'PB' },
        { nome: 'Paraná', capital: 'Curitiba', sigla: 'PR' },
        { nome: 'Pernambuco', capital: 'Recife', sigla: 'PE' },
        { nome: 'Piauí', capital: 'Teresina', sigla: 'PI' },
        { nome: 'Rio de Janeiro', capital: 'Rio de Janeiro', sigla: 'RJ' },
        { nome: 'Rio Grande do Norte', capital: 'Natal', sigla: 'RN' },
        { nome: 'Rio Grande do Sul', capital: 'Porto Alegre', sigla: 'RS' },
        { nome: 'Rondônia', capital: 'Porto Velho', sigla: 'RO' },
        { nome: 'Roraima', capital: 'Boa Vista', sigla: 'RR' },
        { nome: 'Santa Catarina', capital: 'Florianópolis', sigla: 'SC' },
        { nome: 'São Paulo', capital: 'São Paulo', sigla: 'SP' },
        { nome: 'Sergipe', capital: 'Aracaju', sigla: 'SE' },
        { nome: 'Tocantins', capital: 'Palmas', sigla: 'TO' }
    ];

    var ATTR_LABELS = {
        nome: 'Estado',
        capital: 'Capital',
        sigla: 'Sigla'
    };

    var QUESTION_LABELS = {
        nome: 'Qual o nome do estado?',
        capital: 'Qual a capital?',
        sigla: 'Qual a sigla?'
    };

    // ==================== ESTADO DO JOGO ====================

    var STORAGE_KEY = 'flashcards_estados_scores';
    var round = [];
    var currentIndex = 0;
    var revealedAttr = '';
    var questions = [];
    var roundScore = 0;

    // ==================== ARMAZENAMENTO ====================

    function loadScores() {
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                return JSON.parse(raw);
            }
        } catch (e) {
            // dados corrompidos
        }
        var scores = {};
        ESTADOS.forEach(function (e) {
            scores[e.sigla] = 0;
        });
        return scores;
    }

    function saveScores(scores) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
        } catch (e) {
            // localStorage indisponivel
        }
    }

    // ==================== UTILITARIOS ====================

    function shuffle(arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = a[i];
            a[i] = a[j];
            a[j] = tmp;
        }
        return a;
    }

    function shuffleInPlace(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = arr[i];
            arr[i] = arr[j];
            arr[j] = tmp;
        }
    }

    // ==================== RODADA ====================

    function buildRound() {
        var scores = loadScores();

        var groups = {};
        ESTADOS.forEach(function (e) {
            var s = scores[e.sigla] || 0;
            if (!groups[s]) {
                groups[s] = [];
            }
            groups[s].push(e);
        });

        var keys = Object.keys(groups).map(Number).sort(function (a, b) {
            return a - b;
        });

        var result = [];
        keys.forEach(function (k) {
            shuffleInPlace(groups[k]);
            result = result.concat(groups[k]);
        });

        return result;
    }

    function generateOptions(estado, attr) {
        var correct = estado[attr];
        var pool = ESTADOS.filter(function (e) {
            return e.sigla !== estado.sigla;
        });

        var pickedStates = [];
        while (pickedStates.length < 2) {
            var idx = Math.floor(Math.random() * pool.length);
            if (pickedStates.indexOf(idx) === -1) {
                pickedStates.push(idx);
            }
        }

        var wrong1 = pool[pickedStates[0]][attr];
        var wrong2 = pool[pickedStates[1]][attr];

        if (wrong1 === correct || wrong2 === correct || wrong1 === wrong2) {
            return generateOptions(estado, attr);
        }

        return shuffle([correct, wrong1, wrong2]);
    }

    // ==================== UI ====================

    function mostrarTela(id) {
        var telas = document.querySelectorAll('.tela');
        telas.forEach(function (t) {
            t.classList.remove('ativa');
        });
        document.getElementById(id).classList.add('ativa');
    }

    function renderStartScreen() {
        mostrarTela('tela-inicio');
    }

    function renderState() {
        var estado = round[currentIndex];

        document.getElementById('progresso-atual').textContent = currentIndex + 1;
        document.getElementById('progresso-total').textContent = round.length;
        document.getElementById('barra-progresso-preenchimento').style.width =
            ((currentIndex) / round.length) * 100 + '%';

        var attrs = shuffle(['nome', 'capital', 'sigla']);
        revealedAttr = attrs[0];
        var questionAttrs = [attrs[1], attrs[2]];

        document.getElementById('atributo-label').textContent = ATTR_LABELS[revealedAttr];
        document.getElementById('atributo-valor').textContent = estado[revealedAttr];

        questions = questionAttrs.map(function (attr) {
            return {
                attr: attr,
                correct: estado[attr],
                answered: false,
                isCorrect: false,
                options: generateOptions(estado, attr)
            };
        });

        renderQuestion(0);
        renderQuestion(1);

        document.getElementById('btn-proximo').style.display = 'none';
        mostrarTela('tela-jogo');
    }

    function renderQuestion(idx) {
        var q = questions[idx];
        var id = idx + 1;

        document.getElementById('pergunta-' + id + '-texto').textContent = QUESTION_LABELS[q.attr];

        var container = document.getElementById('opcoes-' + id);
        container.innerHTML = '';

        q.options.forEach(function (opt) {
            var btn = document.createElement('button');
            btn.className = 'btn-opcao';
            btn.textContent = opt;
            btn.addEventListener('click', function () {
                handleAnswer(idx, opt, btn, container);
            });
            container.appendChild(btn);
        });

        document.getElementById('feedback-' + id).textContent = '';
        document.getElementById('feedback-' + id).className = 'feedback';
    }

    function handleAnswer(qIdx, choice, clickedBtn, container) {
        var q = questions[qIdx];

        if (q.answered) {
            return;
        }

        q.answered = true;
        q.isCorrect = (choice === q.correct);

        var allBtns = container.querySelectorAll('.btn-opcao');
        allBtns.forEach(function (btn) {
            btn.disabled = true;
            if (btn.textContent === q.correct) {
                btn.classList.add('correta');
            }
        });

        if (q.isCorrect) {
            clickedBtn.classList.add('correta');
        } else {
            clickedBtn.classList.add('incorreta');
        }

        var fb = document.getElementById('feedback-' + (qIdx + 1));
        if (q.isCorrect) {
            fb.textContent = 'Correto!';
            fb.className = 'feedback acerto';
        } else {
            fb.textContent = 'Errado. O correto e: ' + q.correct;
            fb.className = 'feedback erro';
        }

        checkBothAnswered();
    }

    function checkBothAnswered() {
        if (questions[0].answered && questions[1].answered) {
            document.getElementById('btn-proximo').style.display = 'block';
        }
    }

    function nextState() {
        var scores = loadScores();
        var estado = round[currentIndex];
        var sigla = estado.sigla;

        var pontos = 0;
        if (questions[0].isCorrect) pontos++;
        if (questions[1].isCorrect) pontos++;

        roundScore += pontos;

        if (!scores[sigla]) {
            scores[sigla] = 0;
        }
        scores[sigla] += pontos;
        saveScores(scores);

        currentIndex++;

        if (currentIndex >= round.length) {
            renderResults();
        } else {
            renderState();
        }
    }

    function renderResults() {
        mostrarTela('tela-resultados');

        var scores = loadScores();
        var total = round.length * 2;

        var pct = Math.round((roundScore / total) * 100);
        document.getElementById('resultado-porcentagem').textContent = pct + '%';
        document.getElementById('resultado-texto').textContent =
            'Voce acertou ' + roundScore + ' de ' + total + ' perguntas nesta rodada.';

        var tbody = document.getElementById('tabela-scores-body');
        tbody.innerHTML = '';

        var sorted = ESTADOS.slice().sort(function (a, b) {
            return (scores[b.sigla] || 0) - (scores[a.sigla] || 0);
        });

        sorted.forEach(function (e) {
            var tr = document.createElement('tr');
            tr.innerHTML =
                '<td>' + e.nome + '</td>' +
                '<td>' + e.sigla + '</td>' +
                '<td class="pontos-cell">' + (scores[e.sigla] || 0) + '</td>';
            tbody.appendChild(tr);
        });
    }

    // ==================== INICIALIZACAO ====================

    function startGame() {
        round = buildRound();
        currentIndex = 0;
        roundScore = 0;
        renderState();
    }

    function resetScores() {
        var scores = {};
        ESTADOS.forEach(function (e) {
            scores[e.sigla] = 0;
        });
        saveScores(scores);
        renderStartScreen();
    }

    document.addEventListener('DOMContentLoaded', function () {
        renderStartScreen();

        document.getElementById('btn-comecar').addEventListener('click', startGame);
        document.getElementById('btn-proximo').addEventListener('click', nextState);
        document.getElementById('btn-recomecar').addEventListener('click', startGame);
        document.getElementById('btn-limpar').addEventListener('click', function () {
            if (confirm('Tem certeza que deseja zerar todas as pontuacoes?')) {
                resetScores();
            }
        });
    });

})();
