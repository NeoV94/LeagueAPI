import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


let key="?api_key=RGAPI-7775dea9-d309-44bd-b8a9-7185d67d1f70"
let domain="https://euw1.api.riotgames.com/lol"

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http:HttpClient) { }

  getAccountInfo(name : string){
    return this.http.get(domain+"/summoner/v4/summoners/by-name/"+name+key);
  }
  getMatchForAccount(id){
    return this.http.get(domain+"/spectator/v4/active-games/by-summoner/"+id+key);
  }
  getChampions(){
    return this.http.get('./assets/champion.json');
  }
}
