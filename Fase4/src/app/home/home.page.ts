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
  // Almacenamos id de tarea seleccionada
  idTareaSelec: string;
  // Propieded que almacena los datos retornados por consultar()
  arrayColleccionTareas: any = [{
    id: "",
    data: {} as Tarea
  }];

  constructor(private router: Router, private firestoreService: FirestoreService) {
    // Crea una tarea vacía al empezar
    this.tareaEditando = {} as Tarea;
    // Llamada a obtenerListaTareas() para cargar la lista de tareas nada más empezar
    this.obtenerListaTareas();
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

  // Selecciona Tarea al hacer click
  selecTarea(tareaSelec){
    // mensaje depuración
    console.log(`Tarea seleccionada: ${tareaSelec}`);
    // Asignamos los valores de la tarea seleccionada a las proiedades de la clase
    this.idTareaSelec = tareaSelec.id;
    this.tareaEditando.titulo = tareaSelec.data.titulo; 
    this.tareaEditando.descripcion = tareaSelec.data.descripcion; 
    // Redirigimos al usuario a /detalle
    this.router.navigate(['/detalle', this.idTareaSelec]);
  }

  // Redirecciona a detalle para añadir nueva tarea
  clickAddTarea(){
    // limpiamos las tareas seleccinadas 
    this.idTareaSelec = "Insertando";
    this.tareaEditando.titulo = ""; 
    this.tareaEditando.descripcion = "";
    // Redirigimos a /detalle
    this.router.navigate(['/detalle', this.idTareaSelec]);
  }

}
