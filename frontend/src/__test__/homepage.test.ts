import App from "../App";
import { render, screen } from '@testing-library/react';

describe('test', () => {

  let container: HTMLElement;


  function setUp() {
    container = render(<App/>).container;
  }

  beforeEach(() => {
    setUp();
  })
  
  test('First test', () => {
    
    expect(2).toBe(2);
  })
})