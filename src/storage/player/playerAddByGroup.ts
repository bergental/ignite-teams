import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppError } from '@utils/AppError';

import { PLAYER_COLLECTION } from '@storage/storageConfig';

import { PlayerStorageDTO } from './PlayerStorageDTO';
import { playersGetByGroup } from './playersGetByGroup';

export async function playerAddByGroup(newPlayer: PlayerStorageDTO, group: string) {
  try {
    const storage = await playersGetByGroup(group);
    
    const playerAlreadyExists = storage.filter(player => player.name === newPlayer.name).length > 0;
    if (playerAlreadyExists)
      throw new AppError('Essa pessoa já está adicionada em um time aqui.');
    
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, JSON.stringify([...storage, newPlayer]));
  } catch (error) {
    throw error;
  }
}