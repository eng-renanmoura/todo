import { UsuarioProvider } from './../../providers/usuario/usuario';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public usuarios:any;
  public usuario= {nome:"",idade:""};

  constructor(public navCtrl: NavController, public usuarioService: UsuarioProvider) {

  }

  ionViewDidLoad() {

    this.usuarioService.getUsuarios().then((data) => {
      this.usuarios = data;
    });

  }

  public searchUser(event){
    this.usuarioService.searchUsuario(event).then(resultado => this.usuarios =  resultado.docs);
  }

  public editar(usuario){
    this.usuario = usuario;
  }

  public deletar(usuario){
    this.usuarioService.removeUsuario(usuario);
  }

  public salvarUsuario() {
      this.usuarioService.createUsuario(this.usuario);
  };

}
