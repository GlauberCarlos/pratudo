// RecipeDetails
import { useParams, Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useRatings } from '../context/RatingsContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRecipes } from '../context/RecipesContext';

import RecipeComments from '../components/RecipeComments';
import '../styles/RecipeDetails.css';
import '../styles/index.css';

export default function RecipeDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { getRecipeById } = useRecipes();
  const navigate = useNavigate();

  const { getRecipeRating, submitRating } = useRatings();
  const { favorites, toggleFavorite } = useFavorites();

  const recipe = getRecipeById(id);
  if (!recipe) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2>Receita não encontrada!</h2>
        <Link to="/explorer"className="link-back-explorer">← Voltar para o Cardápio</Link>
      </div>
    );
  }

  const isOwner = user && user.id === recipe.userId;
  const isFav = favorites.includes(recipe.id);

  const { rating, ratingCount, userRating, hasRated } = getRecipeRating(recipe.id, user?.id);

  const handleRate = (stars) => {
    if (user?.id) {
      submitRating(recipe.id, user.id, stars);
    } else {
      alert("Você precisa estar logado para avaliar!");
    }
  };

  return (
    <div className="recipe-details-container">
      {/* Barra de Topo: Voltar à esquerda e Editar Receita à direita */}
      <div className="recipe-details-top-bar">
        <button onClick={() => navigate(-1)} className="btn-back">
          Voltar
        </button>

        {isOwner && (
          <Link to={`/recipe/${recipe.id}/edit`} className="btn-edit-recipe">
            Editar Receita
          </Link>
        )}
      </div>

      {/* Wrapper de Imagem com Botão de Favorito Sobreposto */}
      <div className="recipe-details-image-wrapper">
        {user && (
          <button
            onClick={() => toggleFavorite(recipe.id)}
            className="favorite-btn-overlay-details"
            title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        )}

        <img
          src={recipe.img || 'https://via.placeholder.com/800x350'}
          alt={recipe.title}
          className="recipe-details-image"
        />
      </div>

      {/* Cabeçalho da Receita */}
      <div className="recipe-details-header">
        <span className="recipe-category-badge">
          {recipe.category}
        </span>
        <h1 className="recipe-details-title">{recipe.title}</h1>
        {recipe.description && (
          <p className="recipe-details-description">{recipe.description}</p>
        )}
      </div>

      {/* Metadados */}
      <div className="recipe-meta-box">
        <div className="recipe-meta-item">
          <span className="meta-label">Tempo de Preparo</span>
          <strong className="meta-value">⏱️ {recipe.prepareTime} minutos</strong>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-label">Rendimento</span>
          <strong className="meta-value">
            🍽️ {recipe.servings} {recipe.servings === 1 ? 'porção' : 'porções'}
          </strong>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-label">Avaliação</span>
          <strong className="meta-value">
            ⭐ {rating > 0 ? rating : 'Novo'} ({ratingCount})
          </strong>
        </div>
      </div>

      {/* Tags de Dieta e Restrições */}
      <div className="recipe-tags-container">
        {recipe.isVegetarian && (
          <span className="tag-badge tag-veg">🌱 Vegetariano</span>
        )}
        {recipe.isVegan && (
          <span className="tag-badge tag-vegan">🌿 Vegano</span>
        )}
        {recipe.isLactoseFree && (
          <span className="tag-badge tag-lactose">🥛 Sem Lactose</span>
        )}
        {recipe.isGlutenFree && (
          <span className="tag-badge tag-gluten">🌾 Sem Glúten</span>
        )}

        {recipe.restrictions &&
          recipe.restrictions.map((tag, index) => (
            <span key={index} className="tag-badge tag-custom">
              🏷️ {tag}
            </span>
          ))}
      </div>

      <hr className="recipe-divider" />

      {/* Ingredientes */}
      <section className="recipe-section">
        <h3 className="recipe-section-title">Ingredientes</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className="recipe-list">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="recipe-list-item">{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p className="empty-text">Nenhum ingrediente informado.</p>
        )}
      </section>

      {/* Modo de Preparo */}
      <section className="recipe-section">
        <h3 className="recipe-section-title">Modo de Preparo</h3>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ol className="recipe-list">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="recipe-list-item">{step}</li>
            ))}
          </ol>
        ) : (
          <p className="empty-text">Nenhuma instrução informada.</p>
        )}
      </section>

      {/* Avaliação e Comentários */}
      {user && (
        <section className="recipe-rating-section">
          <h4 className="rating-section-title">Avalie esta receita</h4>
          <div className="rating-stars-interactive">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRate(star)}
                className={`star-icon ${star <= userRating ? 'rating-active' : 'rating-inactive'}`}
                title={`Avaliar com ${star} estrela(s)`}
              >
                ★
              </span>
            ))}
          </div>

          {hasRated && (
            <p className="rating-saved-msg">
              ✓ Sua avaliação de {userRating} estrela(s) foi salva!
            </p>
          )}

          <RecipeComments recipeId={recipe.id} />
        </section>
      )}
    </div>
  );
}