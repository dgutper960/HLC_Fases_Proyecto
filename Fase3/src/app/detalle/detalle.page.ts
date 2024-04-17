import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Tarea } from '../tarea';
import { FirestoreService } from '../firestore.service';

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
  idTarea: string = "";
  document: Documento = { id: "", data: {} as Tarea };

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
}
