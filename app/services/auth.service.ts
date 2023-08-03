import { Injectable } from '@angular/core';
import{StorageService} from './storage.service'
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	token = '';
  public isValidToken=false

  constructor(
    private storageService:StorageService, 
    private router:Router
    ) 
    {
           
    }

  async isAuthenticatedUser()
    {
      const token=await this.storageService.get("token");  
      if(!token) 
      return false;
      
      var isExpired=this.isTokenExpired(token);  
      if (isExpired) {
        return false;
      } else {
        return true;
      } 
    }
    private isTokenExpired(token: any) {

      const decodedToken:[]= jwt_decode(token);    
      var expiry=decodedToken["exp"];
      var isExpired= (Math.floor((new Date).getTime() / 1000)) >= expiry;
      return isExpired;
    }
    
  async registerUser(formData)
  {
      if(!formData) return;

      const options = {
        url: 'http://localhost:5000/api/user/register', 
        headers: { 'Content-Type': 'application/json'  },       
        data: JSON.stringify(formData),
      };
    
      try{
        const response: HttpResponse = await CapacitorHttp.post(options);        
        return response.data; 
      }
      catch(e)
      {
        return;
      }     
  }

  async login(formData)
  {
      if(!formData) return;

      const options = {
        url: 'http://localhost:5000/api/user/login', 
        headers: { 'Content-Type': 'application/json'  },       
        data: JSON.stringify(formData),
      };
    
      try{
        const response: HttpResponse = await CapacitorHttp.post(options);
        const res=response.data
        if(res && res.token)
        {
            this.storageService.set("token",res.token);
            this.isAuthenticated.next(true);
            this.router.navigateByUrl('/profile', { replaceUrl: true });
            return;
          } 
        else
        return "Invalid Credentials";     
        
      }
      catch(e)
      {
        return;
      }     
  }
  async logout() {
		this.isAuthenticated.next(false);
		await this.storageService.remove("token");
    this.router.navigateByUrl('/login', { replaceUrl: true });
	}  
 

  public async checkAuthentication(){

    const token=await this.storageService.get("token"); 
    if(!token)  return false;    

    var isExpired=this.isTokenExpired(token);
    console.log("isExpired  " +isExpired)
    if (isExpired) return false;
    
    var isValidToken=false;  
    isValidToken=await this.validateToken(token);
    console.log("isValidToken" +isValidToken)
       
    if(!isValidToken)
      return false;      
    else
      return true;      

  }

  async validateToken(token:any)
  {
    const options = {
      url: 'http://localhost:5000/api/verify', 
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': token // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" 
        }  
    };
  
    try{
      const response: HttpResponse = await CapacitorHttp.post(options);
      const res=response.data      
      if(res)
        return true;
      else
        return false;    
    }
    catch(e)
    {
      return false;
    }     
  }

  
}
