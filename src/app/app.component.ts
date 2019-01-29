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
  builds: any[] = [];
  championSkill: any[] = [];
  championSelected: String;
  onGetInfo(name, region = 'euw') {
    this.service.getAccountInfo(name, region).subscribe((res: any) => {
      console.log(res);
      this.summonerID = res.id;
      this.accountID = res.accountId;
      this.service.getMatchForAccount(this.summonerID, region).subscribe((res: any) => {
        this.gamePlayers = res.participants;
        console.log(res.participants);
        this.gamePlayers.forEach(p => { this.service.getRankedPosition(p.summonerId, region).subscribe((res: any) => p.gameCustomizationObjects = res) });
      })
      console.log(this.gamePlayers);
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

  onBuildSearch(name: String, role: string) {
    this.builds = [];
    let i = 0;
    let player: string;
    let region: string;
    if (role == 'Top' || role == '') {
      player = 'tfblade';
      region = 'na'
    } else if (role == 'Jungle') {
      player = 'Danto 0tohero';
      region = 'euw'
    } else if (role == 'Mid') {
      player = 'Shiphtur';
      region = 'na'
    } else if (role == 'ADC') {
      player = 'imaqtpie';
      region = 'na'
    } else if (role == 'Support') {
      player = 'aphromoo';
      region = 'na'
    }
    this.service.getAccountInfo(player, region).subscribe((res: any) => {
      let championId = this.onSearchChampionId(name);
      this.service.getMatchHistory(res.accountId, championId, region).subscribe((res: any) => {
        console.log(res)
        for (i=0;i<5;i++) {
          this.service.getMatchInfo(res.matches[i].gameId, region).subscribe((res: any) => {
            res.participants.forEach(p => {
              if (p.championId == championId) {
                let b: String[] = [];
                let d: Date = new Date(res.gameCreation);
                b.push(p.stats.item0 == 0 ? '/assets/EmptyIcon.png' : this.buildUrl + p.stats.item0 + ".png");
                b.push(p.stats.item1 == 0 ? '/assets/EmptyIcon.png' : this.buildUrl + p.stats.item1 + ".png");
                b.push(p.stats.item2 == 0 ? '/assets/EmptyIcon.png' : this.buildUrl + p.stats.item2 + ".png");
                b.push(p.stats.item4 == 0 ? '/assets/EmptyIcon.png' : this.buildUrl + p.stats.item4 + ".png");
                b.push(p.stats.item5 == 0 ? '/assets/EmptyIcon.png' : this.buildUrl + p.stats.item5 + ".png");
                b.push(p.stats.item6 == 0 ? '/assets/EmptyIcon.png' : this.buildUrl + p.stats.item6 + ".png");
                b.push(this.summonerSpellUrl + this.onSearchSummonerName(p.spell1Id) + ".png");
                b.push(this.summonerSpellUrl + this.onSearchSummonerName(p.spell2Id) + ".png");
                b.push(d.getDate() + "/" + (d.getUTCMonth() + 1) + "/" + d.getFullYear());
                this.builds.push(b);
              }
            });
          });
        }
      })
    })
  }
  onGetChampionSkill(championName) {
    if (this.championSelected == championName) {
      this.championSelected = '';
    } else {
      this.service.getChampionSkill(championName).subscribe((res: any) => {
        this.championSelected = championName;
        console.log(res.data)
        this.championSkill = [];
        res.data[championName].spells.forEach(spell => {
          let a = { 'cd': '', 'mana': '', 'image': 'http://ddragon.leagueoflegends.com/cdn/9.2.1/img/spell/' };
          a.cd = spell.cooldownBurn;
          a.mana = spell.costBurn;
          a.image += spell.image.full;
          this.championSkill.push(a);
        });
      })
    }
  }
}
