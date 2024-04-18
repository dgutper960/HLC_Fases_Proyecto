import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  // Propiedad que almacena el id de la tarea seleccionada
  idTareaSelec: string;
  // Propieded que almacena los datos retornados por consultar()
  arrayColleccionTareas: any = [{
    id: "",
    data: {} as Tarea
  }];


  constructor(private firestoreService: FirestoreService, private router: Router) {
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
  obtenerListaTareas() {
    this.firestoreService.consultar("tareas").subscribe((resultadoConsultaTareas) => {
      this.arrayColleccionTareas = [];
      resultadoConsultaTareas.forEach((datosTarea: any) => {
        this.arrayColleccionTareas.push({
          id: datosTarea.payload.doc.id,
          data: datosTarea.payload.doc.data()
        })
      })
    })
  }

  // Edita la tarea seleccionada
  clickBotonEditar() {
    this.firestoreService.actualzar("tareas", this.idTareaSelec, this.tareaEditando).then(() => {
      // Actualizar lista
      this.obtenerListaTareas();
      // Limpiar los datos de pantalla
      this.tareaEditando = {} as Tarea;
    })
  }

  // Borrar tarea seleccinada al hacer click en el boton borrar
  clickBotonBorrar() {
    this.firestoreService.borrar("tareas", this.idTareaSelec).then(() => {
      // Actualizar la lista
      this.obtenerListaTareas();
      // Limpiar los datos de pantalla
      this.tareaEditando = {} as Tarea;
    })
  }

  // Selecciona Tarea al hacer click
  selecTarea(tareaSelec) {
    // mensaje depuración
    console.log(`Tarea seleccionada: ${tareaSelec}`);
    // Asignamos los valores de la tarea seleccionada a las proiedades de la clase
    this.idTareaSelec = tareaSelec.id;
    this.tareaEditando.titulo = tareaSelec.data.titulo;
    this.tareaEditando.descripcion = tareaSelec.data.descripcion;
  }

  // Método que selecciona la tarea para enviar datos al enrrutamiento
  // Como entrada, tenemos el di de la tarea en ese momento del bucle
  selectTarea2(idTarea: string) {
    // almacenamos el valor en una variable de la clase
    this.idTareaSelec = idTarea;
    // Mandamos al usuario a la ruta indicada
    this.router.navigate(['/detalle', this.idTareaSelec]);
  }

}