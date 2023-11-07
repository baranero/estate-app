import { render, screen } from '@testing-library/react';
import About from '../pages/About';

describe('About Component', () => {
  it('renders the component with the correct content', () => {
    render(<About />);
    expect(screen.getByText('About Jakub Baran')).toBeInTheDocument();
    expect(screen.getByText('Jakub Baran is a leading real estate agency that specializes in helping clients buy, sell, and rent properties in the most desirable neighborhoods. Our team of experienced agents is dedicated to providing exceptional service and making the buying and selling process as smooth as possible.')).toBeInTheDocument();
    expect(screen.getByText('Our mission is to help our clients achieve their real estate goals by providing expert advice, personalized service, and a deep understanding of the local market. Whether you are looking to buy, sell, or rent a property, we are here to help you every step of the way.')).toBeInTheDocument();
    expect(screen.getByText('Our team of agents has a wealth of experience and knowledge in the real estate industry, and we are committed to providing the highest level of service to our clients. We believe that buying or selling a property should be an exciting and rewarding experience, and we are dedicated to making that a reality for each and every one of our clients.')).toBeInTheDocument();
  });
});
