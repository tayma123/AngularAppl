import { Component, OnInit,ViewChild,Inject } from '@angular/core';
import { Dish} from '../shared/dish';
import {DISHES} from '../shared/dishes';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DishService } from '../services/dish.service';
import { identifierModuleUrl } from '@angular/compiler';
import { subscribeOn, switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { visibility,flyInOut,expand } from '../animations/app.animation';


import {Comment} from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
   animations: [ visibility(),flyInOut(),expand()
   
  ], host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
    },
    
})

export class DishdetailComponent implements OnInit {
  
  dish: Dish;
  dishIds: string[];
  prev: string;
  next: string;
  errMess: string;
  dishcopy: Dish;
  visibility = 'shown';
  @ViewChild('cform') commentFormDirective;
  comment:Comment;
  commentForm: FormGroup;
  formErrors ={
    'author': '',
    'comment':''
  };
  validationMessages={
    'author':{
      'required' : 'Author Name is required',
      'minlength': 'Author Name must be at least 2 characters'
    },
    'comment':{
      'required': 'Comment is required.'

    }
  };
  

  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,@Inject('BaseURL')private BaseURL) { }

  ngOnInit() {
    this.createForm();
  
     this.dishservice.getDishIds()
     .subscribe(dishIds => this.dishIds = dishIds);
     this.route.params.pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishservice.getDish(+params['id']); }))
     .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
       errmess => this.errMess = <any>errmess);
    
  }
  
  goBack(): void {
    this.location.back();

  }
  createForm(){
    this.commentForm= this.fb.group({
      author: ['',[Validators.required,Validators.minLength]],
      rating:5,
      comment:['',Validators.required]
    });
    this.commentForm.valueChanges
    .subscribe(data=>this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }
  onSubmit(){
    this.comment=this.commentForm.value;
    this.comment.date=new Date().toISOString();
    console.log(this.comment);
    this.dishcopy.comments.push(this.comment);
    this.dishservice.putDish(this.dishcopy)
    .subscribe(dish =>{this.dish=dish;
    this.dishcopy= dish;
  },errmess=>{this.dish= null; this.dishcopy= null;});
  this.commentFormDirective.resetForm();
  this.commentForm.reset({
    'author': '',
    'rating': 5,
    comment: ''

  })
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }
  
}
