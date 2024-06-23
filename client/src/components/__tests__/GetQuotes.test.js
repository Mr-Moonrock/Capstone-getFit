import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter } from 'react-router-dom';
import GetQuotes from '../../Dashboard/quotes/GetQuotes';
import quotes from '../../Dashboard/quotes/quotes';

describe('GetQuotes component', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('renders without crashing', () => {
    render(<GetQuotes />);
  });

  test('renders initial quote correctly', () => {
    render(<GetQuotes />);

    const quoteElement = screen.getByText((content, element) =>
      element.tagName.toLowerCase() === 'p' && /^".+"$/.test(content.trim())
    );
    const authorElement = screen.getByText((content, element) =>
      element.tagName.toLowerCase() === 'footer' && /^.+$/.test(content.trim())
    );

    expect(quoteElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
  });

  test('updates quote every 20 seconds', () => {
    render(<GetQuotes />);

    const firstQuoteElement = screen.getByText((content, element) =>
      element.tagName.toLowerCase() === 'p' && /^".+"$/.test(content.trim())
    );
    const firstQuote = firstQuoteElement.textContent;

    act(() => {
      jest.advanceTimersByTime(20000); 
    });

    const secondQuoteElement = screen.getByText((content, element) =>
      element.tagName.toLowerCase() === 'p' && /^".+"$/.test(content.trim())
    );
    const secondQuote = secondQuoteElement.textContent;
    expect(secondQuote).not.toBe(firstQuote);
  });

  test('quote and author format is correct', () => {
    render(<GetQuotes />);
    
    const quoteElement = screen.getByText((content, element) =>
      element.tagName.toLowerCase() === 'p' && /^".+"$/.test(content.trim())
    );
    const authorElement = screen.getByText((content, element) =>
      element.tagName.toLowerCase() === 'footer' && /^.+$/.test(content.trim())
    );

    expect(quoteElement).toBeInTheDocument();
    expect(authorElement).toBeInTheDocument();
  });

});