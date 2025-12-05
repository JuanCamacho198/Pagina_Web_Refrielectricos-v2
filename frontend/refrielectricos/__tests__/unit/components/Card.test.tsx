/* eslint-disable @next/next/no-img-element */
/// <reference types="@types/jest" />
import { render, screen } from '@testing-library/react';
import Card from '../../../components/ui/Card';
import React from 'react';

describe('Card Component', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      render(<Card data-testid="card">Content</Card>);
      expect(screen.getByTestId('card')).toBeInTheDocument();
    });

    it('should render children correctly', () => {
      render(<Card>Card Content</Card>);
      expect(screen.getByText('Card Content')).toBeInTheDocument();
    });

    it('should render complex children', () => {
      render(
        <Card>
          <h2>Title</h2>
          <p>Description</p>
          <button>Action</button>
        </Card>
      );
      
      expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('should apply default classes', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('rounded-xl');
      expect(card).toHaveClass('shadow-sm');
      expect(card).toHaveClass('border');
    });

    it('should apply custom className', () => {
      render(<Card data-testid="card" className="my-custom-class">Content</Card>);
      expect(screen.getByTestId('card')).toHaveClass('my-custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<Card data-testid="card" className="p-8">Content</Card>);
      const card = screen.getByTestId('card');
      
      expect(card).toHaveClass('p-8');
      expect(card).toHaveClass('bg-white');
    });
  });

  describe('ref forwarding', () => {
    it('should forward ref correctly', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(<Card ref={ref}>Content</Card>);
      
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('HTML attributes', () => {
    it('should pass through HTML attributes', () => {
      render(
        <Card 
          data-testid="card"
          id="my-card" 
          role="article"
        >
          Content
        </Card>
      );
      
      const card = screen.getByTestId('card');
      expect(card).toHaveAttribute('id', 'my-card');
      expect(card).toHaveAttribute('role', 'article');
    });

    it('should handle onClick events', () => {
      const handleClick = jest.fn();
      render(
        <Card data-testid="card" onClick={handleClick}>
          Clickable Card
        </Card>
      );
      
      screen.getByTestId('card').click();
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('dark mode support', () => {
    it('should have dark mode classes', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      
      // Check that dark mode classes exist in the className
      expect(card.className).toContain('dark:bg-gray-800');
      expect(card.className).toContain('dark:border-gray-700');
    });
  });

  describe('composition', () => {
    it('should work as a product card container', () => {
      render(
        <Card data-testid="product-card">
          <img src="/product.jpg" alt="Product" />
          <div>
            <h3>Product Name</h3>
            <p>$100.000</p>
          </div>
        </Card>
      );
      
      expect(screen.getByTestId('product-card')).toBeInTheDocument();
      expect(screen.getByAltText('Product')).toBeInTheDocument();
      expect(screen.getByText('Product Name')).toBeInTheDocument();
    });

    it('should work as a form container', () => {
      render(
        <Card>
          <form>
            <input type="text" placeholder="Name" />
            <button type="submit">Submit</button>
          </form>
        </Card>
      );
      
      expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });
});
