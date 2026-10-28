/*
 * Categoria: tecnologia
 * Prefixo: te
 * Próximo id livre: te-021
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'te-999', categoria: 'tecnologia', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasTecnologia: Pergunta[] = [
  {
    "id": "te-010",
    "categoria": "tecnologia",
    "dificuldade": "facil",
    "enunciado": "Qual destes dispositivos serve para digitar texto no computador?",
    "alternativas": [
      "Mouse",
      "Teclado",
      "Monitor",
      "Caixa de som"
    ],
    "correta": 1,
    "explicacao": "O teclado é um dispositivo de entrada. O monitor e a caixa de som são de saída."
  },
  {
    "id": "te-011",
    "categoria": "tecnologia",
    "dificuldade": "facil",
    "enunciado": "Qual empresa criou o sistema operacional Windows?",
    "alternativas": [
      "Apple",
      "Microsoft",
      "Google",
      "IBM"
    ],
    "correta": 1,
    "explicacao": "A Microsoft foi fundada por Bill Gates e Paul Allen, em 1975, e lançou o Windows em 1985."
  },
  {
    "id": "te-012",
    "categoria": "tecnologia",
    "dificuldade": "facil",
    "enunciado": "Qual destes é um sistema operacional para celulares?",
    "alternativas": [
      "Excel",
      "Android",
      "Photoshop",
      "Chrome"
    ],
    "correta": 1,
    "explicacao": "O Android é o sistema operacional móvel mais usado no mundo. Excel e Photoshop são programas, e o Chrome é um navegador."
  },
  {
    "id": "te-013",
    "categoria": "tecnologia",
    "dificuldade": "facil",
    "enunciado": "Qual símbolo separa o nome do usuário do domínio em um endereço de e-mail?",
    "alternativas": [
      "#",
      "@",
      "&",
      "%"
    ],
    "correta": 1,
    "explicacao": "O arroba (@) foi escolhido em 1971 por Ray Tomlinson, criador do e-mail em rede."
  },
  {
    "id": "te-014",
    "categoria": "tecnologia",
    "dificuldade": "medio",
    "enunciado": "O que significa a sigla USB?",
    "alternativas": [
      "Universal Serial Bus",
      "United System Board",
      "Unique Service Block",
      "Universal Storage Box"
    ],
    "correta": 0,
    "explicacao": "USB significa \"barramento serial universal\" e foi criado para padronizar a conexão de dispositivos."
  },
  {
    "id": "te-015",
    "categoria": "tecnologia",
    "dificuldade": "medio",
    "enunciado": "Qual empresa lançou o iPhone, em 2007?",
    "alternativas": [
      "Samsung",
      "Apple",
      "Nokia",
      "Google"
    ],
    "correta": 1,
    "explicacao": "Steve Jobs apresentou o primeiro iPhone em janeiro de 2007."
  },
  {
    "id": "te-016",
    "categoria": "tecnologia",
    "dificuldade": "medio",
    "enunciado": "Qual linguagem de programação roda nos navegadores e dá interatividade às páginas web?",
    "alternativas": [
      "JavaScript",
      "C++",
      "Python",
      "SQL"
    ],
    "correta": 0,
    "explicacao": "O JavaScript foi criado em 1995 e hoje está em quase todos os sites. Apesar do nome, não tem relação com o Java."
  },
  {
    "id": "te-017",
    "categoria": "tecnologia",
    "dificuldade": "medio",
    "enunciado": "Qual é a função de um firewall em uma rede?",
    "alternativas": [
      "Aumentar a velocidade da internet",
      "Filtrar o tráfego e bloquear acessos não autorizados",
      "Armazenar arquivos na nuvem",
      "Converter vídeos"
    ],
    "correta": 1,
    "explicacao": "O firewall funciona como uma barreira entre a rede e o mundo externo, seguindo regras de segurança."
  },
  {
    "id": "te-018",
    "categoria": "tecnologia",
    "dificuldade": "dificil",
    "enunciado": "Qual é o nome do computador eletrônico de uso geral concluído nos Estados Unidos, em 1945-1946, e conhecido como um dos primeiros do tipo?",
    "alternativas": [
      "ENIAC",
      "UNIVAC",
      "Colossus",
      "Altair"
    ],
    "correta": 0,
    "explicacao": "O ENIAC ocupava uma sala inteira e usava milhares de válvulas."
  },
  {
    "id": "te-019",
    "categoria": "tecnologia",
    "dificuldade": "dificil",
    "enunciado": "Qual matemático britânico, considerado um dos pais da computação, criou o conceito da máquina de Turing?",
    "alternativas": [
      "Alan Turing",
      "John von Neumann",
      "Charles Babbage",
      "Claude Shannon"
    ],
    "correta": 0,
    "explicacao": "Alan Turing descreveu a máquina em 1936 e ajudou a decifrar mensagens nazistas na Segunda Guerra Mundial."
  },
  {
    "id": "te-020",
    "categoria": "tecnologia",
    "dificuldade": "dificil",
    "enunciado": "Qual tipo de criptografia usa um par de chaves, uma pública e uma privada?",
    "alternativas": [
      "Criptografia assimétrica",
      "Compressão de dados",
      "Backup incremental",
      "Virtualização"
    ],
    "correta": 0,
    "explicacao": "Na criptografia assimétrica, o que a chave pública tranca só a chave privada abre. Ela é base de conexões seguras, como o HTTPS."
  },
  {
    "id": "te-001",
    "categoria": "tecnologia",
    "dificuldade": "facil",
    "enunciado": "O que significa a sigla CPU?",
    "alternativas": [
      "Unidade Central de Processamento",
      "Controle Principal de Usuário",
      "Computador Pessoal Universal",
      "Unidade de Cache Permanente"
    ],
    "correta": 0,
    "explicacao": "A CPU é o componente que executa as instruções dos programas."
  },
  {
    "id": "te-002",
    "categoria": "tecnologia",
    "dificuldade": "facil",
    "enunciado": "Qual destes é um navegador de internet?",
    "alternativas": [
      "Windows",
      "Chrome",
      "Excel",
      "Linux"
    ],
    "correta": 1,
    "explicacao": "O Chrome é um navegador. Windows e Linux são sistemas operacionais, e o Excel é uma planilha."
  },
  {
    "id": "te-003",
    "categoria": "tecnologia",
    "dificuldade": "facil",
    "enunciado": "Qual linguagem é usada para estruturar o conteúdo de páginas web?",
    "alternativas": [
      "HTML",
      "Python",
      "SQL",
      "C"
    ],
    "correta": 0,
    "explicacao": "HTML define a estrutura da página, como títulos, parágrafos e links."
  },
  {
    "id": "te-004",
    "categoria": "tecnologia",
    "dificuldade": "medio",
    "enunciado": "O que significa a sigla URL?",
    "alternativas": [
      "Localizador Uniforme de Recursos",
      "Unidade de Rede Local",
      "Usuário de Rede Livre",
      "Ligação Universal de Rotas"
    ],
    "correta": 0,
    "explicacao": "URL vem de Uniform Resource Locator, o endereço de um recurso na internet."
  },
  {
    "id": "te-005",
    "categoria": "tecnologia",
    "dificuldade": "medio",
    "enunciado": "Quem é creditado como criador da World Wide Web?",
    "alternativas": [
      "Bill Gates",
      "Tim Berners-Lee",
      "Steve Jobs",
      "Linus Torvalds"
    ],
    "correta": 1,
    "explicacao": "Tim Berners-Lee propôs a Web em 1989, quando trabalhava no CERN."
  },
  {
    "id": "te-006",
    "categoria": "tecnologia",
    "dificuldade": "medio",
    "enunciado": "Quantos bits há em um byte?",
    "alternativas": [
      "4",
      "8",
      "16",
      "32"
    ],
    "correta": 1,
    "explicacao": "Um byte é formado por 8 bits."
  },
  {
    "id": "te-007",
    "categoria": "tecnologia",
    "dificuldade": "dificil",
    "enunciado": "Qual sistema operacional de código aberto nasceu do kernel criado por Linus Torvalds?",
    "alternativas": [
      "Unix",
      "Linux",
      "Android",
      "FreeBSD"
    ],
    "correta": 1,
    "explicacao": "Linus Torvalds começou o kernel Linux em 1991. O Android também usa o kernel Linux, mas é outro sistema."
  },
  {
    "id": "te-008",
    "categoria": "tecnologia",
    "dificuldade": "dificil",
    "enunciado": "Qual protocolo é usado para transferir páginas web com conexão criptografada?",
    "alternativas": [
      "FTP",
      "SMTP",
      "HTTPS",
      "SSH"
    ],
    "correta": 2,
    "explicacao": "O HTTPS é o HTTP protegido por criptografia, o que é indicado pelo cadeado no navegador."
  },
  {
    "id": "te-009",
    "categoria": "tecnologia",
    "dificuldade": "dificil",
    "enunciado": "Qual empresa criou originalmente a linguagem de programação Java?",
    "alternativas": [
      "Oracle",
      "Sun Microsystems",
      "Microsoft",
      "IBM"
    ],
    "correta": 1,
    "explicacao": "O Java foi criado na Sun por James Gosling e equipe. A Oracle comprou a Sun em 2010."
  }
] as Pergunta[]
