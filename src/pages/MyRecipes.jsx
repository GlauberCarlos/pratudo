import { Link } from 'react-router-dom';

export default function MyRecipes({ recipes = [], onDelete }) {
  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      onDelete(id);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Minhas Receitas</h2>
        <Link
          to="/menu/new"
          style={{ padding: '10px 16px', backgroundColor: '#4CAF50', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          + Nova Receita
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p style={{ color: '#666' }}>Você ainda não cadastrou nenhuma receita.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              style={{ border: '1px solid #e0e0e0', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}
            >
              <img
                src={recipe.img}
                alt={recipe.title}
                style={{ width: '100%', height: '180px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00695c', backgroundColor: '#e0f2f1', padding: '2px 8px', borderRadius: '10px' }}>
                    {recipe.category}
                  </span>
                  <h3 style={{ margin: '8px 0', fontSize: '18px' }}>{recipe.title}</h3>
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                    ⏱️ {recipe.prepareTime} min | 🍽️ {recipe.servings} porções
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <Link
                    to={`/menu/${recipe.id}`}
                    style={{ flex: 1, textAlign: 'center', padding: '6px', backgroundColor: '#2196F3', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/menu/${recipe.id}/edit`}
                    style={{ flex: 1, textAlign: 'center', padding: '6px', backgroundColor: '#ff9800', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontSize: '14px' }}
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe.id)}
                    style={{ padding: '6px 12px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
