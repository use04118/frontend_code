import React from 'react';
import EditProductForm from './EditProductForm';
import EditServiceForm from './EditServiceForm';

type ItemType = 'Product' | 'Service';

interface Item {
  itemType: ItemType;
  // Add other fields as per your data model, for example:
  // name: string;
  // price: number;
}

interface ItemFormProps {
  editedItem: Item;
  handleInputChange: (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      | { target: { name: string; value: any } }
  ) => void;
  handleSaveClick: () => void;
}

const ItemForm: React.FC<ItemFormProps> = ({
  editedItem,
  handleInputChange,
  handleSaveClick,
}) => {
  return (
    <div>
      {editedItem.itemType === 'Product' ? (
        <EditProductForm
          editedItem={editedItem}
          handleInputChange={handleInputChange}
          handleSaveClick={handleSaveClick}
        />
      ) : (
        <EditServiceForm
          editedItem={editedItem}
          handleInputChange={handleInputChange}
          handleSaveClick={handleSaveClick}
        />
      )}
    </div>
  );
};

export default ItemForm;
