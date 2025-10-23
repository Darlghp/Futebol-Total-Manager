


const Game = {
    // Variáveis globais do jogo
    // Fix: Cast to any to prevent type errors on initialization with null
    meuTime: null as any,
    gameManager: null as any,
    copaManager: null as any,
    historicoCampeoes: {},
    rodadaCount: 0,
    temporadaCount: 1,
    mercadoJogadores: [],
    mercadoStaff: [],
    lastTicketIncome: 0,
    lastFinanceCycleIncome: 0,
    pendingMatchResult: null,
    pressaoTorcida: 20,
    squadSortConfig: {
        sortBy: 'default',
        filterPos: 'Todos',
        filterName: ''
    },
    configuracoes: {
        coletivaOpcional: true
    },
    sponsorshipOffers: [],
    pendingSponsorshipChoice: false,

    // --- CONSTANTES ---
    FORMACOES: ['4-4-2', '4-3-3', '3-5-2', '5-3-2', '4-2-3-1'],
    FORMATION_STRUCTURES: {
        '4-4-2': { 'Goleiro': 1, 'Zagueiro': 2, 'Lateral': 2, 'Meio-campo': 4, 'Atacante': 2, total: 11 },
        '4-3-3': { 'Goleiro': 1, 'Zagueiro': 2, 'Lateral': 2, 'Meio-campo': 3, 'Atacante': 3, total: 11 },
        '3-5-2': { 'Goleiro': 1, 'Zagueiro': 3, 'Lateral': 0, 'Meio-campo': 5, 'Atacante': 2, total: 11 },
        '5-3-2': { 'Goleiro': 1, 'Zagueiro': 3, 'Lateral': 2, 'Meio-campo': 3, 'Atacante': 2, total: 11 },
        '4-2-3-1': { 'Goleiro': 1, 'Zagueiro': 2, 'Lateral': 2, 'Meio-campo': 5, 'Atacante': 1, total: 11 }
    },
    TRAITS: {
        'Líder': { desc: "Inspira a equipe, concedendo um bônus de força para o time quando é titular.", color: "bg-green-500 text-white" },
        'Jovem Promessa': { desc: "Evolui mais rápido nos treinos até os 23 anos.", color: "bg-blue-500 text-white" },
        'Veterano Experiente': { desc: "Perde menos habilidade com a idade e é mais resistente a quedas de moral.", color: "bg-yellow-600 text-white" },
        'Propenso a Lesões': { desc: "Tem uma chance maior de se lesionar.", color: "bg-red-500 text-white" },
        'Decisivo': { desc: "Joga melhor em partidas de playoffs e copas, recebendo um bônus de força.", color: "bg-purple-600 text-white" },
        'Inconstante': { desc: "Seu desempenho pode variar drasticamente a cada partida.", color: "bg-pink-500 text-white" }
    },
    STAFF_TIPOS: ['Treinador Principal', 'Auxiliar Técnico', 'Preparador Físico', 'Olheiro'],
    MAX_TITULARES: 11,
    TIMES_PER_DIVISION: 20,
    RODADAS_PARA_PAGAMENTO: 6,
    TOTAL_TIMES: 20 * 6, // 6 Divisões
    PROMOTE_RELEGATE_COUNT: 4,
    POSICOES: ["Goleiro", "Zagueiro", "Lateral", "Meio-campo", "Atacante"],
    NOMES_PRIMEIROS: ["Lucas", "Gabriel", "Matheus", "Bruno", "Felipe", "Rafael", "Guilherme", "Gustavo", "Pedro", "João", "Daniel", "Thiago", "Leonardo", "Eduardo", "Vinicius", "Rodrigo", "André", "Carlos", "Marcos", "Antônio", "Francisco", "Ricardo", "Marcelo", "Fernando", "Diego", "Alexandre", "Igor", "Vitor", "Leandro", "César", "Jonas", "Davi", "Éder", "Fábio", "Renato", "Sérgio"],
    NOMES_SOBRENOMES: ["Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira", "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Almeida", "Lopes", "Dias", "Cruz", "Barbosa", "Rocha", "Vieira", "Freitas", "Fernandes", "Melo", "Azevedo", "Barros", "Cardoso", "Correia", "Cunha", "Mendes", "Nunes", "Teixeira", "Moreira", "Castro"],
    NOME_TIMES_IA: [
        "Maranhão Trovão", "Sergipe Laranjas", "Amapá Minérios", "Piauí Vaqueiros", "Goiás Esmeraldas", "Bahia de Aço",
        "Rio Negro Piranhas", "Mato Grosso Onças", "Pantanal Jacarés FC", "Cerrado Lobos EC", "Litoral Praiano AC",
        "Planalto Central Federal", "Serra Azul EC", "Vale do Aço AC", "Costa Verde Marítimo", "Norte Fluminense FC",
        "Sul Catarinense EC", "Oeste Paulista AC", "Leste Mineiro Unido", "Metropolitano de Curitiba", "Serrano Gaúcho",
        "Recôncavo Baiano FC", "Agreste Pernambucano", "Cariri Cearense", "Borborema Paraibano", "Potiguar de Natal",
        "Sertão Alagoano", "Zona da Mata Mineira", "Triângulo Mineiro EC", "Centro-Oeste Goiano", "Norte de Minas",
        "Vale do Paraíba", "Baixada Santista FC", "Grande ABC", "Interior Paulista FC", "Campinas City",
        "Ribeirão Preto Rovers", "Sorocaba Athletic", "Jundiaí United", "Litoral Paranaense", "Campos Gerais EC",
        "Norte do Paraná AC", "Oeste Catarinense", "Vale do Itajaí", "Grande Florianópolis", "Serra Catarinense",
        "Metropolitana de Porto Alegre", "Fronteira Gaúcha", "Planalto Médio EC", "Litoral Gaúcho", "Centro-Sul Baiano",
        "Sudoeste Baiano", "Vale do São Francisco", "Agreste Sergipano", "Leste Sergipano", "Sertão de Pernambuco",
        "Mata Pernambucana", "Borborema Potiguar", "Oeste Potiguar", "Sertão Central Cearense", "Norte Cearense",
        "Cocais Maranhense", "Sul Maranhense", "Centro Piauiense", "Norte Piauiense", "Bico do Papagaio",
        "Sudeste Tocantinense", "Norte Goiano", "Sul Goiano", "Norte Mato-Grossense", "Sul Mato-Grossense",
        "Pantanal Sul-Matogrossense", "Cone Sul de Rondônia", "Vale do Jamari", "Norte Acreano", "Sul Roraimense",
        "Centro-Sul Amazonense", "Baixo Amazonas", "Nordeste Paraense", "Sudeste Paraense", "Metropolitana de Belém",
        "Central Amapaense", "Atlântico Capixaba", "Norte Capixaba", "Região dos Lagos FC", "Noroeste Fluminense",
        "Capital Paulista FC", "Leste Paulista", "Alto Tietê EC", "Circuito das Águas", "Mantiqueira FC",
        "Fronteira Oeste", "Campanha Gaúcha", "Vale do Rio Pardo", "Vale do Taquari", "Carbonífera Criciúma",
        "Tubarão Azul EC", "Joinville Real", "Blumenau Glória", "Chapecó Condores", "Oeste de Cascavel",
        "Londrina Canários", "Maringá Imperial", "Ponta Grossa Operário", "Guarapuava Lobos", "Foz do Iguaçu Cataratas",
        "Cianorte Leões", "Umuarama Panteras", "Toledo Porcos do Mato", "Campo Mourão Dragões", "Apucarana Águias",
        "Arapongas Periquitos", "Paranavaí Laranjas", "Cornélio Procópio Galos", "Jacarezinho Jacarés", "Teresina Capital",
        "Imperatriz Cavalo de Aço", "Parnaíba Litoral", "Floriano Águias", "Mossoró Salineiros", "Caicó Sertanejos"
    ],

    eventosAleatorios: [
        {
            titulo: "Moral em Alta!",
            desc: "Uma vitória inspiradora aumentou a moral de todo o elenco em +10.",
            efeito: (time) => time.jogadores.forEach(j => j.moral = Math.min(100, j.moral + 10))
        },
        {
            titulo: "Jovem Promessa Descoberta!",
            desc: "Um olheiro descobriu um jovem com potencial incrível. Ele se juntou ao time de graça!",
            efeito: (time) => {
                const jovem = Game.gerarJogador(60, 70, [90, 100], 17, 18);
                jovem.traits.push('Jovem Promessa');
                time.jogadores.push(jovem);
            }
        },
        {
            titulo: "Pequena Crise Financeira",
            desc: "Despesas inesperadas reduziram o saldo do clube em $5,000.",
            efeito: (time) => time.saldo -= 5000
        },
        {
            titulo: "Patrocinador Satisfeito",
            desc: "Um patrocinador local, feliz com os resultados, injetou um bônus de $10,000 no clube!",
            efeito: (time) => time.saldo += 10000
        },
        {
            titulo: "Fadiga Coletiva",
            desc: "Uma semana de treinos intensos deixou o elenco mais fadigado (+10 Fadiga para todos).",
            efeito: (time) => time.jogadores.forEach(j => j.fadiga = Math.min(100, j.fadiga + 10))
        },
        {
            titulo: "Crise Econômica Afeta o Clube!",
            desc: "Uma crise global impactou os patrocinadores, resultando em uma perda de 20% do seu saldo atual.",
            efeito: (time) => time.saldo = Math.floor(time.saldo * 0.8)
        }
    ],

    Staff: class Staff {
        id;
        nome;
        tipo; // 'Treinador Principal', 'Auxiliar Técnico', 'Preparador Físico', 'Olheiro'
        habilidade; // 1-100
        salario;

        constructor(nome, tipo, habilidade) {
            this.id = crypto.randomUUID();
            this.nome = nome || '';
            this.tipo = tipo || '';
            this.habilidade = habilidade || 0;
            this.salario = Math.floor((this.habilidade || 0) * (this.habilidade || 0) * 1.5);
        }
        static fromJSON(data) {
            const s = new Game.Staff(data.nome, data.tipo, data.habilidade);
            Object.assign(s, data);
            return s;
        }
    },

    ATRIBUTO_PESOS: {
        'Goleiro': { passe: 0.1, drible: 0.0, chute: 0.0, defesa: 0.5, visao: 0.1, posicionamento: 0.15, determinacao: 0.05, velocidade: 0.02, forca: 0.05, folego: 0.03 },
        'Zagueiro': { passe: 0.05, drible: 0.02, chute: 0.01, defesa: 0.4, visao: 0.05, posicionamento: 0.2, determinacao: 0.05, velocidade: 0.05, forca: 0.15, folego: 0.02 },
        'Lateral': { passe: 0.1, drible: 0.1, chute: 0.03, defesa: 0.2, visao: 0.1, posicionamento: 0.1, determinacao: 0.05, velocidade: 0.15, forca: 0.05, folego: 0.12 },
        'Meio-campo': { passe: 0.2, drible: 0.15, chute: 0.1, defesa: 0.1, visao: 0.15, posicionamento: 0.1, determinacao: 0.05, velocidade: 0.05, forca: 0.03, folego: 0.07 },
        'Atacante': { passe: 0.1, drible: 0.15, chute: 0.3, defesa: 0.01, visao: 0.1, posicionamento: 0.15, determinacao: 0.05, velocidade: 0.1, forca: 0.04, folego: 0.0 }
    },

    Jogador: class Jogador {
        id;
        nome;
        posicao;
        atributos;
        moral;
        idade;
        potencialRange;
        fadiga;
        quimica;
        lesionado;
        dias_recuperacao;
        traits;
        temporadaContratado;
        picoHabilidade;
        aposentado;
        salario;
        contratoAnos;
        individualFocus;
        happiness;

        constructor(nome, posicao, atributos, moral, idade, potencialRange) {
            this.id = crypto.randomUUID();
            this.nome = nome; this.posicao = posicao; this.atributos = atributos;
            this.moral = moral; this.idade = idade;
            this.potencialRange = potencialRange; // [min, max]
            this.fadiga = 0; this.quimica = 50;
            this.lesionado = false; this.dias_recuperacao = 0;
            this.traits = [];
            this.temporadaContratado = 1;
            this.picoHabilidade = this.habilidade;
            this.aposentado = false;
            this.salario = 0;
            this.contratoAnos = 0;
            this.individualFocus = null;
            this.happiness = {
                gameTime: 'Satisfeito',
                contract: 'Satisfeito',
                teamPerformance: 'Satisfeito',
            };
        }

        get habilidade() { // Agora é o OVR (Overall)
            const pesos = Game.ATRIBUTO_PESOS[this.posicao] || Game.ATRIBUTO_PESOS['Meio-campo'];
            let ovr = 0;
            for (const attr in this.atributos) {
                ovr += this.atributos[attr] * pesos[attr];
            }
            return Math.round(ovr);
        }

        get potencial() {
            return this.potencialRange[1]; // Retorna o teto do potencial para UI
        }
        
        get potencialEstrelas() {
            const pot = this.potencial;
            if (pot > 94) return 5;
            if (pot > 88) return 4;
            if (pot > 80) return 3;
            if (pot > 70) return 2;
            return 1;
        }

        treinar(foco, isTitular, staffBonuses = {}) {
            if (this.lesionado) return;

            // Fix: Cast to any to avoid property does not exist error
            const {
                centroTreinamentoNivel = 1,
                deptoMedicoNivel = 1,
                treinadorPrincipal = 0,
                auxiliarTecnico = 0,
                preparadorFisico = 0
            } = staffBonuses as any;

            const focos = {
                'Técnico': { 'passe': 2, 'drible': 2, 'chute': 2, 'defesa': 2, 'visao': 0.5, 'posicionamento': 0.5 },
                'Tático': { 'visao': 2, 'posicionamento': 2, 'determinacao': 2, 'passe': 0.5, 'defesa': 0.5 },
                'Físico': { 'velocidade': 2, 'forca': 2, 'folego': 2, 'determinacao': 0.5 },
                'Geral': { 'passe': 1, 'drible': 1, 'chute': 1, 'defesa': 1, 'visao': 1, 'posicionamento': 1, 'determinacao': 1, 'velocidade': 1, 'forca': 1, 'folego': 1 }
            };
            const focoAtual = focos[foco] || focos['Geral'];

            const individualFocos = {
                'Finalização': { 'chute': 3, 'posicionamento': 1 },
                'Criação': { 'passe': 2, 'drible': 2, 'visao': 2 },
                'Defensivo': { 'defesa': 3, 'posicionamento': 1.5, 'forca': 1 },
                'Velocidade': { 'velocidade': 3, 'folego': 2 },
                'Goleiro': { 'defesa': 4, 'posicionamento': 2 }
            };
            const focoIndividualAtual = this.individualFocus ? individualFocos[this.individualFocus] : null;

            for (const attr in this.atributos) {
                if (this.atributos[attr] >= this.potencial) continue;

                let incrementoBase = 0.5 * (focoAtual[attr] || 0.2);
                if (focoIndividualAtual && focoIndividualAtual[attr]) {
                    incrementoBase += 0.8 * focoIndividualAtual[attr]; // Bônus forte do foco individual
                }
                if (incrementoBase === 0) continue;

                const fatorTitular = isTitular ? 1.5 : 1.0;
                const fatorCT = 1 + (centroTreinamentoNivel - 1) * 0.1;
                let moralMultiplier = this.moral > 75 ? 1.5 : (this.moral < 40 ? 0.5 : 1.0);
                let ageMultiplier = 1.0;
                if (this.idade >= 30) ageMultiplier = 0.5;
                if (this.idade >= 35) ageMultiplier = 0.1;
                if (this.traits.includes('Jovem Promessa') && this.idade < 23) ageMultiplier *= 1.5;

                let incremento = incrementoBase * fatorTitular * fatorCT * moralMultiplier * ageMultiplier;
                incremento *= (1 + (treinadorPrincipal / 200) + (auxiliarTecnico / 400)); // Bônus de Staff

                this.atributos[attr] = Math.min(this.potencial, this.atributos[attr] + incremento);
            }
            this.picoHabilidade = Math.max(this.picoHabilidade, this.habilidade);

            let fadigaGerada = 15 * (isTitular ? 1.5 : 1.0);
            fadigaGerada *= (1 - (auxiliarTecnico / 500));
            this.fadiga = Math.min(100, this.fadiga + Math.floor(fadigaGerada));

            this.moral = Math.min(100, this.moral + 2);
            this.quimica = Math.min(100, this.quimica + 3);

            let chanceLesao = 0.05 + (this.fadiga / 100) * 0.05;
            if (this.traits.includes('Propenso a Lesões')) chanceLesao *= 2;
            chanceLesao *= (1 - (preparadorFisico / 250));
            if (Math.random() < chanceLesao) {
                this.lesionado = true;
                const fatorDM = 1 - (deptoMedicoNivel - 1) * 0.1;
                this.dias_recuperacao = Math.max(1, Math.floor((Math.floor(Math.random() * 5) + 3) * fatorDM));
            }
        }
        envelhecer() {
            this.idade += 1;
            if (this.idade > 35 && Math.random() < (this.idade - 34) * 0.25) {
                this.aposentado = true;
            }

            // Declínio realista por atributo
            const veteranMultiplier = this.traits.includes('Veterano Experiente') ? 0.5 : 1.0;

            if (this.idade > 28) {
                this.atributos.velocidade = Math.max(40, this.atributos.velocidade - (Math.random() * 2 + 1) * veteranMultiplier);
                this.atributos.folego = Math.max(40, this.atributos.folego - (Math.random() * 2 + 1) * veteranMultiplier);
            }
            if (this.idade > 30) {
                this.atributos.forca = Math.max(40, this.atributos.forca - (Math.random() * 1.5) * veteranMultiplier);
                this.atributos.drible = Math.max(40, this.atributos.drible - (Math.random() * 1) * veteranMultiplier);
                this.atributos.chute = Math.max(40, this.atributos.chute - (Math.random() * 1) * veteranMultiplier);
            }
            if (this.idade > 32) {
                this.atributos.passe = Math.max(40, this.atributos.passe - (Math.random() * 1) * veteranMultiplier);
                this.atributos.defesa = Math.max(40, this.atributos.defesa - (Math.random() * 1) * veteranMultiplier);
            }
            if (this.idade > 34) {
                this.atributos.posicionamento = Math.max(40, this.atributos.posicionamento - (Math.random() * 1) * veteranMultiplier);
                this.atributos.visao = Math.max(40, this.atributos.visao - (Math.random() * 1) * veteranMultiplier);
            }

            // Mentais podem melhorar com experiência
            if (this.idade > 25 && this.idade < 33) {
                this.atributos.posicionamento = Math.min(this.potencial, this.atributos.posicionamento + Math.random() * 0.5);
                this.atributos.visao = Math.min(this.potencial, this.atributos.visao + Math.random() * 0.5);
            }
        }
        recuperar(isTitular) {
            const fatorRecuperacao = isTitular ? 10 : 20;
            this.fadiga = Math.max(0, this.fadiga - fatorRecuperacao);
            if (this.lesionado) {
                this.dias_recuperacao -= 1;
                if (this.dias_recuperacao <= 0) this.lesionado = false;
            }
        }
        updateHappiness(team, teamPosition, leagueSize) {
            // Game Time
            const sortedSquad = [...team.jogadores].sort((a, b) => b.habilidade - a.habilidade);
            const top11 = sortedSquad.slice(0, 11).map(p => p.id);
            const isTitular = team.titulares.includes(this.id);
            if (top11.includes(this.id) && !isTitular && this.habilidade > 70) {
                this.happiness.gameTime = 'Insatisfeito';
                this.moral = Math.max(20, this.moral - 5);
            } else if (!top11.includes(this.id) && !isTitular) {
                this.happiness.gameTime = 'Satisfeito';
            } else if (isTitular) {
                this.happiness.gameTime = 'Feliz';
            }

            // Contract
            if (this.contratoAnos <= 1) {
                this.happiness.contract = 'Quer renovar';
                this.moral = Math.max(30, this.moral - 2);
            } else {
                this.happiness.contract = 'Satisfeito';
            }

            // Team Performance
            if (teamPosition <= leagueSize / 2) {
                this.happiness.teamPerformance = 'Satisfeito';
            } else {
                this.happiness.teamPerformance = 'Insatisfeito';
                this.moral = Math.max(40, this.moral - 1);
            }
        }
        static fromJSON(data) {
            const j = new Game.Jogador(data.nome, data.posicao, data.atributos, data.moral, data.idade, data.potencialRange);
            Object.assign(j, data);
            // Compatibilidade com saves antigos
            if (data.habilidade && !data.atributos) {
                j.atributos = { passe: data.habilidade, drible: data.habilidade, chute: data.habilidade, defesa: data.habilidade, visao: data.habilidade, posicionamento: data.habilidade, determinacao: data.habilidade, velocidade: data.habilidade, forca: data.habilidade, folego: data.habilidade };
                j.potencialRange = [data.potencial, data.potencial];
            }
            if (!data.salario) { // Old save compatibility for contracts
                const salarioBase = 10;
                j.salario = Math.floor(salarioBase + Math.pow(j.habilidade, 2) / 20 + Math.pow(j.potencial, 2) / 50);
                j.contratoAnos = 3;
            }
            j.individualFocus = data.individualFocus || null;
            j.happiness = data.happiness || { gameTime: 'Satisfeito', contract: 'Satisfeito', teamPerformance: 'Satisfeito' };
            return j;
        }
    },


    Time: class Time {
        id;
        nome;
        saldo;
        jogadores; // Jogador[]
        youthSquad; // Jogador[]
        titulares;
        formacao;
        tatica;
        vitorias;
        empates;
        derrotas;
        pontos;
        gols_pro;
        gols_contra;
        eh_jogador;
        patrocinio_valor;
        divisao;
        estadio_nivel;
        estadio_capacidade;
        historico;
        academia_nivel;
        investimento_base_nivel;
        centro_treinamento_nivel;
        depto_medico_nivel;
        depto_marketing_nivel;
        trofeus;
        hallOfFame;
        staff; // Staff[]
        sponsorshipDeal;

        constructor(nome, saldo, eh_jogador = false, divisao = 'F') {
            this.id = crypto.randomUUID();
            this.nome = nome || ''; this.saldo = saldo || 0; this.jogadores = [];
            this.youthSquad = [];
            this.titulares = [];
            this.formacao = '4-4-2';
            this.tatica = "Equilibrada";
            this.vitorias = 0; this.empates = 0; this.derrotas = 0;
            this.pontos = 0; this.gols_pro = 0; this.gols_contra = 0;
            this.eh_jogador = eh_jogador; this.patrocinio_valor = 0; this.divisao = divisao;
            this.estadio_nivel = 1; this.estadio_capacidade = 5000; this.historico = [];
            this.academia_nivel = 1;
            this.investimento_base_nivel = 1; // 1: Básico, 2: Intermediário, 3: Avançado
            this.centro_treinamento_nivel = 1;
            this.depto_medico_nivel = 1;
            this.depto_marketing_nivel = 1;
            this.trofeus = {};
            this.hallOfFame = [];
            this.staff = [];
            this.sponsorshipDeal = null;
        }
        getJogador(id) { return this.jogadores.find(j => j.id === id); }
        getYouthPlayer(id) { return this.youthSquad.find(j => j.id === id); }
        getStaff(id) { return this.staff.find(s => s.id === id); }
        getStaffBonus(tipo) {
            const member = this.staff.find(s => s.tipo === tipo);
            return member ? member.habilidade : 0;
        }
        contratar(jogador) {
            const custo = Math.floor(jogador.habilidade * 75 * (1 + jogador.idade / 50));
            if (this.saldo >= custo) {
                jogador.temporadaContratado = Game.temporadaCount;
                jogador.picoHabilidade = jogador.habilidade;
                this.jogadores.push(jogador); this.saldo -= custo;
                if (this.titulares.length < Game.MAX_TITULARES) this.titulares.push(jogador.id);
                return { success: true, custo };
            }
            return { success: false, custo };
        }
        contratarStaff(staff) {
            const custo = staff.salario * 5; // Custo de contratação
            if (this.saldo >= custo) {
                this.staff.push(staff);
                this.saldo -= custo;
                return { success: true, custo };
            }
            return { success: false, custo };
        }
        demitirStaff(staffId) {
            const staffMember = this.getStaff(staffId);
            const index = this.staff.indexOf(staffMember);
            if (index > -1) {
                const custoDemissao = staffMember.salario * 10;
                if (this.saldo >= custoDemissao) {
                    this.saldo -= custoDemissao;
                    this.staff.splice(index, 1);
                    return { success: true, custo: custoDemissao, nome: staffMember.nome };
                }
                return { success: false, custo: custoDemissao, nome: staffMember.nome };
            }
            return { success: false };
        }
        venderJogador(jogadorId) {
            const jogador = this.getJogador(jogadorId);
            const index = this.jogadores.indexOf(jogador);
            if (index > -1) {
                const reputationMultiplier = { 'A': 1.0, 'B': 0.85, 'C': 0.65, 'D': 0.5, 'E': 0.40, 'F': 0.30 }[this.divisao];
                const basePrice = Math.floor(jogador.habilidade * 15 * (1 + jogador.potencial / 100) * (1 - jogador.idade / 50));
                const precoVenda = Math.floor(basePrice * reputationMultiplier * (1 + jogador.contratoAnos / 10));

                this.saldo += precoVenda; this.jogadores.splice(index, 1);
                this.titulares = this.titulares.filter(id => id !== jogador.id);
                return { success: true, preco: precoVenda };
            }
            return { success: false };
        }
        renovarContrato(jogadorId) {
            const jogador = this.getJogador(jogadorId);
            if (!jogador) return { success: false, message: "Jogador não encontrado." };

            const idade = jogador.idade;
            const habilidade = jogador.habilidade;
            const potencial = jogador.potencial;

            // Novo salário baseado na habilidade, potencial e idade
            const novoSalarioBase = 20;
            const novoSalario = Math.floor(novoSalarioBase + Math.pow(habilidade, 2) / 15 + Math.pow(potencial, 2) / 40);

            // Bônus de assinatura
            const bonusAssinatura = novoSalario * 10 * (1 + (habilidade - 60) / 100);

            if (this.saldo < bonusAssinatura) {
                return { success: false, message: `Saldo insuficiente para pagar o bônus de assinatura de $${Math.floor(bonusAssinatura).toLocaleString('pt-BR')}.` };
            }

            // Duração do contrato baseada na idade
            let novosAnosContrato = 1;
            if (idade < 22) novosAnosContrato = 5;
            else if (idade < 28) novosAnosContrato = 4;
            else if (idade < 32) novosAnosContrato = 3;
            else novosAnosContrato = 2;

            this.saldo -= bonusAssinatura;
            jogador.salario = novoSalario;
            jogador.contratoAnos = novosAnosContrato;
            jogador.happiness.contract = 'Satisfeito';
            jogador.moral = Math.min(100, jogador.moral + 25); // Bonus de moral pela renovação

            return {
                success: true,
                message: `${jogador.nome} renovou o contrato por ${novosAnosContrato} anos! Bônus de assinatura: $${Math.floor(bonusAssinatura).toLocaleString('pt-BR')}. Novo salário: $${novoSalario.toLocaleString('pt-BR')}.`
            };
        }
        moverParaTitular(jogadorId) {
            const jogador = this.getJogador(jogadorId);
            if (!jogador) return false;
            if (this.titulares.length >= Game.MAX_TITULARES || this.titulares.includes(jogadorId)) return false;
            this.titulares.push(jogadorId); return true;
        }
        moverParaReserva(jogadorId) { this.titulares = this.titulares.filter(id => id !== jogadorId); }
        treinarElenco(foco) {
            const staffBonuses = {
                centroTreinamentoNivel: this.centro_treinamento_nivel,
                deptoMedicoNivel: this.depto_medico_nivel,
                treinadorPrincipal: this.getStaffBonus('Treinador Principal'),
                auxiliarTecnico: this.getStaffBonus('Auxiliar Técnico'),
                preparadorFisico: this.getStaffBonus('Preparador Físico')
            };
            this.jogadores.forEach(j => j.treinar(foco, this.titulares.includes(j.id), staffBonuses));
        }
        setTatica(novaTatica) { this.tatica = novaTatica; }
        calcularFolhaSalarial() {
            const folhaJogadores = this.jogadores.reduce((total, j) => total + j.salario, 0);
            const folhaStaff = this.staff.reduce((total, s) => total + s.salario, 0);
            return Math.round(folhaJogadores + folhaStaff);
        }
        receberPatrocinioESalarios() {
            const folha = this.calcularFolhaSalarial();
            const patrocinio = (this.sponsorshipDeal && this.sponsorshipDeal.baseValue) ? this.sponsorshipDeal.baseValue / 6 : (this.eh_jogador ? this.patrocinio_valor : 1000 + (Game.gameManager.divisoes[this.divisao]).media_forca_ia * 10);
            this.saldo += patrocinio - folha;
            Game.lastFinanceCycleIncome = patrocinio - folha;
        }
        pagarBonusVitoria() {
            const mediaHab = this.jogadores.reduce((sum, j) => sum + j.habilidade, 0) / this.jogadores.length;
            const bonus = Math.floor(mediaHab * 20);
            this.saldo -= bonus; return bonus;
        }
        atualizarPatrocinio(posicaoNaTabela) {
            let basePatrocinio = { 'A': 40000, 'B': 20000, 'C': 7500, 'D': 2500, 'E': 1500, 'F': 1000 }[this.divisao] || 1000;
            let performanceMultiplier = 1.0;
            const promoteCount = Game.PROMOTE_RELEGATE_COUNT;
            if (posicaoNaTabela <= promoteCount) performanceMultiplier = 1.25;
            if (posicaoNaTabela === 1) performanceMultiplier = 1.4; // Bônus de campeão
            const mediaHab = this.jogadores.reduce((sum, j) => sum + j.habilidade, 0) / (this.jogadores.length || 1);
            const prestigioBonus = Math.max(0, (mediaHab - 50) * 20);
            const bonusAnual = (Game.temporadaCount - 1) * 2000;
            this.patrocinio_valor = Math.floor(basePatrocinio * performanceMultiplier + prestigioBonus + bonusAnual);
        }
        curarJogador(jogadorId) {
            const jogador = this.getJogador(jogadorId);
            if (!jogador) return { success: false, custo: 0 };

            const custo = jogador.habilidade * 100;
            if (jogador.lesionado && this.saldo >= custo) {
                this.saldo -= custo;
                jogador.lesionado = false;
                jogador.dias_recuperacao = 0;
                return { success: true, custo };
            }
            return { success: false, custo };
        }
        melhorarEstadio() {
            const custo = this.estadio_nivel * 75000 * (1 + (this.estadio_nivel / 5));
            if (this.saldo >= custo) {
                this.saldo -= custo; this.estadio_nivel++;
                this.estadio_capacidade = 5000 + (this.estadio_nivel - 1) * 2500;
                return { success: true, custo };
            }
            return { success: false, custo };
        }
        calcularForca(isMataMata = false) {
            let forca = 0;
            let liderPresente = false;
            const jogadoresTitulares = this.titulares.map(id => this.getJogador(id)).filter(j => j && !j.lesionado);

            for (const j of jogadoresTitulares) {
                let contribuicao = j.habilidade + (j.moral / 2) + (j.quimica / 3) - j.fadiga;
                if (j.traits.includes('Inconstante')) contribuicao *= (Math.random() * 0.4 + 0.8); // Varia de 80% a 120%
                if (j.traits.includes('Decisivo') && isMataMata) contribuicao *= 1.1; // Bônus de 10%
                if (j.traits.includes('Líder')) liderPresente = true;
                forca += contribuicao;
            }

            if (jogadoresTitulares.length < Game.MAX_TITULARES) {
                forca -= (Game.MAX_TITULARES - jogadoresTitulares.length) * 30;
            }
            if (jogadoresTitulares.length === 0) return 1;

            let forcaMedia = forca / Game.MAX_TITULARES;

            if (liderPresente) forcaMedia *= 1.02; // Bônus de 2% do líder

            const positionCounts = { 'Goleiro': 0, 'Zagueiro': 0, 'Lateral': 0, 'Meio-campo': 0, 'Atacante': 0 };
            jogadoresTitulares.forEach(j => {
                if (positionCounts.hasOwnProperty(j.posicao)) {
                    positionCounts[j.posicao]++;
                }
            });

            const requiredPositions = Game.FORMATION_STRUCTURES[this.formacao];
            let mismatchPenalty = 0;
            if (requiredPositions) {
                for (const pos in requiredPositions) {
                    if (pos !== 'total') {
                        mismatchPenalty += Math.abs(requiredPositions[pos] - (positionCounts[pos] || 0));
                    }
                }
            }

            const penaltyFactor = 1.0 - (mismatchPenalty * 0.03); // 3% de penalidade por jogador fora de posição
            forcaMedia *= penaltyFactor;


            if (this.tatica === "Ataque") forcaMedia *= 1.05;
            else if (this.tatica === "Defesa") forcaMedia *= 0.95;

            if (!this.eh_jogador) forcaMedia += ((Game.gameManager.divisoes[this.divisao]).media_forca_ia - 60) * 0.5;

            return Math.max(1, forcaMedia);
        }
        atualizarRecuperacao() { this.jogadores.forEach(j => j.recuperar(this.titulares.includes(j.id))); }
        static fromJSON(data) {
            const t = new Game.Time(data.nome, data.saldo, data.eh_jogador, data.divisao);
            Object.assign(t, data);
            t.jogadores = data.jogadores.map(jData => Game.Jogador.fromJSON(jData));
            t.youthSquad = (data.youthSquad || []).map(jData => Game.Jogador.fromJSON(jData));
            t.staff = (data.staff || []).map(sData => Game.Staff.fromJSON(sData));
            t.sponsorshipDeal = data.sponsorshipDeal || null;
            return t;
        }
    },

    gerarCalendario(times) {
        const calendario = [];
        if (times.length < 2) return calendario;

        const timesCopia = [...times];
        if (timesCopia.length % 2 !== 0) {
            timesCopia.push(null); // Adiciona um time fantasma para gerenciar folgas
        }
        const numTimes = timesCopia.length;
        const numRodadas = numTimes - 1;

        for (let rodada = 0; rodada < numRodadas; rodada++) {
            const rodadaPartidas = [];
            for (let i = 0; i < numTimes / 2; i++) {
                const time1 = timesCopia[i];
                const time2 = timesCopia[numTimes - 1 - i];
                if (time1 && time2) { // Ignora partidas com o time fantasma
                    rodadaPartidas.push([time1, time2]);
                }
            }
            calendario.push(rodadaPartidas);

            // Rotaciona os times, mantendo o primeiro fixo
            const ultimo = timesCopia.pop();
            timesCopia.splice(1, 0, ultimo);
        }

        // Cria o segundo turno (returno)
        const calendarioCompleto = [...calendario];
        for (const rodada of calendario) {
            const rodadaVolta = rodada.map(partida => [partida[1], partida[0]]); // Inverte mandante/visitante
            calendarioCompleto.push(rodadaVolta);
        }

        return calendarioCompleto;
    },

    Divisao: class Divisao {
        nome;
        times; // Time[]
        promoteCount;
        relegatCount;
        size;
        media_forca_ia;
        calendario;

        constructor(nome, times, promoteCount, relegatCount, size) {
            this.nome = nome || ''; this.times = times || []; this.promoteCount = promoteCount || 0;
            this.relegatCount = relegatCount || 0; this.size = size || 0; this.media_forca_ia = 60;
            this.calendario = [];
        }
        jogarRodadaCalendario(rodadaIndex, timesExcluidos = new Set()) {
            if (rodadaIndex < 0 || rodadaIndex >= this.calendario.length) return [];

            const resultados = [];
            const partidasDaRodada = this.calendario[rodadaIndex];

            for (const partida of partidasDaRodada) {
                const [time1, time2] = partida;
                if (!timesExcluidos.has(time1.id) && !timesExcluidos.has(time2.id)) {
                    resultados.push(this.simularPartida(time1, time2));
                }
            }

            const timesQueJogaram = new Set(resultados.flatMap(r => [r.time1_id, r.time2_id]));
            for (const t of this.times) {
                if (timesQueJogaram.has(t.id)) {
                    if (t.jogadores.length > 0) {
                        t.titulares.map(id => t.getJogador(id)).filter(Boolean).forEach(j => j.fadiga = Math.min(100, j.fadiga + 25));
                    }
                }
                t.atualizarRecuperacao();
            }
            return resultados;
        }
        simularPartida(time1, time2, isMataMata = false) {
            const f1 = time1.calcularForca(isMataMata), f2 = time2.calcularForca(isMataMata);
            let gols1 = Math.max(0, Math.floor(f1 / 50 + Math.random() * 3));
            let gols2 = Math.max(0, Math.floor(f2 / 50 + Math.random() * 3));

            if (isMataMata && gols1 === gols2) {
                if (f1 > f2) gols1++; else gols2++;
            }

            if (!isMataMata) {
                time1.gols_pro += gols1; time1.gols_contra += gols2;
                time2.gols_pro += gols2; time2.gols_contra += gols1;
                if (gols1 > gols2) {
                    time1.vitorias++;
                    time1.pontos += 3;
                    time2.derrotas++;
                } else if (gols2 > gols1) {
                    time2.vitorias++;
                    time2.pontos += 3;
                    time1.derrotas++;
                } else {
                    time1.empates++;
                    time1.pontos++;
                    time2.empates++;
                    time2.pontos++;
                }
            }

            return {
                time1: time1.nome, time1_id: time1.id, gols1,
                time2: time2.nome, time2_id: time2.id, gols2
            };
        }
        getTabelaClassificacao() {
            return [...this.times].sort((a, b) => b.pontos - a.pontos || (b.gols_pro - b.gols_contra) - (a.gols_pro - a.gols_contra) || b.gols_pro - a.gols_pro);
        }
        static fromJSON(data) {
            const d = new Game.Divisao(data.nome, [], data.promoteCount, data.relegatCount, data.size);
            Object.assign(d, data);
            d.times = data.times.map(tData => Game.Time.fromJSON(tData));
            d.calendario = []; // Calendário será gerado no carregamento
            return d;
        }
    },

    CopaManager: class CopaManager {
        todosOsTimes; // Time[]
        timesNaDisputa; // Time[]
        rodada;
        resultados;
        finalizada;
        campeao; // Time | null

        constructor(todosOsTimes) {
            this.todosOsTimes = todosOsTimes;
            this.timesNaDisputa = [...this.todosOsTimes];
            this.rodada = 1;
            this.resultados = {}; // { 1: [resultados], 2: ... }
            this.finalizada = false;
            this.campeao = null;
        }

        avancarRodada() {
            if (this.finalizada) return null;

            const timesDisponiveis = [...this.timesNaDisputa];
            timesDisponiveis.sort(() => Math.random() - 0.5);
            const vencedores = [];
            const resultadosDaRodada = [];

            let timeDeFolga = null;
            if (timesDisponiveis.length % 2 !== 0) {
                timeDeFolga = timesDisponiveis.pop();
                vencedores.push(timeDeFolga);
            }

            while (timesDisponiveis.length >= 2) {
                const time1 = timesDisponiveis.pop();
                const time2 = timesDisponiveis.pop();
                const resultado = Game.gameManager.divisoes['A'].simularPartida(time1, time2, true);
                const vencedor = resultado.gols1 > resultado.gols2 ? time1 : time2;
                vencedores.push(vencedor);
                resultadosDaRodada.push(resultado);
            }

            this.resultados[this.rodada] = resultadosDaRodada;
            if (timeDeFolga) {
                this.resultados[this.rodada].push({ time1: timeDeFolga.nome, time1_id: timeDeFolga.id, gols1: 'FOLGA', time2: '', time2_id: '', gols2: '' });
            }

            this.timesNaDisputa = vencedores;

            if (this.timesNaDisputa.length === 1) {
                this.finalizada = true;
                this.campeao = this.timesNaDisputa[0];
            }

            const currentRoundResults = this.resultados[this.rodada];
            this.rodada++;
            return currentRoundResults;
        }

        static fromJSON(data) {
            const cm = new Game.CopaManager([]);
            Object.assign(cm, data);
            // Precisa re-associar os times reais, pois o JSON só tem os IDs.
            // Fix: Explicitly type `d` as `any` to resolve implicit `unknown` type error.
            const allTeams = Object.values(Game.gameManager.divisoes).flatMap((d: any) => d.times);
            cm.todosOsTimes = data.todosOsTimes.map(tData => allTeams.find(t => t.id === tData.id));
            cm.timesNaDisputa = data.timesNaDisputa.map(tData => allTeams.find(t => t.id === tData.id));
            if (data.campeao) {
                cm.campeao = allTeams.find(t => t.id === data.campeao.id);
            }
            return cm;
        }
    },

    gerarJogador(habMin, habMax, potRange, idadeMin, idadeMax, bonusOlheiro = 0) {
        const nome = this.NOMES_PRIMEIROS[Math.floor(Math.random() * this.NOMES_PRIMEIROS.length)] + ' ' + this.NOMES_SOBRENOMES[Math.floor(Math.random() * this.NOMES_SOBRENOMES.length)];
        const posicao = this.POSICOES[Math.floor(Math.random() * this.POSICOES.length)];
        const idade = Math.floor(Math.random() * (idadeMax - idadeMin + 1)) + idadeMin;

        const potBonus = Math.floor(bonusOlheiro / 10);
        const habBonus = Math.floor(bonusOlheiro / 20);

        const potencialMin = Math.min(99, potRange[0] + potBonus);
        const potencialMax = Math.min(100, potRange[1] + potBonus);

        const atributos = {};
        const attrBase = Math.floor(Math.random() * (habMax - habMin + 1)) + habMin + habBonus;
        const pesos = this.ATRIBUTO_PESOS[posicao];

        Object.keys(pesos).forEach(attr => {
            const variacao = (Math.random() - 0.5) * 20; // Variação de -10 a +10
            const pesoMultiplier = 1 + (pesos[attr] * 2); // Atributos importantes são naturalmente maiores
            atributos[attr] = Math.max(30, Math.min(potencialMax, attrBase * pesoMultiplier + variacao));
        });

        const moral = Math.floor(Math.random() * 21) + 60;
        const jogador = new this.Jogador(nome, posicao, atributos, moral, idade, [potencialMin, potencialMax]);

        // Calculate salary based on OVR and Potential
        const salarioBase = 10;
        jogador.salario = Math.floor(salarioBase + Math.pow(jogador.habilidade, 2) / 20 + Math.pow(jogador.potencial, 2) / 50);
        // Set contract length based on age
        if (idade < 22) jogador.contratoAnos = 5;
        else if (idade < 28) jogador.contratoAnos = 4;
        else if (idade < 32) jogador.contratoAnos = 3;
        else jogador.contratoAnos = 2;


        if (idade < 21 && Math.random() < 0.2) jogador.traits.push('Jovem Promessa');
        if (idade > 29 && Math.random() < 0.25) jogador.traits.push('Veterano Experiente');
        if (Math.random() < 0.05) jogador.traits.push('Líder');
        if (Math.random() < 0.1) jogador.traits.push('Propenso a Lesões');
        if (Math.random() < 0.08) jogador.traits.push('Inconstante');
        if (Math.random() < 0.06) jogador.traits.push('Decisivo');

        return jogador;
    },

    gerarNovoMercado() {
        this.mercadoJogadores = [];
        const bonusOlheiro = this.meuTime.getStaffBonus('Olheiro');
        for (let i = 0; i < 8; i++) {
            this.mercadoJogadores.push(this.gerarJogador(65, 95, [75, 100], 20, 30, bonusOlheiro));
        }
        this.atualizarGraficos();
    },

    gerarStaff(habMin, habMax) {
        const nome = this.NOMES_PRIMEIROS[Math.floor(Math.random() * this.NOMES_PRIMEIROS.length)] + ' ' + this.NOMES_SOBRENOMES[Math.floor(Math.random() * this.NOMES_SOBRENOMES.length)];
        const tipo = this.STAFF_TIPOS[Math.floor(Math.random() * this.STAFF_TIPOS.length)];
        const habilidade = Math.floor(Math.random() * (habMax - habMin + 1)) + habMin;
        return new this.Staff(nome, tipo, habilidade);
    },

    gerarMercadoStaff() {
        this.mercadoStaff = [];
        for (let i = 0; i < 6; i++) {
            this.mercadoStaff.push(this.gerarStaff(50, 95));
        }
        this.atualizarGraficos();
    },

    initGame() {
        this.meuTime = new this.Time("Meu Clube FC", 30000, true, 'F');
        this.historicoCampeoes = {};
        let nomesIA = [...this.NOME_TIMES_IA];
        nomesIA.sort(() => Math.random() - 0.5);
        const todosOsTimes = [this.meuTime];
        for (let i = 0; i < this.TOTAL_TIMES - 1; i++) {
            const nomeTime = nomesIA[i] || `Clube Genérico ${i + 1}`;
            todosOsTimes.push(new this.Time(nomeTime, 3000));
        }

        let teamsA = [], teamsB = [], teamsC = [], teamsD = [], teamsE = [], teamsF = [];
        const divisionPools = { 'A': teamsA, 'B': teamsB, 'C': teamsC, 'D': teamsD, 'E': teamsE, 'F': teamsF };

        for (const t of todosOsTimes) {
            let currentDiv = 'F';
            if (!t.eh_jogador) {
                if (teamsA.length < this.TIMES_PER_DIVISION) currentDiv = 'A';
                else if (teamsB.length < this.TIMES_PER_DIVISION) currentDiv = 'B';
                else if (teamsC.length < this.TIMES_PER_DIVISION) currentDiv = 'C';
                else if (teamsD.length < this.TIMES_PER_DIVISION) currentDiv = 'D';
                else if (teamsE.length < this.TIMES_PER_DIVISION) currentDiv = 'E';
                else currentDiv = 'F';
                t.divisao = currentDiv;
            } else {
                currentDiv = t.divisao;
            }

            divisionPools[currentDiv].push(t);

            const habRanges = { 'A': [75, 95, [85, 100]], 'B': [60, 85, [75, 95]], 'C': [45, 75, [65, 90]], 'D': [30, 60, [50, 80]], 'E': [20, 45, [40, 75]], 'F': [15, 35, [30, 70]] };
            const [habMin, habMax, potRange] = habRanges[currentDiv];

            const initialPlayers = t.eh_jogador ? 18 : 15;
            for (let i = 0; i < initialPlayers; i++) {
                const initialPlayer = this.gerarJogador(habMin, habMax, potRange, 18, 25);
                initialPlayer.temporadaContratado = 1;
                initialPlayer.picoHabilidade = initialPlayer.habilidade;
                const custo = Math.floor(initialPlayer.habilidade * 10);
                if (t.saldo >= custo) {
                    t.jogadores.push(initialPlayer);
                    t.saldo -= custo;
                }
            }
            t.jogadores.sort((a, b) => b.habilidade - a.habilidade);
            t.titulares = t.jogadores.slice(0, this.MAX_TITULARES).map(j => j.id);
        }

        this.gameManager = {
            meuTime: this.meuTime,
            divisoes: {
                'A': new this.Divisao("Série A", teamsA, 0, this.PROMOTE_RELEGATE_COUNT, this.TIMES_PER_DIVISION),
                'B': new this.Divisao("Série B", teamsB, this.PROMOTE_RELEGATE_COUNT, this.PROMOTE_RELEGATE_COUNT, this.TIMES_PER_DIVISION),
                'C': new this.Divisao("Série C", teamsC, this.PROMOTE_RELEGATE_COUNT, this.PROMOTE_RELEGATE_COUNT, this.TIMES_PER_DIVISION),
                'D': new this.Divisao("Série D", teamsD, this.PROMOTE_RELEGATE_COUNT, this.PROMOTE_RELEGATE_COUNT, this.TIMES_PER_DIVISION),
                'E': new this.Divisao("Série E", teamsE, this.PROMOTE_RELEGATE_COUNT, this.PROMOTE_RELEGATE_COUNT, this.TIMES_PER_DIVISION),
                'F': new this.Divisao("Série F", teamsF, this.PROMOTE_RELEGATE_COUNT, 0, this.TIMES_PER_DIVISION)
            }
        };

        Object.values(this.gameManager.divisoes).forEach((div: any) => {
            div.calendario = this.gerarCalendario(div.times);
        });

        this.copaManager = new this.CopaManager(Object.values(this.gameManager.divisoes).flatMap((d: any) => d.times));

        this.gameManager.divisoes['A'].media_forca_ia = 85; this.gameManager.divisoes['B'].media_forca_ia = 70;
        this.gameManager.divisoes['C'].media_forca_ia = 55; this.gameManager.divisoes['D'].media_forca_ia = 40;
        this.gameManager.divisoes['E'].media_forca_ia = 25;
        this.gameManager.divisoes['F'].media_forca_ia = 15;

        this.meuTime.sponsorshipDeal = {
            name: 'Patrocínio Inicial',
            baseValue: 6000,
            titleBonus: 5000,
            promotionBonus: 10000,
            cupBonus: 2000,
            seasons: 1,
            seasonsRemaining: 1
        };

        // Fix: Cast to HTMLInputElement
        (document.getElementById('team-name-input') as HTMLInputElement).value = this.meuTime.nome;
        (document.getElementById('toggle-press-conference') as HTMLInputElement).checked = this.configuracoes.coletivaOpcional;
        this.gerarNovoMercado();
        this.gerarMercadoStaff();
        this.atualizarGraficos();
    },

    treinar(foco) {
        this.meuTime.treinarElenco(foco);
        this.fecharTreinoModal();
        this.atualizarGraficos();
        this.exibirMensagem(`Treinamento com foco ${foco} concluído.`, "info");
    },

    curarJogadorImediatamente(jogadorId) {
        const jogador = this.meuTime.getJogador(jogadorId);
        if (!jogador || !jogador.lesionado) return;
        const resultado = this.meuTime.curarJogador(jogadorId);
        if (resultado.success) {
            this.atualizarGraficos();
            this.exibirMensagem(`${jogador.nome} curado por $${resultado.custo.toLocaleString('pt-BR')}!`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo: $${resultado.custo.toLocaleString('pt-BR')}.`, "error");
        }
    },

    alterarTatica(novaTatica) {
        this.meuTime.setTatica(novaTatica);
        this.atualizarGraficos();
    },

    alterarFormacao(novaFormacao) {
        this.meuTime.formacao = novaFormacao;
        this.atualizarGraficos();
        this.exibirMensagem(`Formação alterada para ${novaFormacao}.`, 'info');
    },

    contratarJogador(index) {
        const jogador = this.mercadoJogadores[index];
        if (!jogador) return;
        const resultado = this.meuTime.contratar(jogador);
        if (resultado.success) {
            this.mercadoJogadores.splice(index, 1);
            this.atualizarGraficos();
            this.exibirMensagem(`${jogador.nome} contratado por $${resultado.custo.toLocaleString('pt-BR')}.`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo: $${resultado.custo.toLocaleString('pt-BR')}.`, "error");
        }
    },

    contratarStaff(index) {
        const staffMember = this.mercadoStaff[index];
        if (!staffMember) return;
        if (this.meuTime.staff.some(s => s.tipo === staffMember.tipo)) {
            this.exibirMensagem(`Você já tem um ${staffMember.tipo}. Demita o atual primeiro.`, 'error');
            return;
        }
        const resultado = this.meuTime.contratarStaff(staffMember);
        if (resultado.success) {
            this.mercadoStaff.splice(index, 1);
            this.atualizarGraficos();
            this.exibirMensagem(`${staffMember.nome} (${staffMember.tipo}) contratado! Custo: $${resultado.custo.toLocaleString('pt-BR')}.`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo: $${resultado.custo.toLocaleString('pt-BR')}.`, "error");
        }
    },

    demitirStaff(staffId) {
        const resultado = this.meuTime.demitirStaff(staffId);
        if (resultado.success) {
            this.atualizarGraficos();
            this.exibirMensagem(`${resultado.nome} demitido. Custo da recisão: $${resultado.custo.toLocaleString('pt-BR')}.`, 'warning');
        } else {
            this.exibirMensagem(`Saldo insuficiente para pagar a recisão de ${resultado.nome}! Custo: $${resultado.custo.toLocaleString('pt-BR')}.`, 'error');
        }
    },

    venderJogador(jogadorId) {
        const jogador = this.meuTime.getJogador(jogadorId);
        if (!jogador) return;
        const resultado = this.meuTime.venderJogador(jogadorId);
        if (resultado.success) {
            this.atualizarGraficos();
            this.exibirMensagem(`${jogador.nome} vendido por $${resultado.preco.toLocaleString('pt-BR')}.`, "warning");
        }
    },

    renovarContratoJogador(jogadorId) {
        const resultado = this.meuTime.renovarContrato(jogadorId);
        if (resultado.success) {
            this.exibirMensagem(resultado.message, "success");
            this.updateSquadView();
            // Se o modal de jogador estiver aberto, fecha e reabre para atualizar.
            if (!document.getElementById('player-detail-modal').classList.contains('hidden')) {
                this.mostrarPlayerModal(jogadorId);
            }
        } else {
            this.exibirMensagem(resultado.message, "error");
        }
    },

    toggleTitularidade(jogadorId, isTitular) {
        if (isTitular) {
            this.meuTime.moverParaReserva(jogadorId);
        } else {
            if (!this.meuTime.moverParaTitular(jogadorId)) {
                this.exibirMensagem(`Você já tem ${this.MAX_TITULARES} titulares ou o jogador está indisponível.`, "error");
            }
        }
        this.atualizarGraficos();
    },

    upgradeEstadio() {
        const resultado = this.meuTime.melhorarEstadio();
        if (resultado.success) {
            this.atualizarGraficos();
            this.exibirMensagem(`Estádio melhorado para o Nível ${this.meuTime.estadio_nivel} por $${resultado.custo.toLocaleString('pt-BR')}!`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente para melhorar o estádio! Custo: $${Math.floor(resultado.custo).toLocaleString('pt-BR')}`, "error");
        }
    },

    investirNaBase(nivel) {
        const custos = { 1: 0, 2: 250000, 3: 1000000 };
        const nomes = { 1: 'Básico', 2: 'Intermediário', 3: 'Avançado' };
        const custo = custos[nivel];

        if (this.meuTime.investimento_base_nivel === nivel) {
            this.exibirMensagem(`Você já está no nível de investimento ${nomes[nivel]}.`, 'info');
            return;
        }

        // Reembolsa o investimento anterior se estiver fazendo upgrade/downgrade
        const custoAnterior = custos[this.meuTime.investimento_base_nivel] || 0;
        const custoReal = custo - custoAnterior;

        if (this.meuTime.saldo >= custoReal) {
            this.meuTime.saldo -= custoReal;
            this.meuTime.investimento_base_nivel = nivel;
            this.atualizarGraficos();
            this.exibirMensagem(`Investimento na base alterado para ${nomes[nivel]}! Custo da operação: $${Math.floor(custoReal).toLocaleString('pt-BR')}.`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo para mudar: $${Math.floor(custoReal).toLocaleString('pt-BR')}`, "error");
        }
    },


    melhorarAcademia() {
        const custo = Math.floor(100000 * Math.pow(1.5, this.meuTime.academia_nivel - 1));
        if (this.meuTime.saldo >= custo) {
            this.meuTime.saldo -= custo;
            this.meuTime.academia_nivel++;
            this.atualizarGraficos();
            this.exibirMensagem(`Academia melhorada para o Nível ${this.meuTime.academia_nivel} por $${custo.toLocaleString('pt-BR')}!`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo: $${custo.toLocaleString('pt-BR')}`, "error");
        }
    },

    melhorarCentroTreinamento() {
        const custo = Math.floor(120000 * Math.pow(1.6, this.meuTime.centro_treinamento_nivel - 1));
        if (this.meuTime.saldo >= custo) {
            this.meuTime.saldo -= custo;
            this.meuTime.centro_treinamento_nivel++;
            this.atualizarGraficos();
            this.exibirMensagem(`Centro de Treinamento melhorado para o Nível ${this.meuTime.centro_treinamento_nivel} por $${custo.toLocaleString('pt-BR')}!`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo: $${custo.toLocaleString('pt-BR')}`, "error");
        }
    },

    melhorarDeptoMedico() {
        const custo = Math.floor(150000 * Math.pow(1.5, this.meuTime.depto_medico_nivel - 1));
        if (this.meuTime.saldo >= custo) {
            this.meuTime.saldo -= custo;
            this.meuTime.depto_medico_nivel++;
            this.atualizarGraficos();
            this.exibirMensagem(`Departamento Médico melhorado para o Nível ${this.meuTime.depto_medico_nivel} por $${custo.toLocaleString('pt-BR')}!`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo: $${custo.toLocaleString('pt-BR')}`, "error");
        }
    },

    melhorarDeptoMarketing() {
        const custo = Math.floor(80000 * Math.pow(1.7, this.meuTime.depto_marketing_nivel - 1));
        if (this.meuTime.saldo >= custo) {
            this.meuTime.saldo -= custo;
            this.meuTime.depto_marketing_nivel++;
            this.atualizarGraficos();
            this.exibirMensagem(`Depto. de Marketing melhorado para o Nível ${this.meuTime.depto_marketing_nivel} por $${custo.toLocaleString('pt-BR')}!`, "success");
        } else {
            this.exibirMensagem(`Saldo insuficiente! Custo: $${custo.toLocaleString('pt-BR')}`, "error");
        }
    },

    simularPartidaComEmpate(time1, time2) {
        const f1 = time1.calcularForca(true), f2 = time2.calcularForca(true); // isPlayoff = true
        const gols1 = Math.max(0, Math.floor(f1 / 50 + Math.random() * 3));
        const gols2 = Math.max(0, Math.floor(f2 / 50 + Math.random() * 3));
        return { gols1, gols2 };
    },

    simularPlayoffMataMata(timesDoPlayoff, vagas, nomeDivisao) {
        if (timesDoPlayoff.length < 4 || vagas !== 2) return { vencedores: [], log: '' };

        let log = `<div class="space-y-3">`;
        const vencedores = [];

        // Semifinais: 3º vs 6º, 4º vs 5º (índices 0 vs 3, 1 vs 2 do array de entrada)
        const semi1_t1 = timesDoPlayoff[0];
        const semi1_t2 = timesDoPlayoff[3];
        const semi2_t1 = timesDoPlayoff[1];
        const semi2_t2 = timesDoPlayoff[2];

        log += `<h3 class="text-lg font-bold mt-4 dark:text-gray-200">Semifinais do Playoff - ${nomeDivisao}</h3>`;

        const res1 = Game.gameManager.divisoes['A'].simularPartida(semi1_t1, semi1_t2, true);
        const vencedor1 = res1.gols1 > res1.gols2 ? semi1_t1 : semi1_t2;
        vencedores.push(vencedor1);
        const classeDestaque1 = (semi1_t1.eh_jogador || semi1_t2.eh_jogador) ? 'seu-time-playoff' : 'bg-gray-100 dark:bg-gray-700';
        log += `<div class="p-2 ${classeDestaque1} rounded">${res1.time1} <b class="text-indigo-600">${res1.gols1}</b> x <b>${res1.gols2}</b> ${res1.time2}</div>`;

        const res2 = Game.gameManager.divisoes['A'].simularPartida(semi2_t1, semi2_t2, true);
        const vencedor2 = res2.gols1 > res2.gols2 ? semi2_t1 : semi2_t2;
        vencedores.push(vencedor2);
        const classeDestaque2 = (semi2_t1.eh_jogador || semi2_t2.eh_jogador) ? 'seu-time-playoff' : 'bg-gray-100 dark:bg-gray-700';
        log += `<div class="p-2 ${classeDestaque2} rounded">${res2.time1} <b class="text-indigo-600">${res2.gols1}</b> x <b>${res2.gols2}</b> ${res2.time2}</div>`;

        log += `</div><div class="mt-4 p-3 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-bold rounded">🏆 ${vencedor1.nome} e ${vencedor2.nome} garantem o acesso!</div>`;

        return { vencedores, log };
    },

    simularQuadrangularSerieF(timesDoPlayoff) {
        let log = `<div class="space-y-3">`;
        let quadrangularTabela = timesDoPlayoff.map(t => ({
            time: t,
            pontos: 0,
            vitorias: 0,
            empates: 0,
            derrotas: 0,
            gols_pro: 0,
            gols_contra: 0
        }));

        const partidas = [
            [0, 1], [2, 3],
            [0, 2], [1, 3],
            [0, 3], [1, 2]
        ];

        for (let i = 0; i < 3; i++) {
            log += `<h3 class="text-lg font-bold mt-4 dark:text-gray-200">Rodada ${i + 1}</h3>`;
            const p1_idx = partidas[i * 2];
            const p2_idx = partidas[i * 2 + 1];

            const time1_p1 = quadrangularTabela[p1_idx[0]];
            const time2_p1 = quadrangularTabela[p1_idx[1]];
            const res1 = this.simularPartidaComEmpate(time1_p1.time, time2_p1.time);

            const time1_p2 = quadrangularTabela[p2_idx[0]];
            const time2_p2 = quadrangularTabela[p2_idx[1]];
            const res2 = this.simularPartidaComEmpate(time1_p2.time, time2_p2.time);

            const todosResultados = [
                { t1: time1_p1, t2: time2_p1, res: res1 },
                { t1: time1_p2, t2: time2_p2, res: res2 }
            ];

            todosResultados.forEach(({ t1, t2, res }) => {
                t1.gols_pro += res.gols1; t1.gols_contra += res.gols2;
                t2.gols_pro += res.gols2; t2.gols_contra += res.gols1;
                if (res.gols1 > res.gols2) { t1.pontos += 3; t1.vitorias++; t2.derrotas++; }
                else if (res.gols2 > res.gols1) { t2.pontos += 3; t2.vitorias++; t1.derrotas++; }
                else { t1.pontos++; t2.pontos++; t1.empates++; t2.empates++; }

                const classeDestaque = (t1.time.eh_jogador || t2.time.eh_jogador) ? 'seu-time-playoff' : 'bg-gray-100 dark:bg-gray-700';
                log += `<div class="p-2 ${classeDestaque} rounded">${t1.time.nome} <b class="text-indigo-600">${res.gols1}</b> x <b>${res.gols2}</b> ${t2.time.nome}</div>`;
            });
        }

        quadrangularTabela.sort((a, b) =>
            b.pontos - a.pontos ||
            (b.gols_pro - b.gols_contra) - (a.gols_pro - a.gols_contra) ||
            b.gols_pro - a.gols_pro
        );

        log += `<h3 class="text-lg font-bold mt-6 mb-2 dark:text-gray-200">Tabela Final do Quadrangular</h3>`;
        log += `<table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-300">
                    <tr>
                        <th class="px-2 py-2">#</th><th class="px-4 py-2">Time</th><th class="px-2 py-2">P</th><th class="px-2 py-2">SG</th><th class="px-2 py-2">GP</th>
                    </tr>
                </thead><tbody>`;
        quadrangularTabela.forEach((item, index) => {
            const isPromoted = index === 0 ? 'bg-green-100 dark:bg-green-900/50 font-bold' : '';
            const isPlayer = item.time.eh_jogador ? 'seu-time-playoff' : '';
            log += `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 ${isPromoted} ${isPlayer}">
                    <td class="px-2 py-2">${index + 1}</td>
                    <th class="px-4 py-2 font-medium text-gray-900 dark:text-white whitespace-nowrap">${item.time.nome}</th>
                    <td class="px-2 py-2">${item.pontos}</td>
                    <td class="px-2 py-2">${item.gols_pro - item.gols_contra}</td>
                    <td class="px-2 py-2">${item.gols_pro}</td>
                </tr>`;
        });
        log += `</tbody></table>`;

        const vencedor = quadrangularTabela[0].time;
        log += `</div><div class="mt-4 p-3 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 font-bold rounded">🏆 ${vencedor.nome} conquista a última vaga para a Série E!</div>`;

        return { vencedor: vencedor, log: log };
    },


    promoverRebaixar() {
        const divisaoAnterior = this.meuTime.divisao;
        const { A: serieA, B: serieB, C: serieC, D: serieD, E: serieE, F: serieF } = this.gameManager.divisoes;
        const tabelaA = serieA.getTabelaClassificacao(), tabelaB = serieB.getTabelaClassificacao();
        const tabelaC = serieC.getTabelaClassificacao(), tabelaD = serieD.getTabelaClassificacao();
        const tabelaE = serieE.getTabelaClassificacao(), tabelaF = serieF.getTabelaClassificacao();

        let playoffResultLog = null;

        // A <-> B
        const rebaixadosAtoB = tabelaA.slice(-this.PROMOTE_RELEGATE_COUNT), promovidosBtoA = tabelaB.slice(0, this.PROMOTE_RELEGATE_COUNT);
        // B <-> C
        const rebaixadosBtoC = tabelaB.slice(-this.PROMOTE_RELEGATE_COUNT), promovidosCtoB = tabelaC.slice(0, this.PROMOTE_RELEGATE_COUNT);

        // C <-> D (Playoff for D)
        const rebaixadosCtoD = tabelaC.slice(-this.PROMOTE_RELEGATE_COUNT);
        const promovidosDiretoDtoC = tabelaD.slice(0, 2);
        const timesPlayoffD = tabelaD.slice(2, 6);
        const playoffResultD = this.simularPlayoffMataMata(timesPlayoffD, 2, "Série D");
        const promovidosDtoC = [...promovidosDiretoDtoC, ...playoffResultD.vencedores];
        if (divisaoAnterior === 'D') playoffResultLog = playoffResultD.log;

        // D <-> E (Playoff for E)
        const rebaixadosDtoE = tabelaD.slice(-this.PROMOTE_RELEGATE_COUNT);
        const promovidosDiretoEtoD = tabelaE.slice(0, 2);
        const timesPlayoffE = tabelaE.slice(2, 6);
        const playoffResultE = this.simularPlayoffMataMata(timesPlayoffE, 2, "Série E");
        const promovidosEtoD = [...promovidosDiretoEtoD, ...playoffResultE.vencedores];
        if (divisaoAnterior === 'E') playoffResultLog = playoffResultE.log;

        // E <-> F (Quadrangular for F)
        const rebaixadosEtoF = tabelaE.slice(-this.PROMOTE_RELEGATE_COUNT);
        let promovidosFtoE = [];
        if (tabelaF.length >= 7) {
            const promovidosDireto = tabelaF.slice(0, 3);
            const timesDoPlayoffF = tabelaF.slice(3, 7);
            const playoffResultF = this.simularQuadrangularSerieF(timesDoPlayoffF);
            promovidosFtoE = [...promovidosDireto, playoffResultF.vencedor];
            if (divisaoAnterior === 'F') playoffResultLog = playoffResultF.log;
        } else {
            promovidosFtoE = tabelaF.slice(0, this.PROMOTE_RELEGATE_COUNT);
        }

        const tabelasAnteriores = { A: tabelaA, B: tabelaB, C: tabelaC, D: tabelaD, E: tabelaE, F: tabelaF };
        const tabelaFinalDivisaoAnterior = tabelasAnteriores[divisaoAnterior];
        const posicaoFinalAnterior = tabelaFinalDivisaoAnterior.findIndex(t => t.id === this.meuTime.id) + 1;
        let campeao = false;

        if (posicaoFinalAnterior === 1) {
            campeao = true;
            if (!this.meuTime.trofeus) this.meuTime.trofeus = {};
            if (!this.meuTime.trofeus[divisaoAnterior]) {
                this.meuTime.trofeus[divisaoAnterior] = [];
            }
            this.meuTime.trofeus[divisaoAnterior].push(this.temporadaCount);
        }

        const novosSerieA = [...tabelaA.slice(0, this.TIMES_PER_DIVISION - this.PROMOTE_RELEGATE_COUNT), ...promovidosBtoA];
        const novosSerieB = [...tabelaB.slice(this.PROMOTE_RELEGATE_COUNT, this.TIMES_PER_DIVISION - this.PROMOTE_RELEGATE_COUNT), ...rebaixadosAtoB, ...promovidosCtoB];
        const novosSerieC = [...tabelaC.slice(this.PROMOTE_RELEGATE_COUNT, this.TIMES_PER_DIVISION - this.PROMOTE_RELEGATE_COUNT), ...rebaixadosBtoC, ...promovidosDtoC];
        const novosSerieD = [...tabelaD.filter(t => !promovidosDtoC.includes(t) && !rebaixadosDtoE.includes(t)), ...rebaixadosCtoD, ...promovidosEtoD];
        const novosSerieE = [...tabelaE.filter(t => !promovidosEtoD.includes(t) && !rebaixadosEtoF.includes(t)), ...rebaixadosDtoE, ...promovidosFtoE];
        const novosSerieF = [...tabelaF.filter(t => !promovidosFtoE.includes(t)), ...rebaixadosEtoF];

        novosSerieA.forEach(t => t.divisao = 'A'); serieA.times = novosSerieA;
        novosSerieB.forEach(t => t.divisao = 'B'); serieB.times = novosSerieB;
        novosSerieC.forEach(t => t.divisao = 'C'); serieC.times = novosSerieC;
        novosSerieD.forEach(t => t.divisao = 'D'); serieD.times = novosSerieD;
        novosSerieE.forEach(t => t.divisao = 'E'); serieE.times = novosSerieE;
        novosSerieF.forEach(t => t.divisao = 'F'); serieF.times = novosSerieF;

        let resultadoFinal = "";

        if (promovidosFtoE.some(t => t.id === this.meuTime.id)) { resultadoFinal = "PROMOÇÃO! Você subiu para a Série E!"; }
        else if (rebaixadosEtoF.some(t => t.id === this.meuTime.id)) { resultadoFinal = "REBAIXAMENTO! Você caiu para a Série F."; }
        else if (promovidosEtoD.some(t => t.id === this.meuTime.id)) { resultadoFinal = "PROMOÇÃO! Você subiu para a Série D!"; }
        else if (rebaixadosDtoE.some(t => t.id === this.meuTime.id)) { resultadoFinal = "REBAIXAMENTO! Você caiu para a Série E."; }
        else if (promovidosDtoC.some(t => t.id === this.meuTime.id)) { resultadoFinal = "PROMOÇÃO! Você subiu para a Série C!"; }
        else if (rebaixadosCtoD.some(t => t.id === this.meuTime.id)) { resultadoFinal = "REBAIXAMENTO! Você caiu para a Série D."; }
        else if (promovidosCtoB.some(t => t.id === this.meuTime.id)) { resultadoFinal = "PROMOÇÃO! Você subiu para a Série B!"; }
        else if (rebaixadosBtoC.some(t => t.id === this.meuTime.id)) { resultadoFinal = "REBAIXAMENTO! Você caiu para a Série C."; }
        else if (promovidosBtoA.some(t => t.id === this.meuTime.id)) { resultadoFinal = "PROMOÇÃO! Você subiu para a Série A!"; }
        else if (rebaixadosAtoB.some(t => t.id === this.meuTime.id)) { resultadoFinal = "REBAIXAMENTO! Você caiu para a Série B."; }
        else { resultadoFinal = `Você permaneceu na Série ${divisaoAnterior}.`; }

        this.meuTime.historico.push({ temporada: this.temporadaCount, divisao: divisaoAnterior, posicao: posicaoFinalAnterior, resultado: resultadoFinal });
        this.meuTime.atualizarPatrocinio(posicaoFinalAnterior);
        return {
            mensagem: `Posição Final: ${posicaoFinalAnterior}º. ${resultadoFinal}`,
            campeao: campeao,
            divisaoVencida: divisaoAnterior,
            logPlayoff: playoffResultLog
        };
    },

    encerrarTemporada() {
        const divAtual = Game.gameManager.divisoes[this.meuTime.divisao];
        const rodadasMax = (divAtual.size - 1) * 2;
        if (this.rodadaCount < rodadasMax) return;

        const { A: serieA, B: serieB, C: serieC, D: serieD, E: serieE, F: serieF } = this.gameManager.divisoes;
        const tabelaA = serieA.getTabelaClassificacao(), tabelaB = serieB.getTabelaClassificacao();
        const tabelaC = serieC.getTabelaClassificacao(), tabelaD = serieD.getTabelaClassificacao();
        const tabelaE = serieE.getTabelaClassificacao(), tabelaF = serieF.getTabelaClassificacao();

        this.historicoCampeoes[this.temporadaCount] = {
            'A': tabelaA.length > 0 ? tabelaA[0].nome : 'N/A',
            'B': tabelaB.length > 0 ? tabelaB[0].nome : 'N/A',
            'C': tabelaC.length > 0 ? tabelaC[0].nome : 'N/A',
            'D': tabelaD.length > 0 ? tabelaD[0].nome : 'N/A',
            'E': tabelaE.length > 0 ? tabelaE[0].nome : 'N/A',
            'F': tabelaF.length > 0 ? tabelaF[0].nome : 'N/A',
        };

        const resultadosDivisao = this.promoverRebaixar();
        let mensagemTemporada = `Fim da Temporada ${this.temporadaCount}! ${resultadosDivisao.mensagem}`;

        // Pagar bônus de patrocínio
        let bonusPatrocinio = 0;
        const deal = this.meuTime.sponsorshipDeal;
        if (deal) {
            if (resultadosDivisao.campeao) {
                bonusPatrocinio += deal.titleBonus || 0;
            }
            if (resultadosDivisao.mensagem.includes("PROMOÇÃO")) {
                bonusPatrocinio += deal.promotionBonus || 0;
            }
            if (this.copaManager.campeao && this.copaManager.campeao.id === this.meuTime.id) {
                bonusPatrocinio += deal.cupBonus || 0;
            }
            if (bonusPatrocinio > 0) {
                this.meuTime.saldo += bonusPatrocinio;
                mensagemTemporada += ` | Bônus de Patrocínio: +$${Math.floor(bonusPatrocinio).toLocaleString('pt-BR')}!`;
            }
        }
        
        if (this.copaManager.campeao && this.copaManager.campeao.id === this.meuTime.id) {
            if (!this.meuTime.trofeus['Copa Total']) this.meuTime.trofeus['Copa Total'] = [];
            this.meuTime.trofeus['Copa Total'].push(this.temporadaCount);
        }

        if (resultadosDivisao.campeao) {
            mensagemTemporada += ` CAMPEÃO DA SÉRIE ${resultadosDivisao.divisaoVencida}! 🏆 O troféu está na sua galeria!`;
        }
        if (this.copaManager.campeao) {
            mensagemTemporada += ` | Campeão da Copa Total: ${this.copaManager.campeao.nome}!`;
            if (this.copaManager.campeao.id === this.meuTime.id) {
                mensagemTemporada += ` 🏆 Você venceu a Copa!`;
            }
        }

        if (this.meuTime.derrotas === 0) {
            const bonusInvicto = 50000 * (1 + (6 - ['A', 'B', 'C', 'D', 'E', 'F'].indexOf(this.meuTime.divisao)));
            this.meuTime.saldo += bonusInvicto;
            mensagemTemporada += ` | Bônus de Temporada Invicta: +$${Math.floor(bonusInvicto).toLocaleString('pt-BR')}!`;
        }

        if (resultadosDivisao.logPlayoff) {
            this.mostrarPlayoffModal(resultadosDivisao.logPlayoff, `Série ${resultadosDivisao.divisaoVencida}`);
        }

        this.meuTime.jogadores.forEach(j => j.envelhecer());
        this.meuTime.youthSquad.forEach(j => j.envelhecer());


        let aposentados = this.meuTime.jogadores.filter(j => j.aposentado);
        if (aposentados.length > 0) {
            let nomesAposentados = [];
            let nomesHoF = [];
            aposentados.forEach(j => {
                nomesAposentados.push(j.nome);
                const temporadasJogadas = this.temporadaCount - j.temporadaContratado;
                if (temporadasJogadas >= 8 && j.picoHabilidade >= 85) {
                    this.meuTime.hallOfFame.push({
                        nome: j.nome,
                        posicao: j.posicao,
                        picoHabilidade: j.picoHabilidade,
                        temporadaInicio: j.temporadaContratado,
                        temporadaFim: this.temporadaCount
                    });
                    nomesHoF.push(j.nome);
                }
            });
            if (nomesAposentados.length > 0) {
                mensagemTemporada += ` | Jogadores aposentados: ${nomesAposentados.join(', ')}.`;
            }
            if (nomesHoF.length > 0) {
                mensagemTemporada += ` | 🌟 ${nomesHoF.join(', ')} entraram para o Hall da Fama do clube!`;
            }
            this.meuTime.jogadores = this.meuTime.jogadores.filter(j => !j.aposentado);
            this.meuTime.titulares = this.meuTime.titulares.filter(id => this.meuTime.getJogador(id));
        }

        // Contract renewals
        let jogadoresSaindo = [];
        this.meuTime.jogadores.forEach(j => {
            j.contratoAnos -= 1;
            if (j.contratoAnos <= 0) {
                jogadoresSaindo.push(j);
            }
        });

        if (jogadoresSaindo.length > 0) {
            const nomesSaindo = jogadoresSaindo.map(j => j.nome).join(', ');
            mensagemTemporada += ` | Jogadores que saíram por fim de contrato: ${nomesSaindo}.`;
            this.meuTime.jogadores = this.meuTime.jogadores.filter(j => j.contratoAnos > 0);
            this.meuTime.titulares = this.meuTime.titulares.filter(id => this.meuTime.getJogador(id));
        }

        Object.values(this.gameManager.divisoes).forEach((div: any, i) => div.media_forca_ia += (6 - i));

        // Gerar jovens da base (Youth Intake)
        const investimento = this.meuTime.investimento_base_nivel;
        const configBase = {
            1: { num: 4, habMin: 30, habMax: 50, potRange: [75, 90] }, // Básico
            2: { num: 5, habMin: 40, habMax: 60, potRange: [82, 95] }, // Intermediário
            3: { num: 6, habMin: 50, habMax: 68, potRange: [88, 100] }  // Avançado
        };
        const { num, habMin, habMax, potRange } = configBase[investimento];
        const bonusOlheiro = this.meuTime.getStaffBonus('Olheiro');
        
        this.meuTime.youthSquad = []; // Limpa a academia antiga
        const numJovens = num + Math.floor(this.meuTime.academia_nivel / 2);

        for (let i = 0; i < numJovens; i++) {
            // Garante pelo menos uma joia no investimento avançado
            const pRange = (investimento === 3 && i === 0) ? [95, 100] : potRange;
            const hMin = (investimento === 3 && i === 0) ? 60 : habMin;
            const novoJovem = this.gerarJogador(hMin, habMax, pRange, 15, 16, bonusOlheiro);
            novoJovem.temporadaContratado = this.temporadaCount + 1;
            novoJovem.picoHabilidade = novoJovem.habilidade;
            this.meuTime.youthSquad.push(novoJovem);
        }
        mensagemTemporada += ` | Uma nova safra de ${numJovens} jovens talentos chegou à sua categoria de base!`;

        if (this.meuTime.sponsorshipDeal) {
            this.meuTime.sponsorshipDeal.seasonsRemaining--;
        }
        
        this.rodadaCount = 0;
        this.temporadaCount++;

        Object.values(this.gameManager.divisoes).forEach((div: any) => {
            div.times.forEach(t => { t.vitorias = t.empates = t.derrotas = t.pontos = t.gols_pro = t.gols_contra = 0; });
            div.calendario = this.gerarCalendario(div.times);
        });

        // Resetar a copa
        const todosOsTimes = Object.values(this.gameManager.divisoes).flatMap((d: any) => d.times);
        this.copaManager = new this.CopaManager(todosOsTimes);

        if (!this.meuTime.sponsorshipDeal || this.meuTime.sponsorshipDeal.seasonsRemaining <= 0) {
            document.getElementById('sponsorship-season-summary').textContent = mensagemTemporada;
            this.gerarOfertasPatrocinio();
        } else {
            this.exibirMensagem(mensagemTemporada, "system");
            this.atualizarGraficos();
        }
    },

    desenvolverJovens() {
        if (!this.meuTime || !this.meuTime.youthSquad) return;

        this.meuTime.youthSquad.forEach(jovem => {
            if (jovem.habilidade >= jovem.potencial) return;
            const fatorAcademia = 1 + (this.meuTime.academia_nivel - 1) * 0.15;
            
            for (const attr in jovem.atributos) {
                if (jovem.atributos[attr] >= jovem.potencial) continue;

                let incremento = Math.random() * 0.25 * fatorAcademia;
                // Jovens promissores evoluem mais rápido
                if (jovem.potencial > 85) incremento *= 1.2;
                if (jovem.potencial > 90) incremento *= 1.2;

                jovem.atributos[attr] = Math.min(jovem.potencial, jovem.atributos[attr] + incremento);
            }
        });
    },

    jogarRodada() {
        if (this.pendingSponsorshipChoice) {
            this.exibirMensagem("Você precisa escolher um novo patrocinador antes de continuar a temporada!", "warning");
            this.mostrarSponsorshipModal();
            return;
        }

        // Fix: Cast to HTMLButtonElement
        (document.getElementById('btn-match') as HTMLButtonElement).disabled = true;
        (document.getElementById('btn-train') as HTMLButtonElement).disabled = true;

        const divAtual = this.gameManager.divisoes[this.meuTime.divisao];
        const rodadasMax = (divAtual.size - 1) * 2;
        if (this.rodadaCount >= rodadasMax) {
            this.encerrarTemporada();
            // Fix: Cast to HTMLButtonElement
            (document.getElementById('btn-match') as HTMLButtonElement).disabled = false;
            (document.getElementById('btn-train') as HTMLButtonElement).disabled = false;
            return;
        }
        this.rodadaCount++;
        this.desenvolverJovens();

        const precoIngressoBase = { 'A': 2.0, 'B': 1.5, 'C': 0.75, 'D': 0.40, 'E': 0.25, 'F': 0.15 }[this.meuTime.divisao] || 0.15;
        const fatorPressao = 1 - (this.pressaoTorcida / 200);
        this.lastTicketIncome = Math.floor(this.meuTime.estadio_capacidade * precoIngressoBase * (Math.random() * 0.5 + 0.5) * fatorPressao);
        this.meuTime.saldo += this.lastTicketIncome;

        let meuResultadoPartida = null;
        let meuResultadoTipo = 'liga';
        let cupParticipantsIds = new Set();

        const isCupRound = this.rodadaCount > 0 && this.rodadaCount % 6 === 0 && !this.copaManager.finalizada;
        if (isCupRound) {
            // Get participants BEFORE advancing the round
            cupParticipantsIds = new Set(this.copaManager.timesNaDisputa.map(t => t.id));
            const resultadosCopa = this.copaManager.avancarRodada();

            const meuResultadoCopa = resultadosCopa.find(r => r.time1_id === this.meuTime.id || r.time2_id === this.meuTime.id);
            if (meuResultadoCopa) {
                meuResultadoPartida = meuResultadoCopa;
                meuResultadoTipo = 'copa';
            }
        }

        // Always simulate league matches for all divisions
        const todosOsResultadosDaLiga = {};
        Object.keys(this.gameManager.divisoes).forEach(divKey => {
            const divisao = this.gameManager.divisoes[divKey];
            todosOsResultadosDaLiga[divKey] = divisao.jogarRodadaCalendario(this.rodadaCount - 1, cupParticipantsIds);
        });

        // Find my league result IF I didn't play in the cup
        if (meuResultadoTipo !== 'copa') {
            const resultadosMinhaDivisao = todosOsResultadosDaLiga[this.meuTime.divisao];
            if (resultadosMinhaDivisao) {
                const resultadoLiga = resultadosMinhaDivisao.find(r => r.time1_id === this.meuTime.id || r.time2_id === this.meuTime.id);
                if (resultadoLiga) {
                    meuResultadoPartida = resultadoLiga;
                    meuResultadoTipo = 'liga';
                } else {
                    meuResultadoTipo = 'folga_liga';
                }
            }
        }

        // Process the result for the player's team and finalize the round
        this.pendingMatchResult = { message: ` | Ingressos: +$${this.lastTicketIncome.toLocaleString('pt-BR')}.`, type: 'info' };

        if (meuResultadoTipo === 'copa') {
            let cupResultString;
            let cupResultType = 'info';
            if (meuResultadoPartida.gols1 === 'FOLGA') {
                cupResultString = `COPA: Rodada ${this.copaManager.rodada - 1} | Seu time folgou e avançou.`;
                this.pendingMatchResult.message += ` | COPA: Avançou de fase.`;
            } else {
                const golsM = meuResultadoPartida.time1_id === this.meuTime.id ? meuResultadoPartida.gols1 : meuResultadoPartida.gols2;
                const golsA = meuResultadoPartida.time1_id === this.meuTime.id ? meuResultadoPartida.gols2 : meuResultadoPartida.gols1;
                const adversarioNome = meuResultadoPartida.time1_id === this.meuTime.id ? meuResultadoPartida.time2 : meuResultadoPartida.time1;
                cupResultString = `COPA: Rodada ${this.copaManager.rodada - 1} | ${this.meuTime.nome} ${golsM} x ${golsA} ${adversarioNome}`;

                const venci = golsM > golsA;
                if (venci) {
                    const premio = 50000 * (this.copaManager.rodada - 1);
                    this.meuTime.saldo += premio;
                    this.pendingMatchResult.message += ` | COPA: Classificado! Prêmio: +$${premio.toLocaleString('pt-BR')}.`;
                    cupResultType = 'success';
                } else {
                    this.pendingMatchResult.message += ` | COPA: Eliminado.`;
                    cupResultType = 'error';
                }
            }
            this.pendingMatchResult.message = cupResultString + this.pendingMatchResult.message;
            this.pendingMatchResult.type = cupResultType;
            this.finalizarJogadaRodada(); // No press conference for cup matches
        } else if (meuResultadoTipo === 'liga') {
            if (this.meuTime.titulares.length < this.MAX_TITULARES) {
                this.pendingMatchResult.message += ` AVISO: Time jogou a liga com ${this.meuTime.titulares.length} titulares!`;
            }
            if (this.configuracoes.coletivaOpcional) {
                const contexto = this.criarContextoColetiva(meuResultadoPartida);
                this.mostrarColetivaDeImprensa(contexto);
            } else {
                const contexto = this.criarContextoColetiva(meuResultadoPartida);
                this.responderColetiva({ type: 'neutral', contexto: contexto });
            }
        } else { // folga_liga
            let mensagemFolga = `Rodada ${this.rodadaCount} | Seu time folgou na liga.`
            this.pendingMatchResult.message = mensagemFolga + this.pendingMatchResult.message;
            this.finalizarJogadaRodada();
        }
    },

    finalizarJogadaRodada() {
        this.lastFinanceCycleIncome = 0;
        const rodadasMax = (this.gameManager.divisoes[this.meuTime.divisao].size - 1) * 2;
        if (this.rodadaCount % this.RODADAS_PARA_PAGAMENTO === 0) {
            this.meuTime.receberPatrocinioESalarios();
            this.pendingMatchResult.message += ` | Patrocínio e Salários (ciclo) pagos.`;
        }

        const divAtual = this.gameManager.divisoes[this.meuTime.divisao];
        const tabela = divAtual.getTabelaClassificacao();
        const minhaPosicao = tabela.findIndex(t => t.id === this.meuTime.id) + 1;
        const tamanhoLiga = divAtual.size;

        this.meuTime.jogadores.forEach(j => {
            j.updateHappiness(this.meuTime, minhaPosicao, tamanhoLiga);
        });

        const moralPressao = Math.floor(this.pressaoTorcida / 20); // 0-5 penalty
        this.meuTime.jogadores.forEach(j => {
            let modMoral = j.traits.includes('Veterano Experiente') ? moralPressao * 0.5 : moralPressao;
            j.moral = Math.max(0, j.moral - modMoral);
        });
        if (moralPressao > 0) this.pendingMatchResult.message += ` | Moral afetado pela pressão da torcida (-${moralPressao}).`;

        if (Math.random() < 0.25 && this.rodadaCount < rodadasMax) {
            const evento = this.eventosAleatorios[Math.floor(Math.random() * this.eventosAleatorios.length)];
            evento.efeito(this.meuTime);
            const feed = document.getElementById('news-feed');
            feed.innerHTML = `<p class="font-bold text-indigo-600 dark:text-indigo-400">${evento.titulo}</p><p class="text-sm text-gray-600 dark:text-gray-400">${evento.desc}</p>`;
        } else {
            document.getElementById('news-feed').innerHTML = `<p class="text-gray-500 dark:text-gray-400">Nenhum evento importante na última rodada.</p>`;
        }

        this.exibirMensagem(this.pendingMatchResult.message, this.pendingMatchResult.type);
        this.atualizarGraficos();

        // Fix: Cast to HTMLButtonElement
        (document.getElementById('btn-match') as HTMLButtonElement).disabled = false;
        (document.getElementById('btn-train') as HTMLButtonElement).disabled = false;

        if (this.rodadaCount === rodadasMax) setTimeout(() => this.encerrarTemporada(), 500);
    },

    criarContextoColetiva(resultado) {
        const golsM = resultado.time1_id === this.meuTime.id ? resultado.gols1 : resultado.gols2;
        const golsA = resultado.time1_id === this.meuTime.id ? resultado.gols2 : resultado.gols1;
        const adversarioNome = resultado.time1_id === this.meuTime.id ? resultado.time2 : resultado.time1;
        const vitoria = golsM > golsA;
        const derrota = golsA > golsM;
        const empate = golsM === golsA;
        const goleada = Math.abs(golsM - golsA) >= 3;

        let jogadorDestaque = null;
        if (vitoria) {
            const titulares = this.meuTime.titulares.map(id => this.meuTime.getJogador(id)).filter(j => j && !j.lesionado);
            if (titulares.length > 0) {
                jogadorDestaque = titulares[Math.floor(Math.random() * titulares.length)];
            }
        }

        return { golsM, golsA, adversarioNome, vitoria, derrota, empate, goleada, jogadorDestaque };
    },

    mostrarColetivaDeImprensa(contexto) {
        const { golsM, golsA, adversarioNome, vitoria, derrota, empate, goleada, jogadorDestaque } = contexto;

        document.getElementById('press-conference-result').textContent = `${this.meuTime.nome} ${golsM} x ${golsA} ${adversarioNome}`;
        const questionEl = document.getElementById('press-conference-question');
        const optionsEl = document.getElementById('press-conference-options');
        optionsEl.innerHTML = '';

        let question = '';
        let options = [];

        if (goleada && vitoria) {
            question = "Uma vitória espetacular! Qual foi a chave para um resultado tão dominante?";
            options.push({ text: `Enaltecer o Coletivo`, type: 'praise_team' });
            if (jogadorDestaque) options.push({ text: `Destacar ${jogadorDestaque.nome}`, type: 'praise_player', playerId: jogadorDestaque.id });
            options.push({ text: `Agradecer à Torcida`, type: 'praise_fans' });
            options.push({ text: `Manter os Pés no Chão`, type: 'neutral' });
        } else if (vitoria) {
            question = "Parabéns pela vitória suada. O que fez a diferença hoje?";
            options.push({ text: `Elogiar a Garra do Time`, type: 'praise_team' });
            if (jogadorDestaque) options.push({ text: `O brilho de ${jogadorDestaque.nome} foi decisivo`, type: 'praise_player', playerId: jogadorDestaque.id });
            options.push({ text: `Foco no Próximo Jogo`, type: 'neutral' });
            options.push({ text: `Ainda Temos a Melhorar`, type: 'criticize_neutral' });
        } else if (goleada && derrota) {
            question = "Uma derrota muito pesada. O que deu tão errado para o time?";
            options.push({ text: `Assumir a Responsabilidade`, type: 'blame_self' });
            options.push({ text: `Criticar a Defesa`, type: 'criticize_defense' });
            options.push({ text: `Faltou Atitude`, type: 'criticize_team' });
            options.push({ text: `Analisar e Corrigir`, type: 'neutral' });
        } else if (derrota) {
            question = "Um resultado decepcionante. O que faltou para conseguir um resultado melhor?";
            options.push({ text: `Assumir a Culpa`, type: 'blame_self' });
            options.push({ text: `Criticar o Ataque`, type: 'criticize_attack' });
            options.push({ text: `Não Foi Nosso Dia`, type: 'neutral' });
            options.push({ text: `Fomos Inferiores Hoje`, type: 'criticize_neutral' });
        } else { // Empate
            question = "Um empate equilibrado. Como você analisa o resultado final?";
            options.push({ text: `Um Ponto Conquistado`, type: 'praise_team' });
            options.push({ text: `Dois Pontos Perdidos`, type: 'criticize_neutral' });
            options.push({ text: `Resultado Justo`, type: 'neutral' });
            options.push({ text: `Agradecer o Apoio da Torcida`, type: 'praise_fans' });
        }

        questionEl.textContent = `Jornalista: "${question}"`;

        options.forEach(opt => {
            const button = document.createElement('button');
            button.className = "w-full text-left px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-gray-200 dark:border-gray-600 transition-colors duration-150";
            button.textContent = opt.text;
            button.onclick = () => this.responderColetiva({ ...opt, contexto });
            optionsEl.appendChild(button);
        });

        this.pendingMatchResult.tempData = contexto;
        document.getElementById('press-conference-modal').classList.remove('hidden');
    },

    responderColetiva(resposta) {
        const { contexto } = resposta;
        let moralChange = 0;
        const fatorMarketing = 1 - (this.meuTime.depto_marketing_nivel - 1) * 0.05;

        // Moral base da partida
        this.meuTime.jogadores.forEach(j => {
            let mudancaPartida = 0;
            if (contexto.vitoria) mudancaPartida = this.meuTime.titulares.includes(j.id) ? 7 : 3;
            if (contexto.derrota) mudancaPartida = this.meuTime.titulares.includes(j.id) ? -7 : -3;
            j.moral = Math.max(0, Math.min(100, j.moral + mudancaPartida));
        });

        switch (resposta.type) {
            case 'praise_team':
                this.meuTime.jogadores.forEach(j => j.moral = Math.min(100, j.moral + 8));
                this.pressaoTorcida = Math.max(0, this.pressaoTorcida - 5 * (1 / fatorMarketing));
                this.pendingMatchResult.message = `(Coletiva: Elogiou o coletivo)` + this.pendingMatchResult.message;
                break;
            case 'praise_player':
                const jogador = this.meuTime.getJogador(resposta.playerId);
                if (jogador) {
                    jogador.moral = Math.min(100, jogador.moral + 20);
                    this.meuTime.jogadores.forEach(j => { if (j.id !== resposta.playerId) j.moral = Math.min(100, j.moral + 2); });
                    this.pressaoTorcida = Math.max(0, this.pressaoTorcida - 3 * (1 / fatorMarketing));
                    this.pendingMatchResult.message = `(Coletiva: Elogiou ${jogador.nome})` + this.pendingMatchResult.message;
                }
                break;
            case 'praise_fans':
                this.meuTime.jogadores.forEach(j => j.moral = Math.min(100, j.moral + 3));
                this.pressaoTorcida = Math.max(0, this.pressaoTorcida - 15 * (1 / fatorMarketing));
                this.pendingMatchResult.message = `(Coletiva: Agradeceu à torcida)` + this.pendingMatchResult.message;
                break;
            case 'blame_self':
                // Moral dos jogadores é protegido
                this.pressaoTorcida = Math.max(0, this.pressaoTorcida - 4 * (1 / fatorMarketing));
                this.pendingMatchResult.message = `(Coletiva: Assumiu a responsabilidade)` + this.pendingMatchResult.message;
                break;
            case 'criticize_team':
                this.meuTime.jogadores.forEach(j => j.moral = Math.max(0, j.moral - 10));
                this.pressaoTorcida = Math.min(100, this.pressaoTorcida + 15 * fatorMarketing);
                this.pendingMatchResult.message = `(Coletiva: Criticou a atitude do time)` + this.pendingMatchResult.message;
                break;
            case 'criticize_defense':
                this.meuTime.jogadores.forEach(j => { if (['Goleiro', 'Zagueiro', 'Lateral'].includes(j.posicao)) j.moral = Math.max(0, j.moral - 15); });
                this.pressaoTorcida = Math.min(100, this.pressaoTorcida + 8 * fatorMarketing);
                this.pendingMatchResult.message = `(Coletiva: Criticou o sistema defensivo)` + this.pendingMatchResult.message;
                break;
            case 'criticize_attack':
                this.meuTime.jogadores.forEach(j => { if (['Meio-campo', 'Atacante'].includes(j.posicao)) j.moral = Math.max(0, j.moral - 15); });
                this.pressaoTorcida = Math.min(100, this.pressaoTorcida + 8 * fatorMarketing);
                this.pendingMatchResult.message = `(Coletiva: Criticou o sistema ofensivo)` + this.pendingMatchResult.message;
                break;
            case 'criticize_neutral':
                this.meuTime.jogadores.forEach(j => j.moral = Math.max(0, j.moral - 5));
                this.pressaoTorcida = Math.min(100, this.pressaoTorcida + 5 * fatorMarketing);
                this.pendingMatchResult.message = `(Coletiva: Resposta crítica moderada)` + this.pendingMatchResult.message;
                break;
            case 'neutral':
            default:
                if (contexto.vitoria) this.pressaoTorcida = Math.max(0, this.pressaoTorcida - 2 * (1 / fatorMarketing));
                else if (contexto.derrota) this.pressaoTorcida = Math.min(100, this.pressaoTorcida + 6 * fatorMarketing);
                else this.pressaoTorcida = Math.min(100, this.pressaoTorcida + 2 * fatorMarketing);
                if (this.configuracoes.coletivaOpcional) this.pendingMatchResult.message = `(Coletiva: Resposta diplomática)` + this.pendingMatchResult.message;
                break;
        }

        if (contexto.vitoria) {
            const bonus = this.meuTime.pagarBonusVitoria();
            this.pendingMatchResult.message += ` | Bônus Vitória: -$${Math.floor(bonus).toLocaleString('pt-BR')}.`;
            if (contexto.jogadorDestaque) {
                this.pendingMatchResult.message += ` | ${contexto.jogadorDestaque.nome} foi o Jogador da Partida!`;
            }
            this.pendingMatchResult.type = 'success';
        } else if (contexto.derrota) {
            this.pendingMatchResult.type = 'error';
        } else {
            this.pendingMatchResult.type = 'warning';
        }

        const resultadoTexto = `${this.meuTime.nome} ${contexto.golsM} x ${contexto.golsA} ${contexto.adversarioNome}`;
        this.pendingMatchResult.message = `Rodada ${this.rodadaCount} | ${resultadoTexto}` + this.pendingMatchResult.message;

        document.getElementById('press-conference-modal').classList.add('hidden');
        this.finalizarJogadaRodada();
    },


    // --- Funções de UI ---

    exibirMensagem(msg, tipo) {
        const div = document.getElementById('match-result');
        const cores = {
            'success': 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300',
            'error': 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300',
            'warning': 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300',
            'info': 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
            'system': 'bg-indigo-500 text-white font-extrabold'
        };
        div.innerHTML = msg;
        div.className = `mt-4 p-3 rounded-lg text-center font-semibold ${cores[tipo] || cores['info']}`;
        div.style.display = 'block';
    },

    atualizarGraficos() {
        if (!this.meuTime || !this.gameManager) return;

        // Fix: Cast to HTMLSelectElement to access properties
        const formationSelect = document.getElementById('formation-select') as HTMLSelectElement;
        if (formationSelect.options.length === 0) {
            this.FORMACOES.forEach(f => {
                const opt = document.createElement('option');
                opt.value = f;
                opt.textContent = f;
                formationSelect.add(opt);
            });
        }
        formationSelect.value = this.meuTime.formacao;

        const divAtual = this.gameManager.divisoes[this.meuTime.divisao];
        const rodadasMax = (divAtual.size - 1) * 2;
        document.getElementById('season-counter').textContent = this.temporadaCount;

        const btnMatch = document.getElementById('btn-match');
        const isCupRoundUpcoming = !this.copaManager.finalizada && (this.rodadaCount + 1) > 0 && (this.rodadaCount + 1) % this.RODADAS_PARA_PAGAMENTO === 0;
        const isMyTeamInCup = this.copaManager && this.copaManager.timesNaDisputa.some(t => t.id === this.meuTime.id);
        const shouldShowCupButton = isCupRoundUpcoming && isMyTeamInCup;

        if (shouldShowCupButton) {
            btnMatch.innerHTML = `Jogar Rodada (Copa) <span id="rodada-counter" class="font-bold"></span>`;
            btnMatch.classList.remove('bg-red-600', 'hover:bg-red-700');
            btnMatch.classList.add('bg-cyan-600', 'hover:bg-cyan-700');
        } else {
            btnMatch.innerHTML = `Jogar Rodada <span id="rodada-counter" class="font-bold"></span>`;
            btnMatch.classList.remove('bg-cyan-600', 'hover:bg-cyan-700');
            btnMatch.classList.add('bg-red-600', 'hover:bg-red-700');
        }
        document.getElementById('rodada-counter').textContent = `${this.rodadaCount}/${rodadasMax}`;

        document.getElementById('team-name').textContent = this.meuTime.nome;

        const divNameEl = document.getElementById('division-name');
        divNameEl.textContent = `Série ${this.meuTime.divisao}`;
        const divColor = { 'A': 'text-green-600', 'B': 'text-yellow-600', 'C': 'text-orange-500', 'D': 'text-red-500', 'E': 'text-gray-500', 'F': 'text-gray-400' };
        const divDarkColor = { 'A': 'dark:text-green-400', 'B': 'dark:text-yellow-400', 'C': 'dark:text-orange-400', 'D': 'dark:text-red-400', 'E': 'dark:text-gray-400', 'F': 'dark:text-gray-500' };
        divNameEl.className = `font-bold ${divColor[this.meuTime.divisao]} ${divDarkColor[this.meuTime.divisao]}`;

        document.getElementById('team-balance').textContent = `Saldo: $${Math.floor(this.meuTime.saldo).toLocaleString('pt-BR')}`;
        
        const deal = this.meuTime.sponsorshipDeal;
        if (deal) {
            const perCycle = deal.baseValue / 6;
            const sponsorEl = document.getElementById('team-sponsorship');
            sponsorEl.innerHTML = `<b>${deal.name}</b> <br> ($${Math.floor(perCycle).toLocaleString('pt-BR')}/ciclo) <br> ${deal.seasonsRemaining} temp. restante(s)`;
            sponsorEl.className = "text-sm font-medium text-purple-600 dark:text-purple-400";
        } else {
            document.getElementById('team-sponsorship').textContent = `Patrocínio (ciclo): $${this.meuTime.patrocinio_valor.toLocaleString('pt-BR')}`;
        }

        document.getElementById('team-salary').textContent = `Folha Salarial (ciclo): $${this.meuTime.calcularFolhaSalarial().toLocaleString('pt-BR')}`;
        document.getElementById('team-force').textContent = `Força Média (${this.meuTime.tatica}): ${this.meuTime.calcularForca().toFixed(1)}`;
        document.getElementById('elenco-size').textContent = this.meuTime.jogadores.length;

        const jogadoresTitulares = this.meuTime.titulares.map(id => this.meuTime.getJogador(id)).filter(j => j && !j.lesionado);
        const positionCounts = { 'Goleiro': 0, 'Zagueiro': 0, 'Lateral': 0, 'Meio-campo': 0, 'Atacante': 0 };
        jogadoresTitulares.forEach(j => {
            if (positionCounts.hasOwnProperty(j.posicao)) {
                positionCounts[j.posicao]++;
            }
        });
        const requiredPositions = this.FORMATION_STRUCTURES[this.meuTime.formacao];
        let mismatch = 0;
        let faltando = [];
        let excesso = [];

        if (requiredPositions) {
            this.POSICOES.forEach(pos => {
                const required = requiredPositions[pos] || 0;
                const actual = positionCounts[pos] || 0;
                if (actual < required) {
                    faltando.push(`${required - actual} ${pos}(s)`);
                } else if (actual > required) {
                    excesso.push(`${actual - required} ${pos}(s)`);
                }
                mismatch += Math.abs(required - actual);
            });
        }

        const statusEl = document.getElementById('formation-fit-status');
        const detailsEl = document.getElementById('formation-fit-details');
        detailsEl.innerHTML = '';

        if (jogadoresTitulares.length === this.MAX_TITULARES && mismatch === 0) {
            statusEl.textContent = 'Encaixe Perfeito!';
            statusEl.className = 'text-xs font-semibold text-green-600 dark:text-green-400 ml-2';
        } else {
            let warningText = '';
            if (jogadoresTitulares.length !== this.MAX_TITULARES) {
                warningText = `${this.MAX_TITULARES - jogadoresTitulares.length} jogador(es) faltando!`;
            } else {
                warningText = `Fora de Posição!`;
                let detailsText = '';
                if (faltando.length > 0) detailsText += `Falta: ${faltando.join(', ')}. `;
                if (excesso.length > 0) detailsText += `Excesso: ${excesso.join(', ')}.`;
                detailsEl.textContent = detailsText;
            }
            statusEl.textContent = warningText;
            statusEl.className = 'text-xs font-semibold text-red-500 dark:text-red-400 ml-2';
        }

        const custoUpgrade = this.meuTime.estadio_nivel * 75000 * (1 + (this.meuTime.estadio_nivel / 5));
        document.getElementById('stadium-info').innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-200">Estádio Nível ${this.meuTime.estadio_nivel}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Capacidade: ${this.meuTime.estadio_capacidade.toLocaleString('pt-BR')}</p>
                    </div>
                    <button onclick="window.Game.upgradeEstadio()" class="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600">
                        Melhorar ($${Math.floor(custoUpgrade).toLocaleString('pt-BR')})
                    </button>
                </div>`;

        const custoUpgradeAcademia = Math.floor(100000 * Math.pow(1.5, this.meuTime.academia_nivel - 1));
        document.getElementById('academia-info').innerHTML = `
                <div class="flex justify-between items-center">
                     <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-200">Academia Nível: ${this.meuTime.academia_nivel}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Gera melhores jovens.</p>
                    </div>
                    <button onclick="window.Game.melhorarAcademia()" class="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700">
                        Melhorar ($${custoUpgradeAcademia.toLocaleString('pt-BR')})
                    </button>
                </div>`;

        const investimentoBaseDiv = document.getElementById('investimento-base-info');
        const nivelInvestimento = this.meuTime.investimento_base_nivel;
        const nomesInvestimento = { 1: 'Básico', 2: 'Intermediário', 3: 'Avançado' };
        investimentoBaseDiv.innerHTML = `
                <div>
                    <p class="font-semibold text-gray-800 dark:text-gray-200">Investimento na Base</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">Nível atual: <span class="font-bold text-indigo-600 dark:text-indigo-400">${nomesInvestimento[nivelInvestimento]}</span>. Define a qualidade dos jovens na próxima temporada.</p>
                    <div class="flex space-x-2">
                        <button onclick="window.Game.investirNaBase(1)" class="flex-1 px-2 py-2 text-xs font-semibold rounded-lg ${nivelInvestimento === 1 ? 'bg-gray-600 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400'}">Básico ($0)</button>
                        <button onclick="window.Game.investirNaBase(2)" class="flex-1 px-2 py-2 text-xs font-semibold rounded-lg ${nivelInvestimento === 2 ? 'bg-green-600 text-white' : 'bg-green-300 dark:bg-green-700 text-green-800 dark:text-green-200 hover:bg-green-400'}">Intermediário ($250k)</button>
                        <button onclick="window.Game.investirNaBase(3)" class="flex-1 px-2 py-2 text-xs font-semibold rounded-lg ${nivelInvestimento === 3 ? 'bg-yellow-600 text-white' : 'bg-yellow-300 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 hover:bg-yellow-400'}">Avançado ($1M)</button>
                    </div>
                </div>`;

        const custoUpgradeTreinamento = Math.floor(120000 * Math.pow(1.6, this.meuTime.centro_treinamento_nivel - 1));
        document.getElementById('treinamento-info').innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-200">C.T. Nível: ${this.meuTime.centro_treinamento_nivel}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Aumenta eficácia do treino.</p>
                    </div>
                    <button onclick="window.Game.melhorarCentroTreinamento()" class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700">
                        Melhorar ($${custoUpgradeTreinamento.toLocaleString('pt-BR')})
                    </button>
                </div>`;

        const custoUpgradeMedico = Math.floor(150000 * Math.pow(1.5, this.meuTime.depto_medico_nivel - 1));
        document.getElementById('medico-info').innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-200">D.M. Nível: ${this.meuTime.depto_medico_nivel}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Reduz tempo de lesão.</p>
                    </div>
                    <button onclick="window.Game.melhorarDeptoMedico()" class="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700">
                        Melhorar ($${custoUpgradeMedico.toLocaleString('pt-BR')})
                    </button>
                </div>`;

        const custoUpgradeMarketing = Math.floor(80000 * Math.pow(1.7, this.meuTime.depto_marketing_nivel - 1));
        document.getElementById('marketing-info').innerHTML = `
                <div class="flex justify-between items-center">
                    <div>
                        <p class="font-semibold text-gray-800 dark:text-gray-200">Marketing Nível: ${this.meuTime.depto_marketing_nivel}</p>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Gerencia a pressão da torcida.</p>
                    </div>
                    <button onclick="window.Game.melhorarDeptoMarketing()" class="px-4 py-2 bg-yellow-500 text-white text-sm font-semibold rounded-lg hover:bg-yellow-600">
                        Melhorar ($${custoUpgradeMarketing.toLocaleString('pt-BR')})
                    </button>
                </div>`;

        // Staff UI
        const staffInfo = document.getElementById('staff-info');
        staffInfo.innerHTML = '';
        if (this.meuTime.staff.length === 0) {
            staffInfo.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">Nenhum membro da comissão técnica contratado.</p>';
        } else {
            this.meuTime.staff.forEach(s => {
                staffInfo.innerHTML += `
                        <div class="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <div>
                                <p class="font-bold text-gray-900 dark:text-gray-200">${s.nome}</p>
                                <p class="text-sm text-gray-600 dark:text-gray-400">${s.tipo} - <span class="font-semibold text-indigo-600 dark:text-indigo-400">Hab: ${s.habilidade}</span></p>
                            </div>
                            <button onclick="window.Game.demitirStaff('${s.id}')" class="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600">Demitir</button>
                        </div>
                    `;
            });
        }

        const staffMarketList = document.getElementById('staff-market-list');
        staffMarketList.innerHTML = '';
        this.mercadoStaff.forEach((s, index) => {
            const custo = s.salario * 5;
            staffMarketList.innerHTML += `
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-200">${s.nome}</p>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">${s.tipo} | Hab: <span class="text-indigo-600 dark:text-indigo-400">${s.habilidade}</span></p>
                            <p class="text-xs text-red-500 dark:text-red-400">Salário: $${s.salario.toLocaleString('pt-BR')}</p>
                        </div>
                        <div class="flex items-center space-x-3">
                            <span class="text-lg font-extrabold text-green-700 dark:text-green-400">$${custo.toLocaleString('pt-BR')}</span>
                            <button onclick="window.Game.contratarStaff(${index})" class="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition">Contratar</button>
                        </div>
                    </div>`;
        });

        const pressureBar = document.getElementById('fan-pressure-bar');
        const pressureText = document.getElementById('fan-pressure-text');
        const pressureColor = this.pressaoTorcida > 75 ? 'bg-red-500' : this.pressaoTorcida > 50 ? 'bg-yellow-500' : 'bg-green-500';
        pressureBar.style.width = `${this.pressaoTorcida}%`;
        pressureBar.className = `stat-bar ${pressureColor}`;
        let pressureDesc = 'Calma';
        if (this.pressaoTorcida > 75) { pressureDesc = 'Fúriosa!'; pressureText.className = 'text-sm text-center mt-1 font-semibold text-red-500 dark:text-red-400'; }
        else if (this.pressaoTorcida > 50) { pressureDesc = 'Insatisfeita'; pressureText.className = 'text-sm text-center mt-1 font-semibold text-yellow-500 dark:text-yellow-400'; }
        else if (this.pressaoTorcida > 25) { pressureDesc = 'Apoiando'; pressureText.className = 'text-sm text-center mt-1 font-semibold text-gray-600 dark:text-gray-300'; }
        else { pressureDesc = 'Satisfeita'; pressureText.className = 'text-sm text-center mt-1 font-semibold text-green-600 dark:text-green-400'; }
        pressureText.textContent = pressureDesc;

        document.getElementById('income-tickets').textContent = `+$${this.lastTicketIncome.toLocaleString('pt-BR')}`;
        document.getElementById('income-finance-cycle').textContent = `${this.lastFinanceCycleIncome >= 0 ? '+' : ''}$${Math.floor(this.lastFinanceCycleIncome).toLocaleString('pt-BR')}`;

        const marketList = document.getElementById('transfer-market-list');
        marketList.innerHTML = this.mercadoJogadores.length === 0 ? '<p class="text-gray-500 dark:text-gray-400 text-center py-4">Mercado vazio.</p>' : '';
        this.mercadoJogadores.forEach((j, index) => {
            const custo = Math.floor(j.habilidade * 75 * (1 + j.idade / 50));
            const potencialColor = j.potencial > 90 ? 'text-green-700 dark:text-green-400' : j.potencial > 80 ? 'text-yellow-700 dark:text-yellow-400' : 'text-gray-700 dark:text-gray-300';
            const traitsHTML = j.traits.map(t => `<span class="text-xs font-semibold inline-flex px-2 py-0.5 rounded-full ${this.TRAITS[t].color} mr-1">${t}</span>`).join('');
            marketList.innerHTML += `
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                        <div>
                            <p class="font-bold text-gray-900 dark:text-gray-200">${j.nome} <span class="text-xs font-normal text-gray-500 dark:text-gray-400">(${j.posicao})</span></p>
                            <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">OVR: <span class="text-indigo-600 dark:text-indigo-400">${j.habilidade}</span> | P: <span class="${potencialColor}">${j.potencialRange[0]}-${j.potencialRange[1]}</span> | I: ${j.idade}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Salário: $${j.salario.toLocaleString('pt-BR')} (ciclo)</p>
                            <div class="mt-1">${traitsHTML}</div>
                        </div>
                        <div class="flex items-center space-x-3">
                            <span class="text-lg font-extrabold text-green-700 dark:text-green-400">$${custo.toLocaleString('pt-BR')}</span>
                            <button onclick="window.Game.contratarJogador(${index})" class="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600 transition">Contratar</button>
                        </div>
                    </div>`;
        });

        const classificacao = divAtual.getTabelaClassificacao();
        document.getElementById('league-title').textContent = `Classificação da ${divAtual.nome}`;
        let tabelaHTML = `<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead class="bg-gray-100 dark:bg-gray-700"><tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">#</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">Time</th>
                <th class="px-2 py-2 text-xs font-bold text-gray-900 dark:text-gray-200 uppercase">P</th>
                <th class="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase hidden sm:table-cell">V/E/D</th>
                <th class="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">SG</th>
                </tr></thead><tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-200 dark:divide-gray-700">`;

        classificacao.forEach((time, index) => {
            const pos = index + 1;
            let isPromo = false;
            let isPlayoff = false;
            const isReleg = pos > (divAtual.size - divAtual.relegatCount) && divAtual.relegatCount > 0;

            if (divAtual.nome === "Série F") {
                isPromo = pos <= 3;
                isPlayoff = pos >= 4 && pos <= 7;
            } else if (divAtual.nome === "Série E" || divAtual.nome === "Série D") {
                isPromo = pos <= 2;
                isPlayoff = pos >= 3 && pos <= 6;
            } else {
                isPromo = pos <= divAtual.promoteCount && divAtual.promoteCount > 0;
            }

            let rowClasses = time.eh_jogador ? 'bg-indigo-100 dark:bg-indigo-900/50 font-bold' : '';
            if (isPromo) rowClasses += ' promotion';
            if (isPlayoff) rowClasses += ' playoff';
            if (isReleg) rowClasses += ' relegation';

            tabelaHTML += `<tr class="${rowClasses}"><td class="px-3 py-2 text-center font-extrabold">${pos}</td>
                    <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">${time.nome}</td>
                    <td class="px-2 py-2 text-center font-extrabold">${time.pontos}</td>
                    <td class="px-2 py-2 text-center hidden sm:table-cell">${time.vitorias}/${time.empates}/${time.derrotas}</td>
                    <td class="px-2 py-2 text-center">${time.gols_pro - time.gols_contra}</td></tr>`;
        });
        document.getElementById('league-table').innerHTML = tabelaHTML + '</tbody></table>';

        let legendHTML = '';
        if (divAtual.nome === 'Série D' || divAtual.nome === 'Série E') {
            legendHTML += `<p><span class="inline-block w-3 h-3 bg-green-200 rounded-sm mr-1"></span> Acesso Direto (1º e 2º)</p>`;
            legendHTML += `<p><span class="inline-block w-3 h-3 bg-yellow-200 rounded-sm mr-1"></span> Playoff de Acesso (3º ao 6º)</p>`;
        } else if (divAtual.nome === 'Série F') {
            legendHTML += `<p><span class="inline-block w-3 h-3 bg-green-200 rounded-sm mr-1"></span> Acesso Direto (1º ao 3º)</p>`;
            legendHTML += `<p><span class="inline-block w-3 h-3 bg-yellow-200 rounded-sm mr-1"></span> Quadrangular de Acesso (4º ao 7º)</p>`;
        } else {
            if (divAtual.promoteCount > 0) {
                legendHTML += `<p><span class="inline-block w-3 h-3 bg-green-200 rounded-sm mr-1"></span> Zona de Promoção (1º ao ${divAtual.promoteCount}º)</p>`;
            }
        }
        if (divAtual.relegatCount > 0) {
            legendHTML += `<p><span class="inline-block w-3 h-3 bg-red-200 rounded-sm mr-1"></span> Zona de Rebaixamento (${divAtual.size - divAtual.relegatCount + 1}º ao ${divAtual.size}º)</p>`;
        }
        document.getElementById('league-legend').innerHTML = legendHTML;

        this.updateSquadView();
    },

    updateSquadView() {
        // Fix: Cast elements to access value property
        this.squadSortConfig.sortBy = (document.getElementById('squad-sort') as HTMLSelectElement).value;
        this.squadSortConfig.filterPos = (document.getElementById('squad-filter-pos') as HTMLSelectElement).value;
        this.squadSortConfig.filterName = (document.getElementById('squad-filter-name') as HTMLInputElement).value.toLowerCase();

        let players = [...this.meuTime.jogadores];

        // Filter
        if (this.squadSortConfig.filterPos !== 'Todos') {
            players = players.filter(j => j.posicao === this.squadSortConfig.filterPos);
        }
        if (this.squadSortConfig.filterName) {
            players = players.filter(j => j.nome.toLowerCase().includes(this.squadSortConfig.filterName));
        }

        // Sort
        switch (this.squadSortConfig.sortBy) {
            case 'habilidade_desc': players.sort((a, b) => b.habilidade - a.habilidade); break;
            case 'habilidade_asc': players.sort((a, b) => a.habilidade - b.habilidade); break;
            case 'potencial_desc': players.sort((a, b) => b.potencial - a.potencial); break;
            case 'idade_asc': players.sort((a, b) => a.idade - b.idade); break;
            case 'idade_desc': players.sort((a, b) => b.idade - b.idade); break;
            case 'posicao_asc': players.sort((a, b) => this.POSICOES.indexOf(a.posicao) - this.POSICOES.indexOf(b.posicao)); break;
            case 'default':
            default:
                players.sort((a, b) => (this.meuTime.titulares.includes(b.id) ? 1 : 0) - (this.meuTime.titulares.includes(a.id) ? 1 : 0) || b.habilidade - a.habilidade);
                break;
        }

        const statsBody = document.getElementById('player-stats-body');
        statsBody.innerHTML = '';
        players.forEach(j => {
            const isTitular = this.meuTime.titulares.includes(j.id);
            const moralColor = j.moral > 70 ? 'bg-green-500' : j.moral > 50 ? 'bg-yellow-500' : 'bg-red-500';
            const fadigaColor = j.fadiga < 30 ? 'bg-green-500' : j.fadiga < 60 ? 'bg-yellow-500' : 'bg-red-500';

            let statusText, rowClass = '';
            if (j.lesionado) statusText = `<span class="text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300">LESÃO (${j.dias_recuperacao} dias)</span>`;
            else statusText = `<span class="text-xs font-semibold inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">Pronto</span>`;

            const traitsHTML = j.traits.map(t => `<span class="text-xs font-semibold inline-flex px-2 py-0.5 rounded-full ${this.TRAITS[t].color} mr-1" title="${this.TRAITS[t].desc}">${t}</span>`).join('');
            const healBtn = j.lesionado ? `<button onclick="event.stopPropagation(); window.Game.curarJogadorImediatamente('${j.id}')" class="px-3 py-1 mt-1 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700">Curar ($${(j.habilidade * 100).toLocaleString('pt-BR')})</button>` : '';
            const actionBtn = isTitular ? `<button onclick="event.stopPropagation(); window.Game.toggleTitularidade('${j.id}', true)" class="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-lg hover:bg-orange-600">Para Reserva</button>` : `<button onclick="event.stopPropagation(); window.Game.toggleTitularidade('${j.id}', false)" class="px-3 py-1 bg-indigo-500 text-white text-xs font-semibold rounded-lg hover:bg-indigo-600">Para Titular</button>`;

            const reputationMultiplier = { 'A': 1.0, 'B': 0.85, 'C': 0.65, 'D': 0.5, 'E': 0.40, 'F': 0.30 }[this.meuTime.divisao];
            const baseSellPrice = Math.floor(j.habilidade * 15 * (1 + j.potencial / 100) * (1 - j.idade / 50));
            const sellPrice = Math.floor(baseSellPrice * reputationMultiplier * (1 + j.contratoAnos / 10));

            const contractWarning = j.contratoAnos <= 1 ? 'text-red-500 font-extrabold animate-pulse' : '';
            const focusIndicator = j.individualFocus ? `<span class="ml-2 text-xs font-semibold inline-flex px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-300">${j.individualFocus}</span>` : '';

            statsBody.innerHTML += `<tr class="player-row ${isTitular ? 'bg-indigo-50 dark:bg-indigo-900/30 font-medium' : 'hover:bg-gray-50 dark:hover:bg-gray-700'} ${rowClass}" onclick="window.Game.mostrarPlayerModal('${j.id}')">
                        <td class="px-3 py-2 text-gray-900 dark:text-gray-200">
                             <div class="flex items-center">
                                <p>${j.nome}${focusIndicator}</p>
                                ${(j.happiness.gameTime === 'Insatisfeito' || j.happiness.contract === 'Quer renovar') ?
                    `<div class="tooltip ml-2">
                                        <span class="text-red-500">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                            </svg>
                                        </span>
                                        <span class="tooltiptext">
                                            ${j.happiness.gameTime === 'Insatisfeito' ? '• Insatisfeito com o tempo de jogo.<br>' : ''}
                                            ${j.happiness.contract === 'Quer renovar' ? '• Quer um novo contrato.' : ''}
                                        </span>
                                    </div>` : ''}
                            </div>
                            <p class="text-xs text-gray-500 dark:text-gray-400">${j.posicao}</p>
                        </td>
                        <td class="px-3 py-2">
                            <p class="text-lg font-bold text-indigo-700 dark:text-indigo-400">${j.habilidade}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">P: ${j.potencialRange[0]}-${j.potencialRange[1]} | I: ${j.idade}</p>
                        </td>
                        <td class="px-3 py-2">
                           <div class="mb-1">${isTitular ? `<span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">Titular</span>` : `<span class="text-sm text-gray-500 dark:text-gray-400">Reserva</span>`}</div>
                           <div class="mb-1">${statusText}</div>
                           <div class="flex flex-wrap gap-1">${traitsHTML}</div>
                           ${healBtn}
                        </td>
                         <td class="px-3 py-2 text-center">
                            <span class="${contractWarning}">${j.contratoAnos > 1 ? `${j.contratoAnos} anos` : `${j.contratoAnos} ano`}</span>
                            ${j.contratoAnos <= 1 ? `<button onclick="event.stopPropagation(); window.Game.renovarContratoJogador('${j.id}')" class="ml-2 px-2 py-0.5 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">Renovar</button>` : ''}
                         </td>
                        <td class="px-3 py-2"><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">Fadiga:</p><div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full mb-1"><div class="${fadigaColor} stat-bar" style="width: ${j.fadiga}%;"></div></div><p class="text-xs font-semibold text-gray-700 dark:text-gray-300">Moral:</p><div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full"><div class="${moralColor} stat-bar" style="width: ${j.moral}%;"></div></div></td>
                        <td class="px-3 py-2 space-y-1">${actionBtn}<button onclick="event.stopPropagation(); window.Game.venderJogador('${j.id}')" class="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-lg hover:bg-yellow-600">Vender ($${sellPrice.toLocaleString('pt-BR')})</button></td>
                    </tr>`;
        });
    },

    // --- Funções de Save/Load e Histórico ---

    dbManager: {
        db: null,
        dbName: 'FutebolManagerDB_v2',
        storeName: 'savegames',

        async openDB() {
            return new Promise((resolve, reject) => {
                if (this.db) return resolve(this.db);
                const request = indexedDB.open(this.dbName, 1);
                request.onerror = (event) => reject("Erro ao abrir o banco de dados do navegador.");
                request.onsuccess = (event) => {
                    // Fix: Cast event.target to IDBRequest to access result
                    this.db = (event.target as IDBRequest).result;
                    resolve(this.db);
                };
                request.onupgradeneeded = (event) => {
                    // Fix: Cast event.target to IDBRequest to access result
                    const db = (event.target as IDBRequest).result;
                    db.createObjectStore(this.storeName);
                };
            });
        },

        async saveData(key, data) {
            const db = await this.openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put(data, key);
                request.onsuccess = () => resolve("Jogo salvo com sucesso!");
                request.onerror = (event) => reject("Erro ao salvar o jogo no banco de dados.");
            });
        },

        async loadData(key) {
            const db = await this.openDB();
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([this.storeName], 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(key);
                request.onsuccess = () => {
                    if (request.result) resolve(request.result);
                    else reject("Nenhum jogo salvo encontrado.");
                };
                request.onerror = (event) => reject("Erro ao carregar o jogo do banco de dados.");
            });
        }
    },

    async salvarJogo() {
        // Fix: Cast to HTMLButtonElement to access disabled property
        const saveButton = document.getElementById('save-button') as HTMLButtonElement;
        saveButton.disabled = true;
        saveButton.textContent = 'Salvando...';
        try {
            const gameState = {
                meuTime: this.meuTime, gameManager: this.gameManager, copaManager: this.copaManager, rodadaCount: this.rodadaCount, temporadaCount: this.temporadaCount,
                mercadoJogadores: this.mercadoJogadores, mercadoStaff: this.mercadoStaff, lastTicketIncome: this.lastTicketIncome,
                lastFinanceCycleIncome: this.lastFinanceCycleIncome, pressaoTorcida: this.pressaoTorcida, configuracoes: this.configuracoes, historicoCampeoes: this.historicoCampeoes,
                sponsorshipOffers: this.sponsorshipOffers, pendingSponsorshipChoice: this.pendingSponsorshipChoice
            };
            await this.dbManager.saveData('gameState_1', gameState);
            this.exibirMensagem("Jogo salvo com sucesso no banco de dados do navegador!", "success");
        } catch (error) {
            console.error("Erro ao salvar o jogo:", error);
            this.exibirMensagem(`Erro ao salvar: ${error}`, "error");
        } finally {
            saveButton.disabled = false;
            saveButton.textContent = 'Salvar Jogo';
        }
    },

    async carregarJogo() {
        // Fix: Cast to HTMLButtonElement to access disabled property
        const loadButton = document.getElementById('load-button') as HTMLButtonElement;
        loadButton.disabled = true;
        loadButton.textContent = 'Carregando...';
        try {
            const loadedData = await this.dbManager.loadData('gameState_1');

            this.meuTime = this.Time.fromJSON(loadedData.meuTime);
            this.gameManager = {
                meuTime: this.meuTime,
                divisoes: {
                    A: this.Divisao.fromJSON(loadedData.gameManager.divisoes.A),
                    B: this.Divisao.fromJSON(loadedData.gameManager.divisoes.B),
                    C: this.Divisao.fromJSON(loadedData.gameManager.divisoes.C),
                    D: this.Divisao.fromJSON(loadedData.gameManager.divisoes.D),
                    E: this.Divisao.fromJSON(loadedData.gameManager.divisoes.E),
                    F: this.Divisao.fromJSON(loadedData.gameManager.divisoes.F)
                }
            };

            Object.values(this.gameManager.divisoes).forEach((div: any) => {
                div.calendario = this.gerarCalendario(div.times);
            });

            this.copaManager = this.CopaManager.fromJSON(loadedData.copaManager);

            const currentDiv = this.gameManager.divisoes[this.meuTime.divisao];
            if (currentDiv) {
                const myTeamIndex = currentDiv.times.findIndex(t => t.id === this.meuTime.id);
                if (myTeamIndex !== -1) currentDiv.times[myTeamIndex] = this.meuTime;
            }

            this.rodadaCount = loadedData.rodadaCount;
            this.temporadaCount = loadedData.temporadaCount;
            this.mercadoJogadores = (loadedData.mercadoJogadores || []).map(jData => this.Jogador.fromJSON(jData));
            this.mercadoStaff = (loadedData.mercadoStaff || []).map(sData => this.Staff.fromJSON(sData));
            this.lastTicketIncome = loadedData.lastTicketIncome || 0;
            this.lastFinanceCycleIncome = loadedData.lastFinanceCycleIncome || 0;
            this.pressaoTorcida = loadedData.pressaoTorcida || 20;
            this.configuracoes = loadedData.configuracoes || { coletivaOpcional: true };
            this.historicoCampeoes = loadedData.historicoCampeoes || {};
            this.sponsorshipOffers = loadedData.sponsorshipOffers || [];
            this.pendingSponsorshipChoice = loadedData.pendingSponsorshipChoice || false;

            // Fix: Cast to HTMLInputElement to access checked property
            (document.getElementById('toggle-press-conference') as HTMLInputElement).checked = this.configuracoes.coletivaOpcional;

            this.atualizarGraficos();
            this.exibirMensagem("Jogo carregado com sucesso!", "success");

            if (this.pendingSponsorshipChoice) {
                this.mostrarSponsorshipModal();
            }

        } catch (error) {
            console.error("Erro ao carregar o jogo:", error);
            this.exibirMensagem(`Erro ao carregar: ${error}`, "error");
        } finally {
            loadButton.disabled = false;
            loadButton.textContent = 'Carregar Jogo';
        }
    },

    mostrarHistorico() {
        const content = document.getElementById('history-content');
        content.innerHTML = '';
        if (!this.meuTime.historico || this.meuTime.historico.length === 0) {
            content.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Nenhuma temporada foi completada ainda.</p>';
        } else {
            let historyHTML = '<table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead class="bg-gray-50 dark:bg-gray-700"><tr><th class="px-4 py-2 text-gray-800 dark:text-gray-200">Temporada</th><th class="px-4 py-2 text-gray-800 dark:text-gray-200">Divisão</th><th class="px-4 py-2 text-gray-800 dark:text-gray-200">Posição</th><th class="px-4 py-2 text-gray-800 dark:text-gray-200">Resultado</th></tr></thead><tbody class="dark:text-gray-300">';
            [...this.meuTime.historico].reverse().forEach(h => {
                historyHTML += `<tr class="text-center"><td class="py-2">${h.temporada}</td><td>Série ${h.divisao}</td><td>${h.posicao}º</td><td class="font-semibold">${h.resultado}</td></tr>`;
            });
            content.innerHTML = historyHTML + '</tbody></table>';
        }
        document.getElementById('history-modal').classList.remove('hidden');
    },

    fecharHistorico() { document.getElementById('history-modal').classList.add('hidden'); },

    mostrarHistoricoCampeoes() {
        const content = document.getElementById('champions-history-content');
        content.innerHTML = '';
        const seasons = Object.keys(this.historicoCampeoes).sort((a, b) => Number(b) - Number(a)); // Sort descending

        if (seasons.length === 0) {
            content.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-8">Nenhuma temporada foi completada ainda.</p>';
        } else {
            let html = '<div class="space-y-6">';
            seasons.forEach(season => {
                const champions = this.historicoCampeoes[season];
                html += `
                        <div class="bg-gray-100 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h3 class="text-xl font-bold text-indigo-700 dark:text-indigo-400 mb-3">Temporada ${season}</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
                    `;
                Object.keys(champions).sort().forEach(div => { // Sort A, B, C...
                    const teamName = champions[div];
                    html += `
                            <div class="bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
                                <p class="font-semibold text-gray-600 dark:text-gray-400">Série ${div}</p>
                                <p class="font-bold text-gray-900 dark:text-gray-200 truncate" title="${teamName}">${teamName}</p>
                            </div>
                        `;
                });
                html += `
                            </div>
                        </div>
                    `;
            });
            html += '</div>';
            content.innerHTML = html;
        }
        document.getElementById('champions-history-modal').classList.remove('hidden');
    },

    fecharHistoricoCampeoes() { document.getElementById('champions-history-modal').classList.add('hidden'); },

    mostrarHallOfFame() {
        const content = document.getElementById('hall-of-fame-content');
        content.innerHTML = '';
        if (!this.meuTime.hallOfFame || this.meuTime.hallOfFame.length === 0) {
            content.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center">Nenhum jogador foi introduzido ao Hall da Fama ainda.</p>';
        } else {
            let hofHTML = '';
            const sortedLegends = [...this.meuTime.hallOfFame].sort((a, b) => b.picoHabilidade - a.picoHabilidade);
            sortedLegends.forEach(j => {
                hofHTML += `
                    <div class="flex flex-col items-center text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-yellow-400 dark:border-yellow-600 shadow-lg">
                        <p class="text-xl font-bold text-gray-800 dark:text-gray-100">${j.nome}</p>
                        <p class="text-sm font-semibold text-gray-500 dark:text-gray-400">${j.posicao}</p>
                        <p class="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 my-2">${j.picoHabilidade}</p>
                        <p class="text-xs text-gray-600 dark:text-gray-300">Pico de OVR</p>
                        <p class="text-sm font-medium text-gray-700 dark:text-gray-200 mt-3">Carreira no Clube: ${j.temporadaInicio} - ${j.temporadaFim}</p>
                    </div>`;
            });
            content.innerHTML = hofHTML;
        }
        document.getElementById('hall-of-fame-modal').classList.remove('hidden');
    },

    fecharHallOfFame() { document.getElementById('hall-of-fame-modal').classList.add('hidden'); },

    gerarTrofeuSVG(primaryColor, secondaryColor) {
        return `
                <svg class="w-24 h-24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M30 90 H70 V80 H30 Z" fill="${secondaryColor}"/>
                    <path d="M40 80 H60 V70 H40 Z" fill="${secondaryColor}"/>
                    <path d="M50 70 A15 15 0 0 1 50 40 A15 15 0 0 1 50 70" fill="${primaryColor}"/>
                    <path d="M20 50 H35 V40 H20 Z" fill="${primaryColor}"/>
                    <path d="M80 50 H65 V40 H80 Z" fill="${primaryColor}"/>
                    <rect x="45" y="20" width="10" height="20" fill="${primaryColor}"/>
                    <circle cx="50" cy="15" r="10" fill="${primaryColor}"/>
                </svg>`;
    },

    mostrarTrofeus() {
        const content = document.getElementById('trophy-content');
        content.innerHTML = '';
        const trofeus = this.meuTime.trofeus;
        const todasSeries = ['Copa Total', 'A', 'B', 'C', 'D', 'E', 'F'];
        const cores = {
            'Copa Total': ['#E5E4E2', '#D3D3D3'], // Platinum
            A: ['#FFD700', '#FFA500'], // Gold
            B: ['#C0C0C0', '#A9A9A9'], // Silver
            C: ['#CD7F32', '#A0522D'], // Bronze
            D: ['#4682B4', '#5F9EA0'], // Steel Blue
            E: ['#808080', '#696969'], // Gray
            F: ['#A0522D', '#8B4513'] // Sienna/SaddleBrown
        };

        let trofeusHTML = '';
        todasSeries.forEach(serie => {
            if (trofeus && trofeus[serie] && trofeus[serie].length > 0) {
                const [cor1, cor2] = cores[serie];
                const nomeTrofeu = serie === 'Copa Total' ? 'Copa Total' : `Série ${serie}`;
                trofeusHTML += `
                        <div class="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            ${this.gerarTrofeuSVG(cor1, cor2)}
                            <p class="mt-2 text-xl font-bold text-gray-800 dark:text-gray-200">${nomeTrofeu}</p>
                            <p class="text-lg font-semibold text-indigo-600 dark:text-indigo-400">x ${trofeus[serie].length}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Temporada(s): ${trofeus[serie].join(', ')}</p>
                        </div>
                    `;
            }
        });

        if (trofeusHTML === '') {
            content.innerHTML = '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center">Sua sala de troféus está vazia. Ganhe um campeonato para começar!</p>';
        } else {
            content.innerHTML = trofeusHTML;
        }
        document.getElementById('trophy-modal').classList.remove('hidden');
    },

    fecharTrofeus() { document.getElementById('trophy-modal').classList.add('hidden'); },

    mostrarPlayoffModal(logHTML, nomeDivisao) {
        document.querySelector('#playoff-modal h2').textContent = `Playoffs de Acesso - ${nomeDivisao}`;
        document.getElementById('playoff-content').innerHTML = logHTML;
        document.getElementById('playoff-modal').classList.remove('hidden');
    },

    fecharPlayoffModal() { document.getElementById('playoff-modal').classList.add('hidden'); },

    mostrarStaffModal() { document.getElementById('staff-modal').classList.remove('hidden'); },
    fecharStaffModal() { document.getElementById('staff-modal').classList.add('hidden'); },

    mostrarTreinoModal() { document.getElementById('training-modal').classList.remove('hidden'); },
    fecharTreinoModal() { document.getElementById('training-modal').classList.add('hidden'); },

    mostrarCopaModal() {
        const content = document.getElementById('copa-content');
        const title = document.getElementById('copa-title');
        content.innerHTML = '';

        if (!this.copaManager || !this.copaManager.todosOsTimes || this.copaManager.todosOsTimes.length === 0) {
            content.innerHTML = '<p class="text-gray-500 dark:text-gray-400">A copa ainda não começou.</p>';
            document.getElementById('copa-modal').classList.remove('hidden');
            return;
        }

        document.getElementById('copa-teams-count').textContent = `(${this.copaManager.todosOsTimes.length} times)`;

        let bracketHTML = '<div class="cup-bracket">';
        const maxRounds = Math.ceil(Math.log2(this.copaManager.todosOsTimes.length));

        // Render past and current rounds
        for (let r = 1; r <= maxRounds + 1; r++) {
            if (r > 1 && !this.copaManager.resultados[r - 1] && (this.copaManager.finalizada || r > this.copaManager.rodada)) break;

            const resultsOfRound = this.copaManager.resultados[r];
            const isUpcomingRound = r === this.copaManager.rodada && !this.copaManager.finalizada;

            if (!resultsOfRound && !isUpcomingRound) continue;

            const roundTitle = r === maxRounds ? 'Final' : r === maxRounds - 1 ? 'Semi-Finais' : r === maxRounds - 2 ? 'Quartas de Final' : `Rodada ${r}`;
            bracketHTML += `<div class="round ${r > maxRounds ? 'final' : ''}"><h3 class="round-title dark:text-gray-200">${roundTitle}</h3><ul class="match-list">`;

            let matchCountInRound = 0;

            // Played matches
            if (resultsOfRound) {
                for (const res of resultsOfRound) {
                    matchCountInRound++;
                    const isMyTeamInMatch = res.time1_id === this.meuTime.id || res.time2_id === this.meuTime.id;
                    const highlightClass = isMyTeamInMatch ? 'seu-time-copa !border-indigo-500' : '';
                    const winner1 = res.gols1 > res.gols2 ? 'winner' : '';
                    const winner2 = res.gols2 > res.gols1 ? 'winner' : '';

                    bracketHTML += `<li class="match-item"><div class="match-content ${highlightClass}">`;
                    if (res.gols1 === 'FOLGA') {
                        bracketHTML += `<div class="team"><span class="${winner1}">${res.time1}</span></div><div class="team text-sm text-gray-500 dark:text-gray-400">(Folga)</div>`;
                    } else {
                        bracketHTML += `<div class="team"><span class="${winner1}">${res.time1}</span> <span class="score ${winner1}">${res.gols1}</span></div>`;
                        bracketHTML += `<div class="team"><span class="${winner2}">${res.time2}</span> <span class="score ${winner2}">${res.gols2}</span></div>`;
                    }
                    bracketHTML += `</div></li>`;
                }
            }
            // Upcoming matches
            else if (isUpcomingRound) {
                const teamsDaRodada = [...this.copaManager.timesNaDisputa];

                if (teamsDaRodada.length === 1) { // This is the champion before the final round is played
                    continue;
                }

                let timeDeFolga = null;
                if (teamsDaRodada.length % 2 !== 0) {
                    timeDeFolga = teamsDaRodada.pop();
                }

                for (let i = 0; i < teamsDaRodada.length; i += 2) {
                    matchCountInRound++;
                    const t1 = teamsDaRodada[i];
                    const t2 = teamsDaRodada[i + 1];
                    const isMyTeamInMatch = t1.id === this.meuTime.id || t2.id === this.meuTime.id;
                    const highlightClass = isMyTeamInMatch ? 'seu-time-copa !border-indigo-500' : '';

                    bracketHTML += `<li class="match-item"><div class="match-content ${highlightClass}">`;
                    bracketHTML += `<div class="team">${t1.nome}</div>`;
                    bracketHTML += `<div class="team">${t2.nome}</div>`;
                    bracketHTML += `</div></li>`;
                }
                if (timeDeFolga) {
                    matchCountInRound++;
                    const isMyTeamInMatch = timeDeFolga.id === this.meuTime.id;
                    const highlightClass = isMyTeamInMatch ? 'seu-time-copa !border-indigo-500' : '';
                    bracketHTML += `<li class="match-item"><div class="match-content ${highlightClass}">`;
                    bracketHTML += `<div class="team">${timeDeFolga.nome}</div><div class="team text-sm text-gray-500 dark:text-gray-400">(Folga)</div>`;
                    bracketHTML += `</div></li>`;
                }
            }

            // Add spacer to keep pairs for CSS connectors
            if (matchCountInRound % 2 !== 0 && r < maxRounds) {
                bracketHTML += `<li class="match-item" style="visibility: hidden;"><div class="match-content" style="visibility: hidden;"></div></li>`;
            }

            bracketHTML += `</ul></div>`;
        }

        // Champion display
        if (this.copaManager.finalizada && this.copaManager.campeao) {
            bracketHTML += `<div class="round final"><h3 class="round-title dark:text-gray-200">🏆 Campeão 🏆</h3><ul class="match-list">`;
            const isMyTeam = this.copaManager.campeao.id === this.meuTime.id;
            const highlightClass = isMyTeam ? 'seu-time-copa !border-indigo-500' : '';
            bracketHTML += `<li class="match-item"><div class="match-content p-4 text-center ${highlightClass}">
                    <div class="flex justify-center">${this.gerarTrofeuSVG('#FFD700', '#FFA500')}</div>
                    <p class="text-2xl font-bold mt-2 text-gray-800 dark:text-gray-100">${this.copaManager.campeao.nome}</p>
                </div></li>`;
            bracketHTML += `</ul></div>`;
        }

        bracketHTML += '</div>';

        title.innerHTML = `Copa Total <span id="copa-teams-count" class="text-base font-normal text-gray-500 dark:text-gray-400">(${this.copaManager.todosOsTimes.length} times)</span> - Chaveamento`;
        content.innerHTML = bracketHTML;

        document.getElementById('copa-modal').classList.remove('hidden');
    },

    fecharCopaModal() { document.getElementById('copa-modal').classList.add('hidden'); },

    setIndividualFocus(playerId, focus) {
        const jogador = this.meuTime.getJogador(playerId);
        if (jogador) {
            jogador.individualFocus = focus === '' ? null : focus;
            this.fecharPlayerModal();
            this.updateSquadView(); // Re-render squad to show new focus
            this.exibirMensagem(`${jogador.nome} agora está focado em ${focus || 'Nenhum'}.`, 'info');
        }
    },
    
    mostrarPlayerModal(playerId) {
        const jogador = this.meuTime.getJogador(playerId) || this.meuTime.getYouthPlayer(playerId);
        if (!jogador) return;

        const modalContent = document.getElementById('player-modal-content');

        const happinessColor = (status) => {
            switch (status) {
                case 'Feliz':
                case 'Satisfeito':
                    return 'text-green-600 dark:text-green-400';
                case 'Insatisfeito':
                case 'Quer renovar':
                    return 'text-red-600 dark:text-red-400';
                default:
                    return 'text-gray-700 dark:text-gray-300';
            }
        };
        
        const renderAttribute = (attr, value) => {
            const potential = jogador.potencial;
            const barWidth = (value / potential) * 100;
            const barColor = value > 80 ? 'bg-green-500' : value > 60 ? 'bg-yellow-500' : 'bg-red-500';
            return `
                <div class="flex justify-between items-center text-sm">
                    <span class="font-semibold text-gray-700 dark:text-gray-300">${attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
                    <span class="font-bold text-gray-900 dark:text-gray-200">${Math.round(value)}</span>
                </div>
                <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
                    <div class="${barColor} h-2.5 rounded-full" style="width: ${barWidth}%"></div>
                </div>
            `;
        };

        const traitsHTML = jogador.traits.map(t => `
            <div class="tooltip inline-block">
                <span class="text-xs font-semibold inline-flex px-2 py-1 rounded-full ${this.TRAITS[t].color} mr-1">${t}</span>
                <span class="tooltiptext">${this.TRAITS[t].desc}</span>
            </div>
        `).join('');

        const isYouthPlayer = this.meuTime.youthSquad.some(p => p.id === playerId);
        const focusOptions = `
            <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                <label for="individual-focus-select" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Foco de Treino Individual:</label>
                <div class="flex space-x-2">
                    <select id="individual-focus-select" class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm">
                        <option value="">Nenhum</option>
                        <option value="Finalização" ${jogador.individualFocus === 'Finalização' ? 'selected' : ''}>Finalização</option>
                        <option value="Criação" ${jogador.individualFocus === 'Criação' ? 'selected' : ''}>Criação de Jogadas</option>
                        <option value="Defensivo" ${jogador.individualFocus === 'Defensivo' ? 'selected' : ''}>Habilidades Defensivas</option>
                        <option value="Velocidade" ${jogador.individualFocus === 'Velocidade' ? 'selected' : ''}>Velocidade & Ritmo</option>
                        ${jogador.posicao === 'Goleiro' ? `<option value="Goleiro" ${jogador.individualFocus === 'Goleiro' ? 'selected' : ''}>Técnicas de Goleiro</option>` : ''}
                    </select>
                    <button onclick="window.Game.setIndividualFocus('${playerId}', document.getElementById('individual-focus-select').value)" class="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">Definir</button>
                </div>
            </div>
        `;

        modalContent.innerHTML = `
            <div class="flex justify-between items-start">
                <div>
                    <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-200">${jogador.nome}</h2>
                    <p class="text-lg font-semibold text-gray-600 dark:text-gray-400">${jogador.posicao}, ${jogador.idade} anos</p>
                </div>
                <button onclick="window.Game.fecharPlayerModal()" class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-3xl leading-none">&times;</button>
            </div>
            <div class="mt-4 flex flex-wrap gap-2">${traitsHTML}</div>
             <div class="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Satisfação do Jogador</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Tempo de Jogo</p>
                        <p class="font-bold ${happinessColor(jogador.happiness.gameTime)}">${jogador.happiness.gameTime}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Contrato</p>
                        <p class="font-bold ${happinessColor(jogador.happiness.contract)}">${jogador.happiness.contract}</p>
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Desempenho do Time</p>
                        <p class="font-bold ${happinessColor(jogador.happiness.teamPerformance)}">${jogador.happiness.teamPerformance}</p>
                    </div>
                </div>
            </div>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div class="md:col-span-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Overall</p>
                    <p class="text-7xl font-extrabold text-indigo-600 dark:text-indigo-400">${jogador.habilidade}</p>
                    <p class="text-sm font-semibold text-gray-600 dark:text-gray-300">Potencial: ${jogador.potencialRange[0]}-${jogador.potencialRange[1]}</p>
                </div>
                <div class="md:col-span-2 grid grid-cols-2 gap-x-6 gap-y-3">
                    ${Object.entries(jogador.atributos).map(([attr, value]) => renderAttribute(attr, value)).join('')}
                </div>
            </div>
            ${!isYouthPlayer ? focusOptions : ''}
        `;
        document.getElementById('player-detail-modal').classList.remove('hidden');
    },

    fecharPlayerModal() { document.getElementById('player-detail-modal').classList.add('hidden'); },

    mostrarYouthAcademyModal() {
        const content = document.getElementById('youth-academy-content');
        content.innerHTML = '';
        let html = '<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">';
        if (!this.meuTime.youthSquad || this.meuTime.youthSquad.length === 0) {
             html += '<p class="text-gray-500 dark:text-gray-400 col-span-full text-center">Nenhum jovem na academia. Uma nova safra chega ao final de cada temporada.</p>';
        } else {
            const sortedYouth = [...this.meuTime.youthSquad].sort((a,b) => b.potencial - a.potencial);
            sortedYouth.forEach(jovem => {
                 const potencialColor = jovem.potencial > 94 ? 'text-green-500' : jovem.potencial > 88 ? 'text-yellow-500' : 'text-gray-500';
                 html += `
                    <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col justify-between">
                        <div onclick="window.Game.mostrarPlayerModal('${jovem.id}')" class="cursor-pointer">
                            <div class="flex justify-between items-start">
                                <p class="font-bold text-lg text-gray-900 dark:text-gray-200">${jovem.nome}</p>
                                <span class="text-xs font-semibold text-gray-500 dark:text-gray-400">${jovem.posicao}</span>
                            </div>
                            <p class="text-sm text-gray-600 dark:text-gray-400">${jovem.idade} anos</p>
                        </div>
                        <div class="my-3 text-center" onclick="window.Game.mostrarPlayerModal('${jovem.id}')" class="cursor-pointer">
                            <p class="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">${jovem.habilidade}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">OVR Atual</p>
                            <p class="mt-2 text-lg font-bold ${potencialColor}">${jovem.potencialRange[0]}-${jovem.potencialRange[1]}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400">Potencial</p>
                        </div>
                        <button onclick="window.Game.promoverJovem('${jovem.id}')" class="w-full mt-2 px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 ${jovem.idade < 17 ? 'opacity-50 cursor-not-allowed' : ''}" ${jovem.idade < 17 ? 'disabled' : ''}>
                            ${jovem.idade < 17 ? 'Disponível com 17 anos' : 'Promover ao Elenco Principal'}
                        </button>
                    </div>
                 `;
            });
        }
        html += '</div>';
        content.innerHTML = html;
        document.getElementById('youth-academy-modal').classList.remove('hidden');
    },

    fecharYouthAcademyModal() { document.getElementById('youth-academy-modal').classList.add('hidden'); },

    promoverJovem(youthPlayerId) {
        const jovem = this.meuTime.getYouthPlayer(youthPlayerId);
        if (!jovem || jovem.idade < 17) return;
        this.meuTime.jogadores.push(jovem);
        this.meuTime.youthSquad = this.meuTime.youthSquad.filter(p => p.id !== youthPlayerId);
        this.updateSquadView();
        this.mostrarYouthAcademyModal();
        this.exibirMensagem(`${jovem.nome} foi promovido ao time principal!`, 'success');
    },
    
    gerarOfertasPatrocinio() {
        this.sponsorshipOffers = [];
        const divReputation = { 'A': 1.0, 'B': 0.8, 'C': 0.6, 'D': 0.4, 'E': 0.2, 'F': 0.1 }[this.meuTime.divisao] || 0.1;
        const marketingBonus = 1 + (this.meuTime.depto_marketing_nivel - 1) * 0.1;
        const baseValues = [
            { name: 'Patrocínio Sólido', baseMult: 1.0, bonusMult: 0.25, seasons: 3 },
            { name: 'Aposta no Desempenho', baseMult: 0.6, bonusMult: 1.0, seasons: 2 },
            { name: 'Contrato Estável', baseMult: 1.3, bonusMult: 0.1, seasons: 5 }
        ];
        baseValues.forEach(offerType => {
            const base = 60000 * divReputation * marketingBonus * offerType.baseMult * (0.8 + Math.random() * 0.4);
            this.sponsorshipOffers.push({
                name: offerType.name,
                baseValue: Math.floor(base),
                titleBonus: Math.floor(base * offerType.bonusMult * 0.8),
                promotionBonus: Math.floor(base * offerType.bonusMult * 1.2),
                cupBonus: Math.floor(base * offerType.bonusMult * 0.6),
                seasons: offerType.seasons
            });
        });
        this.pendingSponsorshipChoice = true;
        this.mostrarSponsorshipModal();
    },

    mostrarSponsorshipModal() {
        const content = document.getElementById('sponsorship-offers-content');
        if(!content) return;
        content.innerHTML = '';
        this.sponsorshipOffers.forEach((offer, index) => {
            const totalPotential = offer.baseValue + offer.titleBonus + offer.promotionBonus + offer.cupBonus;
            content.innerHTML += `
                <div class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col">
                    <h3 class="text-xl font-bold text-indigo-700 dark:text-indigo-400">${offer.name}</h3>
                    <p class="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">${offer.seasons} Temporada(s)</p>
                    <div class="space-y-2 text-sm flex-grow">
                        <p><b>Valor Base (anual):</b> <span class="text-green-600 dark:text-green-400 font-semibold">$ ${offer.baseValue.toLocaleString('pt-BR')}</span></p>
                        <p><b>Bônus de Título:</b> $ ${offer.titleBonus.toLocaleString('pt-BR')}</p>
                        <p><b>Bônus de Promoção:</b> $ ${offer.promotionBonus.toLocaleString('pt-BR')}</p>
                        <p><b>Bônus de Copa:</b> $ ${offer.cupBonus.toLocaleString('pt-BR')}</p>
                    </div>
                     <p class="text-xs text-center text-gray-500 dark:text-gray-400 mt-3">Potencial Total: $ ${totalPotential.toLocaleString('pt-BR')}</p>
                    <button onclick="window.Game.escolherPatrocinio(${index})" class="w-full mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">Escolher Contrato</button>
                </div>
            `;
        });
        document.getElementById('sponsorship-modal').classList.remove('hidden');
    },
    
    escolherPatrocinio(index) {
        const deal = this.sponsorshipOffers[index];
        if (!deal) return;
        this.meuTime.sponsorshipDeal = { ...deal, seasonsRemaining: deal.seasons };
        this.sponsorshipOffers = [];
        this.pendingSponsorshipChoice = false;
        document.getElementById('sponsorship-modal').classList.add('hidden');
        this.exibirMensagem(`Novo acordo de patrocínio com '${deal.name}' assinado por ${deal.seasons} temporadas!`, "success");
        this.atualizarGraficos();
    },

    toggleDarkMode() {
        const htmlEl = document.documentElement;
        htmlEl.classList.toggle('dark');
        const isDarkMode = htmlEl.classList.contains('dark');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.getElementById('theme-toggle-light-icon').classList.toggle('hidden', isDarkMode);
        document.getElementById('theme-toggle-dark-icon').classList.toggle('hidden', !isDarkMode);
    },

    personalizarNomeTime() {
        // Fix: Cast to HTMLInputElement to access value property
        const newName = (document.getElementById('team-name-input') as HTMLInputElement).value.trim();
        if (newName && newName.length >= 3 && newName.length <= 25) {
            this.meuTime.nome = newName;
            this.atualizarGraficos();
            this.exibirMensagem(`Nome do time atualizado para ${newName}!`, "success");
        } else {
            this.exibirMensagem("Nome do time deve ter entre 3 e 25 caracteres.", "error");
        }
    },

    toggleColetiva(isChecked) {
        this.configuracoes.coletivaOpcional = isChecked;
        this.exibirMensagem(`Participação em coletivas agora é ${isChecked ? 'opcional' : 'automática'}.`, 'info');
    }
};

// Fix: Add Game to window scope for inline event handlers
(window as any).Game = Game;

document.addEventListener('DOMContentLoaded', () => {
    // Carregar preferência de tema
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.getElementById('theme-toggle-dark-icon').classList.remove('hidden');
        document.getElementById('theme-toggle-light-icon').classList.add('hidden');

    } else {
        document.documentElement.classList.remove('dark');
        document.getElementById('theme-toggle-dark-icon').classList.add('hidden');
        document.getElementById('theme-toggle-light-icon').classList.remove('hidden');
    }
    
    Game.dbManager.loadData('gameState_1')
        .then(() => {
            Game.carregarJogo();
        })
        .catch(() => {
            Game.initGame();
        });
});
