import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {AngularFireStorage} from '@angular/fire/compat/storage'

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(
    private angularFirestore: AngularFirestore, 
    private angularFireStorage : AngularFireStorage
  ) { }

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

  // Subir Imagen al FireStorage
  public subirImagenBase64(nombreCarpeta: string, nombreArchivo:string, imagenBase64:string){
    let storageRef = this.angularFireStorage.ref(nombreCarpeta).child(nombreArchivo);
    return storageRef.putString(imagenBase64, 'data_url');
  }

  // Eliminar un archivo a partir de su url
  public eliminarPorURL(url:string){
    return this.angularFireStorage.storage.refFromURL(url).delete();
  }


}

