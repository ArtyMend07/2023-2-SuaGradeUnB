import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SchedulePreview from '@/app/components/SchedulePreview/SchedulePreview';
import html2canvas from 'html2canvas';

describe('SchedulePreview - Exportar em PNG', () => {
  it('Ciclo 1 - GREEN: deve renderizar um botao com texto "Exportar PNG"', () => {
    render(
      <SchedulePreview 
        localSchedule={[]}
        index={0}
        position={1}
      />
    );

    const botaoExportarPNG = screen.getByText('Exportar PNG');
    expect(botaoExportarPNG).toBeInTheDocument();
  });

  it('Ciclo 2 - REFACTOR: ao clicar no botao, ainda deve gerar e baixar PNG', async () => {
    (html2canvas as jest.Mock).mockClear();

    // Criar o elemento que a função espera
    const downloadElement = document.createElement('div');
    downloadElement.id = 'download-content';
    document.body.appendChild(downloadElement);

    render(
      <SchedulePreview 
        localSchedule={[]}
        index={0}
        position={1}
      />
    );

    const botaoExportarPNG = screen.getByText('Exportar PNG');
    const user = userEvent.setup();
    
    await user.click(botaoExportarPNG);
    
    // Esperar um pouco para a promise resolver
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Verificar se html2canvas foi chamado
    expect(html2canvas).toHaveBeenCalled();

    // Limpar
    document.body.removeChild(downloadElement);
  });

  it('Ciclo 3 - REFACTOR: quando html2canvas rejeita, ainda deve mostrar errorToast', async () => {
    
    (html2canvas as jest.Mock).mockRejectedValue(new Error('fail'));

    // Criar o elemento que a função espera
    const downloadElement = document.createElement('div');
    downloadElement.id = 'download-content';
    document.body.appendChild(downloadElement);

    render(
      <SchedulePreview 
        localSchedule={[]}
        index={0}
        position={1}
      />
    );

    const botaoExportarPNG = screen.getByText('Exportar PNG');
    const user = userEvent.setup();
    
    await user.click(botaoExportarPNG);

    // Esperar a promise rejeitar
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verificar se errorToast foi chamado
    const { errorToast } = require('@/app/utils/toast');
    expect(errorToast).toHaveBeenCalled();

    // Limpar
    document.body.removeChild(downloadElement);
  });

  it('Ciclo 4 - REFACTOR: obterNomeArquivo deve estar exportada pelo componente', () => {
    const mod = require('@/app/components/SchedulePreview/SchedulePreview');
    const obterNomeArquivo = mod.obterNomeArquivo;
    expect(typeof obterNomeArquivo).toBe('function');
    expect(obterNomeArquivo(0, false)).toBe('grade-horaria-local-1.png');
  });

  it('Ciclo 5 - REFACTOR: quando a exportacao sucede, ainda deve mostrar successToast, mesmo extraindo a string de sucesso para a constante exportada, substituindo a chamada direta ', async () => {
    // Garantir que html2canvas resolve (comportamento esperado)
    (html2canvas as jest.Mock).mockResolvedValue({ toDataURL: jest.fn(() => 'data:image/png;base64,test') });

    // Criar o elemento que a função espera
    const downloadElement = document.createElement('div');
    downloadElement.id = 'download-content';
    document.body.appendChild(downloadElement);

    render(
      <SchedulePreview 
        localSchedule={[]}
        index={0}
        position={1}
      />
    );

    const botaoExportarPNG = screen.getByText('Exportar PNG');
    const user = userEvent.setup();
    await user.click(botaoExportarPNG);

    // Esperar a promise resolver
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verificar se successToast foi chamado (a mensagem atual não corresponde ao esperado para forçar RED)
    const { successToast } = require('@/app/utils/toast');
    expect(successToast).toHaveBeenCalledWith('Exportação concluída');

    // Limpar
    document.body.removeChild(downloadElement);
  });
});
