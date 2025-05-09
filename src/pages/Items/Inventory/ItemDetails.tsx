import React, { ChangeEvent } from 'react';

interface Category {
  id: number;
  name: string;
}

interface Item {
  itemName?: string;
  serviceName?: string;
  itemCode?: string;
  serviceCode?: string;
  category?: number;
  lowStockQty?: number;
  purchasePrice?: number;
  salesPrice?: number;
  description?: string;
  // Add other fields as needed
}

interface EditedItem {
  itemName: string;
  itemCode: string;
  category: number | string;
  stockQty: number;
  price: number;
  // Add other fields as needed
}

interface ItemDetailsProps {
  selectedItem: Item;
  categories: Category[];
  isEditing: boolean;
  editedItem: EditedItem;
  handleBackClick: () => void;
  handleEditClick: () => void;
  handleDeleteClick: () => void;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSaveClick: () => void;
}

const ItemDetails: React.FC<ItemDetailsProps> = ({
  selectedItem,
  categories,
  isEditing,
  editedItem,
  handleBackClick,
  handleEditClick,
  handleDeleteClick,
  handleInputChange,
  handleSaveClick,
}) => {
  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-4"
        onClick={handleBackClick}
      >
        Back
      </button>
      <div className="absolute top-2 right-2 space-x-2">
        <button
          onClick={handleDeleteClick}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete
        </button>
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Edit
        </button>
      </div>
      <h3 className="text-xl font-bold">Item Details</h3>
      {!isEditing ? (
        <div className="grid grid-cols-1 mt-2 md:grid-cols-2 gap-4">
          <div>
            <strong>Name:</strong>{' '}
            {selectedItem.itemName || selectedItem.serviceName}
          </div>
          <div>
            <strong>Code:</strong>{' '}
            {selectedItem.itemCode || selectedItem.serviceCode}
          </div>
          <div>
            <strong>Category:</strong>{' '}
            {categories.find((cat) => cat.id === selectedItem.category)?.name ||
              'Not Found'}
          </div>
          <div>
            <strong>Stock QTY:</strong> {selectedItem.lowStockQty ?? '-'}
          </div>
          <div>
            <strong>Purchase Price:</strong> ₹
            {selectedItem.purchasePrice ?? '-'}
          </div>
          <div>
            <strong>Selling Price:</strong> ₹{selectedItem.salesPrice ?? '-'}
          </div>
          <div>
            <strong>Description:</strong> {selectedItem.description ?? '-'}
          </div>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-bold">Edit Item</h3>
          <input
            type="text"
            name="itemName"
            value={editedItem.itemName}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="text"
            name="itemCode"
            value={editedItem.itemCode}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="text"
            name="category"
            value={editedItem.category}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="number"
            name="stockQty"
            value={editedItem.stockQty}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <input
            type="number"
            name="price"
            value={editedItem.price}
            onChange={handleInputChange}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={handleSaveClick}
            className="bg-green-500 text-white px-4 py-2 rounded mt-3"
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
