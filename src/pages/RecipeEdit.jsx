import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function RecipeEdit({ recipes, onUpdate }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const recipeToEdit = recipes.find((item) => item.id === Number(id));

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Almoço');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');

  useEffect(() => {
    if (recipeToEdit) {
      setTitle(recipeToEdit.title);
      setCategory(recipeToEdit.category);
      setDescription(recipeToEdit.description);
      setPrepTime(recipeToEdit.prepTime);
      setIngredients(recipeToEdit.ingredients.join(', '));
    }
  }, [recipeToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedRecipe = {
      id: Number(id),
      title,
      category,
      description,
      prepTime,
      ingredients: ingredients.split(',').map((item) => item.trim())
    };

    onUpdate(updatedRecipe);
    navigate(`/menu/${id}`);
  };

  if (!recipeToEdit) {
    return (
      <div>
        <h2>Receita não encontrada!</h2>
        <Link to="/menu">← Voltar para o Cardápio</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '500px' }}>
      <Link to="/menu">← Voltar para o Cardápio</Link>
      <h2 style={{ marginTop: '15px' }}>Editar Receita #{id}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Título da Receita:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Categoria:</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            <option value="Café da Manhã">Café da Manhã</option>
            <option value="Almoço">Almoço</option>
            <option value="Jantar">Jantar</option>
            <option value="Sobremesa">Sobremesa</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Tempo de Preparo:</label>
          <input
            type="text"
            value={prepTime}
            onChange={(e) => setPrepTime(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Descrição:</label>
          <textarea
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Ingredientes (separados por vírgula):</label>
          <input
            type="text"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Salvar Alterações
          </button>
          <button type="button" onClick={() => navigate('/menu')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}