import React, { useRef, useEffect, useMemo, useState } from "react";
import { ForceGraph2D } from "react-force-graph";
import { Table, Button, AutoComplete } from "antd"; // Ant Design components

const ForceNetworkGraph = ({ nodes, links }) => {
  const graphRef = useRef();
  const [selectedNode, setSelectedNode] = useState(null); // State to manage selected node

  console.log("node", nodes, "link", links);

  // Prepare graph data format for ForceGraph
  const graphData = useMemo(
    () => ({
      nodes: nodes.map((node) => ({
        id: node.id,
        group: node.type,
        class: node.class,
        Phenotypes: node.Phenotypes,
        Gene: node.Gene,
        Name: node.Name,
        variant_type  : node.variant_type  ,
        Position_hg38: node.Position_hg38,
        Major_allele: node.Major_allele,
        CADD: node.CADD,
        PolyPhen: node.PolyPhen,
        SIFT: node.SIFT,
        Ensembl: node.Ensembl,
        dbsnp: node.dbsnp,
        Gnomad: node.Gnomad,
        GERP: node.GERP,
        protein: node.protein,
        Phase: node.Phase,
        Drug_name: node.Drug_name,
      })),
      links: links.map((link) => ({
        source: link.source,
        target: link.target,
        DOIs: link.DOIs,
        group: "link",
      })),
    }),
    [nodes, links]
  );

  // Function to draw different node shapes based on the group and class
  const getNodeColor = (nodeClass) => {
    // Handle numeric phase values
    if (typeof nodeClass === 'number' || (typeof nodeClass === 'string' && !isNaN(nodeClass))) {
      const phaseNum = parseInt(nodeClass);
      switch (phaseNum) {
        case 0:
          return "#FF6B6B"; // Red
        case 1:
          return "#4ECDC4"; // Teal
        case 2:
          return "#45B7D1"; // Blue
        case 3:
          return "#96CEB4"; // Green
        case 4:
          return "#FFEAA7"; // Yellow
        case 5:
          return "#DDA0DD"; // Purple
        default:
          return "black";
      }
    }
    
    switch (nodeClass) {
      // Existing cases
      case "Refractive Errors":
        return "red"; // Color from items array
      case "Retinal Diseases":
        return "blue";
      case "Others":
        return "green";
      case "Lens Diseases":
        return "orange";
      case "Ocular Hypertension":
        return "purple";
      case "Ocular Motility Disorders":
        return "pink";
      case "Uveal Diseases":
        return "cyan";
      case "Corneal Diseases":
        return "magenta";
      case "Conjunctival Diseases":
        return "red";
      case "Orbital Diseases":
        return "teal";
      case "Eye Neoplasms":
        return "salmon";
      case "Lacrimal Apparatus Diseases":
        return "violet";

      // New cases with unique colors
      case "missense variant":
        return "#FFD700"; // Dark Gold
      case "inframe deletion":
        return "#A9A9A9"; // Dark Silver
      case "frameshift variant":
        return "#8B4513"; // Dark Beige
      case "intron variant":
        return "#483D8B"; // Dark Lavender
      case "regulatory region variant":
        return "#8B0000"; // Dark Crimson
      case "intergenic variant":
        return "#008080"; // Dark Aqua
      case "missense variant&NMD transcript variant":
        return "#4B0082"; // Indigo
      case "splice acceptor variant&NMD transcript variant":
        return "#800000"; // Maroon
      case "splice region variant":
        return "#FF4500"; // Dark Orange
      case "splice donor variant":
        return "#556B2F"; // Dark Olive
      case "non coding transcript exon variant":
        return "#8B4513"; // Dark Peru
      case "3 prime UTR variant":
        return "#4682B4"; // Dark Blue
      case "5 prime UTR variant":
        return "#B8860B"; // Dark Goldenrod
      case "stop gained":
        return "#228B22"; // Dark Green
      case "synonymous variant":
        return "#008B8B"; // Dark Turquoise
      case "TF binding site variant":
        return "#4682B4"; // Dark Steel Blue
      case "splice acceptor variant":
        return "#9932CC"; // Dark Orchid
      case "downstream gene variant":
        return "#FF6347"; // Dark Coral
      case "stop lost":
        return "#8B4513"; // Dark Chocolate
      case "missense variant&splice region variant":
        return "#000080"; // Navy
      case "frameshift variant&splice region variant":
        return "#BDB76B"; // Dark Khaki
      case "splice region variant&intron variant":
        return "#2E8B57"; // Sea Green
      case "plice region variant":
        return "#FF1493"; // Deep Pink
      case "stop gained&splice region variant":
        return "#8B4513"; // Wheat-like Dark Tan
      case "non coding transcript exon variant; intron variant; intron variant":
        return "#DDA0DD"; // Plum
      case "splice region variant&synonymous variant":
        return "#00CED1"; // Dark Cyan
      case "intron variant&NMD transcript variant":
        return "#ADFF2F"; // Green Yellow
      case "3 prime UTR variant&NMD transcript variant":
        return "#BA55D3"; // Medium Orchid
      case "intergenic variant x intron variant":
        return "#2F4F4F"; // Dark Slate Gray
      case "splice acceptor variant&non coding transcript variant":
        return "#8B0000"; // Light Coral-like Crimson
      case "upstream gene variant":
        return "#D2691E"; // Dark Tan
      case "rameshift variant":
        return "#20B2AA"; // Dark Light Sea Green
      case "inframe insertion":
        return "#8B008B"; // Dark Medium Violet Red
      case "protein altering variant":
        return "#5F9EA0"; // Dark Powder Blue
      case "non coding transcript exon variant&non coding transcript variant":
        return "#CD853F"; // Peach Puff-like Dark Saddle Brown
      case "5 prime UTR variant&NMD transcript variant":
        return "#006400"; // Dark Green
      case "splice donor variant&NMD transcript variant":
        return "#BDB76B"; // Dark Khaki
      case "intron variant; intron variant; TF binding site variant":
        return "#FF1493"; // Deep Pink
      
      // Default case
      default:
        return "black"; // Default color if class not found
    }
  };

  const drawNode = (node, ctx) => {
    const shapeSize = 10; // Define the size of the shape
    const color = getNodeColor(node.class); // Get color based on class
    ctx.beginPath();
    ctx.fillStyle = color;

    if (node.group === "Disease") {
      // Draw triangle for 'Disease'
      ctx.moveTo(node.x, node.y - shapeSize);
      ctx.lineTo(node.x - shapeSize, node.y + shapeSize);
      ctx.lineTo(node.x + shapeSize, node.y + shapeSize);
      ctx.closePath();
    } else if (node.group === "Gene") {
      // Draw pentagon for 'Gene'
      const sides = 5;
      const angle = (2 * Math.PI) / sides;

      ctx.moveTo(
        node.x + shapeSize * Math.cos(0),
        node.y + shapeSize * Math.sin(0)
      );

      for (let i = 1; i <= sides; i++) {
        ctx.lineTo(
          node.x + shapeSize * Math.cos(i * angle),
          node.y + shapeSize * Math.sin(i * angle)
        );
      }
      ctx.closePath();
    } else if (node.group === "Drug") {
      // Draw square for 'Drug'
   const w = shapeSize * 2;
  const h = shapeSize;
  const r = h / 2;

  const x = node.x - w / 2;
  const y = node.y - h / 2;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);

  ctx.fill();
  ctx.stroke();   }

    ctx.fill();

    // Optional: Add node ID label next to each node
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    // ctx.fillText(node.id, node.x + shapeSize + 5, node.y);
  };

  // Handle node click to set selected node
  const handleNodeClick = (node) => {
    setSelectedNode(node); // Set the selected node for table
  };

  // Set link distance and other forces
  useEffect(() => {
    if (graphRef.current) {
      graphRef.current.d3Force("link").distance(150); // Set link distance
    }
  }, [graphData]);

  return (
    <div style={{ width: "99%", height: "100vh", overflow: "hidden" }}>
      <ForceGraph2D
        ref={graphRef}
        graphData={graphData}
        nodeCanvasObject={drawNode}
        linkWidth={2}
        backgroundColor="white"
        nodeRelSize={10}
        enableZoomInteraction={true}
        onNodeClick={handleNodeClick} // Handle node click
        onLinkClick={handleNodeClick} // Handle link click
        nodeLabel={(node) => {
          return `<div style="background-color: black; color: white; padding: 5px; border-radius: 4px;">${node.id}</div>`;
        }}
      />
      {selectedNode && (
        <DataTable
          node={selectedNode}
          onClose={() => setSelectedNode(null)}
          size="small"
          className="compact-table"
        />
      )}
    </div>
  );
};

