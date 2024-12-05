import { React, useState } from "react";
import { Row, Col, Checkbox, Input } from "antd";

import ToggleCategory from "./ToggleCategory";

const Legend = ({
  checkedClasses,
  onClassChange,
  selectedValues,
  setCheckedClasses,
  expandedState,
  setExpandedState,
}) => {
  console.log(expandedState, "expandedState");
  const [expandedClasses, setExpandedClasses] = useState({}); // For expanding/collapsing subgroups
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  console.log(selectedValues, "selectedValues is here ");
  const legendItems = [
    {
      group: "Disease",
      items: [
        {
          shape: "triangle",
          color: "red",
          label: "Refractive Errors",
          class: "Refractive Errors",
        },
        {
          shape: "triangle",
          color: "blue",
          label: "Retinal Diseases",
          class: "Retinal Diseases",
        },
        {
          shape: "triangle",
          color: "green",
          label: "Others",
          class: "Others",
        },
        {
          shape: "triangle",
          color: "orange",
          label: "Lens Diseases",
          class: "Lens Diseases",
        },
        {
          shape: "triangle",
          color: "purple",
          label: "Ocular Hypertension",
          class: "Ocular Hypertension",
        },
        {
          shape: "triangle",
          color: "pink",
          label: "Ocular Motility Disorders",
          class: "Ocular Motility Disorders",
        },
        {
          shape: "triangle",
          color: "cyan",
          label: "Uveal Diseases",
          class: "Uveal Diseases",
        },
        {
          shape: "triangle",
          color: "magenta",
          label: "Corneal Diseases",
          class: "Corneal Diseases",
        },
        {
          shape: "triangle",
          color: "lime",
          label: "Conjunctival Diseases",
          class: "Conjunctival Diseases",
        },
        {
          shape: "triangle",
          color: "teal",
          label: "Orbital Diseases",
          class: "Orbital Diseases",
        },
        {
          shape: "triangle",
          color: "salmon",
          label: "Eye Neoplasms",
          class: "Eye Neoplasms",
        },
        {
          shape: "triangle",
          color: "violet",
          label: "Lacrimal Apparatus Diseases",
          class: "Lacrimal Apparatus Diseases",
        },
      ],
    },

    {
      group: "Variant",
      items: [
        {
          shape: "circle",
          color: "gold",
          label: "missense variant",
          class: "missense variant",
        },
        {
          shape: "circle",
          color: "silver",
          label: "inframe deletion",
          class: "inframe deletion",
        },
        {
          shape: "circle",
          color: "beige",
          label: "frameshift variant",
          class: "frameshift variant",
        },
        {
          shape: "circle",
          color: "lavender",
          label: "intron variant",
          class: "intron variant",
        },
        {
          shape: "circle",
          color: "crimson",
          label: "regulatory region variant",
          class: "regulatory region variant",
        },
        {
          shape: "circle",
          color: "aqua",
          label: "intergenic variant",
          class: "intergenic variant",
        },
        {
          shape: "circle",
          color: "darkorange",
          label: "splice region variant",
          class: "splice region variant",
        },
        {
          shape: "circle",
          color: "olive",
          label: "splice donor variant",
          class: "splice donor variant",
        },
        {
          shape: "circle",
          color: "peru",
          label: "non coding transcript exon variant",
          class: "non coding transcript exon variant",
        },
        {
          shape: "circle",
          color: "lightblue",
          label: "3 prime UTR variant",
          class: "3 prime UTR variant",
        },
        {
          shape: "circle",
          color: "darkgoldenrod",
          label: "5 prime UTR variant",
          class: "5 prime UTR variant",
        },
        {
          shape: "circle",
          color: "limegreen",
          label: "stop gained",
          class: "stop gained",
        },
        {
          shape: "circle",
          color: "turquoise",
          label: "synonymous variant",
          class: "synonymous variant",
        },
        {
          shape: "circle",
          color: "steelblue",
          label: "TF binding site variant",
          class: "TF binding site variant",
        },
        {
          shape: "circle",
          color: "orchid",
          label: "splice acceptor variant",
          class: "splice acceptor variant",
        },
        {
          shape: "circle",
          color: "coral",
          label: "downstream gene variant",
          class: "downstream gene variant",
        },
        {
          shape: "circle",
          color: "chocolate",
          label: "stop lost",
          class: "stop lost",
        },
        {
          shape: "circle",
          color: "tan",
          label: "upstream gene variant",
          class: "upstream gene variant",
        },
        {
          shape: "circle",
          color: "lightseagreen",
          label: "rameshift variant",
          class: "rameshift variant",
        },
        {
          shape: "circle",
          color: "mediumvioletred",
          label: "inframe insertion",
          class: "inframe insertion",
        },
        {
          shape: "circle",
          color: "powderblue",
          label: "protein altering variant",
          class: "protein altering variant",
        },
      ],
    },
  ];

  console.log(selectedValues, "checkedClasses checkedClasses");
  const filteredLegendItems = legendItems.map(
    (group) => {
      // if (group.group === "") {
      return {
        ...group,
        items: selectedValues.length === 0 ? group.items : group.items,
      };
    }
    // return group;
    // }
  );
  // Toggle expansion for a parent class
  const toggleExpand = (className) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [className]: !prev[className],
    }));
  };

  return (
    <Row>
      {filteredLegendItems.map((group, groupIndex) => (
        <Col
          key={groupIndex}
          span={24}
          style={{ marginTop: group.group === "" ? "25px" : "0" }}>
          <dl style={{ margin: 0, padding: 0 }}>
            <dt
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "start",
                justifyContent: "flex-start",
                fontSize: "15px",
                marginBottom: group.group === "Others" ? "10px" : "0",
              }}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}>
                {group.group || null}

                {group.group === "Disease" ? (
                  <ToggleCategory
                    type="Disease"
                    legendItems={legendItems}
                    checkedClasses={checkedClasses}
                    setCheckedClasses={setCheckedClasses}
                  />
                ) : (
                  <ToggleCategory
                    type="Variant"
                    legendItems={legendItems}
                    checkedClasses={checkedClasses}
                    setCheckedClasses={setCheckedClasses}
                  />
                )}
              </div>
            </dt>
            {group.items.map((item, index) => (
              <dd
                key={index}
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  marginLeft: 0,
                }}>
                <div
                  style={{
                    marginBottom: "8px",
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginLeft: 0,
                  }}>
                  <div
                    style={{ cursor: "pointer", marginRight: "8px" }}
                    onClick={() => toggleExpand(item.class)}>
                    {expandedClasses[item.class] ? "▼" : "▶"}
                  </div>

                  {item.shape === "triangle" && (
                    <>
                      <svg
                        width="20"
                        height="20"
                        style={{ marginRight: "2px" }}>
                        <polygon points="10,0 0,20 20,20" fill={item.color} />
                      </svg>

                      <Checkbox
                        checked={checkedClasses[item.class]}
                        onChange={(e) =>
                          onClassChange(item.class, e.target.checked)
                        }
                        style={{ marginLeft: "2px" }}
                      />
                    </>
                  )}
                  {item.shape === "circle" && (
                    <>
                      <svg
                        width="20"
                        height="20"
                        style={{ marginRight: "3px", marginTop: "5px" }}>
                        <polygon
                          points="10,0 19,7 15,19 5,19 1,7"
                          fill={item.color}
                        />
                      </svg>
                      <Checkbox
                        checked={checkedClasses[item.class]}
                        onChange={(e) =>
                          onClassChange(item.class, e.target.checked)
                        }
                        style={{ marginLeft: "2px" }}
                      />
                    </>
                  )}

                  <div style={{ marginLeft: "3px" }}> {item.label}</div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    maxWidth: "200px",
                  }}>
                  {/* Subgroup Rendering */}
                  {expandedClasses[item.class] && (
                    <div style={{ marginTop: "10px", width: "100%" }}>
                      {/* Search Input */}
                      <Input
                        placeholder="Search..."
                        style={{ marginBottom: "10px", maxWidth: "250px" }}
                        value={searchQuery}
                        onChange={(e) =>
                          setSearchQuery(e.target.value.toLowerCase())
                        }
                      />

                      {/* Select All / Unselect All Buttons */}
                      <div
                        style={{
                          marginBottom: "10px",
                          display: "flex",
                          gap: "10px",
                        }}>
                        <button
                          style={{
                            padding: "5px 10px",
                            borderRadius: "5px",
                            backgroundColor: "#1890ff",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // Select All
                            const filteredItems = Object.entries(
                              expandedState
                            ).filter(
                              ([id, details]) =>
                                details.label === item.label &&
                                id.toLowerCase().includes(searchQuery)
                            );
                            setExpandedState((prevState) => {
                              const updatedState = { ...prevState };
                              filteredItems.forEach(([id]) => {
                                updatedState[id].visible = true; // Set all to visible
                              });
                              return updatedState;
                            });
                          }}>
                          Select All
                        </button>
                        <button
                          style={{
                            padding: "5px 10px",
                            borderRadius: "5px",
                            backgroundColor: "#ff4d4f",
                            color: "#fff",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            // Unselect All
                            const filteredItems = Object.entries(
                              expandedState
                            ).filter(
                              ([id, details]) =>
                                details.label === item.label &&
                                id.toLowerCase().includes(searchQuery)
                            );
                            setExpandedState((prevState) => {
                              const updatedState = { ...prevState };
                              filteredItems.forEach(([id]) => {
                                updatedState[id].visible = false; // Set all to invisible
                              });
                              return updatedState;
                            });
                          }}>
                          Unselect All
                        </button>
                      </div>

                      {/* List */}
                      <ul
                        style={{
                          marginTop: "2px",
                          maxHeight: "300px",
                          overflowY: "auto",
                          border: "1px solid #d9d9d9",
                          borderRadius: "5px",
                          // backgroundColor: "#f9f9f9",
                          maxWidth: "250px",
                        }}>
                        {Object.entries(expandedState) // Convert top-level object to array of [id, details] pairs
                          .filter(
                            ([id, details]) =>
                              details.label === item.label &&
                              id.toLowerCase().includes(searchQuery) // Filter based on search query
                          )
                          .map(([id, details]) => (
                            <li
                              key={id}
                              style={{
                                listStyle: "none",
                                borderBottom: "1px solid #e8e8e8",
                              }}>
                              <Checkbox
                                checked={details.visible} // Bind to the `visible` property
                                onChange={(e) => {
                                  const isChecked = e.target.checked;

                                  // Update the state using setExpandedState
                                  setExpandedState((prevState) => ({
                                    ...prevState,
                                    [id]: {
                                      ...prevState[id],
                                      visible: isChecked, // Update the visibility for the specific id
                                    },
                                  }));
                                }}>
                                {id}
                              </Checkbox>
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              </dd>
            ))}
          </dl>
        </Col>
      ))}
    </Row>
  );
};

export default Legend;
