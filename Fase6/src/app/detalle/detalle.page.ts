import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ImagePicker } from '@awesome-cordova-plugins/image-picker/ngx';
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

  // Almacena el contenido de la imagen en formato Base64
  imagenSelec: string = "";

  constructor(
    private alertController: AlertController,
    private router: Router,
    private activatedRouter: ActivatedRoute,
    private firestoreService: FirestoreService,
    private loadingController: LoadingController,
    private toastController: ToastController,
    private imagePicker: ImagePicker
  ) { }

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
  // Implementamos una funcion de alerta antes de borrar
  // Asociamos esta función al botón borrar
  // Si el usuario acepta, se llama a la funcionque borra tarea de la coleccion
  async confirmarBorrado() {
    const alert = await this.alertController.create({
      header: 'Confirmar Borrado',
      message: 'Esta acción no se puede deshacer, ¿Confirma borrar tarea?',
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Borrado cancelado');
        }
      }, {
        text: 'Borrar',
        handler: () => {
          console.log('Borrado confirmado');
          // Llamada a foncion borrar
          this.clickBotonBorrar();
        }
      }]
    });
    await alert.present();
  }

  // Funcion que borra una tarea de la colecion por id
  // Después de borrar, redirige a home
  clickBotonBorrar() {
    // Actualizamos la tarea
    this.firestoreService.borrar("tareas", this.document.id).then(() => {
      // Redirigimos al usuario a /home
      this.router.navigate(['/home']);
    })
  }

  // Seleccinar imagen
  async seleccionarImagen() {
    // comprobamos poermisos de lectura
    this.imagePicker.hasReadPermission().then(
      (results) => {
        // conrol del flujo segun permisos
        if (results == false) {
          this.imagePicker.requestReadPermission();
        } else {
          // Abrimos selector de imagenes
          this.imagePicker.getPictures({
            maximumImagesCount: 1,  // limite de imágenes
            outputType: 1  // = Base64
          }).then(
            (results) => { // las imagenes seleccinadas están en results
              if (results > 0) { // existen imágenes
                // Almacenamos la imagen a la propiedad de la clase
                this.imagenSelec = "data:image/jpeg;base64," + results[0]; // el primer indice de results 
                console.log("Imagen que se ha seleccinado" + this.imagenSelec);
              }
            },
            (err) => {
              console.log(err)
            }
          );
        }
      }, (err) => {
        console.log(err)
      });
  }

  // Sube imagen a Firebase
  async subirImagen() {
    // Feedback de espera al usuario
    const loading = await this.loadingController.create({
      message: 'Subiendo imagen ...'
    });
    // Feedback de éxito al subir
    const toast = await this.toastController.create({
      message: 'Imagen subida correctamente',
      duration: 3000
    });

    // Carpeta dónde se almacena la imagen en FireStore
    let nombreCarpeta = "imagenes";
    // Mostramos el mensaje de espera
    loading.present();
    // Añadimos hecha/hora al nosmbre de la imagen
    // Evita nombres duplicados
    let nombreImagen = `${new Date().getTime()}`;
    // Llamamos al método de firestore.service para subir imagen
    this.firestoreService.subirImagenBase64(nombreCarpeta, nombreImagen, this.imagenSelec)
      .then(snapshot => {
        snapshot.ref.getDownloadURL()
          .then(downloadURL => {
            // depuración
            console.log(`url del la imagen: ${downloadURL}`);
            // Obtenemos la url de la imagen
            this.document.data.imagenURL = downloadURL;
            // ocultamos el mensaje de espera
            loading.dismiss();
            // Mostramos el mensaje de finalizado
            toast.present();
          });
      });
  }

  // Elimina una imagen de Firestore por URL
  async eliminarArchivo(fileURL: string){
    const toast = await this.toastController.create({
      message: 'Archivo borrado con éxito',
      duration: 3000
    });
    // Llamamos al método de forestoreService para elimimar ficheros
    this.firestoreService.eliminarPorURL(fileURL)
    .then(()=>{
      toast.present();
    }, (err)=>{
      console.log(err);
    });
  }

}
