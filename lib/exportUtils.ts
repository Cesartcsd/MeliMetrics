/**
 * Utilitários padronizados para exportação de dados e relatórios.
 * Suporta codificação UTF-8 com BOM para Excel no Windows e formatação brasileira.
 */

export function exportToCSV(filename: string, headers: string[], rows: (string | number | null | undefined)[][]): void {
  const sanitize = (val: string | number | null | undefined): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  // Ponto-e-vírgula é o delimitador padrão para o Microsoft Excel em sistemas operacionais com locale pt-BR
  const csvBody = [
    headers.map(sanitize).join(';'),
    ...rows.map(row => row.map(sanitize).join(';'))
  ].join('\r\n');

  // \uFEFF força o Excel a interpretar o arquivo em UTF-8 com acentuações corretas
  const blob = new Blob(['\uFEFF' + csvBody], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
