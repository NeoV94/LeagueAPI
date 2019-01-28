import { Component } from '@angular/core';
import { RestService } from './rest.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private service: RestService) {
    this.getChampionsList();
  }
  name: String = '';
  title = 'riot-app';
  accountID = '';
  gamePlayers: any[] = [];
  leagueChampions:any;
  onGetInfo(name) {
    this.service.getAccountInfo(name).subscribe((res: any) => {
       this.accountID = res.id; 
       this.service.getMatchForAccount(this.accountID).subscribe((res:any) => {this.gamePlayers=res.participants; console.log(res.participants)}) }, err => console.log(err));
  }
  getChampionsList(){
    this.service.getChampions().subscribe((res:any)=>{this.leagueChampions=res.data as any[];console.log(this.leagueChampions)})
  }
  onSearchChampion(key:String):String{
    let c=''
    for(let champ of this.leagueChampions){
      if(champ.key==key.toString()){
        console.log(champ.id)
        c= champ.id;
      }
    }
    return c;
  }
}
