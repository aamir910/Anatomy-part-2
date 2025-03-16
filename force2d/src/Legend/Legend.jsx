import { React, useState, useEffect } from "react";
import { Row, Col, Checkbox, Input, Button } from "antd";
import ToggleCategory from "./ToggleCategory";

const Legend = ({
  checkedClasses,
  onClassChange,
  selectedValues,
  setCheckedClasses,
  expandedState,
  setExpandedState,
  onFilterData,
}) => {
  const [expandedClasses, setExpandedClasses] = useState({});
  const [searchQueries, setSearchQueries] = useState({});

  const legendItems = [
    {
      group: "Disease",
      items: [
        { shape: "triangle", color: "red", label: "Refractive Errors", class: "Refractive Errors" },
        { shape: "triangle", color: "blue", label: "Retinal Diseases", class: "Retinal Diseases" },
        { shape: "triangle", color: "green", label: "Others", class: "Others" },
        { shape: "triangle", color: "orange", label: "Lens Diseases", class: "Lens Diseases" },
        { shape: "triangle", color: "purple", label: "Ocular Hypertension", class: "Ocular Hypertension" },
        { shape: "triangle", color: "pink", label: "Ocular Motility Disorders", class: "Ocular Motility Disorders" },
        { shape: "triangle", color: "cyan", label: "Uveal Diseases", class: "Uveal Diseases" },
        { shape: "triangle", color: "magenta", label: "Corneal Diseases", class: "Corneal Diseases" },
        { shape: "triangle", color: "lime", label: "Conjunctival Diseases", class: "Conjunctival Diseases" },
        { shape: "triangle", color: "teal", label: "Orbital Diseases", class: "Orbital Diseases" },
        { shape: "triangle", color: "salmon", label: "Eye Neoplasms", class: "Eye Neoplasms" },
        { shape: "triangle", color: "violet", label: "Lacrimal Apparatus Diseases", class: "Lacrimal Apparatus Diseases" },
      ],
    },
    {
      group: "Variant",
      items: [
        { shape: "circle", color: "#FFD700", label: "missense variant", class: "missense variant" },
        { shape: "circle", color: "#A9A9A9", label: "inframe deletion", class: "inframe deletion" },
        { shape: "circle", color: "#8B4513", label: "frameshift variant", class: "frameshift variant" },
        { shape: "circle", color: "#483D8B", label: "intron variant", class: "intron variant" },
        { shape: "circle", color: "#8B0000", label: "regulatory region variant", class: "regulatory region variant" },
        { shape: "circle", color: "#008080", label: "intergenic variant", class: "intergenic variant" },
        { shape: "circle", color: "#FF4500", label: "splice region variant", class: "splice region variant" },
        { shape: "circle", color: "#556B2F", label: "splice donor variant", class: "splice donor variant" },
        { shape: "circle", color: "#8B4513", label: "non coding transcript exon variant", class: "non coding transcript exon variant" },
        { shape: "circle", color: "#4682B4", label: "3 prime UTR variant", class: "3 prime UTR variant" },
        { shape: "circle", color: "#B8860B", label: "5 prime UTR variant", class: "5 prime UTR variant" },
        { shape: "circle", color: "#228B22", label: "stop gained", class: "stop gained" },
        { shape: "circle", color: "#008B8B", label: "synonymous variant", class: "synonymous variant" },
        { shape: "circle", color: "#4682B4", label: "TF binding site variant", class: "TF binding site variant" },
        { shape: "circle", color: "#9932CC", label: "splice acceptor variant", class: "splice acceptor variant" },
        { shape: "circle", color: "#FF6347", label: "downstream gene variant", class: "downstream gene variant" },
        { shape: "circle", color: "#8B4513", label: "stop lost", class: "stop lost" },
        { shape: "circle", color: "#D2691E", label: "upstream gene variant", class: "upstream gene variant" },
        { shape: "circle", color: "#20B2AA", label: "frameshift variant", class: "frameshift variant" },
        { shape: "circle", color: "#8B008B", label: "inframe insertion", class: "inframe insertion" },
        { shape: "circle", color: "#5F9EA0", label: "protein altering variant", class: "protein altering variant" },
      ],
    },
  ];

  // New state to track indeterminate status for each main category checkbox
  const [indeterminateState, setIndeterminateState] = useState({});

  // Effect to synchronize main category checkboxes and handle indeterminate state
  useEffect(() => {
    if (!expandedState || !checkedClasses) return;

    const updatedCheckedClasses = { ...checkedClasses };
    const updatedIndeterminateState = {};

    legendItems.forEach(group => {
      group.items.forEach(item => {
        const relatedExpandedItems = Object.entries(expandedState).filter(
          ([_, details]) => details.label === item.label
        );

        if (relatedExpandedItems.length > 0) {
          const allExpandedChecked = relatedExpandedItems.every(
            ([_, details]) => details.visible
          );
          const anyExpandedChecked = relatedExpandedItems.some(
            ([_, details]) => details.visible
          );

          // Logic for checked and indeterminate states
          if (allExpandedChecked) {
            updatedCheckedClasses[item.class] = true;
            updatedIndeterminateState[item.class] = false;
          } else if (anyExpandedChecked) {
            updatedCheckedClasses[item.class] = true; // Partially checked, so main checkbox is checked
            updatedIndeterminateState[item.class] = true; // Indeterminate state
          } else {
            updatedCheckedClasses[item.class] = false;
            updatedIndeterminateState[item.class] = false;
          }
        }
      });
    });

    if (JSON.stringify(updatedCheckedClasses) !== JSON.stringify(checkedClasses)) {
      setCheckedClasses(updatedCheckedClasses);
    }
    setIndeterminateState(updatedIndeterminateState);
  }, [expandedState, checkedClasses, legendItems, setCheckedClasses]);

  const handleMainCategoryChange = (className, checked) => {
    onClassChange(className, checked);

    let targetItem = null;
    legendItems.forEach(group => {
      group.items.forEach(item => {
        if (item.class === className) {
          targetItem = item;
        }
      });
    });

    if (targetItem) {
      setExpandedState(prev => {
        const updated = { ...prev };
        Object.entries(updated).forEach(([id, details]) => {
          if (details.label === targetItem.label) {
            updated[id] = { ...details, visible: checked };
          }
        });
        return updated;
      });
      // Clear indeterminate state when manually checking/unchecking
      setIndeterminateState(prev => ({ ...prev, [className]: false }));
    }
  };

  const toggleExpand = (className) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [className]: !prev[className],
    }));
  };

  const handleFilterData = () => {
    const selectedClasses = Object.entries(checkedClasses)
      .filter(([_, checked]) => checked)
      .map(([className]) => className);

    const selectedExpandedItems = Object.entries(expandedState)
      .filter(([_, details]) => details.visible)
      .map(([id]) => id);

    onFilterData({
      selectedClasses,
      selectedExpandedItems,
    });
  };

  return (
    <Row style={{ maxHeight: "100vh", overflowY: "auto", scrollbarWidth: "thin", scrollbarColor: "#888 #f1f1f1" }}>
      <Col span={24} style={{ marginBottom: "10px" }}>
        <Button type="primary" onClick={handleFilterData} style={{ width: "70%", maxWidth: "250px" }}>
          Filter Data
        </Button>
      </Col>

      {legendItems.map((group, groupIndex) => (
        <Col key={groupIndex} span={24} style={{ marginTop: group.group === "" ? "25px" : "0" }}>
          <dl style={{ margin: 0, padding: 0 }}>
            <dt
              style={{
                fontWeight: "bold",
                display: "flex",
                alignItems: "start",
                justifyContent: "flex-start",
                fontSize: "15px",
                marginBottom: "10px",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {group.group}
                <ToggleCategory
                  type={group.group}
                  legendItems={legendItems}
                  checkedClasses={checkedClasses}
                  setCheckedClasses={setCheckedClasses}
                  expandedState={expandedState}
                  setExpandedState={setExpandedState}
                />
              </div>
            </dt>

            {group.items.map((item, index) => (
              <dd key={index} style={{ marginBottom: "8px", display: "flex", flexDirection: "column", marginLeft: 0 }}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ cursor: "pointer", marginRight: "8px" }} onClick={() => toggleExpand(item.class)}>
                    {expandedClasses[item.class] ? "▼" : "▶"}
                  </div>

                  <div style={{ margin: "5px" }}>
                    {item.shape === "triangle" && (
                      <svg width="20" height="20">
                        <polygon points="10,0 0,20 20,20" fill={item.color} />
                      </svg>
                    )}
                    {item.shape === "circle" && (
                      <svg width="20" height="20">
                        <circle cx="10" cy="10" r="10" fill={item.color} />
                      </svg>
                    )}
                  </div>

                  <Checkbox
                    checked={checkedClasses[item.class]}
                    indeterminate={indeterminateState[item.class]} // Add indeterminate prop
                    onChange={(e) => handleMainCategoryChange(item.class, e.target.checked)}
                    style={{ marginLeft: "8px" }}
                  />
                  <span style={{ marginLeft: "8px" }}>{item.label}</span>
                </div>

                {expandedClasses[item.class] && (
                  <div style={{ marginLeft: "32px", maxWidth: "250px" }}>
                    <Input
                      placeholder="Search..."
                      value={searchQueries[item.class] || ""}
                      onChange={(e) =>
                        setSearchQueries((prev) => ({
                          ...prev,
                          [item.class]: e.target.value.toLowerCase(),
                        }))
                      }
                      style={{ marginBottom: "10px" }}
                    />

                    <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                      <button
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#1890ff",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const query = searchQueries[item.class] || "";
                          const filtered = Object.entries(expandedState).filter(
                            ([id, details]) =>
                              details.label === item.label && id.toLowerCase().includes(query)
                          );

                          setExpandedState((prev) => {
                            const updated = { ...prev };
                            filtered.forEach(([id]) => {
                              updated[id].visible = true;
                            });
                            return updated;
                          });
                        }}
                      >
                        Select All
                      </button>
                      <button
                        style={{
                          padding: "4px 8px",
                          backgroundColor: "#ff4d4f",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          const query = searchQueries[item.class] || "";
                          const filtered = Object.entries(expandedState).filter(
                            ([id, details]) =>
                              details.label === item.label && id.toLowerCase().includes(query)
                          );

                          setExpandedState((prev) => {
                            const updated = { ...prev };
                            filtered.forEach(([id]) => {
                              updated[id].visible = false;
                            });
                            return updated;
                          });
                        }}
                      >
                        Unselect All
                      </button>
                    </div>

                    <ul
                      style={{
                        maxHeight: "300px",
                        overflowY: "auto",
                        border: "1px solid #d9d9d9",
                        borderRadius: "4px",
                        padding: "8px",
                        listStyle: "none",
                        margin: 0,
                      }}
                    >
                      {Object.entries(expandedState)
                        .filter(([id, details]) => {
                          const query = searchQueries[item.class] || "";
                          return (
                            details.label === item.label && id.toLowerCase().includes(query)
                          );
                        })
                        .sort(([idA], [idB]) => idA.localeCompare(idB))
                        .map(([id, details]) => (
                          <li
                            key={id}
                            style={{
                              padding: "4px 0",
                              borderBottom: "1px solid #f0f0f0",
                            }}
                          >
                            <Checkbox
                              checked={details.visible}
                              onChange={(e) =>
                                setExpandedState((prev) => ({
                                  ...prev,
                                  [id]: { ...prev[id], visible: e.target.checked },
                                }))
                              }
                            >
                              {id}
                            </Checkbox>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
              </dd>
            ))}
          </dl>
        </Col>
      ))}
    </Row>
  );
};

export default Legend;