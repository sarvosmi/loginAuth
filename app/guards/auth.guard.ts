import { Injectable } from '@angular/core';
import { Observable,from, mergeMap } from 'rxjs';
import {AuthService } from '../services/auth.service'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private authService: AuthService, 
    private router: Router) {}


  canActivate(): Observable<boolean> {
				
		return from(this.authService.checkAuthentication())
		.pipe(mergeMap(isAuthenticated => {
			
			return new Observable<boolean>(observer => {
				if(!isAuthenticated) this.router.navigateByUrl('/login');
				observer.next(isAuthenticated)
			})
			}
		));		
	}
  
}
