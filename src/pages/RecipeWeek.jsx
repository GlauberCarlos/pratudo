import { Link } from 'react-router-dom';

export default function RecipeWeek({ recipes, onDelete }) {
  return (
    <div>
      <h2>Cardápio da Semana</h2>
      <p>Confira as receitas cadastradas:</p>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginTop: '20px' }}>
        {recipes.map((recipe) => (
          <div 
            key={recipe.id} 
            style={{ 
              border: '1px solid #ccc', 
              borderRadius: '8px', 
              padding: '16px', 
              width: '260px',
              backgroundColor: '#fff'
            }}
          >
            <h3>{recipe.title}</h3>
            
            <span style={{ fontSize: '12px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
              {recipe.category}
            </span>
            
            <p>{recipe.description}</p>
            <small>⏱️ Tempo: {recipe.prepTime}</small>

            <div style={{ marginTop: '15px', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Link to={`/menu/${recipe.id}`}>Detalhes</Link> | 
              <Link to={`/menu/${recipe.id}/edit`}>Editar</Link> | 
              <button 
                onClick={() => onDelete(recipe.id)}
                style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}