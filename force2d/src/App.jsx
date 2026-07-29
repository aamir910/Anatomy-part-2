import React, { useEffect, useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { Card, Select, Row, Col, Button, Modal } from "antd";
import html2canvas from "html2canvas";
import { saveAs } from 'file-saver'; // Added for SVG export
import ForceNetworkGraph from "./forceNetworkGraph/ForceNetworkGraph";
import Legend from "./Legend/Legend";

const DEFAULT_SELECTED_DISEASES = ["Cone-rod dystrophy", "Cone dystrophy"];

const normalizeDiseaseCategory = (category) => {
  if (category == null) return category;
  const aliases = {
    "Eye Nwoplasms": "Eye Neoplasms",
  };
  return aliases[String(category).trim()] || String(category).trim();
};

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [checkedClasses, setCheckedClasses] = useState({
    "Conjunctival Diseases": false,
    "Corneal Diseases": false,
    "Eye Neoplasms": false,
    "Lacrimal Apparatus Diseases": false,
    "Lens Diseases": false,
    "Ocular Hypertension": false,
    "Ocular Motility Disorders": false,
    "Orbital Diseases": false,
    Others: false,
    "Refractive Errors": false,
    "Retinal Diseases": false,
    "Uveal Diseases": false,
    "missense variant": false,
    "inframe deletion": false,
    "frameshift variant": false,
    "intron variant": false,
    "regulatory region variant": false,
    "intergenic variant": false,
    "splice region variant": false,
    "splice donor variant": false,
    "non coding transcript exon variant": false,
    "3 prime UTR variant": false,
    "5 prime UTR variant": false,
    "stop gained": false,
    "synonymous variant": false,
    "TF binding site variant": false,
    "splice acceptor variant": false,
    "downstream gene variant": false,
    "stop lost": false,
    "upstream gene variant": false,
    "inframe insertion": false,
    "protein altering variant": false,
    "Multiple reported": false,
    "rameshift variant": false,
    "0": false,
    "1": false,
    "2": false,
    "3": false,
    "4": false,
    "5": false,
  });

  const [expandedState, setExpandedState] = useState({});
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [selectedDiseases, setSelectedDiseases] = useState(DEFAULT_SELECTED_DISEASES);
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const rowRef = useRef(null);
  const hasInitialFilterApplied = useRef(false);
  const { Option } = Select;

  useEffect(() => {
    fetchExcelFile();
  }, []);

  const fetchExcelFile = async () => {
    try {
      const response = await fetch("/Variant_Disease_final_file_merged.xlsx");
      const data = await response.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log(jsonData, "jsonData");

      const uniqueVariantCategories = [
        ...new Set(jsonData.map((node) => node.variant_category).filter(Boolean)),
      ];
      console.log("Unique variant categories:", uniqueVariantCategories);

      setJsonData(jsonData);
      extractUniqueClasses(jsonData);
      setOriginalData(jsonData);
    } catch (error) {
      console.error("Error reading the Excel file:", error);
    }
  };

  const extractUniqueClasses = (data) => {
    const classes = new Set();
    data.forEach((row) => {
      const classOfNode = row["Disease"];
      if (classOfNode) {
        classes.add(classOfNode);
      }
    });
    setUniqueClasses(Array.from(classes).sort((a, b) => a.localeCompare(b)));
    setSelectedDiseases((prev) => {
      const validDefaults = DEFAULT_SELECTED_DISEASES.filter((disease) => classes.has(disease));
      if (validDefaults.length > 0) {
        return validDefaults;
      }
      return prev;
    });
  };

  const buildExpandedStateFromData = (data) => {
    const initialState = {};

    data.forEach((row) => {
      const disease = row.Disease;
      const gene = row.SNPID;
      const drug = row.Drug_name;

      if (disease && !initialState[disease]) {
        initialState[disease] = {
          visible: false,
          label: normalizeDiseaseCategory(row.Disease_category),
          type: "Disease",
        };
      }

      if (gene && !initialState[gene]) {
        initialState[gene] = {
          visible: false,
          label: row.variant_category,
          type: "Gene",
        };
      }

      if (drug && !initialState[drug]) {
        initialState[drug] = {
          visible: false,
          label: String(row.Phase),
          type: "Drug",
        };
      }
    });

    return initialState;
  };

  const createNodesAndLinks = (data) => {
    const nodesMap = new Map();
    const links = [];

    data.forEach((row) => {
      const disease = row.Disease;
      const gene = row.SNPID;
      const drug = row.Drug_name;
      const class_disease = normalizeDiseaseCategory(row.Disease_category);
      const class_gene = row["variant_category"];
      const class_drug = row.Phase;

      if (disease && !nodesMap.has(disease)) {
        nodesMap.set(disease, {
          id: disease,
          type: "Disease",
          class: class_disease,
        });
      }

      if (gene && !nodesMap.has(gene)) {
        nodesMap.set(gene, {
          id: gene,
          type: "Gene",
          class: class_gene,
          Gene: row.Gene,
          variant_type: row.variant_type,
          Position_hg38: row.Position_hg38,
          Major_allele: row.Major_allele,
          CADD: row.CADD,
          PolyPhen: row.PolyPhen,
          SIFT: row.SIFT,
          Ensembl: row.Ensembl,
          dbsnp: row.dbsnp,
          Gnomad: row.Gnomad,
          GERP: row.GERP,
          protein: row.protein,
        });
      }

      if (drug && !nodesMap.has(drug)) {
        nodesMap.set(drug, {
          id: drug,
          type: "Drug",
          class: class_drug !== undefined && class_drug !== null ? String(class_drug) : class_drug,
          Phase: row.Phase,
          Drug_name: row.Drug_name,
        });
      }

      if (disease && gene) {
        links.push({ source: disease, target: gene, DOIs: row.DOIs });
      }
      if (disease && drug) {
        links.push({ source: disease, target: drug, DOIs: row.DOIs });
      }
    });

    return { nodes: Array.from(nodesMap.values()), links };
  };

  const syncLegendFromGraph = useCallback((graph) => {
    const presentIds = new Set((graph?.nodes || []).map((node) => node.id));
    const presentClasses = new Set(
      (graph?.nodes || []).map((node) => String(node.class))
    );

    setCheckedClasses((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = presentClasses.has(String(key));
      });
      return next;
    });

    setExpandedState((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((id) => {
        next[id] = {
          ...next[id],
          visible: presentIds.has(id),
        };
      });
      return next;
    });
  }, []);

  const applyFilters = useCallback(() => {
    if (!jsonData) return;

    if (selectedDiseases.length === 0) {
      setGraphData({ nodes: [], links: [] });
      syncLegendFromGraph({ nodes: [], links: [] });
      return;
    }

    const diseaseScoped = jsonData.filter((row) =>
      selectedDiseases.includes(row.Disease)
    );

    const scopeIds = new Set();
    const scopeClasses = new Set();
    diseaseScoped.forEach((row) => {
      const disease = row.Disease;
      const gene = row.SNPID;
      const drug = row.Drug_name;
      const diseaseCategory = normalizeDiseaseCategory(row.Disease_category);
      const geneCategory = row.variant_category;
      const phaseValue =
        row?.Phase !== undefined && row?.Phase !== null ? String(row.Phase) : undefined;

      if (disease) scopeIds.add(disease);
      if (gene) scopeIds.add(gene);
      if (drug) scopeIds.add(drug);
      if (diseaseCategory) scopeClasses.add(String(diseaseCategory));
      if (geneCategory) scopeClasses.add(String(geneCategory));
      if (phaseValue) scopeClasses.add(phaseValue);
    });

    const anyVisibleInScope = [...scopeIds].some((id) => expandedState[id]?.visible);

    let activeChecked = checkedClasses;
    let activeExpanded = expandedState;

    if (!anyVisibleInScope) {
      activeChecked = { ...checkedClasses };
      Object.keys(activeChecked).forEach((key) => {
        activeChecked[key] = scopeClasses.has(String(key));
      });

      activeExpanded = { ...expandedState };
      Object.keys(activeExpanded).forEach((id) => {
        activeExpanded[id] = {
          ...activeExpanded[id],
          visible: scopeIds.has(id),
        };
      });

      setCheckedClasses(activeChecked);
      setExpandedState(activeExpanded);
    }

    const filteredData = diseaseScoped.filter((row) => {
      const disease = row.Disease;
      const gene = row.SNPID;
      const drug = row.Drug_name;
      const diseaseCategory = normalizeDiseaseCategory(row.Disease_category);
      const geneCategory = row.variant_category;
      const phaseValue =
        row?.Phase !== undefined && row?.Phase !== null ? String(row.Phase) : undefined;

      const classMatched =
        (diseaseCategory && activeChecked[diseaseCategory]) ||
        (geneCategory && activeChecked[geneCategory]) ||
        (phaseValue && activeChecked[phaseValue]);

      if (!classMatched) {
        return false;
      }

      if (disease && activeExpanded[disease] !== undefined && !activeExpanded[disease].visible) {
        return false;
      }
      if (gene && activeExpanded[gene] !== undefined && !activeExpanded[gene].visible) {
        return false;
      }
      if (drug && activeExpanded[drug] !== undefined && !activeExpanded[drug].visible) {
        return false;
      }

      return true;
    });

    const newGraphData = createNodesAndLinks(filteredData);
    setGraphData(newGraphData);
    syncLegendFromGraph(newGraphData);
  }, [jsonData, selectedDiseases, checkedClasses, expandedState, syncLegendFromGraph]);

  useEffect(() => {
    if (jsonData) {
      setExpandedState(buildExpandedStateFromData(jsonData));
    }
  }, [jsonData]);

  useEffect(() => {
    if (jsonData && selectedDiseases.length > 0 && !hasInitialFilterApplied.current) {
      hasInitialFilterApplied.current = true;
      applyFilters();
    }
  }, [jsonData, selectedDiseases, applyFilters]);

  const handleDiseaseSelectionChange = (value) => {
    setSelectedDiseases(value);
    if (hasInitialFilterApplied.current) {
      setGraphData({ nodes: [], links: [] });
      syncLegendFromGraph({ nodes: [], links: [] });
    }
  };

  const handleOpenBox = () => {
    setIsBoxOpen(true);
  };

  const handleCloseBox = () => {
    setIsBoxOpen(false);
  };

 const exportToExcel = () => {
  if (jsonData) {
    const jsonData2 = jsonData.filter((row) => {
      const disease = row.Disease;
      const gene = row.SNPID;
      const drug = row.Drug_name;
      const class_disease = normalizeDiseaseCategory(row.Disease_category);
      const class_gene = row.variant_category;
      const class_drug = row.Phase;

      if (!checkedClasses[class_disease]) {
        return false;
      }

      if (!checkedClasses[class_gene]) {
        return false;
      }

      if (class_drug && !checkedClasses[class_drug]) {
        return false;
      }

      if (disease && expandedState[disease] !== undefined && !expandedState[disease].visible) {
        return false;
      }

      if (gene && expandedState[gene] !== undefined && !expandedState[gene].visible) {
        return false;
      }

      if (drug && expandedState[drug] !== undefined && !expandedState[drug].visible) {
        return false;
      }

      return true;
    });

    if (jsonData2.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(jsonData2);
      const book = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(book, worksheet, "Filtered_Variant_Disease");
      XLSX.writeFile(book, "Filtered_Variant_Disease_data.xlsx");
    } else {
      console.log("No filtered data to export.");
    }
  } else {
    console.log("No data available to export.");
  }
};

  const exportGraphImage = async (format) => {
    if (rowRef.current) {
      const canvas = await html2canvas(rowRef.current);
      let filename, dataURL;
      
      switch(format) {
        case 'png':
          filename = 'graph_screenshot.png';
          dataURL = canvas.toDataURL('image/png');
          break;
        case 'jpg':
          filename = 'graph_screenshot.jpg';
          dataURL = canvas.toDataURL('image/jpeg');
          break;
        case 'svg':
          filename = 'graph_screenshot.svg';
          const svgData = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}"><image width="${canvas.width}" height="${canvas.height}" href="${canvas.toDataURL('image/png')}"/></svg>`;
          const blob = new Blob([svgData], { type: 'image/svg+xml' });
          saveAs(blob, filename);
          return;
        default:
          return;
      }
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataURL;
      link.click();
    } else {
      console.log("Row element not found.");
    }
  };

  return (
    <div className="app-container" style={{ padding: "2px", width: "100%" }}>
      <Row gutter={16} ref={rowRef}>
        <Col span={5} style={{ minWidth: "16%" }}>
          <Card
            title="Legend Filters"
            bordered
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Legend
              checkedClasses={checkedClasses}
              setCheckedClasses={setCheckedClasses}
              expandedState={expandedState}
              setExpandedState={setExpandedState}
            />
          </Card>
        </Col>

        <Col span={18} style={{ minWidth: "65%" }}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Anatomy variant based categorization</span>
                <Button type="primary" onClick={handleOpenBox}>
                  Export
                </Button>
              </div>
            }
            bordered
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="disease-filter"
                style={{ display: "block", marginBottom: "8px", fontWeight: 500 }}
              >
                Filter by Disease Name
              </label>
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Select
                  id="disease-filter"
                  mode="multiple"
                  showSearch
                  allowClear
                  placeholder="Select one or more diseases"
                  value={selectedDiseases}
                  onChange={handleDiseaseSelectionChange}
                  optionFilterProp="children"
                  style={{ flex: 1 }}
                >
                  {uniqueClasses.map((disease) => (
                    <Option key={disease} value={disease}>
                      {disease}
                    </Option>
                  ))}
                </Select>
                <Button
                  type="primary"
                  onClick={applyFilters}
                  disabled={selectedDiseases.length === 0}
                >
                  Filter Data
                </Button>
              </div>
            </div>

            {graphData.nodes.length > 0 && graphData.links.length > 0 ? (
              <ForceNetworkGraph nodes={graphData.nodes} links={graphData.links} />
            ) : (
              <p
                style={{
                  paddingRight: "45rem",
                  width: "99%",
                  overflow: "hidden",
                }}
              >
                Select diseases and click Filter Data to view the graph.
              </p>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="Export Options"
        open={isBoxOpen}
        onCancel={handleCloseBox}
        footer={null}
      >
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '10px',
            alignItems: 'center'
          }}
        >
          <Button 
            type="primary" 
            size="small"
            style={{ width: '150px' }}
            onClick={exportToExcel}
          >
            Export to Excel
          </Button>
          <Button 
            type="primary" 
            size="small"
            style={{ width: '150px' }}
            onClick={() => exportGraphImage('png')}
          >
            Download as PNG
          </Button>
          <Button 
            type="primary" 
            size="small"
            style={{ width: '150px' }}
            onClick={() => exportGraphImage('jpg')}
          >
            Download as JPG
          </Button>
          <Button 
            type="primary" 
            size="small"
            style={{ width: '150px' }}
            onClick={() => exportGraphImage('svg')}
          >
            Download as SVG
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default App;