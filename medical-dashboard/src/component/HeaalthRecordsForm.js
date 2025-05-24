
// import React, { useState } from 'react';
// import diseases from '../data/catle_diseases.json';

// const HealthRecordForm = () => {
//   const initialConditions = {
//     "anorexia": 0,
//     "abdominal_pain": 0,
//     "anaemia": 0,
//     "abortions": 0,
//     "acetone": 0,
//     "aggression": 0,
//     "arthrogyposis": 0,
//     "ankylosis": 0,
//     "anxiety": 0,
//     "bellowing": 0,
//     "blood_loss": 0,
//     "blood_poisoning": 0,
//     "blisters": 0,
//     "colic": 0,
//     "Condemnation_of_livers": 0,
//     "conjunctivae": 0,
//     "coughing": 0,
//     "depression": 0,
//     "discomfort": 0,
//     "dyspnea": 0,
//     "dysentery": 0,
//     "diarrhoea": 0,
//     "dehydration": 0,
//     "drooling": 0,
//     "dull": 0,
//     "decreased_fertility": 0,
//     "diffculty_breath": 0,
//     "emaciation": 0,
//     "encephalitis": 0,
//     "fever": 0,
//     "facial_paralysis": 0,
//     "frothing_of_mouth": 0,
//     "frothing": 0,
//     "gaseous_stomach": 0,
//     "highly_diarrhoea": 0,
//     "high_pulse_rate": 0,
//     "high_temp": 0,
//     "high_proportion": 0,
//     "hyperaemia": 0,
//     "hydrocephalus": 0,
//     "isolation_from_herd": 0,
//     "infertility": 0,
//     "intermittent_fever": 0,
//     "jaundice": 0,
//     "ketosis": 0,
//     "loss_of_appetite": 0,
//     "lameness": 0,
//     "lack_of-coordination": 0,
//     "lethargy": 0,
//     "lacrimation": 0,
//     "milk_flakes": 0,
//     "milk_watery": 0,
//     "milk_clots": 0,
//     "mild_diarrhoea": 0,
//     "moaning": 0,
//     "mucosal_lesions": 0,
//     "milk_fever": 0,
//     "nausea": 0,
//     "nasel_discharges": 0,
//     "oedema": 0,
//     "pain": 0,
//     "painful_tongue": 0,
//     "pneumonia": 0,
//     "photo_sensitization": 0,
//     "quivering_lips": 0,
//     "reduction_milk_vields": 0,
//     "rapid_breathing": 0,
//     "rumenstasis": 0,
//     "reduced_rumination": 0,
//     "reduced_fertility": 0,
//     "reduced_fat": 0,
//     "reduces_feed_intake": 0,
//     "raised_breathing": 0,
//     "stomach_pain": 0,
//     "salivation": 0,
//     "stillbirths": 0,
//     "shallow_breathing": 0,
//     "swollen_pharyngeal": 0,
//     "swelling": 0,
//     "saliva": 0,
//     "swollen_tongue": 0,
//     "tachycardia": 0,
//     "torticollis": 0,
//     "udder_swelling": 0,
//     "udder_heat": 0,
//     "udder_hardeness": 0,
//     "udder_redness": 0,
//     "udder_pain": 0,
//     "unwillingness_to_move": 0,
//     "ulcers": 0,
//     "vomiting": 0,
//     "weight_loss": 0,
//     "weakness": 0,
//   };

//   const [conditions, setConditions] = useState(initialConditions);
//   const [possibleDiseases, setPossibleDiseases] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const handleCheckboxChange = (event) => {
//     const { name, checked } = event.target;
//     setConditions(prevState => ({
//       ...prevState,
//       [name]: checked ? 1 : 0
//     }));
//   };

//   const searchDiseases = () => {
//     const selectedConditions = Object.keys(conditions).filter(condition => conditions[condition] === 1);
//     let diseaseMatches = diseases.map(diseaseRecord => {
//       const { prognosis, ...symptoms } = diseaseRecord;
//       const diseaseSymptoms = Object.keys(symptoms).filter(symptom => symptoms[symptom] === 1);
//       const matchCount = selectedConditions.filter(condition => diseaseSymptoms.includes(condition)).length;
//       return { prognosis, matchCount, totalSymptoms: diseaseSymptoms.length };
//     });
//     diseaseMatches.sort((a, b) => b.matchCount - a.matchCount);
//     const highestMatchingDisease = diseaseMatches.length > 0 ? diseaseMatches[0].prognosis : null;
//     setPossibleDiseases(highestMatchingDisease);
//   };

