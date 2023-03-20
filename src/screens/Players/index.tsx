import { useState, useCallback, useRef } from 'react';
import { FlatList, Alert, TextInput } from 'react-native'
import { useRoute, useFocusEffect, useNavigation } from '@react-navigation/native';

import { Header } from '@components/Header';
import { Highlight } from '@components/Highlight';
import { Button } from '@components/Button';
import { ButtonIcon } from '@components/ButtonIcon';
import { Input } from '@components/Input';
import { Filter } from '@components/Filter';
import { PlayerCard } from '@components/PlayerCard';
import { ListEmpty } from '@components/ListEmpty';
import { Loading } from '@components/Loading';

import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTeam } from '@storage/player/playersGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/PlayerStorageDTO';

import { AppError } from '@utils/AppError';

import { Container, Form, HeaderList, NumberOfPlayers } from './styles';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

type RouteParams = {
  group: string;
}

export function Players() {
  const [isLoading, setIsLoading] = useState(true);
  const [newPlayerName, setNewPlayerName] = useState(''); 
  const [team, setTeam] = useState('Time A');
  const [players, setPlayers] = useState<PlayerStorageDTO[]>([]);
  
  const newPlayerNameInputRef = useRef<TextInput>(null)
  
  const navigation = useNavigation();

  const route = useRoute();

  const { group } = route.params as RouteParams;


  async function handleAddPlayer() {
    try {
        const playerName = newPlayerName.trim();
        if (playerName.length === 0)
          throw new AppError('Informe o nome da pessoa para adicionar.');
        
        await playerAddByGroup({
          team,
          name: playerName
        }, group);

        setNewPlayerName('');
        newPlayerNameInputRef.current?.blur();

        await fetchPlayersByTeam();
      } catch (error) {
        if (error instanceof AppError) {
          Alert.alert('Adicionar Pessoa', error.message);
        } else {
          Alert.alert('Adicionar Pessoa', 'Não foi possível adicionar a pessoa n turma.');
        }
      }
  }

  async function handleRemovePlayer(player: PlayerStorageDTO) {
    try {
        await playerRemoveByGroup(player, group);
        await fetchPlayersByTeam();
      } catch (error) {
        if (error instanceof AppError) {
          Alert.alert('Remover Pessoa', error.message);
        } else {
          Alert.alert('Remover Pessoa', 'Não foi possível remover a pessoa do turma.');
        }
      }
  }

  async function removeGroup() {
    try {
        await groupRemoveByName(group);
        navigation.navigate('groups');
      } catch (error) {
        if (error instanceof AppError) {
          Alert.alert('Remover Turma', error.message);
        } else {
          Alert.alert('Remover Turma', 'Não foi possível remover a pessoa do turma.');
        }
      }
  }

  async function handleRemoveGroup() {
    Alert.alert(
      'Remover',
      'Deseja remover a turma?',
      [
        { text: 'Não', style: 'cancel' },
        { text: 'Sim', onPress: () => removeGroup() }
      ]
    );
  }

  async function fetchPlayersByTeam() {
    try {
      setIsLoading(true);
      const data = await playersGetByGroupAndTeam(group, team);
      setPlayers(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(useCallback(() => { 
    fetchPlayersByTeam(); 
  }, [team]));

  return (
    <Container>
      <Header 
        showBackButton
      />
      <Highlight 
        title={group}
        subtitle="adicione a galera e separe os times"
      />

      <Form>
        <Input
          inputRef={newPlayerNameInputRef}
          value={newPlayerName}
          onChangeText={setNewPlayerName}
          placeholder="Nome da pessoa"
          autoCorrect={false}
          onSubmitEditing={handleAddPlayer}
          returnKeyType="done"
        />
        <ButtonIcon
          icon="add"
          onPress={handleAddPlayer}
        />
      </Form>
      <HeaderList>
        <FlatList 
          data={['Time A', 'Time B']}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <Filter 
              title={item}
              isActive={item === team}
              onPress={() => setTeam(item)}
            />
          )}
          horizontal
        />
        <NumberOfPlayers>
          { players.length }
        </NumberOfPlayers>
      </HeaderList>
      
      {
        isLoading ?
          <Loading /> :
          <FlatList 
            data={players}
            keyExtractor={item => item.name}
            renderItem={({ item }) => (
              <PlayerCard 
                name={item.name}
                onRemove={() => { handleRemovePlayer(item) }}
              />
            )}
            ListEmptyComponent={() => (
              <ListEmpty 
                message="Não há pessoas nesse time."
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[{ paddingBottom: 100 }, players.length === 0 && { flex: 1 }]}
          />
      }
      
      <Button
        title="Remover turma"
        type='SECONDARY'
        onPress={handleRemoveGroup}
      />
    </Container>
  );
}