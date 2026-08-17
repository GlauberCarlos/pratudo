import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

export default function RecipeDetails({recipes}) {
  const { id } = useParams();

  const recipe = recipes.find((item) => item.id === Number(id));

  const [comments, setComments] = useState([
    { id: 1, author: 'Maria', text: 'Ficou excelente! Adicionei um pouco mais de queijo.' },
    { id: 2, author: 'João', text: 'Receita rápida e prática para o dia a dia.' }
  ]);

  const [newCommentText, setNewCommentText] = useState('');

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newCommentObj = {
      id: Date.now(),
      author: 'Visitante',
      text: newCommentText
    };

    setComments([...comments, newCommentObj]);
    setNewCommentText('');
  };

  if (!recipe) {
    return (
      <div>
        <h2>Receita não encontrada!</h2>
        <Link to="/menu">← Voltar para o Cardápio</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px' }}>
      <Link to="/menu">← Voltar para o Cardápio</Link>

      <h1 style={{ marginTop: '15px', marginBottom: '5px' }}>{recipe.title}</h1>
      <span style={{ fontSize: '12px', background: '#eee', padding: '2px 6px', borderRadius: '4px' }}>
        {recipe.category}
      </span>
      <p style={{ marginTop: '15px' }}>{recipe.description}</p>
      <p><strong>⏱️ Tempo de Preparo:</strong> {recipe.prepTime}</p>

      <h3>Ingredientes:</h3>
      <ul>
        {recipe.ingredients.map((ing, index) => (
          <li key={index}>{ing}</li>
        ))}
      </ul>

      <hr style={{ margin: '30px 0' }} />

      <section>
        <h3>Caixa de Comentários ({comments.length})</h3>

        <form onSubmit={handleAddComment} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          <textarea
            rows="3"
            placeholder="Escreva um comentário sobre esta receita..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc', resize: 'vertical' }}
          />
          <button type="submit" style={{ width: '160px', padding: '8px', cursor: 'pointer' }}>
            Enviar Comentário
          </button>
        </form>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {comments.map((comment) => (
            <div key={comment.id} style={{ border: '1px solid #eee', padding: '12px', borderRadius: '6px', backgroundColor: '#f9f9f9' }}>
              <strong>{comment.author}</strong>
              <p style={{ margin: '5px 0 0 0', color: '#333' }}>{comment.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}