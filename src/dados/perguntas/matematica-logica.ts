/*
 * Categoria: matematica-logica
 * Prefixo: ma
 * Próximo id livre: ma-016
 * Meta: 50 perguntas (17 fáceis / 17 médias / 16 difíceis).
 * Checklist de qualidade: fato estável e verificável; enunciado sem ambiguidade; alternativas plausíveis;
 * explicação educativa curta; sem tema controverso ou obscuro; evitar informação que muda com o tempo.
 *
 * Modelo de pergunta (exemplo estrutural, não faz parte do banco):
 * { id: 'ma-999', categoria: 'matematica-logica', dificuldade: 'facil', enunciado: 'Enunciado escrito pelo dono?',
 *   alternativas: ['Opção A', 'Opção B', 'Opção C', 'Opção D'], correta: 0, explicacao: 'Explicação curta.' }
 */
import type { Pergunta } from '../../tipos'

export const perguntasMatematicaLogica: Pergunta[] = [
  {
    "id": "ma-001",
    "categoria": "matematica-logica",
    "dificuldade": "facil",
    "enunciado": "Quanto é 7 × 8?",
    "alternativas": [
      "54",
      "56",
      "58",
      "64"
    ],
    "correta": 1,
    "explicacao": "7 × 8 = 56. Um truque: 5, 6, 7, 8 (56 = 7 × 8)."
  },
  {
    "id": "ma-002",
    "categoria": "matematica-logica",
    "dificuldade": "facil",
    "enunciado": "Quantos lados tem um hexágono?",
    "alternativas": [
      "5",
      "6",
      "7",
      "8"
    ],
    "correta": 1,
    "explicacao": "\"Hexa\" vem do grego e significa seis."
  },
  {
    "id": "ma-003",
    "categoria": "matematica-logica",
    "dificuldade": "facil",
    "enunciado": "Quanto é 100 dividido por 4?",
    "alternativas": [
      "20",
      "25",
      "30",
      "40"
    ],
    "correta": 1,
    "explicacao": "Dividir por 4 é o mesmo que dividir por 2 duas vezes: 100 ÷ 2 = 50 e 50 ÷ 2 = 25."
  },
  {
    "id": "ma-004",
    "categoria": "matematica-logica",
    "dificuldade": "facil",
    "enunciado": "Qual é o próximo número da sequência 2, 4, 6, 8, ...?",
    "alternativas": [
      "9",
      "10",
      "11",
      "12"
    ],
    "correta": 1,
    "explicacao": "A sequência soma 2 a cada passo, então depois do 8 vem o 10."
  },
  {
    "id": "ma-005",
    "categoria": "matematica-logica",
    "dificuldade": "facil",
    "enunciado": "Quantos minutos tem uma hora e meia?",
    "alternativas": [
      "60",
      "75",
      "90",
      "100"
    ],
    "correta": 2,
    "explicacao": "Uma hora tem 60 minutos e meia hora tem 30, ou seja, 90 minutos."
  },
  {
    "id": "ma-006",
    "categoria": "matematica-logica",
    "dificuldade": "medio",
    "enunciado": "Qual é o valor aproximado de π (pi), com duas casas decimais?",
    "alternativas": [
      "2,72",
      "3,14",
      "3,41",
      "1,62"
    ],
    "correta": 1,
    "explicacao": "π é a razão entre o comprimento de uma circunferência e o seu diâmetro. Vale cerca de 3,14159."
  },
  {
    "id": "ma-007",
    "categoria": "matematica-logica",
    "dificuldade": "medio",
    "enunciado": "Quanto é 15% de 200?",
    "alternativas": [
      "15",
      "20",
      "30",
      "45"
    ],
    "correta": 2,
    "explicacao": "10% de 200 é 20 e 5% é 10. Somando, 15% é 30."
  },
  {
    "id": "ma-008",
    "categoria": "matematica-logica",
    "dificuldade": "medio",
    "enunciado": "Qual é a raiz quadrada de 144?",
    "alternativas": [
      "10",
      "11",
      "12",
      "14"
    ],
    "correta": 2,
    "explicacao": "12 × 12 = 144."
  },
  {
    "id": "ma-009",
    "categoria": "matematica-logica",
    "dificuldade": "medio",
    "enunciado": "Quanto vale a soma dos ângulos internos de um triângulo?",
    "alternativas": [
      "90°",
      "180°",
      "270°",
      "360°"
    ],
    "correta": 1,
    "explicacao": "Em qualquer triângulo plano, os três ângulos internos somam 180°."
  },
  {
    "id": "ma-010",
    "categoria": "matematica-logica",
    "dificuldade": "medio",
    "enunciado": "Qual destes números é primo?",
    "alternativas": [
      "21",
      "27",
      "29",
      "33"
    ],
    "correta": 2,
    "explicacao": "29 só é divisível por 1 e por ele mesmo. Já 21 = 3 × 7, 27 = 3 × 9 e 33 = 3 × 11."
  },
  {
    "id": "ma-011",
    "categoria": "matematica-logica",
    "dificuldade": "dificil",
    "enunciado": "Qual é o próximo número da sequência de Fibonacci: 1, 1, 2, 3, 5, 8, ...?",
    "alternativas": [
      "11",
      "12",
      "13",
      "15"
    ],
    "correta": 2,
    "explicacao": "Cada termo é a soma dos dois anteriores: 5 + 8 = 13."
  },
  {
    "id": "ma-012",
    "categoria": "matematica-logica",
    "dificuldade": "dificil",
    "enunciado": "Quanto é 2 elevado à décima potência (2¹⁰)?",
    "alternativas": [
      "512",
      "1.000",
      "1.024",
      "2.048"
    ],
    "correta": 2,
    "explicacao": "2¹⁰ = 1.024. Esse valor aparece na informática, onde 1 kilobyte equivale a 1.024 bytes em algumas medidas."
  },
  {
    "id": "ma-013",
    "categoria": "matematica-logica",
    "dificuldade": "dificil",
    "enunciado": "Em um triângulo retângulo com catetos de 3 e 4 unidades, quanto mede a hipotenusa?",
    "alternativas": [
      "5",
      "6",
      "7",
      "12"
    ],
    "correta": 0,
    "explicacao": "Pelo teorema de Pitágoras, 3² + 4² = 9 + 16 = 25, e a raiz quadrada de 25 é 5."
  },
  {
    "id": "ma-014",
    "categoria": "matematica-logica",
    "dificuldade": "dificil",
    "enunciado": "Quantas diagonais tem um quadrado?",
    "alternativas": [
      "2",
      "4",
      "6",
      "8"
    ],
    "correta": 0,
    "explicacao": "Um quadrado tem duas diagonais, que ligam vértices opostos e se cruzam no centro."
  },
  {
    "id": "ma-015",
    "categoria": "matematica-logica",
    "dificuldade": "dificil",
    "enunciado": "Se 3 operários constroem um muro em 6 dias, em quantos dias 6 operários, no mesmo ritmo, construiriam o mesmo muro?",
    "alternativas": [
      "2 dias",
      "3 dias",
      "4 dias",
      "12 dias"
    ],
    "correta": 1,
    "explicacao": "Dobrando o número de operários, o tempo cai pela metade: de 6 para 3 dias."
  }
] as Pergunta[]
