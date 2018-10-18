import React, { Component } from 'react';
import firebase from '../Firebase'
import { Redirect } from 'react-router-dom'

class Tareas extends Component {

  constructor() {
    super();
    this.state = {

      nombreTarea: "",
      desTarea: "",
      prioTarea: "",

      proye: [],
      tareaConst: [],
      tareasDeProyecto: [],
      db: firebase.firestore()
    }

    const settings = { timestampsInSnapshots: true }
    this.state.db.settings(settings);
  }

  componentWillMount() {
    this.refresh();
  }

  refresh() {

    var proy = [];
    var idProys = [];

    this.state.db.collection("proyectos").get().then((querySnapShot) => {

      querySnapShot.forEach(doc => {
        idProys.push(doc.id);
        proy.push(doc.data());
      });

      this.setState({
        proye: proy
      });

    });
  }

  guardarTarea(e) {

    var proyTar = localStorage.getItem("nomProyecto");
  
    if (this.state.nombreTarea !== "" && this.state.desTarea !== ""
      && this.state.prioTarea !== "") {

      e.preventDefault();

      var tareaNueva = {

        nombre: this.state.nombreTarea,
        descripcion: this.state.desTarea,
        prioridad: this.state.prioTarea
      }

      this.state.db.collection("proyectos").get().then((querySnapShot) => {

        var tarProyects = [];

        querySnapShot.forEach(doc => {

          if (doc.data().nombre === proyTar) {


            tarProyects.push(tareaNueva);
        
            this.state.db.doc("/proyectos/" + doc.id).update({
              tareas: tarProyects
            });

          }
        });

      });

      this.msj("Se agregó nueva tarea")

      this.setState({

        nombreTarea:"",
        desTarea:"",
        prioTarea:""      
      });
    } else {
      this.msj("los campos son obligatorios")
    }
  }

  msj(msm) {

    alert(msm);
  }

  updateInput(e) {

    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    if(localStorage.getItem("session")!==""){
    return (
      <div className="Tareas">
        <nav className="navbar  navbar-expand-lg navbar-dark bg-dark">
  <a className="navbar-brand" href="/projects">Managment Tools</a>
   <ul className="navbar-nav ml-auto  my-lg-0">
		      <li className="nav-item">
		       <a className="nav-link" href="/login">LogOut <i className="fas fa-user-times"></i> </a>

		      </li>
		    </ul>
</nav>
        <form className="form-nuevoProy container py-3">

          <div className="form-group row ">
          <label className="custom col-4">Nombre</label>
            <input type="text" className="form-control col-4" placeholder="Nombre" name="nombreTarea" value={this.state.nombreTarea}
              onChange={this.updateInput.bind(this)} />
          </div>
          <div className="form-group row">

            <label className="custom col-4">Descripción</label>
            <input type="text" className="form-control col-4" placeholder="Descripción" name="desTarea" value={this.state.desTarea}
              onChange={this.updateInput.bind(this)} />
          </div>
          <div className="form-group row">
          <label className="custom col-4">Prioridad</label>
            <select className="form-control col-4" name="prioTarea" value={this.state.prioTarea} onChange={this.updateInput.bind(this)}>
              <option>Prioridad</option>
              <option>Con poca prioridad</option>
              <option>Con prioridad media</option>
              <option>Con Alta prioridad</option>
            </select>
          </div>

          <button className="btn btn-primary"  onClick={this.guardarTarea.bind(this)}>Agregar</button>

        </form>
      </div>
    );

    } else {
      return (
        <Redirect to="/login" />
      );
    }
  }
}

export default Tareas;
