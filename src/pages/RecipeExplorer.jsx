import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RecipeExplorer({ recipes = [], favorites = [], onToggleFavorite }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [isVegetarian, setIsVegetarian] = useState(false);
  const [isVegan, setIsVegan] = useState(false);
  const [isLactoseFree, setIsLactoseFree] = useState(false);
  const [isGlutenFree, setIsGlutenFree] = useState(false);
  const [sortBy, setSortBy] = useState('title-asc');

  const filteredRecipes = recipes.filter((recipe) => {
    const term = searchTerm.toLowerCase().trim();

    const matchTitle = recipe.title?.toLowerCase().includes(term);
    const matchDescription = recipe.description?.toLowerCase().includes(term);
    const matchIngredients = recipe.ingredients?.some((ing) => ing.toLowerCase().includes(term));
    const matchRestrictions = recipe.restrictions?.some((res) => res.toLowerCase().includes(term));

    const matchesSearch = !term || matchTitle || matchDescription || matchIngredients || matchRestrictions;

    const matchesCategory = category === 'Todas' || recipe.category === category;

    const matchesVegetarian = !isVegetarian || recipe.isVegetarian;
    const matchesVegan = !isVegan || recipe.isVegan;
    const matchesLactoseFree = !isLactoseFree || recipe.isLactoseFree;
    const matchesGlutenFree = !isGlutenFree || recipe.isGlutenFree;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesVegetarian &&
      matchesVegan &&
      matchesLactoseFree &&
      matchesGlutenFree
    );
  });

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

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>Explorar Receitas</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>Descubra e filtre receitas compartilhadas pela comunidade.</p>

      {/* PAINEL DE BUSCA E FILTROS */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', marginBottom: '25px', border: '1px solid #e0e0e0' }}>
        
        {/* Campo de Busca Principal */}
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Buscar Receita</label>
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

        {/* Checkboxes de Filtros Alimentares */}
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

      {/* RESULTADOS / LISTAGEM */}
      {sortedRecipes.length === 0 ? (
        <p style={{ color: '#666', textAlign: 'center', padding: '40px 0' }}>
          Nenhuma receita encontrada com os filtros selecionados.
        </p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {sortedRecipes.map((recipe) => {
            const isFav = favorites.includes(recipe.id);

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
                  position: 'relative'
                }}
              >
                {/* Botão de Favorito no Canto Superior Direito */}
                {onToggleFavorite && (
                  <button
                    onClick={() => onToggleFavorite(recipe.id)}
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
                )}

                <img
                  src={recipe.img}
                  alt={recipe.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />

                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#00695c', backgroundColor: '#e0f2f1', padding: '2px 8px', borderRadius: '10px' }}>
                      {recipe.category}
                    </span>
                    <h3 style={{ margin: '8px 0', fontSize: '18px' }}>{recipe.title}</h3>
                    {recipe.description && (
                      <p style={{ color: '#666', fontSize: '14px', margin: '0 0 10px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {recipe.description}
                      </p>
                    )}
                  </div>

                  <div>
                    {/* Nota e Quantidade de Avaliações */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#555', marginBottom: '8px' }}>
                      <span>⭐ {recipe.rating ? recipe.rating.toFixed(1) : 'N/A'} ({recipe.ratingCount || 0})</span>
                      <span>⏱️ {recipe.prepareTime} min</span>
                    </div>

                    <Link
                      to={`/menu/${recipe.id}`}
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        padding: '8px',
                        backgroundColor: '#4CAF50',
                        color: '#fff',
                        textDecoration: 'none',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      Ver Receita Completa
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}