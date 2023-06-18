import React, { useState } from "react";
import moment from "moment";
import "./Calendario.css";

const Calendario = ({ todos, hideCompleted }) => {
  const [currentDate, setCurrentDate] = useState(moment());

  const handlePreviousMonth = () => {
    setCurrentDate((prevDate) => prevDate.clone().subtract(1, "month"));
  };

  const handleNextMonth = () => {
    setCurrentDate((prevDate) => prevDate.clone().add(1, "month"));
  };

  const handlePreviousYear = () => {
    setCurrentDate((prevDate) => prevDate.clone().subtract(1, "year"));
  };

  const handleNextYear = () => {
    setCurrentDate((prevDate) => prevDate.clone().add(1, "year"));
  };

  const renderCalendarDays = () => {
    const currentYear = currentDate.year();
    const currentMonth = currentDate.month();
    const daysInMonth = currentDate.daysInMonth();

    const calendarDays = Array.from({ length: daysInMonth }, (_, index) =>
      moment([currentYear, currentMonth, index + 1])
    );

    return calendarDays.map((date) => {
      const matchingTodos = todos.filter(
        (todo) =>
          moment(todo.fecha_hora).isSame(date, "day") &&
          (!hideCompleted || !todo.completed)
      );

      return (
        <div key={date.date()} className="dia">
          <div className="numero-dia">{date.date()}</div>
          
          {matchingTodos.length > 0 && (
            <div className="eventos">
              {matchingTodos.map((todo) => (
                <div key={todo.id} className="evento">
                  {todo.title}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="calendario">
      <div className="navegacion">
        <div className="mes-ano">
          {currentDate.format("MMMM YYYY")}
        </div>
        <div className="botones">
      <button className="btn btn-secondary" onClick={handlePreviousYear}>
        &lt;&lt;
      </button>
      <button className="btn btn-secondary" onClick={handlePreviousMonth}>
        &lt;
      </button>
      <button className="btn btn-secondary" onClick={handleNextMonth}>
        &gt;
      </button>
      <button className="btn btn-secondary" onClick={handleNextYear}>
        &gt;&gt;
      </button>
    </div>
      </div>
      <div className="dias">
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendario;
