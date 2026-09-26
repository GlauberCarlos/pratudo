import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { useRatings } from '../context/RatingsContext';
import { useFavorites } from '../context/FavoritesContext';
import { useRecipes } from '../context/RecipesContext';

import RecipeComments from '../components/RecipeComments';

import { toast } from 'sonner';

import defaultIMG from '../assets/praTudo-placeholder.svg'
import '../styles/RecipeDetails.css';
import '../styles/index.css';

export default function RecipeDetails() {
  const { id } = useParams();
  const { user, getUserName } = useAuth();
  const { fetchRecipeById, deleteRecipe } = useRecipes();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [loadingRecipe, setLoadingRecipe] = useState(true);

  const { getRecipeRating, submitRating } = useRatings();
  const { favorites, toggleFavorite } = useFavorites();

  useEffect(() => {
    let isMounted = true;

    const loadRecipe = async () => {
      setLoadingRecipe(true);
      const data = await fetchRecipeById(id);
      if (isMounted) {
        setRecipe(data);
        setLoadingRecipe(false);
      }
    };

    loadRecipe();

    return () => {
      isMounted = false;
    };
  }, [id, fetchRecipeById]);

  if (loadingRecipe) {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
        <p>A carregar receita...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <h2>Receita não encontrada!</h2>
        <Link to="/explorer" className="link-back-explorer">← Voltar para o Cardápio</Link>
      </div>
    );
  }

  const recipeId = recipe._id || recipe.id;
  const currentUserId = user?._id || user?.id;
  const authorId = recipe.userId || recipe.author?._id || recipe.author;

  const isOwner = Boolean(currentUserId && authorId && String(currentUserId) === String(authorId));
  const isAdmin = user?.role === 'admin';
  const canDelete = isOwner || isAdmin;

  const isFav = favorites.includes(recipeId);

  const { rating, ratingCount, userRating, hasRated } = getRecipeRating(recipeId, currentUserId);

  const handleRate = (stars) => {
    if (currentUserId) {
      submitRating(recipeId, currentUserId, stars);
    } else {
      alert("Você precisa estar logado para avaliar!");
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm("Tem a certeza que deseja eliminar esta receita?");
    if (!confirmed) return;

    const result = await deleteRecipe(recipeId);
    if (result?.success || result) {
      toast.success("Receita eliminada com sucesso!");
      navigate('/my-recipes');
    } else {
      alert(result?.message || "Erro ao eliminar a receita.");
    }
  };

  const displayPrepTime = recipe.prepTime || recipe.prepareTime || 'N/A';

  return (
    <div className="recipe-details-container">
      <div className="recipe-details-top-bar">
        <button onClick={() => navigate(-1)} className="btn-back">
          Voltar
        </button>

        {(isOwner || canDelete) && (
          <div style={{ display: 'flex', gap: '10px' }}>
            {isOwner && (
              <Link to={`/recipe/edit/${recipeId}`} className="btn-edit-recipe">
                Editar Receita
              </Link>
            )}

            {canDelete && (
              <button onClick={handleDelete} className="btn-delete-recipe">
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>

      <div className="recipe-details-image-wrapper">
        {user && (
          <button
            onClick={() => toggleFavorite(recipeId)}
            className="favorite-btn-overlay-details"
            title={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            {isFav ? '❤️' : '🤍'}
          </button>
        )}

        <img
          src={recipe.img || defaultIMG}
          alt={recipe.title}
          className="recipe-details-image"
        />
      </div>

      <div className="recipe-details-header">
        <h1 className="recipe-details-title">{recipe.title}</h1>
        {recipe.description && (
          <p className="recipe-details-description">{recipe.description}</p>
        )}
        <div className="recipe-author">
          Receita de: <span className="recipe-author-badge">{recipe.author?.name}</span>
        </div>
        <div className="recipe-category">
          Dificuldade: <span className="recipe-category-badge">{recipe.category}</span>
        </div>
      </div>

      <div className="recipe-meta-box">
        <div className="recipe-meta-item">
          <span className="meta-label">Tempo de Preparo</span>
          <strong className="meta-value">⏱️ {displayPrepTime}</strong>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-label">Rendimento</span>
          <strong className="meta-value">
            🍽️ {recipe.servings}
          </strong>
        </div>
        <div className="recipe-meta-item">
          <span className="meta-label">Avaliação</span>
          <strong className="meta-value">
            ⭐ {rating > 0 ? rating : 'Novo'} ({ratingCount})
          </strong>
        </div>
      </div>

      <div className="recipe-tags-container">
        {recipe.isVegetarian && <span className="tag-badge tag-veg">🌱 Vegetariano</span>}
        {recipe.isVegan && <span className="tag-badge tag-vegan">🌿 Vegano</span>}
        {recipe.isLactoseFree && <span className="tag-badge tag-lactose">🥛 Sem Lactose</span>}
        {recipe.isGlutenFree && <span className="tag-badge tag-gluten">🌾 Sem Glúten</span>}

        {recipe.restrictions &&
          Array.isArray(recipe.restrictions) &&
          recipe.restrictions.map((tag, index) => (
            <span key={index} className="tag-badge tag-custom">
              🏷️ {tag}
            </span>
          ))}
      </div>

      <hr className="recipe-divider" />

      <section className="recipe-section">
        <h3 className="recipe-section-title">Ingredientes</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul className="recipe-list">
            {Array.isArray(recipe.ingredients)
              ? recipe.ingredients.map((ingredient, index) => (
                <li key={index} className="recipe-list-item">{ingredient}</li>
              ))
              : <li className="recipe-list-item">{recipe.ingredients}</li>
            }
          </ul>
        ) : (
          <p className="empty-text">Nenhum ingrediente informado.</p>
        )}
      </section>

      <section className="recipe-section">
        <h3 className="recipe-section-title">Modo de Preparo</h3>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ol className="recipe-list">
            {Array.isArray(recipe.instructions)
              ? recipe.instructions.map((step, index) => (
                <li key={index} className="recipe-list-item">{step}</li>
              ))
              : <li className="recipe-list-item">{recipe.instructions}</li>
            }
          </ol>
        ) : (
          <p className="empty-text">Nenhuma instrução informada.</p>
        )}
      </section>

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

          <RecipeComments recipeId={recipeId} />
        </section>
      )}
    </div>
  );
}