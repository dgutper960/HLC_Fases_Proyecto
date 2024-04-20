import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {

  // propieddad de la clase que almacena el id obtendo de home
  id: string = "";

  constructor(private activatedRouter: ActivatedRoute) { }

  ngOnInit() {

    // Almacenamos el id recibido de home
    let idRecibido = this.activatedRouter.snapshot.paramMap.get('id');
    // controlamos que el valor no sea null
    if(idRecibido != null){
      this.id = idRecibido;
    }
  }

}
