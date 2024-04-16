import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(private angularFirestore: AngularFirestore) { }

  // Inserta el registro de una nueva tarea
  // entrada -> coleccion, datos
  public insertar(coleccion: string, datos: any) {
    return this.angularFirestore.collection(coleccion).add(datos)
  }

  // Obtiene la lista de una coleccion
  // entrada -> coleccion
  public consultar(collection: any) {
    return this.angularFirestore.collection(collection).snapshotChanges();
  }

  // Obtiene los detalles de una tarea por id
  // entrada -> coleccion, idTarea
 public consultarPorId(coleccion: string, documentId:string){
  return this.angularFirestore.collection(coleccion).doc(documentId).snapshotChanges();
 }

}

