import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore) { }

  public insertar(coleccion, datos) {
    return this.angularFirestore.collection(coleccion).add(datos)
  }

  public consultar(colection){
    return this.angularFirestore.collection(colection).snapshotChanges();
  }

  public actualzar(colection, documentId, datos){
    return this.angularFirestore.collection(colection).doc(documentId).set(datos);
  }

  public borrar(colection, documentId){
    return this.angularFirestore.collection(colection).doc(documentId).delete();
  }

  public consultarPorId(coleccion:string, documentId:string){
    return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
  }

}

