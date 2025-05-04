import React, { useState } from "react";

const MHistDraggable: React.FC = () => {
  const [items, setItems] = useState(["Item 1", "Item 2", "Item 3", "Item 4"]);

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
    console.log("Updated backend list:", newItems);
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li
            key={item}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={(e) => e.preventDefault()}
            style={{
              cursor: "grab",
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MHistDraggable;