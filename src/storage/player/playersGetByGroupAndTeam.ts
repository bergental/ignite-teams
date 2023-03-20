import { playersGetByGroup } from '@storage/player/playersGetByGroup';

export async function playersGetByGroupAndTeam(group: string, team: string) {
  try {
    const storage = await playersGetByGroup(group);

    const players = storage.filter(item => item.team === team);
    
    return players;
  } catch(error) {
    throw error;
  }
}