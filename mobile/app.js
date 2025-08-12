import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const API_URL = 'http://your-backend-ip/api';

export default function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);
  const [relationship, setRelationship] = useState(null);

  const handleAuth = async () => {
    const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      fetchRelationship(data.user);
    }
  };

  const fetchRelationship = async (user) => {
    const response = await fetch(`${API_URL}/relationships`, {
      headers: { 'Authorization': `Bearer ${user.token}` },
    });
    
    if (response.ok) {
      const data = await response.json();
      setRelationship(data);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{isLogin ? 'Login' : 'Cadastro'}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="E-mail"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Senha"
          secureTextEntry
        />
        <Button
          title={isLogin ? 'Entrar' : 'Cadastrar'}
          onPress={handleAuth}
        />
        <Button
          title={isLogin ? 'Criar nova conta' : 'Já tenho uma conta'}
          onPress={() => setIsLogin(!isLogin)}
        />
      </View>
    );
  }

  if (!relationship) {
    return <RelationshipForm user={user} onSave={() => fetchRelationship(user)} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Olá, {relationship.couple_name}!</Text>
      <Text>Juntos desde: {new Date(relationship.start_date).toLocaleDateString()}</Text>
      <PhotoUpload relationshipId={relationship.id} onUpload={() => fetchRelationship(user)} />
      <PhotoGallery photos={relationship.photos} />
    </ScrollView>
  );
}

function RelationshipForm({ user, onSave }) {
  const [coupleName, setCoupleName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [customMessage, setCustomMessage] = useState('');

  const handleSave = async () => {
    const response = await fetch(`${API_URL}/relationships`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({ 
        couple_name: coupleName, 
        start_date: startDate, 
        custom_message: customMessage 
      }),
    });
    
    if (response.ok) {
      onSave();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurar Relacionamento</Text>
      <TextInput
        style={styles.input}
        value={coupleName}
        onChangeText={setCoupleName}
        placeholder="Nome do Casal"
      />
      <TextInput
        style={styles.input}
        value={startDate}
        onChangeText={setStartDate}
        placeholder="Data de Início (YYYY-MM-DD)"
      />
      <TextInput
        style={styles.input}
        value={customMessage}
        onChangeText={setCustomMessage}
        placeholder="Mensagem Personalizada (opcional)"
        multiline
      />
      <Button title="Salvar" onPress={handleSave} />
    </View>
  );
}

function PhotoUpload({ relationshipId, onUpload }) {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('photo', {
      uri: image,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    const response = await fetch(`${API_URL}/relationships/${relationshipId}/photos`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (response.ok) {
      onUpload();
      setImage(null);
    }
  };

  return (
    <View style={styles.photoSection}>
      <Text style={styles.sectionTitle}>Adicionar Foto</Text>
      <Button title="Selecionar Foto" onPress={pickImage} />
      {image && (
        <>
          <Image source={{ uri: image }} style={styles.previewImage} />
          <Button title="Enviar Foto" onPress={uploadImage} />
        </>
      )}
    </View>
  );
}

function PhotoGallery({ photos }) {
  if (!photos || photos.length === 0) {
    return <Text style={styles.noPhotos}>Nenhuma foto cadastrada ainda.</Text>;
  }

  return (
    <View style={styles.photoSection}>
      <Text style={styles.sectionTitle}>Fotos do Casal</Text>
      <View style={styles.gallery}>
        {photos.map(photo => (
          <Image 
            key={photo.id} 
            source={{ uri: `${API_URL}/photos/${photo.id}` }} 
            style={styles.galleryImage} 
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  photoSection: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
  },
  noPhotos: {
    fontStyle: 'italic',
    marginTop: 10,
  },
  gallery: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  galleryImage: {
    width: 100,
    height: 100,
    margin: 5,
  },
});