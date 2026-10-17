/**
 * Utilitários de formatação e cálculos financeiros e de calendário.
 */

export const formatCurrency = (value: number, minimumFractionDigits = 2): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
};

export const formatCompactCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}M`;
  }
  if (value >= 1_000) {
    return `R$ ${(value / 1_000).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}k`;
  }
  return formatCurrency(value);
};

export const formatPercentage = (value: number, decimals = 1): string => {
  return `${value.toLocaleString('pt-BR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}%`;
};

/**
 * Retorna os dados estatísticos dinâmicos do mês corrente:
 * - diasNoMes: Total de dias no mês atual
 * - diaAtual: Dia atual do mês (1 a 31)
 * - diasRestantes: Dias restantes no mês
 * - percentualMesDecorrido: Proporção já transcorrida
 */
export const getMesCalendarioInfo = () => {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = agora.getMonth(); // 0-11
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();
  const diaAtual = Math.max(1, agora.getDate());
  const diasRestantes = Math.max(0, diasNoMes - diaAtual);
  const percentualMesDecorrido = Math.min(100, (diaAtual / diasNoMes) * 100);

  return {
    diasNoMes,
    diaAtual,
    diasRestantes,
    percentualMesDecorrido,
  };
};

/**
 * Calcula a projeção de fechamento estatística baseada no run-rate diário real.
 */
export const calcularProjecaoRunRate = (gmvAtual: number): number => {
  const { diaAtual, diasNoMes } = getMesCalendarioInfo();
  const mediaDiaria = gmvAtual / diaAtual;
  return Math.round(mediaDiaria * diasNoMes);
};
