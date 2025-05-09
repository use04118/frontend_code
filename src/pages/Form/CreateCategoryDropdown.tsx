import React from 'react'

const CreateCategoryDropdown = () => {

  // Fetch categories from API when component mounts
    useEffect(() => {
      fetchCategories();
    }, []);
  
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://192.168.1.40:8000/sales/categories/'); // Replace with actual API
        const data: Category[] = await response.json();
        console.log(data);
        if (data && Array.isArray(data.results)) {
          setCategories(data.results); // Update categories with the results array
        } else {
          throw new Error('Invalid data format');
        } // Assuming API returns an array of categories
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };
  
    // Handle category selection
    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      e.preventDefault();
      const value = e.target.value;
      if (value === 'create') {
        setIsCreatingCategory(true);
        setPartyCategory('');
      } else {
        setPartyCategory(Number(value));
      }
    };
  
    const handleCreateCategory = async (e: React.FormEvent) => {
      e.preventDefault(); // ✅ Prevent page refresh immediately
    
      if (!newCategory.trim()) {
        alert('Please enter a valid category.');
        return;
      }
    
      try {
        const response = await fetch('http://192.168.1.40:8000/sales/categories/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategory.trim() }),
        });
    
        const data = await response.json();
        console.log('Response from API:', data); // Debugging
    
        if (response.ok) {
          setNewCategory('');
          setIsCreatingCategory(false);
          await fetchCategories(); // ✅ Re-fetch categories from API to update dropdown
        } else {
          console.error('Error adding category:', data);
          alert('Error adding category');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to add category.');
      }
    };
  
  return (
    <div>
      
    </div>
  )
}

export default CreateCategoryDropdown
