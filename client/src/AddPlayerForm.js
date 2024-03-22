import { useState } from "react";
// import "./AddPlayerForm.css"

/** An individual game piece dropped by a player
 *
 * Props:
 *  - add(): A callback function for when a player is added by a user
 *
 * State:
 *  - None
 *
 * PlayerManager -> AddPlayerForm*/

function AddPlayerForm({ add }) {
  // console.log("AddPlayerForm re-rendered");

  const [formData, setFormData] = useState({
    playerName: "",
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
    console.log("handleSubmit called");
    evt.preventDefault();
    add(formData);
  }

  return (
    <div className="AddPlayerForm">
      <form onSubmit={ handleSubmit }>
        <div>
          <label htmlFor="addPlayerForm-playerName">Player Name:</label>
          <input
            id="addPlayerForm-playerName"
            name="playerName"
            value={formData.playerName}
            onChange={handleChange}>
          </input>
        </div>
        <div>
          <label htmlFor="addPlayerForm-color">Color:</label>
          <input
            type="color"
            id="addPlayerForm-color"
            name="color"
            value={formData.color}
            onChange={handleChange}>
          </input>
        </div>
        <div>
          <label htmlFor="addPlayerForm-ai">Make AI Player:</label>
          <input
            type="checkbox"
            id="addPlayerForm-ai"
            name="ai"
            value={formData.ai}
            onChange={handleChange}>
          </input>
        </div>
        <div><button className="AddPlayerForm-button">Add Player</button></div>
      </form>
    </div>
  );
}

export default AddPlayerForm;