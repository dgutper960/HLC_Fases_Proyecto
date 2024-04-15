import { Component } from '@angular/core';
// Importaciones a ficheros de nuestro proyecto
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  // Podemos declarar propiedades del tipo Tarea 
  tareaEditando: Tarea;
  // Propieded que almacena los datos retornados por consultar()
  arrayColleccionTareas: any = [{
    id: "",
    data: {} as Tarea
  }];

  constructor(private firestoreService: FirestoreService) {
    // Crea una tarea vacía al empezar
    this.tareaEditando = {} as Tarea;

    // Llamada a obtenerListaTareas() para cargar la lista de tareas nada más empezar
    this.obtenerListaTareas();
  }

  clickBotonInsertar() {
    // Accedemos al método insretar de la interface implementada en firestore.service.ts
    // Recordamos sus parámetros de entrada
    // Como segundo parámetro, pondremos el valor de tareaEditando con una promesa
    this.firestoreService.insertar("tareas", this.tareaEditando)
      .then(() => {
        console.log("Tarea creada correctamente");
        // Limpiamos el contenido de la tarea que se estaba editando
        this.tareaEditando = {} as Tarea;
      }, (error) => {
        // en caso de error
        console.error(error)
      });
  }

  // Método que obtiene la lista de tareas
  obtenerListaTareas(){
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas)=>{
      this.arrayColleccionTareas = [];
      resultadoConsultaTareas.forEach((datosTarea: any)=>{
        this.arrayColleccionTareas.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        })
      })
    })
  }
}
