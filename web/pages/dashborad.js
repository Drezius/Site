import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function Dashboard() {
  const [relationship, setRelationship] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/relationships');
      if (res.ok) {
        const data = await res.json();
        setRelationship(data);
      } else if (res.status === 401) {
        router.push('/');
      }
      setLoading(false);
    };
    
    fetchData();
  }, []);

  if (loading) return <div>Carregando...</div>;
  
  if (!relationship) {
    return (
      <div>
        <h1>Configurar Relacionamento</h1>
        <RelationshipForm />
      </div>
    );
  }
  
  return (
    <div>
      <h1>Olá, {relationship.couple_name}!</h1>
      <p>Juntos desde: {new Date(relationship.start_date).toLocaleDateString()}</p>
      <PhotoUpload relationshipId={relationship.id} />
      <PhotoGallery photos={relationship.photos} />
    </div>
  );
}

function RelationshipForm() {
  const [coupleName, setCoupleName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/relationships', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ couple_name: coupleName, start_date: startDate, custom_message: customMessage }),
    });
    
    if (response.ok) {
      router.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={coupleName}
        onChange={(e) => setCoupleName(e.target.value)}
        placeholder="Nome do Casal"
        required
      />
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        required
      />
      <textarea
        value={customMessage}
        onChange={(e) => setCustomMessage(e.target.value)}
        placeholder="Mensagem Personalizada (opcional)"
      />
      <button type="submit">Salvar</button>
    </form>
  );
}

function PhotoUpload({ relationshipId }) {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('photo', file);
    
    const response = await fetch(`/api/relationships/${relationshipId}/photos`, {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      window.location.reload();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        accept="image/*"
        required
      />
      <button type="submit">Enviar Foto</button>
    </form>
  );
}

function PhotoGallery({ photos }) {
  if (!photos || photos.length === 0) return <p>Nenhuma foto cadastrada ainda.</p>;
  
  return (
    <div>
      <h2>Fotos do Casal</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {photos.map(photo => (
          <img 
            key={photo.id} 
            src={`/api/photos/${photo.id}`} 
            alt="Foto do casal" 
            style={{ width: '200px', margin: '10px' }}
          />
        ))}
      </div>
    </div>
  );
}