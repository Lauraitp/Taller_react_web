import React, { Component } from 'react';
import ProjectList from './ProjectList'
import firebase from '../Firebase'

class ProjectItem extends Component {

constructor() {
    super();
    this.state = {

     
      detalles:null,
      projects:[],
      proy:null,
      redir:null,
      db: firebase.firestore()
      
    }

    const settings = { timestampsInSnapshots: true }
    this.state.db.settings(settings);
  }

   componentWillMount() {
      this.refresh()
this.darDetalles()
  }

  refresh() {
     var proy = [];
    this.state.db.collection("proyectos").get().then((querySnapShot) => {

      querySnapShot.forEach(doc => {

        proy.push(doc.data());
      });

      this.setState({ projects: proy,

      });
    });
  }

 darDetalles(){
    
    var date = new Date()
    var dateFormat=this.convertDateFormat(date.toLocaleDateString()).toString()

    if(this.props.proyectoParam.estado !== "TERMINADO" && 
     this.props.proyectoParam.fecha_fin < dateFormat){

      this.setState({
        detalles:   <li className="list-group-item barra-busqueda rojo">
        {"Nombre: " + this.props.proyectoParam.nombre} <hr/>
         {"Descripción: " + this.props.proyectoParam.descripcion} <hr/>
          {"Responsable: " + this.props.proyectoParam.responsable} <hr/>
        {"Fecha de Inicio: " +this.props.proyectoParam.fecha_inicio} <hr/> 
        
        {"Fecha de Entrega: " +this.props.proyectoParam.fecha_fin} <hr/> 
        
        {"Estado: " +this.props.proyectoParam.estado}<hr/> 
       {"Tareas:"}
       { <ul>
                  {this.props.proyectoParam.tareas.map(item => <li key={item.nombre}>Nombre: {item.nombre}<br/>Descripción: {item.descripcion}<br/>Prioridad: {item.prioridad}</li>)}
                </ul>}
        
       
      </li>
      });
    }
    else{

      this.setState({
        detalles:<li className="list-group-item barra-busqueda">

        {"Nombre: " + this.props.proyectoParam.nombre} <hr/>
        
        {"Fecha de Inicio: " +this.props.proyectoParam.fecha_inicio} <hr/> 
        
        {"Fecha de Entrega: " +this.props.proyectoParam.fecha_fin} <hr/> 
        
           {"Estado: " +this.props.proyectoParam.estado}<hr/> 
       {"Tareas:"}
       { <ul>
                  {this.props.proyectoParam.tareas.map(item => <li key={item.nombre}>Nombre: {item.nombre}<br/>Descripción: {item.descripcion}<br/>Prioridad: {item.prioridad}</li>)}
                </ul>}
        
       
        
        
      </li>
      });
    }
  }

  convertDateFormat(string) {
    var info = string.split('/');
    return info[2] + '-' + info[1] + '-' + info[0];
  }

  render() {
    return (
      
      <div className="col-8 ">
      {this.state.detalles}
  
      </div>
      
    );
  }
}

export default ProjectItem;
 