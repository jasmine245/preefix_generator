import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  input_word = '';
  search_word = '';
  first_chars:any = '';
  search_word_length:any='';
  alphabets = "ABCDEFGHIJKLMANOPQRSTUVWXYZ";
  alpha_numerics = "1234567890";
  curr_sugg:any = '';
  selected_suggestion_title = '';
  selected_suggestions = {};
  invalid_text:boolean = false;
  no_selected_sugg:boolean = false;
  new_set = new Set();
  
  search_tnt_prefix(){
    this.search_word = this.input_word.replace(/[0-9]/g, '');
    this.search_word = this.input_word.replace(/[^a-zA-Z0-9 ]/g, '')
    if(this.search_word.includes(' ')){
      this.first_chars = this.search_word.match(/\b(\w)/g).join('');
      if(this.first_chars.length < 2){
        this.invalid_text = true;
      }else{
        this.new_set.clear();
        this.get_sugg_with_spaces();
      }
    } 
    else{
      this.new_set.clear();
      this.get_sugg_without_spaces();
    }
  }

  get_sugg_with_spaces(){
    let result = '', result_sub_str = '';
    while(this.new_set.size<=3){
      if(this.first_chars.length <= 3){
        result = this.first_chars + this.generate_randoms(3 - this.first_chars.length);
      }else{
        let sub_str = this.first_chars.substring(0,4);
        result_sub_str = (sub_str != this.selected_suggestions[sub_str] ? sub_str : '');
        result = this.first_chars.substring(0,3) + this.generate_randoms(0);
      }
      if(result_sub_str != ''){
        this.new_set.add(result_sub_str);
      }
      if(result != this.selected_suggestions[result]){
        this.new_set.add(result);
      }
    }
  }

  get_sugg_without_spaces(){
    let unique_chars = this.find_unique_chars();
    let result = '';
    this.invalid_text = false;
    this.search_word_length = this.search_word.length;
    if(this.search_word_length <2){
      this.invalid_text = true;
    }else{
      while(this.new_set.size<=3){
        if(this.search_word_length == 2){
          result = this.search_word.charAt(0) + this.search_word.charAt(1) + this.generate_randoms(1);
        }else{
          if(unique_chars.length < 4){
            result = this.search_word.charAt(0) + unique_chars.charAt(unique_chars.length/2) + unique_chars.charAt(unique_chars.length -1) + this.generate_randoms(0);
          }else{
            result = this.search_word.charAt(0) + unique_chars.charAt(2) + unique_chars.charAt(3) + this.generate_randoms(0,1,unique_chars.substring(4,unique_chars.length));
          }
        }
        if(result != this.selected_suggestions[result]){
          this.new_set.add(result);
        }
      }
    }
  }

  find_unique_chars(){
    return [...this.input_word].reduce((acc, curr)=>{
      return acc.includes(curr) ?  acc  :  acc + curr;
    }, "");

  }

  generate_randoms(sugg_count,len=1, input_unique_chars = this.alphabets){
    let randomString = '';
    this.alpha_numerics = "1234567890";
    if(input_unique_chars == this.alphabets){
      for(let j=0;j<sugg_count;j++){
        for ( let i = 0; i < len; i++) {
          randomString += this.alphabets.charAt(Math.floor(Math.random()*input_unique_chars.length));
        }
      }
    }
    this.alpha_numerics = input_unique_chars + this.alpha_numerics;
    for ( let i = 0; i < len; i++ ) {
      randomString += this.alpha_numerics.charAt(Math.floor(Math.random()*this.alpha_numerics.length));
    }
    return randomString;
  }

  save_suggestion(){
    if(this.curr_sugg){
      this.selected_suggestions[this.curr_sugg] = this.curr_sugg;
      this.empty_values();
    }else{
      this.no_selected_sugg = true;
    }
  }

  empty_values(){
    this.no_selected_sugg = false;
    this.input_word = '';
    this.invalid_text = false;
    this.new_set.clear();
    this.curr_sugg = '';
  }

  valueToUpperCase(value){
    this.input_word = value.toUpperCase();
  }
}
