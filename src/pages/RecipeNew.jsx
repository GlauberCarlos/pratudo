// RecipeNew
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipesContext';

import '../styles/RecipeForm.css';
import '../styles/index.css';

export default function RecipeNew() {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fácil');
  const [img, setImg] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [servings, setServings] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [restrictions, setRestrictions] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isLactoseFree, setIsLactoseFree] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !prepTime || !servings || !ingredients.trim() || !instructions.trim()) {
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
      img: img.trim() || "",
      prepTime: `${prepTime} min`,
      servings: `${servings} porções`,
      ingredients: ingredientsArray,
      instructions: instructionsArray,
      restrictions: restrictionsArray,
      isPublic,
      isVegetarian,
      isVegan,
      isLactoseFree,
      isGlutenFree,
    };

    const result = await addRecipe(newRecipe);
    if (result.success) {
      alert('Receita salva com sucesso!');
      navigate('/my-recipes');
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="recipe-form-container">
      <div className="recipe-details-top-bar">
        <h2 className="recipe-form-title">Nova Receita</h2>
        <button onClick={() => navigate(-1)} className="btn-back">
          Voltar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="recipe-form">
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

        <div className="form-row">
          <div className="form-group-flex">
            <label className="form-label">Dificuldade *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-input"
              required
            >
              <option value="Fácil">Fácil</option>
              <option value="Médio">Médio</option>
              <option value="Difícil">Difícil</option>
            </select>
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

        <div className="form-row">
          <div className="form-group-flex">
            <label className="form-label">Tempo de Preparo (min) *</label>
            <input
              type="number"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
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

        <div className="form-group">
          <label className="form-label">
            Restrições Adicionais <span className="form-label-hint">(separadas por vírgula)</span>
          </label>
          <input
            type="text"
            value={restrictions}
            onChange={(e) => setRestrictions(e.target.value)}
            placeholder="Ex: Sem Açúcar, Low Carb"
            className="form-input"
          />
        </div>

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

        <button type="submit" className="btn-submit-recipe">
          Guardar Receita
        </button>
      </form>
    </div>
  );
}