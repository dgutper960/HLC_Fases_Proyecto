import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
// Importaciones desde nuestro proyecto
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  // propiedad de la clase que almacena el id obtendo de home
  id: string = "";
  // Porpiedad con estructura para almacenar el id y los data de una tarea
  document: any = {
    id: "",
    data: {} as Tarea
  };

  constructor(private router: Router, private activatedRouter: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    // // Almacenamos el id recibido de home
    let idRecibido = this.activatedRouter.snapshot.paramMap.get('id');
    // controlamos que el valor no sea null
    if (idRecibido != null) {
      this.id = idRecibido;
    }
    this.consultarPorId();
  }

  consultarPorId() {
    this.firestoreService.consultarPorId("tareas", this.id).subscribe((resultado: any) => {
      if (resultado.payload.data() != null) {
        this.document.id = resultado.payload.id;
        this.document.data = resultado.payload.data();
        // mostramos algo por consola
        console.log(this.document.data.titulo);
      } else {
        this.document.data = {} as Tarea;
      }
    })
  }

  // Inserta una tarea en la colección de firestore
  clickBotonInsertar() {
    // Accedemos al método insretar de la interface implementada en firestore.service.ts
    // Recordamos sus parámetros de entrada
    // Como segundo parámetro, pondremos el valor de este document.data con una promesa
    this.firestoreService.insertar("tareas", this.document.data)
      .then(() => {
        console.log("Tarea creada correctamente");
        // Limpiamos el contenido de la tarea que se estaba editando
        this.document.data = {} as Tarea;
      }, (error) => {
        // en caso de error
        console.error(error)
      });
    // Redirigimos al usuario a /home
    this.router.navigate(['/home']);
  }

  // Edita la tarea seleccionada
  clickBotonEditar() {
    // Actualizamos la tarea
    this.firestoreService.actualzar("tareas", this.document.id, this.document.data).then(() => {
      // Redirigimos al usuario a /home
      this.router.navigate(['/home']);
    })
  }

  // Borrar tarea seleccinada al hacer click en el boton borrar
  clickBotonBorrar() {
    // Actualizamos la tarea
    this.firestoreService.borrar("tareas", this.document.id).then(() => {
      // Redirigimos al usuario a /home
      this.router.navigate(['/home']);
    })
  }

}
