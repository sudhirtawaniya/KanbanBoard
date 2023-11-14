import { SortableContext, useSortable } from '@dnd-kit/sortable';
import TrashIcon from '../icons/TrashIcon';
import { Column, Id, Task } from '../types';
import { CSS } from '@dnd-kit/utilities';
import { useMemo, useState } from 'react';
import PlusIcon from '../icons/PlusIcon';
import TaskCard from './TaskCard';

interface Props {
  column: any;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  updateDes: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  updateTask: (id: Id, content: string) => void;
  deleteTask: (id: Id) => void;
  tasks: Task[];
}

function ColumnContainer({
  column,
  deleteColumn,
  updateColumn,
  createTask,
  tasks,
  updateDes,
  deleteTask,
  updateTask,
}: Props) {
  const [editMode, setEditMode] = useState(false);
  const [editModeDec, setEditModeDec] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({

    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className='
      bg-columnBackgroundColor
      opacity-40
      border-2
      mb-5
      border-green-200
      w-[350px]
      h-[500px]
      max-h-[500px]
      rounded-md
      flex
      flex-col
      '></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className='
    bg-columnBackgroundColor
      w-[350px]
      h-[500px]
      max-h-[500px]
      mb-5
      rounded-md
      flex
      flex-col
    '>
     
      <div
        {...attributes}
        {...listeners}
       
        className='
        bg-mainBackgroundColor
        text-medium
        h-[60px]
        cursor-grab
        rounded-md
        rounded-b-none
        p-3
        font-bold
        border-columnBackgroundColor
        border-4
        flex
        
        items-center
        justify-between
        '>
        <div className=' gap-2' >
        
          <p  onClick={() => {
          setEditMode(true);
        }}>{!editMode && column.title}</p>
          {editMode && (
            <input
              className='bg-transparent focus:border-green-300 border-rounded outline-none px-2'
              value={column.title}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              autoFocus
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => {
                if (e.key !== 'Enter') return;
                setEditMode(false);
              }}
            />
          )}
          <p className='opacity-25 font-[300]' onClick={() => {
          setEditModeDec(true);
        }}> {!editModeDec && column.decription}</p>
        {editModeDec && (
          <input
            className='bg-transparent focus:border-green-300 border-rounded outline-none px-2'
            value={column.decription}
            onChange={(e) => updateDes(column.id, e.target.value)}
            
            onBlur={() => setEditModeDec(false)}
            onKeyDown={(e) => {
              if (e.key !== 'Enter') return;
              setEditModeDec(false);
            }}
          />
        )}
        </div>
       
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className='
            stroke-gray-500
            hover:stroke-white
            hover:bg-columnBackgroundColor
            rounded
            px-1
            py-2'>
          <TrashIcon />
        </button>
      </div>

     
      <div className='flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto'>
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
     
      <button
        className='flex gap-2 items-center border-columnBackgroundColor border-2 rounded-md p-4 border-x-columnBackgroundColor hover:bg-mainBackgroundColor hover:text-green-300 active:bg-black'
        onClick={() => {
          createTask(column.id);
        }}>
        <PlusIcon />
        Add task
      </button>
    </div>
  );
}

export default ColumnContainer;
