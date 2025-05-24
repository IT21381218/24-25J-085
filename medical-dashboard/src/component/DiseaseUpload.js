"use client"

import { useState } from "react"
import axios from "axios"
import ENV from "../data/Env"
import "./disease-upload.css"

const DiseaseUpload = () => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedDisease, setSelectedDisease] = useState(null)
  const [activeTab, setActiveTab] = useState("detect")

  // Content mapping for each condition
  const conditionInfo = {
    BlackQuarter: {
      name: "Black Quarter (BQ)",
      description:
        "Black Quarter (BQ), also known as Blackleg, is a severe bacterial disease affecting cattle and other ruminants. It is caused by Clostridium chauvoei, a spore-forming bacterium. The disease is highly fatal and primarily affects young cattle (6 months to 2 years old), though older animals can also be susceptible.",
      remedies: [
        "Immediate veterinary intervention is critical.",
        "Antibiotics such as penicillin or tetracycline may be effective in early stages.",
        "Supportive care, including anti-inflammatory drugs and wound management, may be necessary.",
        "Treatment is often ineffective in advanced cases, so prevention is the key strategy.",
      ],
    },
    lumpycows: {
      name: "Lumpy Skin Disease",
      description:
        "Lumpy skin disease is a viral infection that causes fever, swelling, and nodules on the skin. It is spread by insect bites.",
      remedies: [
        "Consult a vet for appropriate vaccination and treatment options.",
        "Ensure cows are isolated to prevent the spread of the disease.",
        "Use insect repellents to reduce the risk of transmission.",
      ],
    },
    Dermatitis: {
      name: "Dermatitis",
      description:
        "Dermatitis in cows, often referred to as bovine dermatitis, is an inflammation of the skin that can be caused by various factors. The most common type affecting dairy cows is digital dermatitis, which mainly affects the skin around the hooves and causes lameness. It's a significant issue in livestock management because it impacts cow health, welfare, and productivity. Here's an overview:",
      remedies: [
        "Regularly clean and dry areas where cows congregate to reduce the buildup of manure and moisture.",
        "Use bedding that promotes dryness, like sand or dry straw, and change it frequently.",
        "Periodically clean and disinfect floors, especially in milking parlors and holding areas.",
        "Provide regular footbaths with disinfectants (like copper sulfate or formalin) to kill bacteria on hooves and lower limbs.",
        "Ensure footbaths are the correct concentration and frequency to avoid overuse, which could harm the skin.",
        "Avoid overcrowding, as this reduces the spread of infection through close contact.",
        "Regular hoof trimming helps maintain good hoof health and removes potential areas for bacteria to grow.",
        "Inspect hooves regularly to catch and treat early signs of dermatitis.",
      ],
    },
    Dermatophytosis: {
      name: "Dermatophytosis (Ringworm)",
      description:
        "Dermatophytosis, commonly known as ringworm, is a contagious fungal infection affecting the skin, hair, and sometimes nails. It is caused by dermatophytes, a group of fungi that thrive on keratin, a protein found in these tissues. In cattle, ringworm is typically caused by species like Trichophyton verrucosum. The disease manifests as circular, scaly patches of hair loss, often with gray or crusty lesions. Although not life-threatening, it can cause discomfort, reduce productivity, and spread to humans (zoonotic potential).",
      remedies: [
        "Regularly clean and disinfect equipment, barns, and milking areas.",
        "Use antifungal disinfectants (e.g., iodine solutions, lime sulfur) on shared surfaces.",
        "Isolate new cattle for a few weeks before introducing them to the herd.",
        "Separate infected animals to prevent spread.",
        "Provide balanced nutrition with adequate vitamins and minerals, especially Vitamin A and zinc.",
        "Reduce stress factors such as sudden changes in diet or handling.",
        "Vaccines against Trichophyton verrucosum are available in some regions and can reduce the severity of outbreaks.",
        "Treat infected animals promptly using topical antifungal creams (e.g., miconazole, clotrimazole) or sprays.",
      ],
    },
    FlyStrike: {
      name: "Fly Strike (Myiasis)",
      description:
        "Fly Strike (Myiasis) is a condition caused by the infestation of fly larvae (maggots) in the tissues of animals, including cows. It occurs when flies lay eggs on the skin, wounds, or body openings of an animal. Once the eggs hatch, the larvae burrow into the skin or feed on tissues, causing irritation, infection, and tissue damage.",
      remedies: [
        "Regularly clean barns, stalls, and areas where cows are kept to reduce fly populations.",
        "Properly dispose of manure and organic waste to minimize breeding grounds.",
        "Use fly repellents, sprays, or pour-on insecticides on cows to deter flies.",
        "Install fly traps or sticky tapes in the barn or grazing areas.",
        "Consider using biological control methods, such as introducing natural predators of flies.",
        "Ensure proper drainage in pastures and around water sources to avoid standing water.",
      ],
    },
    Mastitis: {
      name: "Mastitis",
      description:
        "Mastitis is an inflammation of the mammary gland (udder) in dairy cows. It is a common and significant disease in dairy farming, as it affects milk production and quality. Mastitis is caused by bacterial, fungal, or viral infections that enter the udder through the teat canal. It can also result from physical injuries or environmental factors.",
      remedies: [
        "Keep barns and bedding clean and dry.",
        "Regularly clean milking equipment and sanitize teats before and after milking.",
        "Use a proper milking routine to reduce teat damage.",
        "Ensure the milking machine is functioning correctly to avoid over-milking or vacuum fluctuations.",
        "Use a post-milking teat dip to disinfect teats and prevent pathogen entry.",
        "Check for and treat any injuries or cracks on the teats.",
        "Conduct regular somatic cell count (SCC) testing to identify subclinical mastitis early.",
        "Observe cows for signs of discomfort or changes in milk quality.",
      ],
    },
    Parasiticmange: {
      name: "Parasitic mange",
      description:
        "Parasitic mange is a skin disease caused by microscopic mites that burrow into or live on the skin of cattle. The condition leads to severe itching, inflammation, hair loss, and crusty lesions. It is highly contagious and can spread quickly among animals in close contact.",
      remedies: [
        "Regularly clean barns, bedding, and equipment.",
        "Ensure proper ventilation in housing facilities.",
        "Quarantine animals showing signs of mange to prevent the spread to healthy cattle.",
        "Treat animals with approved acaricides or insecticides. These can be applied as sprays, dips, or pour-on formulations.",
        "Repeat treatments as recommended by a veterinarian to ensure all mites are eliminated.",
        "Regularly disinfect grooming tools, feeders, and water troughs.",
      ],
    },
    Tickinfestation: {
      name: "Tick infestation",
      description:
        "Tick infestation refers to the presence of a large number of ticks on the body of cattle. Ticks are small parasitic arachnids that attach to the skin of cows, feed on their blood, and can cause various health issues.",
      remedies: [
        "Regularly mow grass and clear bushes to reduce tick habitats.",
        "Rotate grazing areas to prevent ticks from establishing in one area.",
        "Introduce natural predators of ticks, such as certain birds or parasitic wasps.",
        "Use entomopathogenic fungi, which can infect and kill ticks.",
        "Inspect cows regularly for ticks, especially around the ears, udder, and tail.",
        "Manually remove ticks using tweezers or tick-removal tools, ensuring the head is removed.",
      ],
    },
  }

  // Handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedImage(file)
      setPreviewUrl(URL.createObjectURL(file)) // Create a preview URL for the image
    }
  }

  // Handle disease detection
  const handleDetectDisease = async () => {
    if (!uploadedImage) {
      alert("Please upload an image first.")
      return
    }

    const formData = new FormData()
    formData.append("file", uploadedImage)

    setLoading(true)
    setPrediction(null)

    try {
      const response = await axios.post(ENV.SERVER + "/predict-pest", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      setPrediction(response.data)

      // Set the selected disease to match the prediction for consistent display
      if (response.data.predicted_label && conditionInfo[response.data.predicted_label]) {
        setSelectedDisease(conditionInfo[response.data.predicted_label])
      }
    } catch (error) {
      console.error("Error detecting disease:", error)
      alert("Failed to detect disease.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
    const foundDisease = Object.keys(conditionInfo).find((key) =>
      key.toLowerCase().includes(event.target.value.toLowerCase()),
    )
    setSelectedDisease(foundDisease ? conditionInfo[foundDisease] : null)
  }

  return (
    <div className="disease-card">
      <div className="card-header">
        <h2>Disease Detection</h2>
      </div>

      <div className="disease-tabs">
        <div className="tab-buttons">
          <button className={activeTab === "search" ? "active" : ""} onClick={() => setActiveTab("search")}>
            <span className="tab-icon">🔍</span>
            Search Diseases
          </button>
          <button className={activeTab === "detect" ? "active" : ""} onClick={() => setActiveTab("detect")}>
            <span className="tab-icon">📷</span>
            Detect Based on Images
          </button>
        </div>

        {/* Search Tab */}
        <div className={`tab-panel ${activeTab === "search" ? "active" : ""}`}>
          <div className="search-section">
            <div className="search-container">
              <input
                type="text"
                placeholder="Search for disease"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>

            {selectedDisease && (
              <div className="disease-details">
                <h3 className="disease-name">{selectedDisease.name}</h3>
                <div className="disease-description">{selectedDisease.description}</div>
                <h4 className="remedies-title">Remedies:</h4>
                <ul className="remedies-list">
                  {selectedDisease.remedies.map((remedy, index) => (
                    <li key={index}>{remedy}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Detect Tab */}
        <div className={`tab-panel ${activeTab === "detect" ? "active" : ""}`}>
          <div className="upload-section">
            <div className="upload-container">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="file-input"
                id="image-upload"
              />
              <label htmlFor="image-upload" className="upload-label">
                {!previewUrl ? (
                  <div className="upload-placeholder">
                    <div className="upload-icon">📤</div>
                    <span>Choose an image or drag it here</span>
                  </div>
                ) : (
                  <div className="preview-wrapper">
                    <img src={previewUrl || "/placeholder.svg"} alt="Preview" className="image-preview" />
                    <div className="change-image">Change Image</div>
                  </div>
                )}
              </label>

              <button
                onClick={handleDetectDisease}
                className={`detect-button ${loading || !uploadedImage ? "disabled" : ""}`}
                disabled={loading || !uploadedImage}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  "Detect Disease"
                )}
              </button>
            </div>

            {/* Prediction Results */}
            {prediction && (
              <div className="prediction-results">
                <div className="prediction-header">
                  <h3>Detection Results</h3>
                  <div className="confidence-meter">
                    <div className="confidence-bar" style={{ width: `${prediction.confidence * 100}%` }}></div>
                    <span className="confidence-text">Confidence: {(prediction.confidence * 100).toFixed(2)}%</span>
                  </div>
                </div>

                <div className="prediction-details">
                  <div className="detected-disease">
                    <h4>Detected: {conditionInfo[prediction.predicted_label]?.name || prediction.predicted_label}</h4>
                  </div>

                  {/* Display condition details and remedies */}
                  {prediction.predicted_label && conditionInfo[prediction.predicted_label] && (
                    <div className="disease-details">
                      <h3 className="disease-name">{conditionInfo[prediction.predicted_label].name}</h3>
                      <div className="disease-description">{conditionInfo[prediction.predicted_label].description}</div>
                      <h4 className="remedies-title">Recommended Remedies:</h4>
                      <ul className="remedies-list">
                        {conditionInfo[prediction.predicted_label].remedies.map((remedy, index) => (
                          <li key={index}>{remedy}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DiseaseUpload
