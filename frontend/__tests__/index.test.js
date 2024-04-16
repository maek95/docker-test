import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders a "Log In" button when the user is not logged in', () => {
    // Render the Home component
    render(<Home />);

    // Check if the "Log In" button is rendered
    const logInButton = screen.getByText('Log In');
    expect(logInButton).toBeInTheDocument();
  });
});