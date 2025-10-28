import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DynamicForm } from './DynamicForm';

describe('DynamicForm', () => {
  it('renders and shows submit button', () => {
    render(<DynamicForm formTitle="Title Form" fields={[]} record={{}} onSubmit={vi.fn()} />);
    const button = screen.getByRole('button', { name: /enviar/i });
    expect(button).toBeInTheDocument();
  });
});
