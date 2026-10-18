import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { describe, expect, it, vi } from 'vitest';

import Login from '@/components/Login';

describe('login sintético do shell legado', () => {
  it('informa campos obrigatórios sem criar sessão', () => {
    render(<Login onLogin={vi.fn()} />);

    fireEvent.submit(screen.getByRole('button', { name: /acessar dashboard/i }).closest('form')!);

    expect(screen.getByRole('alert')).toHaveTextContent(/preencha o e-mail/i);
    expect(localStorage.getItem('melimetrics_auth')).toBeNull();
  });

  it('mantém a estrutura sem violações críticas de acessibilidade', async () => {
    const { container } = render(<Login onLogin={vi.fn()} />);

    expect((await axe(container)).violations).toHaveLength(0);
  });
});
