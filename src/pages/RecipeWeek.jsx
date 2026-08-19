export default function RecipeWeek() {
  const daysOfWeek = [
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado',
    'Domingo'
  ];

  return (
    <div>
      <h2>Cardápio Semanal</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>
        Planeje suas refeições para cada dia da semana.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {daysOfWeek.map((day) => (
          <div 
            key={day} 
            style={{ 
              border: '2px dashed #ccc', 
              borderRadius: '8px', 
              padding: '20px', 
              minHeight: '160px',
              backgroundColor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <h3 style={{ marginTop: 0, color: '#333' }}>{day}</h3>
            
            <div style={{ textAlign: 'center', padding: '10px', color: '#888' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>Nenhuma receita selecionada</p>
            </div>

            <button style={{ padding: '6px 12px', cursor: 'pointer', alignSelf: 'flex-start', marginTop: '10px' }}>
              + Adicionar Receita
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}