// main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

import { AuthProvider } from './context/AuthContext.jsx';
import { RecipesProvider } from './context/RecipesContext';
import { FavoritesProvider } from './context/FavoritesContext.jsx';
import { RatingsProvider } from './context/RatingsContext.jsx';

import { CommentsProvider } from './context/CommentsContext.jsx';

import '../src/styles/App.css'
import '../src/styles/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RecipesProvider>
      <FavoritesProvider>
        <RatingsProvider>
          <CommentsProvider>
            <App />
          </CommentsProvider>
        </RatingsProvider>
      </FavoritesProvider>
      </RecipesProvider>
    </AuthProvider>
  </StrictMode>,
)
