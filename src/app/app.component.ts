import { Component } from '@angular/core';
import { RestService } from './rest.service';
import { build$ } from 'protractor/built/element';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private service: RestService) {
    this.getChampionsList();
    this.getItemsList();
    this.getSummonerSpells();
  }
  name: String = '';
  title = 'riot-app';
  accountID = '';
  summonerID = '';
  gamePlayers: any[] = [];
  leagueChampions: any;
  leagueItems: any;
  summonerSpells: any;
  championImage: String;
  probuildUrl = 'https://www.probuilds.net/champions/details/';
  buildUrl = "http://ddragon.leagueoflegends.com/cdn/9.2.1/img/item/";
  summonerSpellUrl = "http://ddragon.leagueoflegends.com/cdn/9.2.1/img/spell/";
  build: String[] = [];
  builds:any[]=[];
  onGetInfo(name) {
    this.service.getAccountInfo(name).subscribe((res: any) => {
      console.log(res);
      this.summonerID = res.id;
      this.accountID = res.accountId;
      this.service.getMatchForAccount(this.summonerID).subscribe((res: any) => { this.gamePlayers = res.participants; console.log(res.participants) })
    }, err => console.log(err));
  }
  getChampionsList() {
    this.service.getChampions().subscribe((res: any) => { this.leagueChampions = res.data as any[] })
  }
  getItemsList() {
    let a = "1001";
    this.service.getItems().subscribe((res: any) => { this.leagueItems = res.data; })
  }
  getSummonerSpells() {
    this.service.getSpells().subscribe((res: any) => { this.summonerSpells = res.data });
  }
  onSearchChampion(key: String): String {
    let c = ''
    for (let champ of this.leagueChampions) {
      if (champ.key == key.toString()) {
        c = champ.id;
      }
    }
    return c;
  }
  onSearchChampionId(name): String {
    let c = ''
    for (let champ of this.leagueChampions) {
      if ((champ.id as String).toLowerCase().trim() == name) {
        c = champ.key;
      }
    }
    return c;
  }

  onSearchIteamName(itemId) {
    console.log(this.leagueItems.itemId);
  }
  onSearchSummonerName(summonerID): String {
    let a = Object.keys(this.summonerSpells);
    let summ = '';
    a.forEach(key => {
      if (this.summonerSpells[key].key == summonerID) {
        summ = this.summonerSpells[key].id;
      }
    })
    return summ;
  }

  onBuildSearch(name: String) {
    this.builds = [];
    let i=0
    this.service.getAccountInfo('danto 0tohero').subscribe((res: any) => {
      let championId = this.onSearchChampionId(name);
      this.service.getMatchHistory(res.accountId, championId).subscribe((res: any) => {
        while (i < 5) {
          this.service.getMatchInfo(res.matches[i].gameId).subscribe((res: any) => {
            res.participants.forEach(p => {
              if (p.championId == championId) {
                let b:String[]=[];
                b.push(this.buildUrl + p.stats.item0 + ".png");
                b.push(this.buildUrl + p.stats.item1 + ".png");
                b.push(this.buildUrl + p.stats.item2 + ".png");
                b.push(this.buildUrl + p.stats.item4 + ".png");
                b.push(this.buildUrl + p.stats.item5 + ".png");
                b.push(this.buildUrl + p.stats.item6 + ".png");
                b.push(this.summonerSpellUrl + this.onSearchSummonerName(p.spell1Id) + ".png");
                b.push(this.summonerSpellUrl + this.onSearchSummonerName(p.spell2Id) + ".png");
                this.builds.push(b);
              }
            });
          });
          i=i+1;
        }
      })
    })
  }
}
