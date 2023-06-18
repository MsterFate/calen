class VentanaDatos extends Component {
    render() {
      const { selectedDay } = this.props;
  
      if (!selectedDay) {
        return null;
      }
  
      // Aquí puedes implementar la lógica para mostrar los datos guardados del día seleccionado en la ventana.
  
      return (
        <div className="ventana-datos">
          <h2>{format(selectedDay, "MMMM d, yyyy")}</h2>
          {/* Agrega aquí los elementos y datos que deseas mostrar */}
        </div>
      );
    }
  }