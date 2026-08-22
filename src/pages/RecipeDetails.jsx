import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RecipeDetails({ recipes = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const recipe = recipes.find((item) => item.id === Number(id));
  if (!recipe) {
    return (
      <div>
        <h2>Receita não encontrada!</h2>
        <Link to="/menu">← Voltar para o Cardápio</Link>
      </div>
    );
  }

  const isOwner = user && user.id === recipe.userId;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      {/* Botão de Voltar */}
      <button
        onClick={() => navigate(-1)}
        style={{ marginBottom: '20px', padding: '6px 12px', cursor: 'pointer', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}
      >
        ← Voltar
      </button>

      {/* Imagem de Capa e Cabeçalho */}
      <div style={{ borderRadius: '8px', overflow: 'hidden', marginBottom: '20px', maxHeight: '350px', backgroundColor: '#eee' }}>
        <img
          src={recipe.img}
          alt={recipe.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ backgroundColor: '#e0f2f1', color: '#00695c', padding: '4px 10px', borderRadius: '12px', fontSize: '13px', fontWeight: 'bold' }}>
            {recipe.category}
          </span>
          <h1 style={{ marginTop: '10px', marginBottom: '5px' }}>{recipe.title}</h1>
          {recipe.description && (
            <p style={{ color: '#666', fontSize: '16px', marginTop: 0 }}>{recipe.description}</p>
          )}
        </div>

        {/* Botão de Editar se for o dono */}
        {isOwner && (
          <Link
            to={`/menu/${recipe.id}/edit`}
            style={{ padding: '8px 16px', backgroundColor: '#ff9800', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Editar Receita
          </Link>
        )}
      </div>

      {/* Informações Rápidas (Tempo e Porções) */}
      <div style={{ display: 'flex', gap: '20px', margin: '20px 0', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', border: '1px solid #eee' }}>
        <div>
          <span style={{ color: '#888', fontSize: '13px', display: 'block' }}>Tempo de Preparo</span>
          <strong>⏱️ {recipe.prepareTime} minutos</strong>
        </div>
        <div style={{ borderLeft: '1px solid #ddd', paddingLeft: '20px' }}>
          <span style={{ color: '#888', fontSize: '13px', display: 'block' }}>Rendimento</span>
          <strong>🍽️ {recipe.servings} {recipe.servings === 1 ? 'porção' : 'porções'}</strong>
        </div>
      </div>

      {/* Tags de Dieta e Restrições */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {recipe.isVegetarian && (
          <span style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '4px 10px', borderRadius: '16px', fontSize: '13px' }}>🌱 Vegetariano</span>
        )}
        {recipe.isVegan && (
          <span style={{ backgroundColor: '#c8e6c9', color: '#1b5e20', padding: '4px 10px', borderRadius: '16px', fontSize: '13px' }}>🌿 Vegano</span>
        )}
        {recipe.isLactoseFree && (
          <span style={{ backgroundColor: '#fff3e0', color: '#e65100', padding: '4px 10px', borderRadius: '16px', fontSize: '13px' }}>🥛 Sem Lactose</span>
        )}
        {recipe.isGlutenFree && (
          <span style={{ backgroundColor: '#fff8e1', color: '#f57f17', padding: '4px 10px', borderRadius: '16px', fontSize: '13px' }}>🌾 Sem Glúten</span>
        )}

        {/* Restrições personalizadas */}
        {recipe.restrictions && recipe.restrictions.map((tag, index) => (
          <span key={index} style={{ backgroundColor: '#f5f5f5', color: '#616161', padding: '4px 10px', borderRadius: '16px', fontSize: '13px', border: '1px solid #e0e0e0' }}>
            🏷️ {tag}
          </span>
        ))}
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '20px 0' }} />

      {/* Seção de Ingredientes */}
      <section style={{ marginBottom: '30px' }}>
        <h3>Ingredientes</h3>
        {recipe.ingredients && recipe.ingredients.length > 0 ? (
          <ul style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: '#888' }}>Nenhum ingrediente informado.</p>
        )}
      </section>

      {/* Seção de Modo de Preparo */}
      <section style={{ marginBottom: '40px' }}>
        <h3>Modo de Preparo</h3>
        {recipe.instructions && recipe.instructions.length > 0 ? (
          <ol style={{ lineHeight: '1.8', paddingLeft: '20px' }}>
            {recipe.instructions.map((step, index) => (
              <li key={index} style={{ marginBottom: '10px' }}>{step}</li>
            ))}
          </ol>
        ) : (
          <p style={{ color: '#888' }}>Nenhuma instrução informada.</p>
        )}
      </section>
    </div>
  );
}