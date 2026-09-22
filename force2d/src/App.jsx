import React, { useEffect, useState, useRef, useCallback } from "react";
import * as XLSX from "xlsx";
import { Card, Select, Row, Col, Button, Modal } from "antd";
import html2canvas from "html2canvas";
import { saveAs } from 'file-saver'; // Added for SVG export
import ForceNetworkGraph from "./forceNetworkGraph/ForceNetworkGraph";
import Legend from "./Legend/Legend";

const DEFAULT_FILTER_TYPE = "disease_name";
const DEFAULT_SELECTED_DISEASES = ["Cone-rod dystrophy", "Cone dystrophy"];

const FILTER_TYPE_OPTIONS = [
  { value: "disease_name", label: "Disease Name" },
  { value: "disease_class", label: "Disease Class" },
  { value: "variant_category", label: "Variant Category" },
  { value: "snp_id", label: "Gene/SNP" },
  { value: "drug_name", label: "Drug Name" },
  { value: "drug_phase", label: "Drug Phase" },
];

const FILTER_VALUE_PLACEHOLDERS = {
  disease_name: "Select one or more disease names",
  disease_class: "Select one or more disease classes",
  variant_category: "Select one or more variant categories",
  snp_id: "Select one or more genes/SNPs",
  drug_name: "Select one or more drug names",
  drug_phase: "Select one or more drug phases",
};

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
  const [availableClasses, setAvailableClasses] = useState({
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
  const [availableIds, setAvailableIds] = useState({});
  const [filterType, setFilterType] = useState(DEFAULT_FILTER_TYPE);
  const [selectedFilterValues, setSelectedFilterValues] = useState(DEFAULT_SELECTED_DISEASES);
  const [filterOptions, setFilterOptions] = useState({
    disease_name: [],
    disease_class: [],
    variant_category: [],
    snp_id: [],
    drug_name: [],
    drug_phase: [],
  });
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
      extractFilterOptions(jsonData);
      setOriginalData(jsonData);
    } catch (error) {
      console.error("Error reading the Excel file:", error);
    }
  };

  const extractFilterOptions = (data) => {
    const diseaseNames = new Set();
    const diseaseClasses = new Set();
    const variantCategories = new Set();
    const snpIds = new Set();
    const drugNames = new Set();
    const drugPhases = new Set();

    data.forEach((row) => {
      if (row.Disease) diseaseNames.add(row.Disease);
      const diseaseClass = normalizeDiseaseCategory(row.Disease_category);
      if (diseaseClass) diseaseClasses.add(diseaseClass);
      if (row.variant_category) variantCategories.add(row.variant_category);
      if (row.SNPID) snpIds.add(row.SNPID);
      if (row.Gene) snpIds.add(row.Gene);
      if (row.Drug_name) drugNames.add(row.Drug_name);
      if (row.Phase !== undefined && row.Phase !== null && row.Phase !== "") {
        drugPhases.add(String(row.Phase));
      }
    });

    const sorted = (set) => Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));

    setFilterOptions({
      disease_name: sorted(diseaseNames),
      disease_class: sorted(diseaseClasses),
      variant_category: sorted(variantCategories),
      snp_id: sorted(snpIds),
      drug_name: sorted(drugNames),
      drug_phase: sorted(drugPhases),
    });

    const validDefaults = DEFAULT_SELECTED_DISEASES.filter((disease) =>
      diseaseNames.has(disease)
    );
    if (validDefaults.length > 0) {
      setSelectedFilterValues(validDefaults);
    }
  };

  const rowMatchesPrimaryFilter = (row, type, values) => {
    if (!values.length) return false;

    switch (type) {
      case "disease_name":
        return values.includes(row.Disease);
      case "disease_class":
        return values.includes(normalizeDiseaseCategory(row.Disease_category));
      case "variant_category":
        return values.includes(row.variant_category);
      case "snp_id":
        return values.includes(row.SNPID) || values.includes(row.Gene);
      case "drug_name":
        return values.includes(row.Drug_name);
      case "drug_phase":
        return (
          row.Phase !== undefined &&
          row.Phase !== null &&
          values.includes(String(row.Phase))
        );
      default:
        return false;
    }
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

    setAvailableClasses((prev) => {
      const next = { ...prev };
      Object.keys(next).forEach((key) => {
        next[key] = presentClasses.has(String(key));
      });
      presentClasses.forEach((cls) => {
        next[cls] = true;
      });
      return next;
    });

    setAvailableIds(() => {
      const next = {};
      presentIds.forEach((id) => {
        next[id] = true;
      });
      return next;
    });

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

  const handleClassCheckboxChange = (className, checked) => {
    setCheckedClasses((prev) => ({
      ...prev,
      [className]: checked,
    }));
  };

  const applyFilters = useCallback(() => {
    if (!jsonData) return;

    if (selectedFilterValues.length === 0) {
      setGraphData({ nodes: [], links: [] });
      syncLegendFromGraph({ nodes: [], links: [] });
      return;
    }

    const hasLegendChecks = Object.values(checkedClasses).some(Boolean);

    const filteredData = jsonData.filter((row) => {
      if (!rowMatchesPrimaryFilter(row, filterType, selectedFilterValues)) {
        return false;
      }

      if (!hasLegendChecks) {
        return true;
      }

      const diseaseCategory = normalizeDiseaseCategory(row.Disease_category);
      const variantCategory = row.variant_category;
      const drugCategory =
        row.Phase !== undefined && row.Phase !== null ? String(row.Phase) : undefined;
      const disease = row.Disease;
      const snpId = row.SNPID;
      const drug = row.Drug_name;

      if (diseaseCategory && !checkedClasses[diseaseCategory]) {
        return false;
      }

      const anyVariantSelected = [
        "missense variant",
        "inframe deletion",
        "frameshift variant",
        "intron variant",
        "regulatory region variant",
        "intergenic variant",
        "splice region variant",
        "splice donor variant",
        "non coding transcript exon variant",
        "3 prime UTR variant",
        "5 prime UTR variant",
        "stop gained",
        "synonymous variant",
        "TF binding site variant",
        "splice acceptor variant",
        "downstream gene variant",
        "stop lost",
        "upstream gene variant",
        "inframe insertion",
        "protein altering variant",
        "Multiple reported",
        "rameshift variant",
      ].some((v) => checkedClasses[v]);

      if (anyVariantSelected && variantCategory && !checkedClasses[variantCategory]) {
        return false;
      }

      if (drugCategory && !checkedClasses[drugCategory]) {
        return false;
      }

      if (disease && expandedState[disease] !== undefined && !expandedState[disease].visible) {
        return false;
      }
      if (snpId && expandedState[snpId] !== undefined && !expandedState[snpId].visible) {
        return false;
      }
      if (drug && expandedState[drug] !== undefined && !expandedState[drug].visible) {
        return false;
      }

      return true;
    });

    const newGraphData = createNodesAndLinks(filteredData);
    setGraphData(newGraphData);
    syncLegendFromGraph(newGraphData);
  }, [jsonData, filterType, selectedFilterValues, checkedClasses, expandedState, syncLegendFromGraph]);

  useEffect(() => {
    if (jsonData) {
      setExpandedState(buildExpandedStateFromData(jsonData));
    }
  }, [jsonData]);

  useEffect(() => {
    if (
      jsonData &&
      selectedFilterValues.length > 0 &&
      !hasInitialFilterApplied.current
    ) {
      hasInitialFilterApplied.current = true;
      applyFilters();
    }
  }, [jsonData, selectedFilterValues, applyFilters]);

  const clearGraphUntilFilter = () => {
    if (hasInitialFilterApplied.current) {
      setGraphData({ nodes: [], links: [] });
      syncLegendFromGraph({ nodes: [], links: [] });
    }
  };

  const handleFilterTypeChange = (value) => {
    setFilterType(value);
    setSelectedFilterValues([]);
    clearGraphUntilFilter();
  };

  const handleFilterValuesChange = (value) => {
    setSelectedFilterValues(value);
    clearGraphUntilFilter();
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
              expandedState={expandedState}
              availableClasses={availableClasses}
              availableIds={availableIds}
              onClassChange={handleClassCheckboxChange}
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
            <div
              style={{
                marginBottom: "16px",
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                alignItems: "flex-end",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label
                  htmlFor="filter-type"
                  style={{ display: "block", fontWeight: 500 }}
                >
                  Filter Type
                </label>
                <Select
                  id="filter-type"
                  value={filterType}
                  onChange={handleFilterTypeChange}
                  style={{ width: 220 }}
                  options={FILTER_TYPE_OPTIONS}
                />
              </div>

              {filterType && (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                    <label
                      htmlFor="filter-values"
                      style={{ display: "block", fontWeight: 500 }}
                    >
                      {
                        FILTER_TYPE_OPTIONS.find((option) => option.value === filterType)
                          ?.label
                      }
                    </label>
                    <Select
                      id="filter-values"
                      mode="multiple"
                      showSearch
                      allowClear
                      maxTagCount="responsive"
                      placeholder={FILTER_VALUE_PLACEHOLDERS[filterType]}
                      value={selectedFilterValues}
                      onChange={handleFilterValuesChange}
                      optionFilterProp="children"
                      style={{ width: 360 }}
                    >
                      {(filterOptions[filterType] || []).map((option) => (
                        <Option key={option} value={option}>
                          {option}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <Button
                    type="primary"
                    onClick={applyFilters}
                    disabled={selectedFilterValues.length === 0}
                  >
                    Filter Data
                  </Button>
                </>
              )}
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
                Select filter values and click Filter Data to view the graph.
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