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

  constructor(private router:Router, private activatedRouter: ActivatedRoute, private firestoreService: FirestoreService) { }

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

  // Edita la tarea seleccionada
  clickBotonEditar() {
    this.firestoreService.actualzar("tareas", this.document.id, this.document.data).then(() => {
      // Limpiar los datos de pantalla
      this.document = {} as Tarea;

      // Redirigimos al usuario a /home
      this.router.navigate(['/home']);
    })
  }

  // Borrar tarea seleccinada al hacer click en el boton borrar
  clickBotonBorrar() {
    this.firestoreService.borrar("tareas", this.document.id).then(() => {
      // Limpiar los datos de pantalla
      this.document = {} as Tarea;
      // Redirigimos al usuario a /home
      this.router.navigate(['/home']);
    })
  }

}
