import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RecipeNew({ onAdd }) {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Almoço');
  const [img, setImg] = useState('');
  const [prepareTime, setPrepareTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isLactoseFree, setIsLactoseFree] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim() || !prepareTime || !servings || !ingredients.trim() || !instructions.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios (*)');
      return;
    }
    const ingredientsArray = ingredients
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const instructionsArray = instructions
      .split(/[\n.]/)
      .map((item) => item.trim())
      .filter(Boolean);

    const restrictionsArray = restrictions
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const newRecipe = {
      title,
      description,
      category,
      img: img.trim() || 'https://via.placeholder.com/300x200?text=Sem+Imagem',
      prepareTime: Number(prepareTime),
      servings: Number(servings),
      ingredients: ingredientsArray,
      instructions: instructionsArray,
      restrictions: restrictionsArray,
      isPublic,
      isVegetarian,
      isVegan,
      isLactoseFree,
      isGlutenFree,
      rating: 0,
      ratingCount: 0
    };

    onAdd(newRecipe);
    navigate('/my-recipes');
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '20px' }}>
      <h2>Nova Receita</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {/* Título (Obrigatório) */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Título da Receita *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Lasanha de Berinjela"
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {/* Descrição */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>Descrição Breve</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Uma breve apresentação do prato..."
            rows={2}
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {/* Categoria e Imagem */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            >
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Jantar">Jantar</option>
              <option value="Lanche">Lanche</option>
              <option value="Sobremesa">Sobremesa</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>URL da Imagem</label>
            <input
              type="url"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        </div>

        {/* Tempo de Preparo e Porções (Obrigatórios) */}
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Tempo de Preparo (min) *</label>
            <input
              type="number"
              value={prepareTime}
              onChange={(e) => setPrepareTime(e.target.value)}
              placeholder="Ex: 45"
              min="1"
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', fontWeight: 'bold' }}>Rendimento (porções) *</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="Ex: 4"
              min="1"
              required
              style={{ width: '100%', padding: '8px', marginTop: '4px' }}
            />
          </div>
        </div>

        {/* Ingredientes (Obrigatório - Separados por vírgula) */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            Ingredientes * <small style={{ fontWeight: 'normal', color: '#666' }}>(separados por vírgula)</small>
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ex: 2 xícaras de farinha, 1 colher de fermento, 3 ovos"
            rows={3}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {/* Modo de Preparo (Obrigatório - Separados por ponto ou enter) */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            Modo de Preparo * <small style={{ fontWeight: 'normal', color: '#666' }}>(separados por ponto ou quebra de linha)</small>
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Ex: Misture os ingredientes secos. Adicione os ovos e mexa bem. Leve ao forno por 30 minutos."
            rows={4}
            required
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {/* Restrições Adicionais */}
        <div>
          <label style={{ display: 'block', fontWeight: 'bold' }}>
            Restrições Adicionais <small style={{ fontWeight: 'normal', color: '#666' }}>(separadas por vírgula)</small>
          </label>
          <input
            type="text"
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            placeholder="Ex: Sem Açúcar, Low Carb, Sem Oleaginosas"
            style={{ width: '100%', padding: '8px', marginTop: '4px' }}
          />
        </div>

        {/* Filtros de Dieta (Checkboxes) */}
        <div style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '6px', backgroundColor: '#fafafa' }}>
          <strong style={{ display: 'block', marginBottom: '10px' }}>Filtros de Dieta:</strong>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
              />
              Vegetariano
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isVegan}
                onChange={(e) => setIsVegan(e.target.checked)}
              />
              Vegano
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isLactoseFree}
                onChange={(e) => setIsLactoseFree(e.target.checked)}
              />
              Sem Lactose
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isGlutenFree}
                onChange={(e) => setIsGlutenFree(e.target.checked)}
              />
              Sem Glúten
            </label>
          </div>
        </div>

        {/* Visibilidade Pública */}
        <div style={{ border: '1px solid #e3f2fd', backgroundColor: '#e3f2fd', padding: '12px', borderRadius: '6px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            Tornar esta receita pública na Comunidade
          </label>
        </div>

        {/* Botão de Envio */}
        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Salvar Receita
        </button>
      </form>
    </div>
  )
}