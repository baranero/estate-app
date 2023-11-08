import { render, screen } from '@testing-library/react';
import Test from '../components/Test';

describe('Test component renders "Test"', () => {
  it('render', () => {
    render(<Test />);
    const testElement = screen.getByText('Test');
    expect(testElement).toBeInTheDocument();
  })

});
