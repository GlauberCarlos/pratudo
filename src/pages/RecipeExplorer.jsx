// RecipeExplorer
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../context/FavoritesContext';
import { useRatings } from '../context/RatingsContext';
import { useRecipes } from '../context/RecipesContext';

import '../styles/RecipeList.css';
import '../styles/index.css';

export default function RecipeExplorer() {
  const { user, getUserName } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { getRecipeRating } = useRatings();
  const { recipes } = useRecipes();

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isLactoseFree, setIsLactoseFree] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [sortBy, setSortBy] = useState('title-asc');

  // Extrai dinamicamente as categorias únicas das receitas
  const categoriesList = useMemo(() => {
    const categoriesSet = new Set(
      recipes.map((r) => r.category).filter(Boolean)
    );
    return Array.from(categoriesSet);
  }, [recipes]);

  const publicRecipes = recipes.filter(
    (recipe) => recipe.isPublic && String(recipe.userId) !== String(user?.id)
  );

  const recipesWithRatings = useMemo(() => {
    return publicRecipes.map((recipe) => {
      const { rating, ratingCount } = getRecipeRating(recipe.id);
      return { ...recipe, rating, ratingCount };
    });
  }, [publicRecipes, getRecipeRating]);

  const filteredRecipes = recipesWithRatings.filter((recipe) => {
    if (user?.id && recipe.userId === user.id) {
      return false;
    }

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
      case 'ratingCount-desc':
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      case 'ratingCount-asc':
        return (a.ratingCount || 0) - (b.ratingCount || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="recipes-page-container main-container">
      <div className="recipes-header-section">
        <h2 className="recipes-page-title">Explorar Receitas da Comunidade</h2>
      </div>

      {/* PAINEL DE FILTROS EM 3 LINHAS */}
      <div className="recipes-filter-panel">

        {/* LINHA 1: Buscar, Categoria e Ordenar */}
        <div className="filter-row-1">
          <input
            type="text"
            placeholder="Buscar por título, ingrediente ou restrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input-search"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="filter-select"
          >
            <option value="Todas">Todas as Categorias</option>
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
            <option value="ratingCount-desc">Mais Avaliações</option>
            <option value="ratingCount-asc">Menos Avaliações</option>
          </select>
        </div>

        {/* LINHA 3: Restrições */}
        <div className="filter-row-3">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isVegetarian}
              onChange={(e) => setIsVegetarian(e.target.checked)}
            />
            🌱 Vegetariano
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isVegan}
              onChange={(e) => setIsVegan(e.target.checked)}
            />
            🌿 Vegano
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isLactoseFree}
              onChange={(e) => setIsLactoseFree(e.target.checked)}
            />
            🥛 Sem Lactose
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={isGlutenFree}
              onChange={(e) => setIsGlutenFree(e.target.checked)}
            />
            🌾 Sem Glúten
          </label>
        </div>

      </div>

      {/* GRADE DE CARDS */}
      {sortedRecipes.length === 0 ? (
        <p style={{ color: '#5D5D5D', textAlign: 'center', padding: '40px 0' }}>
          Nenhuma receita encontrada com os filtros selecionados.
        </p>
      ) : (
        <div className="recipes-grid">
          {sortedRecipes.map((recipe) => {
            const isMine = recipe.userId === user?.id;
            const isFav = favorites.includes(recipe.id);
            const authorName = getUserName ? getUserName(recipe.userId) : 'Autor';

            const servingsText = recipe.servings > 1 ? 'porções' : 'porção';

            return (
              <div
                key={recipe.id}
                className={`recipe-card ${isMine ? 'own-recipe' : 'third-party-recipe'}`}
              >
                {/* Imagem + Overlay do Favorito */}
                <div className="recipe-card-image-wrapper">
                  <img
                    src={recipe.img || 'https://via.placeholder.com/300x150'}
                    alt={recipe.title}
                    className="recipe-card-image"
                  />
                  <button
                    onClick={() => toggleFavorite(recipe.id)}
                    className="favorite-btn-overlay"
                    title={isFav ? 'Remover dos Favoritos' : 'Favoritar'}
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                </div>

                {/* Conteúdo */}
                <div className="recipe-card-content">
                  <div>
                    {/* Linha 1: Título (Esq) e Avaliação (Dir) */}
                    <div className="recipe-card-header">
                      <h3 className="recipe-card-title">{recipe.title}</h3>
                      <span className="recipe-card-rating">
                        ★ {recipe.rating > 0 ? recipe.rating.toFixed(1) : 'Novo'}{' '}
                        {recipe.ratingCount > 0 && `(${recipe.ratingCount})`}
                      </span>
                    </div>

                    {/* Linha 2: Tempo/Porções (Esq) e Nome do Autor (Dir) */}
                    <div className="recipe-card-meta">
                      <div className="meta-info">
                        <span>⏱️ {recipe.prepareTime || 0} min</span>
                        <span>🍽️ {recipe.servings || 1} {servingsText}</span>
                      </div>
                      <span className="meta-author" title={authorName}>
                        👤 {authorName}
                      </span>
                    </div>
                  </div>

                  {/* Linha 3: Botões de Ação */}
                  <div className="recipe-card-actions">
                    <Link to={`/recipe/${recipe.id}`} className="btn-view">
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