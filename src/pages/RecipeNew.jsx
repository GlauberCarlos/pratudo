import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../context/RecipesContext';

import { toast } from 'sonner';

import '../styles/RecipeForm.css';
import '../styles/RecipeDetails.css';
import '../styles/index.css';

export default function RecipeNew() {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Fácil');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
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
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 3MB.');
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');

    const fileInput = document.getElementById('recipe-img');
    if (fileInput) {
      fileInput.value = '';
    }
  };

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

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('prepTime', `${prepTime} min`);
    formData.append('servings', `${servings} porções`);

    // Arrays precisam de ser serializados em JSON ou adicionados item a item
    formData.append('ingredients', JSON.stringify(ingredientsArray));
    formData.append('instructions', JSON.stringify(instructionsArray));
    formData.append('restrictions', JSON.stringify(restrictionsArray));

    formData.append('isPublic', isPublic);
    formData.append('isVegetarian', isVegetarian);
    formData.append('isVegan', isVegan);
    formData.append('isLactoseFree', isLactoseFree);
    formData.append('isGlutenFree', isGlutenFree);

    if (imageFile) {
      formData.append('img', imageFile);
    }

    try {
      setLoading(true);
      const result = await addRecipe(formData);

      if (result.success) {
        toast.success('Receita salva com sucesso!');
        navigate('/my-recipes');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      alert('Erro inesperado ao guardar a receita.');
    } finally {
      setLoading(false);
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

      {imagePreview && (
        <div className="recipe-image-preview-wrapper">
          <img
            src={imagePreview}
            alt="Pré-visualização"
            className="recipe-image-preview"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="btn-remove-image"
            title="Remover foto"
            aria-label="Remover foto"
          >
            🗑️
          </button>
        </div>
      )}

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
            <label htmlFor="recipe-img" className="form-label-img">Escolher foto</label>
            <input
              type="file"
              id="recipe-img"
              accept="image/*"
              onChange={handleImageChange}
              className="form-label-input"
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

        <button type="submit" className="btn-submit-recipe" disabled={loading}>
          {loading ? 'A guardar e enviar imagem...' : 'Guardar Receita'}
        </button>
      </form>
    </div>
  );
}