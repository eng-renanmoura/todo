import { Injectable } from '@angular/core';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
PouchDB.plugin(PouchDBFind);

/*
  Generated class for the UsuarioProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UsuarioProvider {

  public data:any;
  public db:any;
  public remote:any;

  constructor() {
    this.db = new PouchDB('usuario');
  }

  public searchUsuario(nome: string) {
    return this.db.find({
      selector: { nome: { $regex: nome} }
    })
  }

  public createUsuario(usuario:any){
    this.db.post(usuario);
  }

  public updateUsuario(usuario:any){
    this.db.put(usuario).catch((err)=>{
      console.log(err);
    });
  }

  public removeUsuario(usuario:any){
    this.db.remove(usuario);
  }

  public getUsuarios(){
    if(this.data){
      return Promise.resolve(this.data);
    }

    return new Promise(resolve =>
      this.db.allDocs({
        include_docs: true
      }).then((result)=>{
        this.data = [];

        result.rows.map((row)=>{
          this.data.push(row.doc);
        });
        resolve(this.data);

        this.db.changes({ live: true, since: 'now', include_docs: true }).on('change', (change) => {
          this.handleChange(change);
        });

      })
    );
    
  }

  handleChange(change) {
    let changedDoc = null;
    let changedIndex = null;

    this.data.forEach((doc, index) => {
      if (doc._id === change.id) {
        changedDoc = doc;
        changedIndex = index;
      }
    });

    //Documento deletado
    if (change.deleted) {
      this.data.splice(changedIndex, 1);
    } else {
      if (changedDoc) {
        //Documento atualizado
        this.data[changedIndex] = change.doc;
      } else {
        //Documento adicionado
        this.data.push(change.doc);
      }
    }
  }

}
