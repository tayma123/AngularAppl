import { Component, OnInit, Input } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import {LEADERS} from '../shared/leaders';
import { flyInOut ,expand} from '../animations/app.animation';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    animations: [
      flyInOut(), expand()
    ]
})
export class AboutComponent implements OnInit {
  @Input()
  leader:Leader;
  leaders:Leader[]=LEADERS;

  constructor() { }

  ngOnInit() {
  }

}
