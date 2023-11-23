import { screen, render } from '@testing-library/react';
import Header from "../src/components/Header";

const auth = true;

  describe('Header component', () => {

    it('the title is visible', () => {
      render(<Header/>);

      expect(screen.getAllByText(/Remitente/i)).toBeInTheDocument();
    });
  });