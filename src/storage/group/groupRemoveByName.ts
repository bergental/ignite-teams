import AsyncStorage from '@react-native-async-storage/async-storage';

import { playersRemoveByGroup } from '@storage/player/playersRemoveByGroup';
import { GROUP_COLLECTION } from '@storage/storageConfig';

import { groupsGetAll } from './groupsGetAll';

export async function groupRemoveByName (groupDeleted: string) {
  try {
    await playersRemoveByGroup(groupDeleted);

    const storedGroups = await groupsGetAll();

    const groups = storedGroups.filter(item => item !== groupDeleted)
    
    const storage = JSON.stringify([...groups]);
    await AsyncStorage.setItem(GROUP_COLLECTION, storage);
  } catch (error) {
    throw error;
  }
}