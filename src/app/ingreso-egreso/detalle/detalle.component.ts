import { Subscription } from 'rxjs';
import { AppState } from '../../app.reducer';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

items: IngresoEgreso[];
subscription: Subscription = new Subscription();

  constructor( private store: Store<AppState>,
              public  ingresoEgresoService: IngresoEgresoService
               ) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
    .subscribe( ingresoEgreso => {
      console.log( ingresoEgreso.items );
      this.items = ingresoEgreso.items;
    });
  }

ngOnDestroy() {
  this.subscription.unsubscribe();
  // Called once, before the instance is destroyed.
  // Add 'implements OnDestroy' to the class.
}

borrarItem( item: IngresoEgreso ) {
  this.ingresoEgresoService.borrarIngresoEgreso( item.uid )
        .then( () => {
          Swal('Eliminado', item.descripcion, 'success' );
        });
}

}

