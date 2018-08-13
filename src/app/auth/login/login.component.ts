import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: []
})
export class LoginComponent implements OnInit, OnDestroy {

  cargando: boolean;
  subscription: Subscription;

  constructor( public authService: AuthService,
                public store: Store<AppState> ) { }

  ngOnInit() {
    this.subscription = this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading );

  }


  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

onSubmit(data: any) {
  this.authService.login( data.email, data.password);
}


}
