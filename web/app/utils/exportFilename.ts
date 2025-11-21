export function construirNomeArquivo(index: number, isCloud: boolean): string {
  const tipo = isCloud ? 'cloud' : 'local';
  return `grade-horaria-${tipo}-${index + 1}.png`;
}

export default construirNomeArquivo;
