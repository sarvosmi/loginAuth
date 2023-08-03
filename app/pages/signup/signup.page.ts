import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup,Validators,FormControl} from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {

  public registrationForm:FormGroup;
  isSubmitted = false;
  submitError=""

  constructor(
     private formBuilder: FormBuilder, 
    private authService:AuthService, 
    private alertController:AlertController) { }

  ngOnInit() {
    this.createForm();
  }
  createForm()
  {
    this.registrationForm= this.formBuilder.group({

      name: new FormControl('',{validators:[
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        Validators.pattern("^[A-Za-z]+([\ A-Za-z]+)*")
      ]}),

      email: new FormControl('', {
        validators: [
            Validators.required, 
            Validators.email,
            Validators.minLength(10),
            Validators.maxLength(50)]
        }),
        
      password:new FormControl('',
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.pattern("^(?=.*?[a-z])(?=.*?[0-9]).{5,30}$")]
        )),

      confirmPassword:new FormControl('',
          Validators.compose([Validators.required])
        ),

      mobile: new FormControl('', Validators.compose([
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),          
            Validators.pattern("^(0|[1-9][0-9]*)$")
        ])),  
      },
      {
        validator: this.ConfirmedValidator('password', 'confirmPassword'),

     });
  }
 

  async onSubmit()
  {
    this.isSubmitted = true;
    console.log(this.registrationForm.value)

    if(! this.registrationForm.valid) return; 
    
    var res=await this.authService.registerUser(this.registrationForm.value);
    
    if(res && res.status==='ok')
    {  
      const alert=await this.alertController.create(
        {
          message:"Registration done !",
          buttons: ['OK'],}
        )
        await alert.present();

      this.resetForm();
    }
    else if(res && res.message)
      this.submitError=res.message;
    else 
      this.submitError="Error in submission. Please try again / latter!";

  }

  resetForm()
  {
    this.registrationForm.reset();

     Object.keys(this.registrationForm.controls).forEach((key) => {
        const control = this.registrationForm.controls[key];
        control.setErrors(null);
      });
  }


  public validation_messages = {
    'name': [
      {type: 'required', message: 'Name is required' },
      {type:'minlength',message:"Minimum 5 characters required"},
      {type:'maxlength',message:"Exceeded the max length 50"},
      {type: 'pattern', message:'Only alphabets and space allowed'}
      ],
    'email': [
        {type: 'required', message: 'Email is required' },
        { type: 'minlength', message: 'Email: min 10 characters' },
        { type: 'maxlength', message: 'Email: max 50 characters' },
        { type: 'email', message: 'Enter a valid email' }
      ],
    'mobile': [
          {type: 'required', message: 'Mobile is required' },
          { type: 'minlength', message: 'Mobile: min 10 characters' },
          { type: 'maxlength', message: 'Mobile: max 10 characters' },
          { type: 'pattern', message: 'Enter a valid Mobile Number' }
      ],
    'password' :[
        { type: 'required', message: 'Password is required.' },       
        { type: 'minlength', message: 'Minimum password length 5.' },       
        { type: 'pattern', message: 'Alphanumeric passward with atleast '+
        'one lower case letter and one digit, max allowed length 30' },
      ],
      'confirmPassword' :[
        { type: 'required', message: 'Confirm Password is required.'},
        { type:'confirmedValidator', message:'Password and Confirm Password must be match'}
      ]
    }

    ConfirmedValidator(controlName: string, matchingControlName: string) {
      
      return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        
        const matchingControl = formGroup.controls[matchingControlName];
        if (matchingControl.errors) { return; }

        if (control.value !== matchingControl.value) {          
          matchingControl.setErrors({ confirmedValidator: true });
        } else {
          matchingControl.setErrors(null);
        }
      };
    } 

}
