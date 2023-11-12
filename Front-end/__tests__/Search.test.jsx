import { render } from '@testing-library/react';
import Search from "../src/components/Search";


  describe('Search component', () => {
    it('the title is visible', () => {
      const { getByText } = render(<Search />);
      expect(getByText(/Búsqueda/i)).toBeInTheDocument();
    });
  });
  
  
  
  
  
  