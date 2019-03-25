import {Component, ViewChild} from '@angular/core';
import {ModalDirective} from 'angular-bootstrap-md';


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  @ViewChild(ModalDirective) modal: ModalDirective;
  events: Array<any> = [
    {"id":"mac_aws","org":"mini-gateway","env":"aws","containers":[{"id":"59257f00647b","created":1553436971266,"platform":"linux","nodejsVersion":"v8.15.0","mgstateVersion":"1.0.0","edgemicroVersion":"2.5.30","loadavg":[0.06689453125,0.21337890625,0.20703125],"memory":{"total":4139118592,"used":2695204864,"free":1443913728},"time":1553437121259,"uptime":"0 days, 21:47:30","proxies":[{"proxiesName":"edgemicro_extgateway","proxiesBasePath":"\/extgateway","targetAccess":"KO"},{"proxiesName":"edgemicro_healcheck","proxiesBasePath":"\/healthcheck","targetAccess":"OK"}]}]},
    {"id":"mgtest","org":"mini-gateway","env":"kermit","containers":[{"id":"5928f00647b","created":1553436971266,"platform":"linux","nodejsVersion":"v8.15.0","mgstateVersion":"1.0.0","edgemicroVersion":"2.5.30","loadavg":[0.06689453125,0.21337890625,0.20703125],"memory":{"total":4139118592,"used":2695204864,"free":1443913728},"time":1553437121259,"uptime":"0 days, 21:47:30","proxies":[{"proxiesName":"edgemicro_extgateway","proxiesBasePath":"\/extgateway","targetAccess":"KO"},{"proxiesName":"edgemicro_healcheck","proxiesBasePath":"\/healthcheck","targetAccess":"OK"}]}]}
  ];
  deleteEvent(event: any) {
    const itemIndex = this.events.findIndex(el => el === event);
    this.events.splice(itemIndex, 1);
  }
}