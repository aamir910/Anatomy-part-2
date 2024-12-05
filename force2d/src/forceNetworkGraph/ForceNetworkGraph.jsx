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
        return "gold";
      case "inframe deletion":
        return "silver";
      case "frameshift variant":
        return "beige";
      case "intron variant":
        return "lavender";
      case "regulatory region variant":
        return "crimson";
      case "intergenic variant":
        return "aqua";
      case "missense variant&NMD transcript variant":
        return "indigo";
      case "splice acceptor variant&NMD transcript variant":
        return "maroon";
      case "splice region variant":
        return "darkorange";
      case "splice donor variant":
        return "olive";
      case "non coding transcript exon variant":
        return "peru";
      case "3 prime UTR variant":
        return "lightblue";
      case "5 prime UTR variant":
        return "darkgoldenrod";
      case "stop gained":
        return "limegreen";
      case "synonymous variant":
        return "turquoise";
      case "TF binding site variant":
        return "steelblue";
      case "splice acceptor variant":
        return "orchid";
      case "downstream gene variant":
        return "coral";
      case "stop lost":
        return "chocolate";
      case "missense variant&splice region variant":
        return "navy";
      case "frameshift variant&splice region variant":
        return "khaki";
      case "splice region variant&intron variant":
        return "seagreen";
      case "plice region variant":
        return "hotpink";
      case "stop gained&splice region variant":
        return "wheat";
      case "non coding transcript exon variant; intron variant; intron variant":
        return "plum";
      case "splice region variant&synonymous variant":
        return "cyan";
      case "intron variant&NMD transcript variant":
        return "greenyellow";
      case "3 prime UTR variant&NMD transcript variant":
        return "mediumorchid";
      case "intergenic variant x intron variant":
        return "darkslategray";
      case "splice acceptor variant&non coding transcript variant":
        return "lightcoral";
      case "upstream gene variant":
        return "tan";
      case "rameshift variant":
        return "lightseagreen";
      case "inframe insertion":
        return "mediumvioletred";
      case "protein altering variant":
        return "powderblue";
      case "non coding transcript exon variant&non coding transcript variant":
        return "peachpuff";
      case "5 prime UTR variant&NMD transcript variant":
        return "lightgreen";
      case "splice donor variant&NMD transcript variant":
        return "darkkhaki";
      case "intron variant; intron variant; TF binding site variant":
        return "deeppink";

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
    }

    ctx.fill();

    // Optional: Add node ID label next to each node
    ctx.fillStyle = "black";
    ctx.font = "10px Arial";
    ctx.fillText(node.id, node.x + shapeSize + 5, node.y);
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
