import axios from "axios";

export async function getPuuid(
  username: string,
  apiKey: string
): Promise<string> {
  const response = await axios.get(
    `https://europe.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${username}/EUW?api_key=${apiKey}`
  );
  return response.data.puuid;
}

export async function getUserMatchesByPuuid(
  puuid: string,
  apiKey: string
): Promise<string[]> {
  const response = await axios.get(
    `https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`
  );
  return response.data;
}

export async function getMatchDetails(
  matchId: string,
  apiKey: string
): Promise<unknown> {
  const response = await axios.get(
    `https://europe.api.riotgames.com/lol/match/v5/matches/${matchId}?api_key=${apiKey}`
  );
  return response.data;
}
