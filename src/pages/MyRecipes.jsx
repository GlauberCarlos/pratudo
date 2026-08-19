import { Link } from 'react-router-dom';

export default function MyRecipes({ recipes, onDelete }) {
  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      onDelete(id);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Minhas Receitas</h2>
        <Link 
          to="/menu/new" 
          style={{ padding: '8px 16px', backgroundColor: '#4CAF50', color: '#fff', borderRadius: '4px', textDecoration: 'none' }}
        >
          + Nova Receita
        </Link>
      </div>

      {recipes.length === 0 ? (
        <div style={{ padding: '30px', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
          <p>Você ainda não cadastrou nenhuma receita.</p>
          <Link to="/menu/new">Clique aqui para adicionar a primeira!</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', backgroundColor: '#fff' }}>
              <h3 style={{ marginTop: 0 }}>{recipe.title}</h3>
              <p style={{ color: '#666', fontSize: '14px' }}>{recipe.description}</p>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                <Link to={`/menu/${recipe.id}`} style={{ fontSize: '14px' }}>Ver Detalhes</Link>
                <Link to={`/menu/${recipe.id}/edit`} style={{ fontSize: '14px' }}>Editar</Link>
                <button 
                  onClick={() => handleDelete(recipe.id)} 
                  style={{ marginLeft: 'auto', backgroundColor: '#ff4d4d', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}