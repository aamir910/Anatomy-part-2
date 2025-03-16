import React from "react";

const ToggleCategory = ({
  type,
  legendItems,
  checkedClasses,
  setCheckedClasses,
  expandedState,
  setExpandedState
}) => {
  // Function to select all items in the specified type (both main checkboxes and expanded ones)
  const handleSelectAll = () => {
    // Update main category checkboxes
    const updatedClasses = { ...checkedClasses };
    const categoryItems = legendItems.find((group) => group.group === type)?.items || [];
    
    categoryItems.forEach((item) => {
      updatedClasses[item.class] = true; // Set all main checkboxes to true
    });
    setCheckedClasses(updatedClasses);

    // Update expanded items checkboxes
    if (expandedState && setExpandedState) {
      const updatedExpandedState = { ...expandedState };
      
      // Filter expandedState to only update items that belong to this category
      Object.entries(updatedExpandedState).forEach(([id, details]) => {
        // Check if this expanded item belongs to any of the current category's items
        const belongsToCategory = categoryItems.some(item => item.label === details.label);
        if (belongsToCategory) {
          updatedExpandedState[id] = { ...details, visible: true };
        }
      });
      
      setExpandedState(updatedExpandedState);
    }
  };

  // Function to unselect all items in the specified type (both main checkboxes and expanded ones)
  const handleUnselectAll = () => {
    // Update main category checkboxes
    const updatedClasses = { ...checkedClasses };
    const categoryItems = legendItems.find((group) => group.group === type)?.items || [];
    
    categoryItems.forEach((item) => {
      updatedClasses[item.class] = false; // Set all main checkboxes to false
    });
    setCheckedClasses(updatedClasses);

    // Update expanded items checkboxes
    if (expandedState && setExpandedState) {
      const updatedExpandedState = { ...expandedState };
      
      // Filter expandedState to only update items that belong to this category
      Object.entries(updatedExpandedState).forEach(([id, details]) => {
        // Check if this expanded item belongs to any of the current category's items
        const belongsToCategory = categoryItems.some(item => item.label === details.label);
        if (belongsToCategory) {
          updatedExpandedState[id] = { ...details, visible: false };
        }
      });
      
      setExpandedState(updatedExpandedState);
    }
  };

  // Check if all items in this category are selected
  const allSelected = legendItems
    .find((group) => group.group === type)
    ?.items.every((item) => checkedClasses[item.class]);

  return (
    <a
      onClick={() => {
        // Toggle behavior: if all items are checked, unselect all; otherwise, select all
        if (allSelected) {
          handleUnselectAll();
        } else {
          handleSelectAll();
        }
      }}
      style={{ cursor: "pointer" }}
    >
      {allSelected ? "Unselect all" : "Select all"}
    </a>
  );
};

export default ToggleCategory;