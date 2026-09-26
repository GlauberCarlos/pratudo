import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../context/RecipesContext';
import { useFavorites } from '../context/FavoritesContext';
import api from '../services/api';

import { toast } from 'sonner';

import defaultIMG from '../assets/praTudo-placeholder.svg'
import weekIMG from '../assets/praTudo-week.svg'
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

// Helper para ler o localStorage com segurança antes do render
const getSavedStorage = (userId) => {
  if (!userId) return null;
  try {
    const data = localStorage.getItem(`@my-menu:weekly-plan:${userId}`);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};

export default function RecipeWeek() {
  const { user } = useAuth();
  const { recipes, myRecipes, fetchMyRecipes, fetchPublicRecipes } = useRecipes();
  const { favorites } = useFavorites();
  const navigate = useNavigate();

  const currentUserId = user?._id || user?.id;

  const savedStorage = useMemo(() => getSavedStorage(currentUserId), [currentUserId]);

  useEffect(() => {
    fetchMyRecipes();
    fetchPublicRecipes();
  }, [fetchMyRecipes, fetchPublicRecipes]);

  const myCollection = useMemo(() => {
    const favoritedPublicRecipes = recipes.filter((r) => favorites.includes(r._id || r.id));
    const combined = [...myRecipes, ...favoritedPublicRecipes];

    return Array.from(
      new Map(combined.map((recipe) => [recipe._id || recipe.id, recipe])).values()
    );
  }, [myRecipes, recipes, favorites]);

  const allKnownRecipes = useMemo(() => {
    const combined = [...recipes, ...myRecipes];
    return Array.from(
      new Map(combined.map((recipe) => [recipe._id || recipe.id, recipe])).values()
    );
  }, [recipes, myRecipes]);

  const [selectedDays, setSelectedDays] = useState(() => {
    return savedStorage?.selectedDays || {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true,
    };
  });

  const [filterVeg, setFilterVeg] = useState(() => savedStorage?.filters?.filterVeg || false);
  const [filterVegan, setFilterVegan] = useState(() => savedStorage?.filters?.filterVegan || false);
  const [filterLactose, setFilterLactose] = useState(() => savedStorage?.filters?.filterLactose || false);
  const [filterGluten, setFilterGluten] = useState(() => savedStorage?.filters?.filterGluten || false);
  const [restrictionsInput, setRestrictionsInput] = useState(() => savedStorage?.filters?.restrictionsInput || '');

  const [weeklyPlan, setWeeklyPlan] = useState(() => savedStorage?.plan || {});

  const [modalDayKey, setModalDayKey] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

  useEffect(() => {
    async function loadPlanFromApi() {
      if (!currentUserId) return;
      try {
        const response = await api.get('/menu');
        const planData = response.data?.plan || response.data || {};

        const cleanedPlan = {};
        Object.keys(planData).forEach((day) => {
          if (planData[day]) {
            cleanedPlan[day] = typeof planData[day] === 'object' ? planData[day]._id : planData[day];
          }
        });

        if (Object.keys(cleanedPlan).length > 0) {
          setWeeklyPlan(cleanedPlan);
        }
      } catch (error) {
        console.error('Erro ao sincronizar planeamento da API, mantendo plano local:', error);
      }
    }

    loadPlanFromApi();
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const storagePayload = {
      plan: weeklyPlan,
      selectedDays,
      filters: {
        filterVeg,
        filterVegan,
        filterLactose,
        filterGluten,
        restrictionsInput,
      },
    };

    localStorage.setItem(
      `@my-menu:weekly-plan:${currentUserId}`,
      JSON.stringify(storagePayload)
    );
  }, [selectedDays, filterVeg, filterVegan, filterLactose, filterGluten, restrictionsInput, weeklyPlan, currentUserId]);

  const savePlan = async (newPlan) => {
    setWeeklyPlan(newPlan);

    if (currentUserId) {
      try {
        await api.put('/menu', { plan: newPlan });
      } catch (error) {
        console.error('Erro ao sincronizar planeamento com o servidor:', error);
      }
    }
  };

  const [sendingEmail, setSendingEmail] = useState(false);

  const handleSendEmail = async () => {
    if (Object.keys(weeklyPlan).length === 0) {
      toast.error('O seu cardápio está vazio! Adicione receitas antes de enviar por e-mail.');
      return;
    }

    try {
      setSendingEmail(true);
      const response = await api.post('/menu/send-email', { plan: weeklyPlan });
      toast.success(response.data.message || 'Cardápio enviado para o seu e-mail com sucesso!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Erro ao enviar o cardápio por e-mail.');
    } finally {
      setSendingEmail(false);
    }
  };

  const getFilteredCollection = () => {
    return myCollection.filter((recipe) => {
      if (filterVeg && !recipe.isVegetarian) return false;
      if (filterVegan && !recipe.isVegan) return false;
      if (filterLactose && !recipe.isLactoseFree) return false;
      if (filterGluten && !recipe.isGlutenFree) return false;

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

  const getRandomRecipe = (pool) => {
    if (!pool || pool.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  };

  const handleGenerateMenu = () => {
    const pool = getFilteredCollection();

    if (pool.length === 0) {
      toast.error('Nenhuma receita encontrada com os filtros selecionados na sua coleção!');
      return;
    }

    const updatedPlan = { ...weeklyPlan };

    DAYS_OF_WEEK.forEach((day) => {
      if (selectedDays[day.key]) {
        const randomRecipe = getRandomRecipe(pool);
        if (randomRecipe) {
          updatedPlan[day.key] = randomRecipe._id || randomRecipe.id;
        }
      } else {
        delete updatedPlan[day.key];
      }
    });

    savePlan(updatedPlan);
  };

  const handleClearMenu = () => {
    savePlan({});
  };

  const handleRandomizeDay = (dayKey) => {
    const pool = getFilteredCollection();
    if (pool.length === 0) {
      toast.error('Nenhuma receita atende aos filtros atuais para ser sorteada!');
      return;
    }
    const randomRecipe = getRandomRecipe(pool);
    if (randomRecipe) {
      savePlan({
        ...weeklyPlan,
        [dayKey]: randomRecipe._id || randomRecipe.id,
      });
    }
  };

  const handleRemoveFromDay = (dayKey) => {
    const updatedPlan = { ...weeklyPlan };
    delete updatedPlan[dayKey];
    savePlan(updatedPlan);
  };

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

          <div className="recipe-week-actions">
            <button onClick={handleGenerateMenu} className="btn-generate-menu">
              Gerar Cardápio
            </button>
            <button onClick={handleClearMenu} className="btn-clear-menu">
              Limpar Cardápio
            </button>
            <button
              onClick={handleSendEmail}
              className="btn-send-email-menu"
              disabled={sendingEmail}
            >
              {sendingEmail ? 'A enviar...' : '✉️ Enviar por E-mail'}
            </button>
          </div>
        </aside>

        <main className="recipe-week-grid">
          {DAYS_OF_WEEK.map((day) => {
            const recipeId = weeklyPlan[day.key];
            const recipe = allKnownRecipes.find(
              (r) => String(r._id || r.id) === String(recipeId)
            );
            const prepTimeDisplay = recipe?.prepTime || recipe?.prepareTime || 'N/A';

            return (
              <div key={day.key} className="recipe-week-card">
                <div>

                  {recipe ? (
                    <div className="recipe-week-card-content">
                      <div>
                        <div className="recipe-week-card-header">{day.label}</div>
                        <div className="recipe-week-img-wrapper">
                          <img
                            src={recipe.img || defaultIMG}
                            alt={recipe.title}
                            className="recipe-week-card-img"
                          />
                        </div>
                        <h4 className="recipe-week-card-recipe-title">{recipe.title}</h4>
                        <p className="recipe-week-card-recipe-description">{recipe.description}</p>
                        <span className="recipe-week-card-time">Tempo de preparo: {prepTimeDisplay}</span>
                      </div>

                      <div className="recipe-week-card-actions">
                        <button
                          title='Escolher'
                          onClick={() => setModalDayKey(day.key)}
                          className="card-btn card-btn-choose"
                        >
                          Buscar
                        </button>
                        <button
                          title='Sortear'
                          onClick={() => handleRandomizeDay(day.key)}
                          className="card-btn card-btn-randomize"
                        >
                          Sortear
                        </button>
                        <button
                          title='Ver Receita'
                          onClick={() => navigate(`/recipe/${recipe._id || recipe.id}`)}
                          className="card-btn card-btn-view"
                        >
                          Ver
                        </button>
                        <button
                          title='Remover do dia'
                          onClick={() => handleRemoveFromDay(day.key)}
                          className="card-btn card-btn-remove"
                        >
                          Apagar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="recipe-week-card-content">
                      <div>
                        <div className="recipe-week-card-header">{day.label}</div>
                        <div className="recipe-week-img-wrapper">
                          <img
                            src={weekIMG}
                            className="recipe-week-card-img"
                          />
                        </div>
                        <p className="recipe-week-card-recipe-title">Dia sem receita</p>
                        <p className="recipe-week-card-recipe-description">Clique em <strong>Buscar</strong> ou em <strong>Sortear</strong> para adicionar uma Receita</p>
                      </div>
                      <div className="recipe-week-empty-actions">
                        <button
                          onClick={() => setModalDayKey(day.key)}
                          className="card-btn card-btn-choose"
                        >
                          Buscar
                        </button>
                        <button
                          onClick={() => handleRandomizeDay(day.key)}
                          className="card-btn card-btn-randomize"
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
                .map((r) => {
                  const recId = r._id || r.id;
                  const timeDisplay = r.prepTime || r.prepareTime || 'N/A';

                  return (
                    <div key={recId} className="recipe-week-modal-item">
                      <img
                        src={r.img || defaultIMG}
                        alt={r.title}
                        className="recipe-week-modal-item-img"
                      />
                      <div className="recipe-week-modal-item-info">
                        <strong className="recipe-week-modal-item-title">{r.title}</strong>
                        <span className="recipe-week-modal-item-time">⏱️ {timeDisplay}</span>
                      </div>
                      <button
                        onClick={() => handleSelectRecipeForDay(recId)}
                        className="card-btn card-btn-view"
                      >
                        Adicionar
                      </button>
                    </div>
                  );
                })}

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