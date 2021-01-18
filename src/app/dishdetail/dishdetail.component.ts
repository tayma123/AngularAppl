import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { Dish} from '../shared/dish';
import {DISHES} from '../shared/dishes';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { identifierModuleUrl } from '@angular/compiler';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
 
  

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,@Inject('BaseURL')private BaseURL) { }

  ngOnInit() {
    
  
     this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
     this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
     .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
    
    
  }
  
  goBack(): void {
    this.location.back();

  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  
}
