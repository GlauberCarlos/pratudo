// App
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// import { useRecipes } from './hooks/useRecipes';
import { useAuth } from './hooks/useAuth';

import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import GuestRoute from './components/GuessRoute';

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

function App() {
  const { isLoggedIn, user } = useAuth();


  return (
    <BrowserRouter>
      <nav style={{ padding: '15px', backgroundColor: '#f0f0f0', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px' }}>Página Inicial</Link>        
        <Link to="/explorer" style={{ marginRight: '15px' }}>Explorar</Link>        

        {isLoggedIn &&
          <>
            <Link to="/menu" style={{ marginRight: '15px' }}>Cardápio Semanal</Link>
            <Link to="/my-recipes" style={{ marginRight: '15px' }}>Minhas Receitas</Link>        
          </>
        }       

        {user?.role === 'admin' && (
          <Link to="/admin" style={{ color: '#d32f2f', fontWeight: 'bold' }}>Painel Admin</Link>
        )}

        {isLoggedIn ? (
          <Link to="/profile" style={{ marginRight: '15px' }}>Meu Perfil</Link>
        ) : (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
            <Link to="/login">Entrar</Link>
            <Link to="/register">Cadastrar</Link>
          </div>
        )
        }
      </nav>

      <div>
        <Routes>
          {/* rotas livres */}
          <Route path="/" element={<Home />} />
          <Route path="/explorer" element={<RecipeExplorer/>} />
          <Route path="/recipe/:id" element={<RecipeDetails/>}/>

          {/* rotas protegidas */}            
          <Route 
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }/>
          <Route 
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }/>
          <Route 
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }/>
          <Route 
            path="/my-recipes"
            element={
              <PrivateRoute>
                <MyRecipes/>
              </PrivateRoute>
            }/>
          <Route 
            path="/menu"
            element={
              <PrivateRoute>
                <RecipeWeek/>
              </PrivateRoute>
            }/>          
          <Route 
            path="/recipe/new"
            element={
              <PrivateRoute>
                <RecipeNew/>
              </PrivateRoute>
            }/>
          <Route 
            path="/recipe/:id/edit"
            element={
              <PrivateRoute>
                <RecipeEdit/>
              </PrivateRoute>
            }/>        
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />  
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;