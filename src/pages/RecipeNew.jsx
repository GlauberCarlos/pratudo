import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../context/RecipesContext';

import '../styles/RecipeForm.css';
import '../styles/index.css';

export default function RecipeNew() {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();
  const { user } = useAuth();

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
      userId: user.id,
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
    };

    addRecipe(newRecipe);
    navigate('/my-recipes');
  };

  return (
    <div className="recipe-form-container">
      <h2 className="recipe-form-title">Nova Receita</h2>

      <form onSubmit={handleSubmit} className="recipe-form">
        {/* Título */}
        <div className="form-group">
          <label className="form-label">Título da Receita *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: Lasanha de Berinjela"
            required
            className="form-input"
          />
        </div>

        {/* Descrição */}
        <div className="form-group">
          <label className="form-label">Descrição Breve</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Uma breve apresentação do prato..."
            rows={2}
            className="form-textarea"
          />
        </div>

        {/* Categoria e Imagem */}
        <div className="form-row">
          <div className="form-group-flex">
            <label className="form-label">Categoria</label>
            <textarea
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-category"
            >              
            </textarea>
          </div>

          <div className="form-group-flex">
            <label className="form-label">URL da Imagem</label>
            <input
              type="url"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="form-input"
            />
          </div>
        </div>

        {/* Tempo de Preparo e Porções (Obrigatórios) */}
        <div className="form-row">
          <div className="form-group-flex">
            <label className="form-label">Tempo de Preparo (min) *</label>
            <input
              type="number"
              value={prepareTime}
              onChange={(e) => setPrepareTime(e.target.value)}
              placeholder="Ex: 45"
              min="1"
              required
              className="form-input"
            />
          </div>

          <div className="form-group-flex">
            <label className="form-label">Rendimento (porções) *</label>
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              placeholder="Ex: 4"
              min="1"
              required
              className="form-input"
            />
          </div>
        </div>

        {/* Ingredientes */}
        <div className="form-group">
          <label className="form-label">
            Ingredientes * <span className="form-label-hint">(separados por vírgula)</span>
          </label>
          <textarea
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            placeholder="Ex: 2 xícaras de farinha, 1 colher de fermento, 3 ovos"
            rows={3}
            required
            className="form-textarea"
          />
        </div>

        {/* Modo de Preparo */}
        <div className="form-group">
          <label className="form-label">
            Modo de Preparo * <span className="form-label-hint">(separados por ponto ou quebra de linha)</span>
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Ex: Misture os ingredientes secos. Adicione os ovos e mexa bem. Leve ao forno por 30 minutos."
            rows={4}
            required
            className="form-textarea"
          />
        </div>

        {/* Restrições Adicionais */}
        <div className="form-group">
          <label className="form-label">
            Restrições Adicionais <span className="form-label-hint">(separadas por vírgula)</span>
          </label>
          <input
            type="text"
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            placeholder="Ex: Sem Açúcar, Low Carb, Sem Oleaginosas"
            className="form-input"
          />
        </div>

        {/* Filtros de Dieta (Checkboxes) */}
        <div className="form-fieldset-diet">
          <strong className="fieldset-title">Filtros de Dieta:</strong>

          <div className="diet-grid">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isVegetarian}
                onChange={(e) => setIsVegetarian(e.target.checked)}
                className="checkbox-input"
              />
              Vegetariano
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isVegan}
                onChange={(e) => setIsVegan(e.target.checked)}
                className="checkbox-input"
              />
              Vegano
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isLactoseFree}
                onChange={(e) => setIsLactoseFree(e.target.checked)}
                className="checkbox-input"
              />
              Sem Lactose
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isGlutenFree}
                onChange={(e) => setIsGlutenFree(e.target.checked)}
                className="checkbox-input"
              />
              Sem Glúten
            </label>
          </div>
        </div>

        {/* Visibilidade Pública */}
        <div className="form-box-public">
          <label className="checkbox-label-bold">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="checkbox-input"
            />
            Tornar esta receita pública na Comunidade
          </label>
        </div>

        {/* Botão de Envio */}
        <button type="submit" className="btn-submit-recipe">
          Guardar Receita
        </button>
      </form>
    </div>
  );
}