//   return (
//     <div className="recentCustomers">
//       <div className="cardHeader">
//         <h2>Health Condition Checklist</h2>
//         <input
//           type="text"
//           placeholder="Search symptoms..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
//           className="searchInput"
//         />
//       </div>
//       <form>
//         <div className="checkboxList">
//           {Object.keys(conditions)
//             .filter(condition => condition.includes(searchTerm))
//             .map((condition, index) => (
//               <div key={index} className="checkboxItem">
//                 <label className="checkboxLabel">{condition}</label>
//                 <input
//                   type="checkbox"
//                   name={condition}
//                   checked={conditions[condition] === 1}
//                   onChange={handleCheckboxChange}
//                   className="checkboxInput"
//                 />
//               </div>
//             ))}
//         </div>
//         <button type="button" onClick={searchDiseases} className="searchButton">
//           Search Possible Diseases
//         </button>
//       </form>
//       {possibleDiseases && (
//         <div className="resultBox">
//           <h3>Most Likely Disease:</h3>
//           <p className="diseaseName">{possibleDiseases}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default HealthRecordForm;


"use client"

import { useState } from "react"
import diseases from "../data/catle_diseases.json"
import "./health-record-form.css"

const HealthRecordForm = () => {
  const initialConditions = {
    anorexia: 0,
    abdominal_pain: 0,
    anaemia: 0,
    abortions: 0,
    acetone: 0,
    aggression: 0,
    arthrogyposis: 0,
    ankylosis: 0,
    anxiety: 0,
    bellowing: 0,
    blood_loss: 0,
    blood_poisoning: 0,
    blisters: 0,
    colic: 0,
    Condemnation_of_livers: 0,
    conjunctivae: 0,
    coughing: 0,
    depression: 0,
    discomfort: 0,
    dyspnea: 0,
    dysentery: 0,
    diarrhoea: 0,
    dehydration: 0,
    drooling: 0,
    dull: 0,
    decreased_fertility: 0,
    diffculty_breath: 0,
    emaciation: 0,
    encephalitis: 0,
    fever: 0,
    facial_paralysis: 0,
    frothing_of_mouth: 0,
    frothing: 0,
    gaseous_stomach: 0,
    highly_diarrhoea: 0,
    high_pulse_rate: 0,
    high_temp: 0,
    high_proportion: 0,
    hyperaemia: 0,
    hydrocephalus: 0,
    isolation_from_herd: 0,
    infertility: 0,
    intermittent_fever: 0,
    jaundice: 0,
    ketosis: 0,
    loss_of_appetite: 0,
    lameness: 0,
    "lack_of-coordination": 0,
    lethargy: 0,
    lacrimation: 0,
    milk_flakes: 0,
    milk_watery: 0,
    milk_clots: 0,
    mild_diarrhoea: 0,
    moaning: 0,
    mucosal_lesions: 0,
    milk_fever: 0,
    nausea: 0,
    nasel_discharges: 0,
    oedema: 0,
    pain: 0,
    painful_tongue: 0,
    pneumonia: 0,
    photo_sensitization: 0,
    quivering_lips: 0,
    reduction_milk_vields: 0,
    rapid_breathing: 0,
    rumenstasis: 0,
    reduced_rumination: 0,
    reduced_fertility: 0,
    reduced_fat: 0,
    reduces_feed_intake: 0,
    raised_breathing: 0,
    stomach_pain: 0,
    salivation: 0,
    stillbirths: 0,
    shallow_breathing: 0,
    swollen_pharyngeal: 0,
    swelling: 0,
    saliva: 0,
    swollen_tongue: 0,
    tachycardia: 0,
    torticollis: 0,
    udder_swelling: 0,
    udder_heat: 0,
    udder_hardeness: 0,
    udder_redness: 0,
    udder_pain: 0,
    unwillingness_to_move: 0,
    ulcers: 0,
    vomiting: 0,
    weight_loss: 0,
    weakness: 0,
  }

  const [conditions, setConditions] = useState(initialConditions)
  const [possibleDiseases, setPossibleDiseases] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCount, setSelectedCount] = useState(0)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeCategory, setActiveCategory] = useState("all")

  // Group symptoms by category
  const categories = {
    all: "All Symptoms",
    digestive: "Digestive System",
    respiratory: "Respiratory System",
    reproductive: "Reproductive System",
    behavioral: "Behavioral Signs",
    physical: "Physical Symptoms",
    udder: "Udder Health",
  }

  // Map symptoms to categories
  const symptomCategories = {
    // Digestive System
    anorexia: "digestive",
    abdominal_pain: "digestive",
    colic: "digestive",
    diarrhoea: "digestive",
    dysentery: "digestive",
    gaseous_stomach: "digestive",
    highly_diarrhoea: "digestive",
    mild_diarrhoea: "digestive",
    nausea: "digestive",
    rumenstasis: "digestive",
    reduced_rumination: "digestive",
    reduces_feed_intake: "digestive",
    stomach_pain: "digestive",
    vomiting: "digestive",
    loss_of_appetite: "digestive",

    // Respiratory System
    coughing: "respiratory",
    diffculty_breath: "respiratory",
    dyspnea: "respiratory",
    nasel_discharges: "respiratory",
    pneumonia: "respiratory",
    rapid_breathing: "respiratory",
    raised_breathing: "respiratory",
    shallow_breathing: "respiratory",

    // Reproductive System
    abortions: "reproductive",
    decreased_fertility: "reproductive",
    infertility: "reproductive",
    reduced_fertility: "reproductive",
    stillbirths: "reproductive",

    // Behavioral Signs
    aggression: "behavioral",
    anxiety: "behavioral",
    bellowing: "behavioral",
    depression: "behavioral",
    discomfort: "behavioral",
    dull: "behavioral",
    isolation_from_herd: "behavioral",
    lethargy: "behavioral",
    moaning: "behavioral",
    unwillingness_to_move: "behavioral",

    // Physical Symptoms
    anaemia: "physical",
    arthrogyposis: "physical",
    ankylosis: "physical",
    blood_loss: "physical",
    blood_poisoning: "physical",
    blisters: "physical",
    Condemnation_of_livers: "physical",
    conjunctivae: "physical",
    dehydration: "physical",
    drooling: "physical",
    emaciation: "physical",
    encephalitis: "physical",
    fever: "physical",
    facial_paralysis: "physical",
    frothing_of_mouth: "physical",
    frothing: "physical",
    high_pulse_rate: "physical",
    high_temp: "physical",
    high_proportion: "physical",
    hyperaemia: "physical",
    hydrocephalus: "physical",
    intermittent_fever: "physical",
    jaundice: "physical",
    ketosis: 0,
    lameness: 0,
    "lack_of-coordination": 0,
    lacrimation: 0,
    mucosal_lesions: 0,
    milk_fever: 0,
    oedema: 0,
    pain: 0,
    painful_tongue: 0,
    photo_sensitization: 0,
    quivering_lips: 0,
    salivation: 0,
    swollen_pharyngeal: 0,
    swelling: 0,
    saliva: 0,
    swollen_tongue: 0,
    tachycardia: 0,
    torticollis: 0,
    ulcers: 0,
    weight_loss: 0,
    weakness: 0,

    // Udder Health
    milk_flakes: "udder",
    milk_watery: "udder",
    milk_clots: "udder",
    reduction_milk_vields: "udder",
    reduced_fat: "udder",
    udder_swelling: "udder",
    udder_heat: "udder",
    udder_hardeness: "udder",
    udder_redness: "udder",
    udder_pain: "udder",

    // Default for any uncategorized symptoms
    acetone: "physical",
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    const newValue = checked ? 1 : 0

    setConditions((prevState) => ({
      ...prevState,
      [name]: newValue,
    }))

    // Update selected count
    setSelectedCount((prevCount) => (newValue === 1 ? prevCount + 1 : prevCount - 1))

    // Clear results when symptoms change
    if (possibleDiseases) {
      setPossibleDiseases(null)
    }
  }

  // Update the searchDiseases function to prevent duplicate results
  const searchDiseases = () => {
    setIsAnalyzing(true)

    // Simulate analysis delay for better UX
    setTimeout(() => {
      const selectedConditions = Object.keys(conditions).filter((condition) => conditions[condition] === 1)

      const diseaseMatches = diseases.map((diseaseRecord) => {
        const { prognosis, ...symptoms } = diseaseRecord
        const diseaseSymptoms = Object.keys(symptoms).filter((symptom) => symptoms[symptom] === 1)
        const matchCount = selectedConditions.filter((condition) => diseaseSymptoms.includes(condition)).length
        const matchPercentage = diseaseSymptoms.length > 0 ? (matchCount / diseaseSymptoms.length) * 100 : 0

        return {
          prognosis,
          matchCount,
          totalSymptoms: diseaseSymptoms.length,
          matchPercentage: Math.round(matchPercentage),
        }
      })

      // Sort by match count first, then by match percentage
      diseaseMatches.sort((a, b) => {
        if (b.matchCount !== a.matchCount) {
          return b.matchCount - a.matchCount
        }
        return b.matchPercentage - a.matchPercentage
      })

      // Get unique diseases by prognosis name
      const uniqueDiseases = []
      const seenPrognoses = new Set()

      for (const disease of diseaseMatches) {
        if (!seenPrognoses.has(disease.prognosis) && disease.matchCount > 0) {
          seenPrognoses.add(disease.prognosis)
          uniqueDiseases.push(disease)
          if (uniqueDiseases.length >= 3) break
        }
      }

      if (uniqueDiseases.length > 0) {
        setPossibleDiseases(uniqueDiseases)
      } else {
        setPossibleDiseases([])
      }

      setIsAnalyzing(false)
    }, 1500)
  }

  const resetForm = () => {
    setConditions(initialConditions)
    setPossibleDiseases(null)
    setSelectedCount(0)
    setSearchTerm("")
  }

  const formatSymptomName = (name) => {
    return name
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  // Filter symptoms based on search and category
  const filteredSymptoms = Object.keys(conditions).filter((condition) => {
    const matchesSearch = condition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || symptomCategories[condition] === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="health-record-card">
      <div className="card-header">
        <h2>Symptom Analyzer</h2>
        <div className="selected-count">{selectedCount} symptoms selected</div>
      </div>

      <div className="health-form-content">
        <div className="search-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search symptoms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          {searchTerm && (
            <button className="clear-search" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>

        <div className="category-tabs">
          {Object.entries(categories).map(([key, label]) => (
            <button
              key={key}
              className={`category-tab ${activeCategory === key ? "active" : ""}`}
              onClick={() => setActiveCategory(key)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="symptoms-container">
          {filteredSymptoms.length > 0 ? (
            <div className="checkbox-grid">
              {filteredSymptoms.map((condition) => (
                <div key={condition} className="checkbox-item">
                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      name={condition}
                      checked={conditions[condition] === 1}
                      onChange={handleCheckboxChange}
                    />
                    <span className="checkmark"></span>
                    <span className="checkbox-label">{formatSymptomName(condition)}</span>
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-symptoms">No symptoms match your search criteria</div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={searchDiseases}
            className={`analyze-button ${selectedCount === 0 ? "disabled" : ""}`}
            disabled={selectedCount === 0 || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <span className="spinner"></span>
                Analyzing...
              </>
            ) : (
              "Analyze Symptoms"
            )}
          </button>

          <button type="button" onClick={resetForm} className="reset-button" disabled={isAnalyzing}>
            Reset
          </button>
        </div>

        {possibleDiseases && (
          <div className={`results-container ${possibleDiseases.length > 0 ? "has-results" : "no-match"}`}>
            <h3 className="results-title">{possibleDiseases.length > 0 ? "Possible Diagnoses" : "No Matches Found"}</h3>

            {possibleDiseases.length > 0 ? (
              <div className="disease-results">
                {possibleDiseases.map((disease, index) => (
                  <div key={index} className="disease-result-item">
                    <div className="disease-name">{disease.prognosis}</div>
                    <div className="match-info">
                      <div className="match-percentage">
                        <div className="percentage-bar">
                          <div className="percentage-fill" style={{ width: `${disease.matchPercentage}%` }}></div>
                        </div>
                        <span>{disease.matchPercentage}% match</span>
                      </div>
                      <div className="match-details">
                        {disease.matchCount} of {disease.totalSymptoms} symptoms match
                      </div>
                    </div>
                  </div>
                ))}
                <div className="disclaimer">
                  Note: This is only a preliminary analysis. Please consult a veterinarian for proper diagnosis.
                </div>
              </div>
            ) : (
              <div className="no-match-message">
                No diseases match the selected symptoms. Try selecting different symptoms or consult a veterinarian.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default HealthRecordForm
