"use client"
import PlusIcon from '../icons/PlusIcon';
import { useMemo, useState } from 'react';
import { Column, Id, Task } from '../types';
import ColumnContainer from './ColumnContainer';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import { nanoid } from 'nanoid';
import TaskCard from './TaskCard';
import { log } from 'console';

function KanbanBoard() {
  let [editMode, setEditMode] = useState<Boolean[]>([]);
  const [columns, setColumns] = useState<Column[]>([{
    title: `Title`, id: nanoid(), description: "somthing Here", colums: [{
      id: nanoid(),
      title: `To Do`,
      decription:"description"
    }, {
      id: nanoid(),
      title: `In Progress`,
      decription:"description"
    },
    {
      id: nanoid(),
      title: `Completed`,
      decription:"description"
    }]
  }]);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  return (
    <div
      className='
      m-auto
      flex
      flex-wrap
      min-h-screen
      w-full
      items-center
      overflow-x-auto
      overflow-y-hidden
      px-[40px]
    '>
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}>
        <div className='m-auto  top-1  gap-4'>
          <SortableContext items={columnsId}>
            {columns.map((col, i) => <>
              <div className="title mt-[80px]  font-[700] flex justify-center">
                <h1 className='text-center' onClick={() => {
                  editMode[i] = true;
                  setEditMode([...editMode]);
                }}> {!editMode[i] && col.title}</h1>
                {editMode[i] && (
                  <input
                    className='bg-transparent text-white font-[700] text-center focus:border-green-300 border-rounded outline-none px-2'
                    value={col.title}
                    onChange={(e) => updateColumn(col.id, e.target.value)}
                    autoFocus
                    onBlur={() => { editMode[i] = true; setEditMode([...editMode]); }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      { editMode[i] = true; setEditMode([...editMode]); };
                    }}
                  />
                )}
              </div>
              <div className="title mb-4 flex justify-center">
                <h1 className='text-center ' onClick={() => {
                  editMode[i] = true;
                  setEditMode([...editMode]);
                }}> {!editMode[i] && col.description}</h1>
                {editMode[i] && (
                  <input
                    className='bg-transparent text-white text-center  focus:border-green-300 border-rounded outline-none px-2'
                    value={col.description}
                    onChange={(e) => updateDes(col.id, e.target.value)}
                    autoFocus
                    onBlur={() => { editMode[i] = true; setEditMode([...editMode]); }}
                    onKeyDown={(e) => {
                      if (e.key !== 'Enter') return;
                      { editMode[i] = true; setEditMode([...editMode]); };
                    }}
                  />
                )}
              </div>
              <div className='flex flex-wrap  gap-4'>

                {col.colums.map((data) => {
                  return <ColumnContainer
                    key={data.id}
                    column={data}
                    deleteColumn={deleteColumn}
                    updateColumn={updateColumn}
                    updateDes={updateDes}
                    createTask={createTask}
                    deleteTask={deleteTask}
                    updateTask={updateTask}
                    tasks={tasks.filter((task) => task.columnId === data.id)}
                  />
                })}
              </div>
            </>
            )}
          </SortableContext>

          <button
            onClick={() => createNewColumn()}
            className='
          h-[60px]
          w-[250px]
          min-w-[200px]
          cursor-pointer
          rounded-lg
          fixed
          top-1
          right-0
          bg-mainBackgroundColor
          border-2
          border-columnBackgroundColor
          p-4
          ring-white
          hover:ring-2
          flex
          gap-2
        '>
            <PlusIcon />
            Add Kanban Board
          </button>
        </div>

        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                updateDes={updateDes}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  (task) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: Id) {
    const newTask: Task = {
      id: nanoid(),
      columnId,
      content: `Content`,
    };

    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: Id) {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: Id, content: string) {
    const newTasks = tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, content };
    });

    setTasks(newTasks);
  }

  function createNewColumn() {
    const columnToAdd:Column = {
      id: nanoid(), title: `Title`, description: "somthing Here", colums: [{
        id: nanoid(),
        title: `To Do`,
        decription:"description"
      }, {
        id: nanoid(),
        title: `In Progress`,
        decription:"description"
      },
      {
        id: nanoid(),
        title: `Completed`,
        decription:"description"
      }]
    }

    setColumns([...columns, columnToAdd]);
  }

  function deleteColumn(id: Id) {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTasks = tasks.filter((t) => t.columnId !== id);
    setTasks(newTasks);
  }

  function updateColumn(id: Id, title: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, title };
    });

    setColumns(newColumns);
  }
  function updateDes(id: Id, description: string) {
    const newColumns = columns.map((col) => {
      if (col.id !== id) return col;
      return { ...col, description };
    });

    setColumns(newColumns);
  }
  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveColumn = active.data.current?.type === 'Column';
    if (!isActiveColumn) return;

    let  parent:Id=-1, child:Id= -1;
    let  oldpar:Id=-1, parchild:Id= -1;
      columns.forEach((col,i) =>{ col.colums.forEach((data,j) => {
        if (data.id === activeId) {
          child = j;
          parent =i;
        }
      })});

      columns.forEach((col,i) =>{ col.colums.forEach((data,j) => {
        if (data.id === overId) {
          parchild =j;
          oldpar =i;
        }
      })});
console.log(parent+" "+child);

      let dummy=columns[parent].colums[child];
      columns[parent].colums[child]=columns[oldpar].colums[parchild];
      columns[oldpar].colums[parchild]=dummy;
      setColumns([...columns]);
  }

  

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveTask) return;


    if (isActiveTask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);

        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveTask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);

        tasks[activeIndex].columnId = overId;

        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export default KanbanBoard;
