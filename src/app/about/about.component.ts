import { Component, OnInit, Input } from '@angular/core';
import { LeaderService } from '../services/leader.service';
import { Leader } from '../shared/leader';
import {LEADERS} from '../shared/leaders';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  @Input()
  leader:Leader;
  leaders:Leader[]=LEADERS;

  constructor() { }

  ngOnInit() {
  }

}
