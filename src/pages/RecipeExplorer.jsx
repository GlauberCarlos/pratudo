import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../context/FavoritesContext';
import { useRatings } from '../context/RatingsContext';
import { useRecipes } from '../context/RecipesContext';

import { toast } from 'sonner';

import defaultIMG from '../assets/praTudo-placeholder.svg'
import '../styles/RecipeList.css';
import '../styles/index.css';

const DIFFICULTY = ['Fácil', 'Médio', 'Difícil'];

export default function RecipeExplorer() {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { getRecipeRating } = useRatings();
  const { recipes, loading, fetchPublicRecipes, deleteRecipe } = useRecipes();
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [sortBy, setSortBy] = useState('title-asc');
  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') || '';
  const category = searchParams.get('category') || 'Todas';
  const isVegetarian = searchParams.get('isVegetarian') === 'true';
  const isVegan = searchParams.get('isVegan') === 'true';
  const isLactoseFree = searchParams.get('isLactoseFree') === 'true';
  const isGlutenFree = searchParams.get('isGlutenFree') === 'true';

  const currentUserId = user?._id || user?.id;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    let isMounted = true;

    const params = {};
    if (searchTerm) params.searchTerm = searchTerm;
    if (category && category !== 'Todas') params.category = category;
    if (isVegetarian) params.isVegetarian = true;
    if (isVegan) params.isVegan = true;
    if (isLactoseFree) params.isLactoseFree = true;
    if (isGlutenFree) params.isGlutenFree = true;

    fetchPublicRecipes(params).finally(() => {
      if (isMounted) setIsInitialLoad(false);
    });

    return () => {
      isMounted = false;
    };
  }, [
    searchTerm,
    category,
    isVegetarian,
    isVegan,
    isLactoseFree,
    isGlutenFree,
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

  const handleDelete = async (id) => {
    toast('Tem certeza que deseja excluir esta receita?', {
      action: {
        label: 'Sim',
        onClick: async () => {
          const result = await deleteRecipe(id);
          if (!result?.success && result?.message) {
            toast.error(result.message);
          } else if (result?.success) {
            toast.success('Receita apagada com sucesso!');
          }
        },
      },
      cancel: {
        label: 'Não',
        onClick: () => { },
      },
    });
  };

  const publicThirdPartyRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const authorId = recipe.author?._id || recipe.author;
      return !currentUserId || String(authorId) !== String(currentUserId);
    });
  }, [recipes, currentUserId]);

  const recipesWithRatings = useMemo(() => {
    return publicThirdPartyRecipes.map((recipe) => {
      const { rating, ratingCount } = getRecipeRating
        ? getRecipeRating(recipe._id)
        : { rating: 0, ratingCount: 0 };
      return { ...recipe, rating, ratingCount };
    });
  }, [publicThirdPartyRecipes, getRecipeRating]);

  const sortedRecipes = useMemo(() => {
    return [...recipesWithRatings].sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.title.localeCompare(b.title);
        case 'title-desc':
          return b.title.localeCompare(a.title);
        case 'rating-desc':
          return (b.rating || 0) - (a.rating || 0);
        case 'rating-asc':
          return (a.rating || 0) - (b.rating || 0);
        default:
          return 0;
      }
    });
  }, [recipesWithRatings, sortBy]);

  return (
    <div className="recipes-page-container main-container">
      <div className="recipes-header-section">
        <h2 className="recipes-page-title">Explorar Receitas da Comunidade</h2>
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
            <option value="Todas">Todas as Opções</option>
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
          </select>
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

      {loading || isInitialLoad ? (
        <p style={{ textAlign: 'center', padding: '40px 0' }}>A carregar receitas...</p>
      ) : sortedRecipes.length === 0 ? (
        <p style={{ color: 'var(--cinza1)', textAlign: 'center', padding: '40px 0' }}>
          Nenhuma receita encontrada com os filtros selecionados.
        </p>
      ) : (
        <div className="recipes-grid">
          {sortedRecipes.map((recipe) => {
            const isFav = favorites?.includes(recipe._id);
            const authorName = recipe.author?.name
              ? `${recipe.author.name} ${recipe.author.lastName || ''}`.trim()
              : 'Autor Comunitário';

            return (
              <div key={recipe._id} className="recipe-card third-party-recipe">
                <div className="recipe-card-image-wrapper">
                  <img
                    src={recipe.img || defaultIMG}
                    alt={recipe.title}
                    className="recipe-card-image"
                  />
                  {user && toggleFavorite && (
                    <button
                      onClick={() => toggleFavorite(recipe._id)}
                      className="favorite-btn-overlay"
                      title={isFav ? 'Remover dos Favoritos' : 'Favoritar'}
                    >
                      {isFav ? '🧡' : '🤍'}
                    </button>
                  )}
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
                        <span>⏱️ {recipe.prepTime || recipe.prepareTime || 'N/A'}</span>
                        <span>🍽️ {recipe.servings || '1 porção'}</span>
                      </div>
                      <span className="meta-author" title={authorName}>
                        👤 {authorName}
                      </span>
                    </div>
                  </div>

                  <div className="recipe-card-actions" style={{ display: 'flex', gap: '8px' }}>
                    <Link to={`/recipe/${recipe._id}`} className="btn-view" style={{ flex: 1, textAlign: 'center' }}>
                      Ver Detalhes
                    </Link>

                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(recipe._id)}
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