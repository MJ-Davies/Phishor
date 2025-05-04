import React, { useState } from "react";

const enum User {
  Me = "Me",
  Them = "Them"
}

const MHistForm = () => {
  const [items, setItems] = useState([
    { user: User.Me, message: "Hello!" },
    { user: User.Them, message: "Hi there!" },
    { user: User.Me, message: "How are you?" },
    { user: User.Them, message: "I'm good, thanks!" }
  ]);

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    const draggedIndex = Number(e.dataTransfer.getData("text/plain"));

    if (draggedIndex === index) return; // Prevent dropping onto itself

    const newItems = [...items];
    const [removed] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, removed);

    setItems(newItems);
  };

  const handleDelete = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

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
  
  const sendToBackend = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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