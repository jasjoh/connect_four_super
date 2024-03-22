import { render } from '@testing-library/react';
import App from './App';

describe("Connect 4 App", function () {
  it("renders without crashing", function () {
    render(<App />);
  });
});
