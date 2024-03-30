import { useState } from "react";
import "./GameCreateForm.css"

/** A form for creating a new player
 *
 * Props:
 *  - createGame(): A callback function for form submission
 *
 * State:
 *  - None
 *
 * PlayerList -> GameCreateForm */

function GameCreateForm({ createGame }) {
  // console.log("GameCreateForm re-rendered");

  const [formData, setFormData] = useState({
    width: 6,
    height: 6,
    ai: false
  });

  // updates the form input as the user types
  function handleChange(evt) {

    // look at checked if its our checkbox
    if (evt.target.name === 'ai') {
      let { name, checked } = evt.target;
      setFormData( formData => ({
        ...formData,
        [name]: checked
      }))

    // otherwise user value
    } else {
      let { name, value } = evt.target;
      setFormData( formData => ({
        ...formData,
        [name]: value
      }))
    }
  }

  function handleSubmit(evt) {
    console.log("handleSubmit called");
    evt.preventDefault();
    createGame(formData);
  }

  return (
    <div className="GameCreateForm">
      <form onSubmit={ handleSubmit }>
        <div>
          <label htmlFor="gameCreateForm-name">Board Width:</label>
          <input
            id="gameCreateForm-width"
            name="width"
            value={formData.width}
            onChange={handleChange}>
          </input>
        </div>
        <div>
          <label htmlFor="gameCreateForm-name">Board Height:</label>
          <input
            id="gameCreateForm-height"
            name="height"
            value={formData.height}
            onChange={handleChange}>
          </input>
        </div>
        <div><button className="GameCreateForm-button">Create Game</button></div>
      </form>
    </div>
  );
}

export default GameCreateForm;