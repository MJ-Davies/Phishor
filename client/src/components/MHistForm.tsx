/**
 * Purpose: Represents the message history form that users put for it to be analyzed by AI in the backend
 */
import React, { useState } from "react";

// An enumerator that defines the parties involved in this message history form
const enum User {
  Me = "Me",
  Them = "Them"
}

const MHistForm = () => {
  // Default content for the user to see
  const [items, setItems] = useState([
    { user: User.Me, message: "Hello!" },
    { user: User.Them, message: "Hi there!" },
    { user: User.Me, message: "How are you?" },
    { user: User.Them, message: "I'm good, thanks!" }
  ]);

  // Purpose: Handles start of the drag event for the message history form
  // Parameters: e(React.DragEvent) - The event to handle (drag)
  //             index(number) - The current index of this element being dragged
  // Returns: None
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  // Purpose: Handles the end of a drag event for the message history form
  // Parameters: e(React.DragEvent) - The event to handle (drag)
  //             index(number) - The index where we dropped the element
  // Returns: None
  const handleDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));

    if (draggedIndex === index) return; // Prevent dropping onto itself

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);

    setItems(newItems);
  };

  // Purpose: Handles the delete of an elementin the message history form
  // Parameters: index(number) - The index of the element to delete
  // Returns: None
  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Purpose: Adds an entry to the message history form
  // Parameters: None
  // Returns: None
  const handleAddEntry = () => {
    // Get user selection and message input
    const userSelect = (document.getElementById("user") as HTMLSelectElement).value as User;
    const messageInput = (document.getElementById("message") as HTMLTextAreaElement).value;

    if (!messageInput.trim()) return; // Prevent empty messages

    // Add new entry
    setItems([...items, { user: userSelect, message: messageInput }]);

    // Clear the input field after adding
    (document.getElementById("message") as HTMLTextAreaElement).value = "";
  };
  
  // Purpose: Function to send to backend server when code finishes
  // Parameters: e(React.FormEvent)
  // Returns: None
  const sendToBackend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO implement Sending the items array to the backend server
    console.log("Sending to backend!")
  }

  return (
    <form id="mhist_entry_form" onSubmit={sendToBackend}>
      <select id="user" required>
        <option value="Me">Me</option>
        <option value="Them">Them</option>
      </select>
      <label htmlFor="message" className="hidden-label">Message input field</label>
      <textarea id="message" name="message" placeholder="Message"/>
      <ul>
        {items.map((item, index) => (
          <li
            key={`${item.user}: ${item.message}`}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
            style={{
              cursor: "grab",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}>
            {`${item.user}: ${item.message}`}
            <button onClick={() => handleDelete(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <button type="button" onClick={handleAddEntry}>Add entry</button>
        <button type="submit">Submit Message History to AI</button>
      </div>
    </form>
  );
};

export default MHistForm;