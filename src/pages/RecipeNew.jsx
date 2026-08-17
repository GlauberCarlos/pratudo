import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RecipeNew({ onAdd }) {
  const navigate = useNavigate();

  // Estados locais para cada campo do formulário
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Almoço');
  const [description, setDescription] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [ingredients, setIngredients] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Monta o objeto da nova receita
    const newRecipe = {
      title,
      category,
      description,
      prepTime,
      ingredients: ingredients.split(',').map((item) => item.trim())
    };

    onAdd(newRecipe);
    navigate('/menu');
  };

  return (
    <div style={{ maxWidth: '500px' }}>
      <Link to="/menu">← Voltar para o Cardápio</Link>
      <h2 style={{ marginTop: '15px' }}>Cadastrar Nova Receita</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '5px' }}>Título da Receita:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Strogonoff de Frango"
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
            placeholder="Ex: 30 min"
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
            placeholder="Breve resumo sobre a receita..."
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
            placeholder="Ex: Peito de frango, Creme de leite, Champignon"
            required
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <button type="submit" style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Cadastrar Receita
          </button>
          <button type="button" onClick={() => navigate('/menu')} style={{ padding: '10px 20px', cursor: 'pointer' }}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}