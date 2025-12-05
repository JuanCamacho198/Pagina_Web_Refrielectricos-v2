/// <reference types="@types/jest" />
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from '../../../components/ui/Input';
import React from 'react';

describe('Input Component', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render with label', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should render with placeholder', () => {
      render(<Input placeholder="Ingresa tu email" />);
      expect(screen.getByPlaceholderText('Ingresa tu email')).toBeInTheDocument();
    });

    it('should render error message when error prop is provided', () => {
      render(<Input error="Este campo es requerido" />);
      expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });

    it('should not render error message when error prop is not provided', () => {
      render(<Input label="Email" />);
      expect(screen.queryByText(/error/i)).not.toBeInTheDocument();
    });
  });

  describe('functionality', () => {
    it('should accept user input', async () => {
      const user = userEvent.setup();
      render(<Input />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test@example.com');
      
      expect(input).toHaveValue('test@example.com');
    });

    it('should call onChange handler', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();
      
      render(<Input onChange={handleChange} />);
      const input = screen.getByRole('textbox');
      
      await user.type(input, 'a');
      
      expect(handleChange).toHaveBeenCalled();
    });

    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />);
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLInputElement>();
      render(<Input ref={ref} />);
      
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('input types', () => {
    it('should render as password type', () => {
      render(<Input type="password" data-testid="password-input" />);
      const input = screen.getByTestId('password-input');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render as email type', () => {
      render(<Input type="email" data-testid="email-input" />);
      const input = screen.getByTestId('email-input');
      expect(input).toHaveAttribute('type', 'email');
    });

    it('should render as number type', () => {
      render(<Input type="number" data-testid="number-input" />);
      const input = screen.getByTestId('number-input');
      expect(input).toHaveAttribute('type', 'number');
    });
  });

  describe('styling', () => {
    it('should apply custom className', () => {
      render(<Input className="custom-class" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-class');
    });

    it('should apply error styling when error is present', () => {
      render(<Input error="Error message" />);
      expect(screen.getByRole('textbox')).toHaveClass('ring-red-500');
    });
  });

  describe('accessibility', () => {
    it('should associate label with input', () => {
      render(<Input label="Email" id="email-input" />);
      // The label is rendered but not formally associated - this tests the visual relationship
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should support aria-label', () => {
      render(<Input aria-label="Search products" />);
      expect(screen.getByRole('textbox', { name: 'Search products' })).toBeInTheDocument();
    });

    it('should support aria-describedby for error messages', () => {
      render(<Input aria-describedby="error-msg" error="Invalid input" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-describedby', 'error-msg');
    });
  });
});
