import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Tarea } from '../tarea';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  // Variable que almacena el id
  idTarea: string = "";

  // Variable que recoge los datos de la consulta
  // Necesitamos dos propiedades en la variable
  document: any = {
    id: "",
    data: {} as Tarea // debemos importar Tarea
  };

  constructor(private activateRoute: ActivatedRoute) { 

    

  }

  ngOnInit() {
    // Almacenamos el id de la ruta en nuestra variable de la clase
    // Usamos la instancia de ActivateRoute que hemos definido en el constructor
    let idRecibido = this.activateRoute.snapshot.paramMap.get('id'); // mismo nombre usado en la ruta
    // controlamos que el elemento, por lo que sea, no sea null
    if(idRecibido != null){
      this.idTarea = idRecibido;
    }
  }

}
