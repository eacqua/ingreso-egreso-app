import { Subscription } from 'rxjs';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { strictEqual } from 'assert';
import { User } from '../auth/user.model';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

// aqui maneja las suscripciones para evitar fugas de memoria
  ingresoEgresoListenerSubscription: Subscription = new Subscription;
  ingresoEgresoItemsSubscription: Subscription = new Subscription;


  constructor( private afDB: AngularFirestore,
                public authService: AuthService,
                private store: Store<AppState>
               ) { }

// este metodo va a estar escuchando los cambios que se produzcan en la coleccion de Items
// lo vamos a llamar cuando el usuario acabe de loguearse, en el dashboard component
initIngresoEgresoListener() {
  // nos suscribimos al state. Nos interesa todo lo que suceda en el auth
  // como es un Observable, se puede trabajar con los operadores de RxJS : Pipe
  // filter solo permite que se llegue al subscribe si el usuario no es nulo
  this.ingresoEgresoListenerSubscription = this.store.select('auth')
      .pipe(
        filter( auth => auth.user != null )
      )
      .subscribe( auth => {
          this.ingresoEgresoItems( auth.user.uid );
      } );

}

private ingresoEgresoItems( uid: string ) {
  this.ingresoEgresoItemsSubscription = this.afDB
        .collection(`${ uid }/ingresos-egresos/items`)   // /ingresos-egresos/items son klos nombres de las columnas de firebase 
        .snapshotChanges()                                   // (es el path donde vamos a estar escuchando los cambio) es el observable
        .pipe(
          map( docData => {
           return docData.map( doc => {
              return {
                uid: doc.payload.doc.id,
                ... doc.payload.doc.data()
              };
           });
         })
       )
       .subscribe( (coleccion: any[]) => {
        //  console.log( coleccion );
         this.store.dispatch( new SetItemsAction( coleccion ) );
       } );
}


cancelarSubscriptions() {
  this.ingresoEgresoListenerSubscription.unsubscribe();
  this.ingresoEgresoItemsSubscription.unsubscribe();
  this.store.dispatch( new UnsetItemsAction() );
}

  crearIngresoEgreso( ingresoEgreso: IngresoEgreso ) {

    const user = this.authService.getUsuario();

    return this.afDB.doc(`${ user.uid }/ingresos-egresos`)
      .collection('items').add({ ...ingresoEgreso });

  }

borrarIngresoEgreso( uid: string ) {
    const user = this.authService.getUsuario();
  return this.afDB.doc(`${ user.uid }/ingresos-egresos/items/${ uid }`)
  .delete();  // todas las acciones de firebase devuelven una promesa. Aqui se podria hacer algo por then o catch
}

}
