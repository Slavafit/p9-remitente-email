import { render } from '@testing-library/react';
import Header from "../src/components/Header";
import { useAuth } from "../src/service/AuthUser";


  describe('Header component', () => {
    it('the title is visible', () => {
      const { getByText } = render(<Header />);
      expect(getByText(/Remitente/i)).toBeInTheDocument();
    });
  });
  
  
  
  
  
  