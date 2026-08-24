import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../context/FavoritesContext';

export default function MyRecipes({ allRecipes = [], onDelete}) {
  const { user, getUserName } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();

  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isLactoseFree, setIsLactoseFree] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [sortBy, setSortBy] = useState('title-asc');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  const rawCollection = allRecipes.filter((recipe) => {
    const isMine = recipe.userId === user?.id;
    const isFav = favorites.includes(recipe.id);
    return isMine || isFav;
  });

  const myCollection = Array.from(
    new Map(rawCollection.map((recipe) => [recipe.id, recipe])).values()
  );

  //Busca e Filtros
  const filteredRecipes = myCollection.filter((recipe) => {
    const term = searchTerm.toLowerCase().trim();
    const matchTitle = recipe.title?.toLowerCase().includes(term);
    const matchDescription = recipe.description?.toLowerCase().includes(term);
    const matchIngredients = recipe.ingredients?.some((ing) => ing.toLowerCase().includes(term));
    const matchRestrictions = recipe.restrictions?.some((res) => res.toLowerCase().includes(term));
    const matchesSearch = !term || matchTitle || matchDescription || matchIngredients || matchRestrictions;

    // Filtros 
    const matchesCategory = category === 'Todas' || recipe.category === category;
    const isFav = favorites.includes(recipe.id);
    const matchesOnlyFavorites = !onlyFavorites || isFav;
    const matchesVegetarian = !isVegetarian || recipe.isVegetarian;
    const matchesVegan = !isVegan || recipe.isVegan;
    const matchesLactoseFree = !isLactoseFree || recipe.isLactoseFree;
    const matchesGlutenFree = !isGlutenFree || recipe.isGlutenFree;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesOnlyFavorites &&
      matchesVegetarian &&
      matchesVegan &&
      matchesLactoseFree &&
      matchesGlutenFree
    );
  });

  // Ordenação
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'rating-desc':
        return (b.rating || 0) - (a.rating || 0);
      case 'rating-asc':
        return (a.rating || 0) - (b.rating || 0);
      case 'ratingCount-desc':
        return (b.ratingCount || 0) - (a.ratingCount || 0);
      case 'ratingCount-asc':
        return (a.ratingCount || 0) - (b.ratingCount || 0);
      default:
        return 0;
    }
  });

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta receita?')) {
      onDelete(id);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Minhas Receitas & Favoritos</h2>
        <Link
          to="/menu/new"
          style={{ padding: '10px 16px', backgroundColor: '#4CAF50', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          + Nova Receita
        </Link>
      </div>

      {/* PAINEL DE BUSCA E FILTROS */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e0e0e0' }}>

        {/* Busca por Texto */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Buscar no Seu Acervo</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Procure por título, descrição, ingrediente ou restrição..."
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
          />
        </div>

        {/* Categoria e Ordenação */}
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="Todas">Todas as Categorias</option>
              <option value="Café da Manhã">Café da Manhã</option>
              <option value="Almoço">Almoço</option>
              <option value="Jantar">Jantar</option>
              <option value="Lanche">Lanche</option>
              <option value="Sobremesa">Sobremesa</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Ordenar Por</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              <option value="title-asc">Título (A-Z)</option>
              <option value="title-desc">Título (Z-A)</option>
              <option value="rating-desc">Avaliação (Maior para Menor)</option>
              <option value="rating-asc">Avaliação (Menor para Maior)</option>
              <option value="ratingCount-desc">Qtd. Avaliações (Maior para Menor)</option>
              <option value="ratingCount-asc">Qtd. Avaliações (Menor para Maior)</option>
            </select>
          </div>
        </div>

        {/* Checkboxes de Filtros */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Checkbox de Favoritos */}
          <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', color: '#e91e63' }}>
            <input
              type="checkbox"
              checked={onlyFavorites}
              onChange={(e) => setOnlyFavorites(e.target.checked)}
            />
            ❤️ Mostrar Apenas Favoritos
          </label>

          {/* Restrições Alimentares */}
          <div>
            <strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Restrições Alimentares:</strong>
            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="checkbox" checked={isVegetarian} onChange={(e) => setIsVegetarian(e.target.checked)} />
                Vegetariano
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="checkbox" checked={isVegan} onChange={(e) => setIsVegan(e.target.checked)} />
                Vegano
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="checkbox" checked={isLactoseFree} onChange={(e) => setIsLactoseFree(e.target.checked)} />
                Sem Lactose
              </label>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <input type="checkbox" checked={isGlutenFree} onChange={(e) => setIsGlutenFree(e.target.checked)} />
                Sem Glúten
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* RESULTADOS */}
      {sortedRecipes.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>
          Nenhuma receita encontrada no seu acervo com os filtros selecionados.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {sortedRecipes.map((recipe) => {
            const isMine = recipe.userId === user?.id;
            const isFav = favorites.includes(recipe.id);

            const authorName = getUserName(recipe.userId);

            const cardBackgroundColor = isMine ? '#ffffff' : '#fffde7';
            const cardBorderColor = isMine ? '#e0e0e0' : '#ffe082';

            return (
              <div
                key={recipe.id}
                style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                {/* Botão Favoritar */}
                <button
                  onClick={() => toggleFavorite(recipe.id)}
                  title={isFav ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}
                >
                  {isFav ? '❤️' : '🤍'}
                </button>

                <img
                  src={recipe.img}
                  alt={recipe.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />

                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00695c', backgroundColor: '#e0f2f1', padding: '2px 8px', borderRadius: '10px' }}>
                        {recipe.category}
                      </span>

                      {/* Nome do criador exibido apenas se for receita de terceiros */}
                      {!isMine && (
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#8d6e63', backgroundColor: '#fff8e1', padding: '2px 8px', borderRadius: '10px', border: '1px solid #ffe082' }}>
                          👤 {authorName}
                        </span>
                      )}
                    </div>

                    <h3 style={{ margin: '8px 0', fontSize: '18px' }}>{recipe.title}</h3>
                    <div style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                      ⏱️ {recipe.prepareTime} min | 🍽️ {recipe.servings} porções
                    </div>
                  </div>

                  {/* Botões de Ação de acordo com a autoria */}
                  {isMine ? (
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
                  ) : (
                    <Link
                      to={`/menu/${recipe.id}`}
                      style={{ display: 'block', textAlign: 'center', padding: '8px', backgroundColor: '#4CAF50', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '14px' }}
                    >
                      Ver Detalhes
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
