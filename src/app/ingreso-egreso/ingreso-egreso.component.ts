import { Subscription } from 'rxjs';
import { AppState } from '../app.reducer';
import { IngresoEgreso } from './ingreso-egreso.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { IngresoEgresoService } from './ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.accions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit,OnDestroy {

  // esto es para poder usar reactive forms
  forma: FormGroup;  // es el formulario
  tipo = 'ingreso';

  loadingSubs: Subscription = new Subscription();
  cargando: boolean;

  constructor( public ingresoEgresoService: IngresoEgresoService,
                private store: Store<AppState>
              ) { }

  ngOnDestroy(): void {
    // Called once, before the instance is destroyed.
    // Add 'implements OnDestroy' to the class.
    this.loadingSubs.unsubscribe();
  }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui')
                        .subscribe( ui => this.cargando = ui.isLoading );
    
    // son los campos del formulario
    this.forma = new FormGroup({
      'descripcion': new FormControl( '', Validators.required ),
      'monto': new FormControl(0, Validators.min(0))
    });
  }

crearIngresoEgreso() {

  this.store.dispatch( new ActivarLoadingAction() );

  const ingresoEgreso = new IngresoEgreso({ ... this.forma.value, tipo: this.tipo});
  this.ingresoEgresoService.crearIngresoEgreso( ingresoEgreso )
            .then( () => {
              this.store.dispatch( new DesactivarLoadingAction() );
              Swal( 'Creado', ingresoEgreso.descripcion, 'success' );
                  this.forma.reset({ monto: 0 });
            })
            .catch();


}

}
