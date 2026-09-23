//myrecipes
import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../context/FavoritesContext';
import { useRatings } from '../context/RatingsContext';
import { useRecipes } from '../context/RecipesContext';

import defaultIMG from '../assets/praTudo-placeholder.svg'
import '../styles/RecipeList.css';
import '../styles/index.css';

const DIFFICULTY = ['Fácil', 'Médio', 'Difícil'];

export default function MyRecipes() {
  const { user, getUserName } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { getRecipeRating } = useRatings();
  const { recipes, myRecipes, loading, fetchMyRecipes, fetchPublicRecipes, deleteRecipe } = useRecipes();

  const [sortBy, setSortBy] = useState('title-asc');
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') || '';
  const category = searchParams.get('category') || 'Todas';
  const onlyFavorites = searchParams.get('onlyFavorites') === 'true';
  const isVegetarian = searchParams.get('isVegetarian') === 'true';
  const isVegan = searchParams.get('isVegan') === 'true';
  const isLactoseFree = searchParams.get('isLactoseFree') === 'true';
  const isGlutenFree = searchParams.get('isGlutenFree') === 'true';

  const currentUserId = user?._id || user?.id;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const params = {};
    if (searchTerm) params.searchTerm = searchTerm;
    if (category && category !== 'Todas') params.category = category;
    if (isVegetarian) params.isVegetarian = true;
    if (isVegan) params.isVegan = true;
    if (isLactoseFree) params.isLactoseFree = true;
    if (isGlutenFree) params.isGlutenFree = true;

    fetchMyRecipes(params);
    fetchPublicRecipes(params);
  }, [
    searchTerm,
    category,
    isVegetarian,
    isVegan,
    isLactoseFree,
    isGlutenFree,
    fetchMyRecipes,
    fetchPublicRecipes,
  ]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== 'Todas' && value !== false) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams, { replace: true });
  };

  const myCollection = useMemo(() => {
    const favoritedPublicRecipes = recipes.filter((r) => favorites.includes(r._id || r.id));
    const combined = [...myRecipes, ...favoritedPublicRecipes];

    return Array.from(
      new Map(combined.map((recipe) => [recipe._id || recipe.id, recipe])).values()
    );
  }, [myRecipes, recipes, favorites]);

  const recipesWithRatings = useMemo(() => {
    return myCollection.map((recipe) => {
      const recId = recipe._id || recipe.id;
      const { rating, ratingCount } = getRecipeRating ? getRecipeRating(recId) : { rating: 0, ratingCount: 0 };
      return { ...recipe, rating, ratingCount };
    });
  }, [myCollection, getRecipeRating]);

  const filteredRecipes = useMemo(() => {
    return recipesWithRatings.filter((recipe) => {
      const recId = recipe._id || recipe.id;
      const isFav = favorites.includes(recId);
      return !onlyFavorites || isFav;
    });
  }, [recipesWithRatings, favorites, onlyFavorites]);

  const sortedRecipes = useMemo(() => {
    return [...filteredRecipes].sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return (a.title || '').localeCompare(b.title || '');
        case 'title-desc':
          return (b.title || '').localeCompare(a.title || '');
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        case 'ratingCount-desc':
          return (b.ratingCount || 0) - (a.ratingCount || 0);
        case 'ratingCount-asc':
          return (a.ratingCount || 0) - (b.ratingCount || 0);
        default:
          return 0;
      }
    });
  }, [filteredRecipes, sortBy]);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      const result = await deleteRecipe(id);
      if (!result?.success && result?.message) {
        alert(result.message);
      }
    }
  };

  return (
    <div className="recipes-page-container main-container">
      <div className="recipes-header-section">
        <h2 className="recipes-page-title">Minhas Receitas e Receitas Favoritas</h2>
        <Link to="/recipe/new" className="btn-add-recipe">
          + Nova Receita
        </Link>
      </div>

      <div className="recipes-filter-panel">
        <div className="filter-row-1">
          <input
            type="text"
            placeholder="Buscar por título, ingrediente ou restrição..."
            value={searchTerm}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            className="filter-input-search"
          />
          <select
            value={category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="filter-select"
          >
            <option value="Todas">Todas as Categorias</option>
            {DIFFICULTY.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="title-asc">Título (A-Z)</option>
            <option value="title-desc">Título (Z-A)</option>
            <option value="rating-desc">Maior Avaliação</option>
            <option value="rating-asc">Menor Avaliação</option>
            <option value="ratingCount-desc">Mais Avaliações</option>
            <option value="ratingCount-asc">Menos Avaliações</option>
          </select>
        </div>

        <div className="filter-row-2">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(e) => handleFilterChange('onlyFavorites', e.target.checked)}
            />
            Somente Favoritos
          </label>
        </div>

        <div className="filter-row-3">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => handleFilterChange('isVegetarian', e.target.checked)}
            />
            🌱 Vegetariano
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isVegan}
              onChange={(e) => handleFilterChange('isVegan', e.target.checked)}
            />
            🌿 Vegano
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isLactoseFree}
              onChange={(e) => handleFilterChange('isLactoseFree', e.target.checked)}
            />
            🥛 Sem Lactose
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isGlutenFree}
              onChange={(e) => handleFilterChange('isGlutenFree', e.target.checked)}
            />
            🌾 Sem Glúten
          </label>
        </div>
      </div>

      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px 0' }}>A carregar a sua coleção...</p>
      ) : sortedRecipes.length === 0 ? (
        <p style={{ color: '#5D5D5D', textAlign: 'center', padding: '40px 0' }}>
          Nenhuma receita encontrada com os filtros selecionados.
        </p>
      ) : (
        <div className="recipes-grid">
          {sortedRecipes.map((recipe) => {
            const recipeId = recipe._id || recipe.id;
            const authorId = recipe.userId || recipe.author?._id || recipe.author;

            const isMine = Boolean(currentUserId && authorId && String(currentUserId) === String(authorId));
            const canDelete = isMine || isAdmin;

            const isFav = favorites.includes(recipeId);
            const authorName = recipe.author?.name
              ? `${recipe.author.name} ${recipe.author.lastName || ''}`
              : getUserName
              ? getUserName(authorId)
              : 'Autor';

            const prepTimeDisplay = recipe.prepTime || recipe.prepareTime || 'N/A';

            return (
              <div
                key={recipeId}
                className={`recipe-card ${isMine ? 'own-recipe' : 'third-party-recipe'}`}
              >
                <div className="recipe-card-image-wrapper">
                  <img
                    src={recipe.img || defaultIMG}
                    alt={recipe.title}
                    className="recipe-card-image"
                  />
                  <button
                    onClick={() => toggleFavorite(recipeId)}
                    className="favorite-btn-overlay"
                    title={isFav ? 'Remover dos Favoritos' : 'Favoritar'}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>

                <div className="recipe-card-content">
                  <div>
                    <div className="recipe-card-header">
                      <h3 className="recipe-card-title">{recipe.title}</h3>
                      <span className="recipe-card-rating">
                        ★ {recipe.rating > 0 ? recipe.rating.toFixed(1) : 'Novo'}{' '}
                        {recipe.ratingCount > 0 && `(${recipe.ratingCount})`}
                      </span>
                    </div>

                    <div className="recipe-card-meta">
                      <div className="meta-info">
                        <span>⏱️ {prepTimeDisplay}</span>
                        <span>🍽️ {recipe.servings || '1 porção'}</span>
                      </div>
                      <span className="meta-author" title={authorName}>
                        👤 {authorName}
                      </span>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="recipe-card-actions">
                    <Link to={`/recipe/${recipeId}`} className="btn-view">
                      {isMine ? 'Ver' : 'Ver Detalhes'}
                    </Link>

                    {/* Editar visível APENAS para o dono */}
                    {isMine && (
                      <Link to={`/recipe/edit/${recipeId}`} className="btn-edit">
                        Editar
                      </Link>
                    )}

                    {/* Excluir visível para o dono OU para o Admin */}
                    {canDelete && (
                      <button
                        onClick={() => handleDelete(recipeId)}
                        className="btn-delete"
                      >
                        Excluir
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}