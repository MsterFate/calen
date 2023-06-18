import React, { Component } from "react";
import Modal from "./components/Modal";
import axios from "axios";
import Calendario from "./Calendario";
import moment from "moment-timezone";
import Navbar from "./components/Navbar";
import "./App.css";


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      viewCompleted: false,
      hideCompleted: false,
      todoList: [],
      modal: false,
      activeItem: {
        title: "",
        description: "",
        fecha_hora: "",
        completed: false,
      },
    };
  }
  
  
  toggleHideCompleted = () => {
    this.setState((prevState) => ({
      hideCompleted: !prevState.hideCompleted,
    }));
  };

  
  componentDidMount() {
    this.refreshList();
  }

  refreshList = () => {
    axios
      .get("http://18.208.193.74:8000/api/todos/")
      .then((res) => {
        if (Array.isArray(res.data)) {
          this.setState({ todoList: res.data });
        } else {
          console.error("Error: res.data no es un array", res.data);
        }
      })
      .catch((err) => console.log(err));
  };

  toggle = () => {
    this.setState({ modal: !this.state.modal });
  };

  handleSubmit = (item) => {
    this.toggle();

    if (item.id) {
      axios
        .put(`http://18.208.193.74:8000/api/todos/${item.id}/`, item)
        .then((res) => this.refreshList());
      return;
    }
    axios
      .post("http://18.208.193.74:8000/api/todos/", item)
      .then((res) => this.refreshList());
  };

  handleDelete = (item) => {
    axios
      .delete(`http://18.208.193.74:8000/api/todos/${item.id}/`)
      .then((res) => this.refreshList());
  };

  createItem = () => {
    const item = { title: "", description: "", fecha_hora: "", completed: false };

    this.setState({ activeItem: item, modal: !this.state.modal });
  };

  editItem = (item) => {
    const hora = item.fecha_hora.slice(11, 16);
    this.setState({
      activeItem: {
        ...item,
        fecha_hora: item.fecha_hora.slice(0, 16) // Mantener solo los primeros 16 caracteres (fecha y hora)
      },
      modal: !this.state.modal
    });
  };

  displayCompleted = (status) => {
    if (status) {
      return this.setState({ viewCompleted: true });
    }

    return this.setState({ viewCompleted: false });
  };

  renderTabList = () => {
    return (
      <div className="nav nav-tabs">
        <span
          onClick={() => this.displayCompleted(true)}
          className={this.state.viewCompleted ? "nav-link active" : "nav-link"}
        >
          Citas completadas
        </span>
        <span
          onClick={() => this.displayCompleted(false)}
          className={this.state.viewCompleted ? "nav-link" : "nav-link active"}
        >
          Citas a Realizar
        </span>
      </div>
    );
  };

  renderItems = () => {
    const { viewCompleted } = this.state;
    const newItems = this.state.todoList.filter((item) => item.completed === viewCompleted);
  
    return newItems.map((item) => {
      const fechaHora = new Date(item.fecha_hora);
      fechaHora.setHours(fechaHora.getHours() + 4); // Sumar 4 horas a la fecha y hora
  
      const fecha = fechaHora.toLocaleDateString();
      const hora = `${fechaHora.getHours().toString().padStart(2, '0')}:${fechaHora.getMinutes().toString().padStart(2, '0')} Hrs`;
  
      return (
        <li
          key={item.id}
          className="list-group-item d-flex justify-content-between align-items-left text-center"
        >
          <span
            className={`todo-title mr-2 ${
              this.state.viewCompleted ? 'completed-todo' : ''
            }`}
            title={item.description}
          >
            {item.title} - {fecha}, {hora}
          </span>
          <span>
            <button
              className="btn btn-secondary mr-2"
              onClick={() => this.editItem(item)}
            >
              Editar
            </button>
            <button
              className="btn btn-danger"
              onClick={() => this.handleDelete(item)}
            >
              Eliminar cita
            </button>
          </span>
        </li>
      );
    });
  };

  render() {
    const { hideCompleted } = this.state;
  
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-2">
            <Navbar />
          </div>
          <div className="col-md-9">
            <main className="app-container text-left">
              <h1 className="text-white text-uppercase text-left my-4">Todo app</h1>
              <div className="row">
                <div className="col-md-4">
                  <div className="card p-3">
                    <div className="mb-4">
                      <button className="btn btn-primary" onClick={this.createItem}>
                        Crear Cita
                      </button>
                    </div>
                    {this.renderTabList()}
                    <ul className="list-group list-group-flush border-top-0">
                      {this.renderItems()}
                    </ul>
                  </div>
                </div>
                <div className="col-md-8">
                  <button
                    className="btn btn-secondary mb-3 "
                    onClick={this.toggleHideCompleted}
                  >
                    {hideCompleted ? "Mostrar horas completas" : "Ocultar horas completas"}
                  </button>
                  <Calendario todos={this.state.todoList} hideCompleted={hideCompleted} />
                </div>
              </div>
              {this.state.modal ? (
                <Modal
                  activeItem={this.state.activeItem}
                  toggle={this.toggle}
                  onSave={this.handleSubmit}
                />
              ) : null}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;