import { useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { Container, Content, Icon } from './styles';
import { Input } from '@components/Input';

import { groupCreate } from '@storage/group/groupCreate';

import { AppError } from '@utils/AppError';

export function NewGroup() {
  const [group, setGroup] = useState<string>('')

  const navigation = useNavigation();

  async function handleNew() {
    try {
        const newGroup = group.trim();
        if (newGroup.length === 0)
          throw new AppError('Informe o nome da turma.');
        await groupCreate(newGroup);
        navigation.navigate('players', { group: newGroup });
      } catch (error) {
        if (error instanceof AppError) {
          Alert.alert('Nova Turma', error.message);
        } else {
          Alert.alert('Nova Turma', 'Não foi possível criar uma nova turma.');
        }
      }
  }
  
  return (
    <Container>
      <Header 
        showBackButton
      />
      <Content>
        <Icon />
        <Highlight 
          title="Nova Turma"
          subtitle="crie uma turma para adicionar pessoas"
        />
        <Input 
          placeholder="Nome da turma"
          value={group}
          onChangeText={setGroup}
        />
        <Button
          title="Criar"
          style={{ marginTop: 20 }}
          onPress={handleNew}
        />
      </Content>
    </Container>
  );
}