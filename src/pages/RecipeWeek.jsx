// RecipeWeek
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../context/RecipesContext';
import { useFavorites } from '../context/FavoritesContext';

import '../styles/RecipeWeek.css';
import '../styles/index.css';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira', initial: 'S' },
  { key: 'tuesday', label: 'Terça-feira', initial: 'T' },
  { key: 'wednesday', label: 'Quarta-feira', initial: 'Q' },
  { key: 'thursday', label: 'Quinta-feira', initial: 'Q' },
  { key: 'friday', label: 'Sexta-feira', initial: 'S' },
  { key: 'saturday', label: 'Sábado', initial: 'S' },
  { key: 'sunday', label: 'Domingo', initial: 'D' },
];

export default function RecipeWeek() {
  const { user } = useAuth();
  const { recipes } = useRecipes();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  // 1. Coleção de receitas do usuário (Minhas + Favoritadas)
  const myCollection = recipes.filter(
    (recipe) => recipe.userId === user?.id || favorites.includes(recipe.id)
  );

  // 2. Estados dos Filtros do Painel Lateral
  const [selectedDays, setSelectedDays] = useState({
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  });

  const [filterVeg, setFilterVeg] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterLactose, setFilterLactose] = useState(false);
  const [filterGluten, setFilterGluten] = useState(false);
  const [restrictionsInput, setRestrictionsInput] = useState('');

  // 3. Estado do Planejamento Semanal: { monday: recipeId, tuesday: recipeId, ... }
  const [weeklyPlan, setWeeklyPlan] = useState({});

  // 4. Estado para Controle do Modal de Seleção
  const [modalDayKey, setModalDayKey] = useState(null); // ex: 'monday'
  const [modalSearch, setModalSearch] = useState('');

  // Carregar planejamento salvo no localStorage ao iniciar
  useEffect(() => {
    if (user?.id) {
      const savedPlan = localStorage.getItem(`@my-menu:weekly-plan:${user.id}`);
      if (savedPlan) {
        try {
          setWeeklyPlan(JSON.parse(savedPlan));
        } catch (error) {
          console.error('Erro ao carregar planejamento da semana:', error);
        }
      }
    }
  }, [user]);

  // Salvar planejamento no localStorage sempre que mudar
  const savePlan = (newPlan) => {
    setWeeklyPlan(newPlan);
    if (user?.id) {
      localStorage.setItem(`@my-menu:weekly-plan:${user.id}`, JSON.stringify(newPlan));
    }
  };

  // Funções de Filtragem da Coleção
  const getFilteredCollection = () => {
    return myCollection.filter((recipe) => {
      if (filterVeg && !recipe.isVegetarian) return false;
      if (filterVegan && !recipe.isVegan) return false;
      if (filterLactose && !recipe.isLactoseFree) return false;
      if (filterGluten && !recipe.isGlutenFree) return false;

      // Filtro por restrições em texto (separadas por vírgula)
      if (restrictionsInput.trim()) {
        const requiredRestrictions = restrictionsInput
          .split(',')
          .map((r) => r.trim().toLowerCase())
          .filter(Boolean);

        const recipeRestrictions = (recipe.restrictions || []).map((r) =>
          r.toLowerCase()
        );

        const matchesAll = requiredRestrictions.every((req) =>
          recipeRestrictions.some((r) => r.includes(req))
        );
        if (!matchesAll) return false;
      }

      return true;
    });
  };

  // Sorteia uma receita aleatória a partir de uma lista
  const getRandomRecipe = (pool) => {
    if (!pool || pool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };

  // Ação: Gerar Cardápio Geral
  const handleGenerateMenu = () => {
    const pool = getFilteredCollection();

    if (pool.length === 0) {
      alert('Nenhuma receita encontrada com os filtros selecionados na sua coleção!');
      return;
    }

    const updatedPlan = { ...weeklyPlan };

    DAYS_OF_WEEK.forEach((day) => {
      if (selectedDays[day.key]) {
        const randomRecipe = getRandomRecipe(pool);
        if (randomRecipe) {
          updatedPlan[day.key] = randomRecipe.id;
        }
      } else {
        delete updatedPlan[day.key];
      }
    });

    savePlan(updatedPlan);
  };

  // Ação: Limpar Cardápio
  const handleClearMenu = () => {
    savePlan({});
  };

  // Ação: Sortear para um único dia
  const handleRandomizeDay = (dayKey) => {
    const pool = getFilteredCollection();
    if (pool.length === 0) {
      alert('Nenhuma receita atende aos filtros atuais para ser sorteada!');
      return;
    }
    const randomRecipe = getRandomRecipe(pool);
    if (randomRecipe) {
      savePlan({
        ...weeklyPlan,
        [dayKey]: randomRecipe.id,
      });
    }
  };

  // Ação: Remover receita do dia
  const handleRemoveFromDay = (dayKey) => {
    const updatedPlan = { ...weeklyPlan };
    delete updatedPlan[dayKey];
    savePlan(updatedPlan);
  };

  // Ação: Selecionar receita manualmente via Modal
  const handleSelectRecipeForDay = (recipeId) => {
    if (modalDayKey) {
      savePlan({
        ...weeklyPlan,
        [modalDayKey]: recipeId,
      });
      setModalDayKey(null);
      setModalSearch('');
    }
  };

  // Alternar checkbox de dia no painel lateral
  const toggleDaySelection = (dayKey) => {
    setSelectedDays((prev) => ({
      ...prev,
      [dayKey]: !prev[dayKey],
    }));
  };

  return (
    <div className="recipe-week-container main-container">
      <h2 className="recipe-week-title">Planeador Semanal</h2>

      <div className="recipe-week-layout">
        {/* PAINEL LATERAL DE CONFIGURAÇÕES */}
        <aside className="recipe-week-sidebar">

          <div className="recipe-week-days-box">
            <div className="recipe-week-section-label">
              Escolha os dias da semana
            </div>
            <div className="recipe-week-days-horizontal">
              {DAYS_OF_WEEK.map((day) => (
                <label key={day.key} className="recipe-week-day-item" title={day.label}>
                  <span className="recipe-week-day-letter">{day.initial}</span>
                  <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={selectedDays[day.key]}
                    onChange={() => toggleDaySelection(day.key)}
                  />
                </label>
              ))}
            </div>
          </div>

          <hr className="recipe-week-divider" />

          {/* Filtros de Dieta na Vertical */}
          <div className="recipe-week-filters-group">
            <strong className="recipe-week-section-label">Filtros</strong>

            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filterVeg}
                onChange={(e) => setFilterVeg(e.target.checked)}
              />
              🌱 Vegetariano
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filterVegan}
                onChange={(e) => setFilterVegan(e.target.checked)}
              />
              🌿 Vegano
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filterLactose}
                onChange={(e) => setFilterLactose(e.target.checked)}
              />
              🥛 Sem Lactose
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                className="checkbox-input"
                checked={filterGluten}
                onChange={(e) => setFilterGluten(e.target.checked)}
              />
              🌾 Sem Glúten
            </label>
          </div>

          {/* Restrições Adicionais */}
          <div className="recipe-week-restrictions-group">
            <div className="recipe-week-section-label">Restrições Adicionais:</div>
            <input
              type="text"
              placeholder="Ex: sem açúcar, low carb"
              value={restrictionsInput}
              onChange={(e) => setRestrictionsInput(e.target.value)}
              className="recipe-week-input-text"
            />
            <div className="recipe-week-small-help">Separadas por vírgula</div>
          </div>

          {/* Botões do Painel Lateral */}
          <div className="recipe-week-actions">
            <button onClick={handleGenerateMenu} className="btn-generate-menu">
              Gerar Cardápio
            </button>
            <button onClick={handleClearMenu} className="btn-clear-menu">
              Limpar Cardápio
            </button>
          </div>
        </aside>

        {/* GRADE DOS CARDS */}
        <main className="recipe-week-grid">
          {DAYS_OF_WEEK.map((day) => {
            const recipeId = weeklyPlan[day.key];
            const recipe = recipes.find((r) => r.id === recipeId);

            return (
              <div key={day.key} className="recipe-week-card">
                <div className="recipe-week-card-header">
                  {day.label}
                </div>

                <div className="recipe-week-card-content">
                  {recipe ? (
                    <>
                      <div>
                        <div className="recipe-week-img-wrapper">
                          <img
                            src={recipe.img || 'https://via.placeholder.com/300x130?text=Sem+Imagem'}
                            alt={recipe.title}
                            className="recipe-week-card-img"
                          />
                        </div>
                        <h4 className="recipe-week-card-recipe-title">{recipe.title}</h4>
                        <p className="recipe-week-card-recipe-description">{recipe.description}</p>
                        <span className="recipe-week-card-time">Tempo de preparo: {recipe.prepareTime} min</span>
                      </div>

                      <div className="recipe-week-card-actions">
                        <button
                          onClick={() => setModalDayKey(day.key)}
                          className="card-btn card-btn-choose"
                        >
                          Escolher
                        </button>
                        <button
                          onClick={() => handleRandomizeDay(day.key)}
                          className="card-btn card-btn-randomize"
                        >
                          Sortear
                        </button>
                        <button
                          onClick={() => navigate(`/recipe/${recipe.id}`)}
                          className="card-btn card-btn-view"
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleRemoveFromDay(day.key)}
                          className="card-btn card-btn-remove"
                        >
                          Excluir
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="recipe-week-card-empty">
                      <p className="recipe-week-card-recipe-title">Sem receita selecionada</p>
                      <div className="recipe-week-empty-actions">
                        <button
                          onClick={() => setModalDayKey(day.key)}
                          className="card-btn card-btn-choose"
                          style={{ padding: '8px 16px' }}
                        >
                          Escolher
                        </button>
                        <button
                          onClick={() => handleRandomizeDay(day.key)}
                          className="card-btn card-btn-randomize"
                          style={{ padding: '8px 16px' }}
                        >
                          Sortear
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </main>
      </div>

      {/* MODAL DE ESCOLHA DA RECEITA */}
      {modalDayKey && (
        <div className="recipe-week-modal-overlay">
          <div className="recipe-week-modal-container">
            <div className="recipe-week-modal-header">
              <h3 className="recipe-week-modal-title">
                Escolher receita para {DAYS_OF_WEEK.find((d) => d.key === modalDayKey)?.label}
              </h3>
              <button
                onClick={() => setModalDayKey(null)}
                className="recipe-week-modal-close-btn"
              >
                ✕
              </button>
            </div>

            <div className="recipe-week-modal-search-box">
              <input
                type="text"
                placeholder="Buscar na sua coleção..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                className="recipe-week-input-text"
              />
            </div>

            <div className="recipe-week-modal-list">
              {myCollection
                .filter((r) => r.title.toLowerCase().includes(modalSearch.toLowerCase()))
                .map((r) => (
                  <div key={r.id} className="recipe-week-modal-item">
                    <img
                      src={r.img || 'https://via.placeholder.com/50'}
                      alt={r.title}
                      className="recipe-week-modal-item-img"
                    />
                    <div className="recipe-week-modal-item-info">
                      <strong className="recipe-week-modal-item-title">{r.title}</strong>
                      <span className="recipe-week-modal-item-time">⏱️ {r.prepareTime} min</span>
                    </div>
                    <button
                      onClick={() => handleSelectRecipeForDay(r.id)}
                      className="card-btn card-btn-view"
                      style={{ padding: '6px 12px' }}
                    >
                      Adicionar
                    </button>
                  </div>
                ))}

              {myCollection.length === 0 && (
                <p className="recipe-week-modal-empty-msg">
                  Você ainda não possui receitas criadas ou favoritadas na sua coleção.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}