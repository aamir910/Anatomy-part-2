
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
        color: "#FFD700", // Dark Gold
        label: "missense variant",
        class: "missense variant",
      },
      {
        shape: "circle",
        color: "#A9A9A9", // Dark Silver
        label: "inframe deletion",
        class: "inframe deletion",
      },
      {
        shape: "circle",
        color: "#8B4513", // Dark Beige
        label: "frameshift variant",
        class: "frameshift variant",
      },
      {
        shape: "circle",
        color: "#483D8B", // Dark Lavender
        label: "intron variant",
        class: "intron variant",
      },
      {
        shape: "circle",
        color: "#8B0000", // Dark Crimson
        label: "regulatory region variant",
        class: "regulatory region variant",
      },
      {
        shape: "circle",
        color: "#008080", // Dark Aqua
        label: "intergenic variant",
        class: "intergenic variant",
      },
      {
        shape: "circle",
        color: "#FF4500", // Dark Orange
        label: "splice region variant",
        class: "splice region variant",
      },
      {
        shape: "circle",
        color: "#556B2F", // Dark Olive
        label: "splice donor variant",
        class: "splice donor variant",
      },
      {
        shape: "circle",
        color: "#8B4513", // Dark Peru
        label: "non coding transcript exon variant",
        class: "non coding transcript exon variant",
      },
      {
        shape: "circle",
        color: "#4682B4", // Dark Blue
        label: "3 prime UTR variant",
        class: "3 prime UTR variant",
      },
      {
        shape: "circle",
        color: "#B8860B", // Dark Goldenrod
        label: "5 prime UTR variant",
        class: "5 prime UTR variant",
      },
      {
        shape: "circle",
        color: "#228B22", // Dark Green
        label: "stop gained",
        class: "stop gained",
      },
      {
        shape: "circle",
        color: "#008B8B", // Dark Turquoise
        label: "synonymous variant",
        class: "synonymous variant",
      },
      {
        shape: "circle",
        color: "#4682B4", // Dark Steel Blue
        label: "TF binding site variant",
        class: "TF binding site variant",
      },
      {
        shape: "circle",
        color: "#9932CC", // Dark Orchid
        label: "splice acceptor variant",
        class: "splice acceptor variant",
      },
      {
        shape: "circle",
        color: "#FF6347", // Dark Coral
        label: "downstream gene variant",
        class: "downstream gene variant",
      },
      {
        shape: "circle",
        color: "#8B4513", // Dark Chocolate
        label: "stop lost",
        class: "stop lost",
      },
      {
        shape: "circle",
        color: "#D2691E", // Dark Tan
        label: "upstream gene variant",
        class: "upstream gene variant",
      },
      {
        shape: "circle",
        color: "#20B2AA", // Dark Light Sea Green
        label: "frameshift variant",
        class: "frameshift variant",
      },
      {
        shape: "circle",
        color: "#8B008B", // Dark Medium Violet Red
        label: "inframe insertion",
        class: "inframe insertion",
      },
      {
        shape: "circle",
        color: "#5F9EA0", // Dark Powder Blue
        label: "protein altering variant",
        class: "protein altering variant",
      },
    ]
    
    
  },
];



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
  const [expandedClasses, setExpandedClasses] = useState({});
  const [searchQueries, setSearchQueries] = useState({});


  const toggleExpand = (className) => {
    setExpandedClasses((prev) => ({
      ...prev,
      [className]: !prev[className],
    }));
  };

  return (
    <Row style={{ 
      maxHeight: "100vh",
      overflowY: "auto",
      scrollbarWidth: "thin",
      scrollbarColor: "#888 #f1f1f1"
    }}>
      {legendItems.map((group, groupIndex) => (
        <Col
          key={groupIndex}
          span={24}
          style={{ marginTop: group.group === "" ? "25px" : "0" }}
        >
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
                />
              </div>
            </dt>

            {group.items.map((item, index) => (
              <dd
                key={index}
                style={{
                  marginBottom: "8px",
                  display: "flex",
                  flexDirection: "column",
                  marginLeft: 0,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{ cursor: "pointer", marginRight: "8px" }}
                    onClick={() => toggleExpand(item.class)}
                  >
                    {expandedClasses[item.class] ? "▼" : "▶"}
                  </div>

                  {/* Shape Display */}
                  <div style={{ margin: "5px" }}>
                    {item.shape === "triangle" && (
                      <svg width="20" height="20">
                        <polygon points="10,0 0,20 20,20" fill={item.color} />
                      </svg>
                    )}
                    {item.shape === "circle" && (
                      <svg width="20" height="20">
                        <polygon
                          points="10,0 19,7 15,19 5,19 1,7"
                          fill={item.color}
                        />
                      </svg>
                    )}
                  </div>

                  <Checkbox
                    checked={checkedClasses[item.class]}
                    onChange={(e) => onClassChange(item.class, e.target.checked)}
                    style={{ marginLeft: "8px" }}
                  />
                  <span style={{ marginLeft: "8px" }}>{item.label}</span>
                </div>

                {expandedClasses[item.class] && (
                  <div style={{ marginLeft: "32px", maxWidth: "250px" }}>
                    <Input
                      placeholder="Search..."
                      value={searchQueries[item.class] || ""}
                      onChange={(e) => setSearchQueries(prev => ({
                        ...prev,
                        [item.class]: e.target.value.toLowerCase()
                      }))}
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
                          const filtered = Object.entries(expandedState)
                            .filter(([id, details]) => 
                              details.label === item.label &&
                              id.toLowerCase().includes(query)
                            );

                          setExpandedState(prev => {
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
                          const filtered = Object.entries(expandedState)
                            .filter(([id, details]) => 
                              details.label === item.label &&
                              id.toLowerCase().includes(query)
                            );

                          setExpandedState(prev => {
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
                            details.label === item.label &&
                            id.toLowerCase().includes(query)
                          );
                        })
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
                              onChange={(e) => setExpandedState(prev => ({
                                ...prev,
                                [id]: { ...prev[id], visible: e.target.checked }
                              }))}
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