const renderPhenotypes = (text) => {
  if (!text) return "N/A";

  // Ensure text is properly parsed as a string
  if (typeof text !== "string") {
    return "Invalid data";
  }

  // Split the string by ";"
  const phenotypeArray = text.split(";");

  // Process each phenotype
  return phenotypeArray.map((item, index) => {
    // Match OMIM entries in the item
    const omimMatch = item.match(/OMIM:(\d+)/);

    if (omimMatch) {
      const omimId = omimMatch[1]; // Extract OMIM ID
      const parts = item.split(`OMIM:${omimId}`); // Split the text into parts
      return (
        <div key={index}>
          {parts[0]}
          {/* Render text before OMIM */}
          <a
            href={`https://omim.org/entry/${omimId}`}
            target="_blank"
            rel="noopener noreferrer">
            OMIM:{omimId}
          </a>
          {parts[1]}
          {/* Render text after OMIM */}
        </div>
      );
    }

    return <div key={index}>{item}</div>; // Return item as-is if no OMIM link
  });
};

// DataTable component to display node details

const DataTable = ({ node, onClose }) => {
  // Define the columns for the Ant Design table
  const columns = [
    {
      title: "Property",
      dataIndex: "property",
      key: "property",
      render: (text) => (
        <div style={{ paddingTop: "1px", paddingBottom: "1px" }}>{text}</div>
      ),
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      render: (text, record) => {
        // Check if the property should be clickable
        if (
          ["Ensembl", "dbsnp", "Gnomad"].includes(
            record.property
          )
        ) {
          const url = node[record.property];
          return url ? (
            <a href={url} target="_blank" rel="noopener noreferrer">
              click here
            </a>
          ) : (
            "N/A"
          );
        } else if (node.group === "link") {
          // Split DOI entries by "; " and display each on a new line as clickable links
          if (text) {
            const doiList = text.split(";").map((doi, index) => {
              const trimmedDOI = doi.trim();
              const doiLink = `https://doi.org/${trimmedDOI}`;
              return (
                <div key={index}>
                  <a href={doiLink} target="_blank" rel="noopener noreferrer">
                    {trimmedDOI}
                  </a>
                </div>
              );
            });
            return doiList.length ? doiList : "N/A";
          }
        } else if (record.property === "Phenotypes") {
          return (
            <div
              style={{
                maxHeight: "300px",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
                backgroundColor: "#f9f9f9",
              }}>
              {renderPhenotypes(text)}
            </div>
          );
        }
        return text;
      },
    },
  ];

  // Conditionally add data based on the node.group value
  let dataSource = [];

  if (node.group === "Disease") {
    dataSource = [
      { key: "Phenotypes", property: "Phenotypes", value: node.Phenotypes },
    ];
  } else if (node.group === "Drug") {
    dataSource = [
      { key: "Drug_name", property: "Drug Name", value: node.Drug_name },
      { key: "Phase", property: "Phase", value: `Phase ${node.Phase}` },
    ];
  } else if (node.group === "link") {
    dataSource = [{ key: "DOIs", property: "DOIs", value: node.DOIs }];
  } else {
    dataSource = [
      { key: "Gene", property: "Gene", value: node.Gene },
      { key: "variant_type", property: "variant_type", value: node.variant_type  },
      { key: "Position_hg38", property: "Position_hg38", value: node.Position_hg38 },
      { key: "Major_allele", property: "Major_allele", value: node.Major_allele },
      { key: "CADD", property: "CADD", value: node.CADD },
      { key: "SIFT", property: "SIFT", value: node.SIFT },
      { key: "GERP", property: "GERP", value: node.GERP },
      { key: "protein", property: "protein", value: node.protein },
     { key: "Ensembl", property: "Ensembl", value: node.Ensembl },
      { key: "dbsnp", property: "dbsnp", value: node.dbsnp },
      { key: "Gnomad", property: "Gnomad", value: node.Gnomad },
     
    ];
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 5,
        boxShadow: "0px 0px 10px rgba(0,0,0,0.2)",
        zIndex: 10,
        width: "auto",
      }}>
      <h2>{node.id}</h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        size="small"
      />
      <Button type="primary" onClick={onClose} style={{ marginTop: "10px" }}>
        Close
      </Button>
    </div>
  );
};

export default ForceNetworkGraph;
