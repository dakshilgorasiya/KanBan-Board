// KanbanBoard.jsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { v4 as uuidv4 } from 'uuid';

const initialData = {
  columns: {
    todo: {
      name: 'To Do',
      items: [
        { id: 'task-1', title: 'Design landing page', description: 'Create responsive UI' },
        { id: 'task-2', title: 'Write documentation', description: 'Document API endpoints' },
      ],
    },
    inprogress: {
      name: 'In Progress',
      items: [
        { id: 'task-3', title: 'Develop login page', description: 'Implement authentication flow' },
      ],
    },
    done: {
      name: 'Done',
      items: [
        { id: 'task-4', title: 'Setup database', description: 'Initialize schema and tables' },
      ],
    },
  },
};

const KanbanBoard = () => {
  const [columns, setColumns] = useState(initialData.columns);
  const [newCategory, setNewCategory] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', columnId: 'todo' });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColId = source.droppableId;
    const destColId = destination.droppableId;

    if (sourceColId === 'inprogress' && destColId === 'todo') return;
    if (sourceColId === 'done' && destColId !== 'done') return;

    const sourceCol = columns[sourceColId];
    const destCol = columns[destColId];

    const sourceItems = Array.from(sourceCol.items);
    const destItems = Array.from(destCol.items);
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (sourceColId === destColId) {
      sourceItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [sourceColId]: {
          ...sourceCol,
          items: sourceItems,
        },
      });
    } else {
      destItems.splice(destination.index, 0, movedItem);
      setColumns({
        ...columns,
        [sourceColId]: {
          ...sourceCol,
          items: sourceItems,
        },
        [destColId]: {
          ...destCol,
          items: destItems,
        },
      });
    }
  };

  const handleAddCategory = () => {
    const id = uuidv4();
    setColumns({
      ...columns,
      [id]: {
        name: newCategory,
        items: [],
      },
    });
    setNewCategory('');
  };

  const handleDeleteCategory = (id) => {
    const updated = { ...columns };
    delete updated[id];
    setColumns(updated);
  };

  const handleAddTask = () => {
    const task = {
      id: uuidv4(),
      title: newTask.title,
      description: newTask.description,
    };
    setColumns({
      ...columns,
      [newTask.columnId]: {
        ...columns[newTask.columnId],
        items: [...columns[newTask.columnId].items, task],
      },
    });
    setNewTask({ title: '', description: '', columnId: 'todo' });
  };

  const handleDeleteTask = (colId, taskId) => {
    setColumns({
      ...columns,
      [colId]: {
        ...columns[colId],
        items: columns[colId].items.filter(item => item.id !== taskId),
      },
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>

      {/* Add Category */}
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New Category Name"
          className="border p-2 rounded"
        />
        <button onClick={handleAddCategory} className="bg-blue-500 text-white px-4 py-2 rounded">
          Add Category
        </button>
      </div>

      {/* Add Task */}
      <div className="mb-6 flex gap-2 flex-wrap">
        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Task Title"
          className="border p-2 rounded"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          placeholder="Task Description"
          className="border p-2 rounded"
        />
        <select
          value={newTask.columnId}
          onChange={(e) => setNewTask({ ...newTask, columnId: e.target.value })}
          className="border p-2 rounded"
        >
          {Object.entries(columns).map(([id, col]) => (
            <option key={id} value={id}>{col.name}</option>
          ))}
        </select>
        <button onClick={handleAddTask} className="bg-green-500 text-white px-4 py-2 rounded">
          Add Task
        </button>
      </div>

      {/* Columns */}
      <div className="flex gap-4 overflow-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.entries(columns).map(([columnId, column]) => (
            <div key={columnId} className="bg-gray-100 p-4 rounded w-72 shadow-md flex-shrink-0">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">{column.name}</h2>
                <button
                  onClick={() => handleDeleteCategory(columnId)}
                  className="text-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[100px] space-y-2"
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="p-3 bg-white rounded shadow relative"
                          >
                            <h3 className="font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <button
                              onClick={() => handleDeleteTask(columnId, item.id)}
                              className="absolute top-1 right-1 text-xs text-red-500"
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
