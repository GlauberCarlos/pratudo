// App
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster, toast } from 'sonner';

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
import NotFound from './pages/NotFound';
import EditProfile from './pages/EditProfile';
import AdminEditUser from './pages/AdminEditUser';
import MyComments from './pages/MyComments';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right"
        richColors
        expand={true}        
        toastOptions={{          
          style: {
            background: 'var(--branco)',
            color: 'var(--verde1)',
            fontSize: '1.2rem',
            minWidth: '400px',
            padding: '16px',
            borderRadius: '12px',
          },
          duration: 7000,
          actionButtonStyle: {
            backgroundColor: 'var(--vermelho)',
            color: 'var(--branco)',
          },
          cancelButtonStyle: {
            backgroundColor: 'var(--laranja1)',
            color: 'var(--branco)',
          },
        }} />
      <Routes>
        <Route element={<MainLayout />}>

          {/* PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<RecipeExplorer />} />
          <Route path="/recipe/:id" element={<RecipeDetails />} />

          {/* VISITANTES */}
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </Route>

          {/* PROTEGIDAS */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-recipes" element={<MyRecipes />} />
            <Route path="/menu" element={<RecipeWeek />} />
            <Route path="/recipe/new" element={<RecipeNew />} />
            <Route path="/recipe/edit/:id" element={<RecipeEdit />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/my-comments" element={<MyComments />} />
          </Route>

          {/* ADMIN */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users/edit/:id" element={<AdminEditUser />} />
          </Route>

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}