// RecipeExplorer
import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../context/FavoritesContext';
import { useRatings } from '../context/RatingsContext';
import { useRecipes } from '../context/RecipesContext';

import '../styles/RecipeList.css';
import '../styles/index.css';

export default function RecipeExplorer() {
  const { user } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { getRecipeRating } = useRatings();
  const { recipes, loading } = useRecipes();

  const [sortBy, setSortBy] = useState('title-asc');

  const [searchParams, setSearchParams] = useSearchParams();

  const searchTerm = searchParams.get('searchTerm') || "";
  const category = searchParams.get('category') || "Todas";
  const isVegetarian = searchParams.get('isVegetarian') === 'true';
  const isVegan = searchParams.get('isVegan') === 'true';
  const isLactoseFree = searchParams.get('isLactoseFree') === 'true';
  const isGlutenFree = searchParams.get('isGlutenFree') === 'true';

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);

    if (value && value !== 'Todas' && value !== false) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }

    setSearchParams(newParams, { replace: true });
  };

  // Extrai dinamicamente as categorias únicas das receitas
  const categoriesList = useMemo(() => {
    const categoriesSet = new Set(recipes.map((r) => r.category).filter(Boolean));
    return Array.from(categoriesSet);
  }, [recipes]);

  const publicRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      const authorId = recipe.author?._id || recipe.author;
      return recipe.isPublic && String(authorId) !== String(user?.id);
    });
  }, [recipes, user]);

  const recipesWithRatings = useMemo(() => {
    return publicRecipes.map((recipe) => {
      const { rating, ratingCount } = getRecipeRating ? getRecipeRating(recipe._id) : { rating: 0, ratingCount: 0 };
      return { ...recipe, rating, ratingCount };
    });
  }, [publicRecipes, getRecipeRating]);

  const filteredRecipes = recipesWithRatings.filter((recipe) => {
    const term = searchTerm.toLowerCase().trim();
    const matchTitle = recipe.title?.toLowerCase().includes(term);
    const matchDescription = recipe.description?.toLowerCase().includes(term);
    const matchIngredients = recipe.ingredients?.some((ing) => ing.toLowerCase().includes(term));
    const matchRestrictions = recipe.restrictions?.some((res) => res.toLowerCase().includes(term));

    const matchesSearch = !term || matchTitle || matchDescription || matchIngredients || matchRestrictions;
    const matchesCategory = category === 'Todas' || recipe.category === category;
    const matchesVegetarian = !isVegetarian || recipe.isVegetarian;
    const matchesVegan = !isVegan || recipe.isVegan;
    const matchesLactoseFree = !isLactoseFree || recipe.isLactoseFree;
    const matchesGlutenFree = !isGlutenFree || recipe.isGlutenFree;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesVegetarian &&
      matchesVegan &&
      matchesLactoseFree &&
      matchesGlutenFree
    );
  });

  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
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

  if (loading) {
    return (
      <div className="recipes-page-container main-container">
        <p style={{ textAlign: 'center', padding: '40px 0' }}>Carregando receitas...</p>
      </div>
    );
  }

  return (
    <div className="recipes-page-container main-container">
      <div className="recipes-header-section">
        <h2 className="recipes-page-title">Explorar Receitas da Comunidade</h2>
      </div>

      {/* Painel de Filtros */}
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
            onChange={(e) => handleFilterChange('category',e.target.value)}
            className="filter-select"
          >
            <option value="Todas">Todas as Dificuldades</option>
            {categoriesList.map((cat) => (
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

      {/* Grade de Receitas */}
      {sortedRecipes.length === 0 ? (
        <p style={{ color: '#5D5D5D', textAlign: 'center', padding: '40px 0' }}>
          Nenhuma receita encontrada com os filtros selecionados.
        </p>
      ) : (
        <div className="recipes-grid">
          {sortedRecipes.map((recipe) => {
            const authorId = recipe.author?._id || recipe.author;
            const isMine = String(authorId) === String(user?.id);
            const isFav = favorites?.includes(recipe._id);
            const authorName = recipe.author?.name
              ? `${recipe.author.name} ${recipe.author.lastName || ''}`
              : 'Autor Comunitário';

            return (
              <div
                key={recipe._id}
                className={`recipe-card ${isMine ? 'own-recipe' : 'third-party-recipe'}`}
              >
                <div className="recipe-card-image-wrapper">
                  <img
                    src={recipe.img || 'https://via.placeholder.com/300x150?text=Sem+Imagem'}
                    alt={recipe.title}
                    className="recipe-card-image"
                  />
                  {user && toggleFavorite && (
                    <button
                      onClick={() => toggleFavorite(recipe._id)}
                      className="favorite-btn-overlay"
                      title={isFav ? 'Remover dos Favoritos' : 'Favoritar'}
                    >
                      {isFav ? '❤️' : '🤍'}
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
                        <span>⏱️ {recipe.prepTime || 'N/A'}</span>
                        <span>🍽️ {recipe.servings || '1 porção'}</span>
                      </div>
                      <span className="meta-author" title={authorName}>
                        👤 {authorName}
                      </span>
                    </div>
                  </div>

                  <div className="recipe-card-actions">
                    <Link to={`/recipe/${recipe._id}`} className="btn-view">
                      Ver Detalhes
                    </Link>
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