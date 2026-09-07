// App
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import MainLayout from './components/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import GuestRoute from './components/GuestRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import MyRecipes from './pages/MyRecipes';
import RecipeWeek from './pages/RecipeWeek';
import RecipeNew from './pages/RecipeNew';
import RecipeEdit from './pages/RecipeEdit';
import RecipeDetails from './pages/RecipeDetails';
import RecipeExplorer from './pages/RecipeExplorer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout Principal com Header e Footer para todas as páginas */}
        <Route element={<MainLayout />}>
          
          {/*  ROTAS PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<RecipeExplorer />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />

          {/* ROTAS APENAS PARA VISITANTES (Não Logados) */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>

          {/* ROTAS PROTEGIDAS (Apenas Logados) */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/menu" element={<RecipeWeek />} />
            <Route path="/recipe/new" element={<RecipeNew />} />
            <Route path="/recipe/:id/edit" element={<RecipeEdit />} />
          </Route>

          {/* ROTA ADMIN */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}