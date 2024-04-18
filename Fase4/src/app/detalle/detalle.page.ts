import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Importaciones desde nuestro proyecto
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

// Definimos una Interfaz con la estructura de datos que se espera
interface Documento {
  id: string;
  data: Tarea;
}

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  // Almacenaremos el id obtenido por URL
  idTarea: string = "";
  // Aquí alamacenaremos los datos obtenidos
  document: Documento = { id: "", data: {} as Tarea };

    // Podemos declarar propiedades del tipo Tarea 
  tareaEditando: Tarea;
  // Propiedad que almacena el id de la tarea seleccionada
  idTareaSelec: string;
  // Propieded que almacena los datos retornados por consultar()
  arrayColleccionTareas: any = [{
    id: "",
    data: {} as Tarea
  }];

  constructor(private firestoreService: FirestoreService, private activateRoute: ActivatedRoute) {}

  ngOnInit() {
    let idRecibido = this.activateRoute.snapshot.paramMap.get('id');
    if (idRecibido !== null) {
      this.idTarea = idRecibido;
      this.consultarTarea();
    }
  }

  consultarTarea() {
    // hacemos consulta a la BBDD
    this.firestoreService.consultarPorId("tareas", this.idTarea).subscribe((resultado:any)=>{
      // En caso de obtener un document con ese nombre
      if(resultado.payload.data() != null){
        this.document.id = resultado.payload.id
        this.document.data = resultado.payload.data();
        // mostramos el titulo por consola
        console.log(this.document.data.titulo);
      }else{
        this.document.data = {} as Tarea;
      }
    })
  }

  // Añadimos funciones para Editar y Borrar

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

}
