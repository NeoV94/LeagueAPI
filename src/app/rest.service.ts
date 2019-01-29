import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


let key="?api_key=RGAPI-a9083581-e521-47e5-950c-cc222e7be181"
let domain="1.api.riotgames.com/lol"
let protocol='https://';
@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http:HttpClient) { }

  getAccountInfo(name : string, region){
    return this.http.get(protocol+region+domain+"/summoner/v4/summoners/by-name/"+name+key);
  }
  getMatchForAccount(id,region){
    return this.http.get(protocol+region+domain+"/spectator/v4/active-games/by-summoner/"+id+key);
  }
  getChampions(){
    return this.http.get('./assets/champion.json');
  }
  getItems(){
    return this.http.get('./assets/item.json');
  }
  getSpells(){
    return this.http.get('./assets/summonerSpell.json');
  }
  getMatchHistory(accountId,championName,region){
    return this.http.get(protocol+region+domain+'/match/v4/matchlists/by-account/'+accountId+key+'&champion='+championName);
  }
  getMatchInfo(matchId,region){
    return this.http.get(protocol+region+domain+"/match/v4/matches/"+matchId+key);
  }
  getRankedPosition(summonerId,region){
    return this.http.get(protocol+region+domain+"/league/v4/positions/by-summoner/"+summonerId+key);
  }
  getChampionSkill(championName){
    return this.http.get("http://ddragon.leagueoflegends.com/cdn/9.2.1/data/en_US/champion/"+championName+".json")
  }
}
