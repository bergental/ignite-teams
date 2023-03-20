import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppError } from '@utils/AppError';

import { PLAYER_COLLECTION } from '@storage/storageConfig';

import { PlayerStorageDTO } from './PlayerStorageDTO';
import { playersGetByGroup } from './playersGetByGroup';

export async function playerRemoveByGroup(player: PlayerStorageDTO, group: string) {
  try {
    const storage = await playersGetByGroup(group);
    
    const players = storage.filter(item => item.name !== player.name);
    
    await AsyncStorage.setItem(`${PLAYER_COLLECTION}-${group}`, JSON.stringify(players));
  } catch (error) {
    throw error;
  }
}