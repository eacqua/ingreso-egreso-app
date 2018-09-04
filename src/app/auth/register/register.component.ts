import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit,OnDestroy {

  cargando: boolean;
  subscription: Subscription = new Subscription();

  constructor( public authService: AuthService,
                public store: Store<AppState> ) { }

  ngOnInit() {
    this.store.select('ui')
    .subscribe( ui => this.cargando = ui.isLoading );
  }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.subscription.unsubscribe();
  }

onSubmit(data: any) {
  this.authService.crearUsuario(data.nombre, data.email, data.password);
}

}
