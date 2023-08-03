import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public loginForm: FormGroup;
  errorMsg:string=""
  isSubmitted = false;

  constructor( 
    public formBuilder: FormBuilder,
    private authenticationService:AuthService,
    private storageService:StorageService,
    private router:Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({ 
      mobile: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10), 
      ])),  

      password: new FormControl('', Validators.compose([        
        Validators.required,
        ])),
      termsconditions: new FormControl(true,Validators.requiredTrue),

      error:new FormControl('')
    });
  }

  validation_messages = {  
    'mobile': [
      { type: 'required', message: 'Please enter mobile number' },      
    ],  
    'password': [
        { type: 'required', message: 'Please enter password' }              
    ],
    'termsconditions': [
      { type: 'required', message: 'Please accept terms and coditions' }              
    ]
  }
  
  numberOnlyValidation(event: any) {
    const pattern = /[0-9.,]/;
    let inputChar = String.fromCharCode(event.charCode);

    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  async onSubmit()
  {
    this.isSubmitted = true;    
    
    if(! this.loginForm.valid) return; 

    const resp=await this.authenticationService.login(this.loginForm.value);    
    if(resp)
      this.errorMsg=resp;  
    
  }


}
