import '@testing-library/jest-dom/vitest';
import 'vitest-axe/extend-expect';
import { afterEach } from 'vitest';

afterEach(() => {
  localStorage.clear();
  document.body.innerHTML = '';
});
