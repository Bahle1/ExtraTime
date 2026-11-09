import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { AppProviders } from './app/AppProviders';
import { createAppRouter } from './app/router';
import './styles/global.css';

const ROOT_ELEMENT_ID = 'root';
const rootElement = document.getElementById(ROOT_ELEMENT_ID);
if (rootElement === null) throw new Error(`Missing #${ROOT_ELEMENT_ID} in index.html`);
const router = createAppRouter();

createRoot(rootElement).render(
  <StrictMode>
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  </StrictMode>,
);
