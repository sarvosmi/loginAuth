import { Injectable } from '@angular/core';
import { Observable, mergeMap ,from} from 'rxjs';
import{AuthService} from '../services/auth.service';

import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard  {
 
  constructor(private authenticationService:AuthService,
    private router:Router){}

    canActivate(): Observable<boolean> {
      
      return from(this.authenticationService.isAuthenticatedUser())
      .pipe(mergeMap(isAuthenticated => {
          
          return new Observable<boolean>(observer => {
            if(isAuthenticated) this.router.navigateByUrl('/profile');
            observer.next(!isAuthenticated)
          })
        }
      ));		      
    }


}
