import { useState } from "react";
import "./PlayerCreateForm.css"

/** A form for creating a new player
 *
 * Props:
 *  - createPlayer(): A callback function for form submission
 *
 * State:
 *  - None
 *
 * PlayerListAndCreate -> PlayerCreateForm */

function PlayerCreateForm({ createPlayer }) {
  // console.log("PlayerCreateForm re-rendered");

  const [formData, setFormData] = useState({
    name: "",
    color: "#3c3c3c",
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
    // console.log("handleSubmit called");
    evt.preventDefault();
    createPlayer(formData);
  }

  return (
    <div className="PlayerCreateForm">
      <form onSubmit={ handleSubmit }>
        <div>
          <label htmlFor="playerCreateForm-name">Player Name:</label>
          <input
            id="playerCreateForm-name"
            name="name"
            value={formData.name}
            onChange={handleChange}>
          </input>
        </div>
        <div>
          <label htmlFor="playerCreateForm-color">Color:</label>
          <input
            type="color"
            id="playerCreateForm-color"
            name="color"
            value={formData.color}
            onChange={handleChange}>
          </input>
        </div>
        <div>
          <label htmlFor="playerCreateForm-ai">Make AI Player:</label>
          <input
            type="checkbox"
            id="playerCreateForm-ai"
            name="ai"
            value={formData.ai}
            onChange={handleChange}>
          </input>
        </div>
        <div><button className="PlayerCreateForm-button">Add Player</button></div>
      </form>
    </div>
  );
}

export default PlayerCreateForm;