import { GridRowSelectedParams } from '@material-ui/data-grid';
import { useState } from 'react';

export default function useSelectedItems<T extends { id: string }>(predicate: (model: T) => any = (model => model.id)) 
  : {
    selectedItems: Array<T>;
    reset: () => void;
    changeSelection: (param: GridRowSelectedParams) => void;
} {
  const [selectedItems, setSelectedItems] = useState<Array<T>>([]);

  const changeSelection = (param: GridRowSelectedParams) => {
    if (param.isSelected) {
      setSelectedItems(prev => {
        const newItems = [...prev];
        newItems.push(param.data as T);
        return newItems;
      })
    } else {
      setSelectedItems(prev => {
        const newItems = [...prev];
        const index = newItems.findIndex(el => predicate(el) === predicate(param.data as T))
        index !== -1 && newItems.splice(index, 1);
        return newItems;
      })
    }
  };

  const reset = () => {
    setSelectedItems([]);
  }

  return {
    selectedItems,
    reset,
    changeSelection
  }
};