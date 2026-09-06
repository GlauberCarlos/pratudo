// RecipeWeek
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useRecipes } from '../context/RecipesContext';
import { useFavorites } from '../context/FavoritesContext';

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ marginBottom: '20px' }}>📅 Planejador de Cardápio Semanal</h2>

      <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
        
        {/* PAINEL LATERAL ESQUERDO (CONFIGURAÇÕES) */}
        <aside
          style={{
            flex: '1 1 280px',
            backgroundColor: '#f9f9f9',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: '15px', borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
            ⚙️ Configurações
          </h3>

          {/* Seleção de Dias */}
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Dias para preenchimento:
            </strong>
            {DAYS_OF_WEEK.map((day) => (
              <label
                key={day.key}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}
              >
                <input
                  type="checkbox"
                  checked={selectedDays[day.key]}
                  onChange={() => toggleDaySelection(day.key)}
                />
                {day.label}
              </label>
            ))}
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '15px 0' }} />

          {/* Filtros de Dieta */}
          <div style={{ marginBottom: '20px' }}>
            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
              Filtros de Dieta:
            </strong>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={filterVeg} onChange={(e) => setFilterVeg(e.target.checked)} />
              🌱 Vegetariano
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={filterVegan} onChange={(e) => setFilterVegan(e.target.checked)} />
              🌿 Vegano
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={filterLactose} onChange={(e) => setFilterLactose(e.target.checked)} />
              🥛 Sem Lactose
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '14px' }}>
              <input type="checkbox" checked={filterGluten} onChange={(e) => setFilterGluten(e.target.checked)} />
              🌾 Sem Glúten
            </label>
          </div>

          {/* Restrições Adicionais */}
          <div style={{ marginBottom: '25px' }}>
            <strong style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
              Restrições Adicionais:
            </strong>
            <input
              type="text"
              placeholder="Ex: sem açúcar, low carb"
              value={restrictionsInput}
              onChange={(e) => setRestrictionsInput(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '13px', boxSizing: 'border-box' }}
            />
            <small style={{ color: '#666', fontSize: '11px', display: 'block', marginTop: '4px' }}>
              Separadas por vírgula
            </small>
          </div>

          {/* Botões de Ação do Painel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleGenerateMenu}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '15px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              🎲 Gerar Cardápio
            </button>
            <button
              onClick={handleClearMenu}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: '#f44336',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              🧹 Limpar Cardápio
            </button>
          </div>
        </aside>

        {/* ÁREA PRINCIPAL: CARDS DOS DIAS DA SEMANA */}
        <main style={{ flex: '3 1 600px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
          {DAYS_OF_WEEK.map((day) => {
            const recipeId = weeklyPlan[day.key];
            const recipe = recipes.find((r) => r.id === recipeId);

            return (
              <div
                key={day.key}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
                  minHeight: '280px',
                }}
              >
                {/* Cabeçalho do Card */}
                <div style={{ backgroundColor: '#2196F3', color: '#fff', padding: '10px 15px', fontWeight: 'bold' }}>
                  {day.label}
                </div>

                {/* Conteúdo do Card */}
                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  {recipe ? (
                    <>
                      <div>
                        <div style={{ height: '130px', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#eee' }}>
                          <img
                            src={recipe.img || 'https://via.placeholder.com/300x130?text=Sem+Imagem'}
                            alt={recipe.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <h4 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{recipe.title}</h4>
                        <span style={{ fontSize: '12px', color: '#666' }}>⏱️ {recipe.prepareTime} min</span>
                      </div>

                      {/* Botões do Card Preenchido */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '15px' }}>
                        <button
                          onClick={() => setModalDayKey(day.key)}
                          style={{ padding: '6px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Escolher
                        </button>
                        <button
                          onClick={() => handleRandomizeDay(day.key)}
                          style={{ padding: '6px', backgroundColor: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Sortear
                        </button>
                        <button
                          onClick={() => navigate(`/recipe/${recipe.id}`)}
                          style={{ padding: '6px', backgroundColor: '#4CAF50', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Ver
                        </button>
                        <button
                          onClick={() => handleRemoveFromDay(day.key)}
                          style={{ padding: '6px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                        >
                          Excluir
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Card Vazio */
                    <div style={{ textAlign: 'center', margin: 'auto 0' }}>
                      <p style={{ color: '#999', fontSize: '14px', marginBottom: '15px' }}>Sem receita selecionada</p>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={() => setModalDayKey(day.key)}
                          style={{ padding: '8px 14px', backgroundColor: '#2196F3', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
                        >
                          Escolher
                        </button>
                        <button
                          onClick={() => handleRandomizeDay(day.key)}
                          style={{ padding: '8px 14px', backgroundColor: '#ff9800', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
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

      {/* POPUP / MODAL DE ESCOLHA DA RECEITA */}
      {modalDayKey && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: '8px',
              maxWidth: '550px',
              width: '100%',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              overflow: 'hidden',
            }}
          >
            {/* Header Modal */}
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0 }}>Escolher receita para {DAYS_OF_WEEK.find((d) => d.key === modalDayKey)?.label}</h3>
              <button
                onClick={() => setModalDayKey(null)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888' }}
              >
                ✕
              </button>
            </div>

            {/* Busca no Modal */}
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #f0f0f0' }}>
              <input
                type="text"
                placeholder="Buscar na sua coleção..."
                value={modalSearch}
                onChange={(e) => setModalSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            {/* Lista Resumida de Receitas */}
            <div style={{ padding: '15px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {myCollection
                .filter((r) => r.title.toLowerCase().includes(modalSearch.toLowerCase()))
                .map((r) => (
                  <div
                    key={r.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '8px',
                      border: '1px solid #eee',
                      borderRadius: '6px',
                      backgroundColor: '#fafafa',
                    }}
                  >
                    <img
                      src={r.img || 'https://via.placeholder.com/50'}
                      alt={r.title}
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <strong style={{ display: 'block', fontSize: '14px' }}>{r.title}</strong>
                      <span style={{ fontSize: '12px', color: '#777' }}>⏱️ {r.prepareTime} min</span>
                    </div>
                    <button
                      onClick={() => handleSelectRecipeForDay(r.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        fontSize: '12px',
                      }}
                    >
                      Adicionar
                    </button>
                  </div>
                ))}

              {myCollection.length === 0 && (
                <p style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
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