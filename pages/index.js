import React, { useState, useEffect, useCallback } from "react";
//import { Bar } from "react-chartjs-2";
import { ComposedChart, XAxis, YAxis, Tooltip, Legend, Area, BarChart, Heatmap } from 'recharts';
import { useDropzone } from 'react-dropzone';
import { useRef } from 'react';



//import "./App.css";
import { Configuration, OpenAIApi } from "openai";
//const [visualData, setVisualData] = useState({});

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);


//const API_KEY = "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";

const Home = () => {


  const [csvData, setCsvData] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [insights, setInsights] = useState("");
  const [visualizationData, setVisualizationData] = useState([]);
  const [selectedVisualization, setSelectedVisualization] = useState("");
  //const [showHeatMap, setShowHeatMap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [heatmapData, setHeatmapData] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  //const [loading, setLoading] = useState(false);
  

  const handleOnDrop = (acceptedFiles) => {
    setCsvData([]);
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const csvText = reader.result;
        const { data } = Papa.parse(csvText, { header: true });
        setCsvData((prev) => [...prev, ...data]);
      };
      reader.readAsText(file);
    });
    setDragOver(false);
  };
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleOnDrop });

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = () => {
      const csv = reader.result;
      const data = csv
        .split("\n")
        .map((row) => row.split(","))
        .slice(1);
      setCsvData(data);
    };
  };  
  
  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };
  

    const generateInsights  = async (promptText) => {
      setPrompt(promptText);
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {"role": "system", "content": "You are a helpful data assistant that analyzes datasets and gives detailed data and business insights related to the data"},
            {"role": "user", "content": promptText + csvData.map((row) => row.join(",")).join("\n")}
          ]
        });
        //const result = await response.json();
        //console.log(response.data.choices[0].text)
        //console.log("Analyse the following data:\n\n" + csvData.map((row) => row.join(", ")).join("\n"))
        console.log(prompt + + csvData.map((row) => row.join(", ")).join("\n"))
        setInsights(response.data.choices[0].message.content);
        //console.log(response.data.choices[0].text)
      } catch 
      (error) {
        console.error(error);
      }
    };



  return (
    <input type="file" accept=".csv" onChange={handleFileUpload} />
  <div className="dropzone-container" {...getRootProps()}>
    <input {...getInputProps()} />
    {isDragActive ? (
      <p className="dropzone-text">Drop the files here ...</p>
    ) : (
      <>
        <p className="dropzone-text">
          Drag 'n' drop some files here, or click to select files
        </p>
        <button className="dropzone-btn" onClick={() => fileInputRef.current.click()}>
          Browse Files
        </button>
      </>
    )}
    {dragOver && <div className="dropzone-overlay"></div>}
  </div>
      {csvData.length ? (
        <div>
          <h2 style={{ marginTop: "40px", marginBottom: "10px" }}>Quantitative Analysis:</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <button
              onClick={() => generateInsights("Which columns can be used specifically for analysis: \n")}
              style={{
                backgroundColor: "#3f51b5",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "20px"
              }}
            >
               Which columns can be used specifically for analysis
            </button>
            <button
              onClick={() => generateInsights("Which columns needs to be removed due to excessive NULL values: \n")}
              style={{
                backgroundColor: "#3f51b5",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "20px"
              }}
            >
              Which columns needs to be removed due to excessive NULL values 
            </button>
          </div>
          

        <h2 style={{ marginTop: "40px", marginBottom: "10px" }}>Qualitative Analysis:</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <button
              onClick={() => generateInsights("Identify potential problems with the data: \n")}
              style={{
                backgroundColor: "#3EB489",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "20px"
              }}
            >
               Identify potential problems with the data
            </button>
            <button
              onClick={() => generateInsights("What business insights can you generate using the data : \n")}
              style={{
                backgroundColor: "#3EB489",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "20px"
              }}
            >
              What business insights can you generate using the data
            </button>
          </div>
          

        <h2 style={{ marginTop: "40px", marginBottom: "10px" }}>Representational Analysis:</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <button
              onClick={() => generateInsights("Which charts can be used to best describe the columns : \n")}
              style={{
                backgroundColor: "#FF0000",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "20px"
              }}
            >
               Which specific charts can be used for the best analysis 
            </button>
            <button
              onClick={() => generateInsights("Give an ordered EDA process of the data with charts : \n")}
              style={{
                backgroundColor: "#FF0000",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                marginRight: "20px"
              }}
            >
              Give an ordered EDA process of the data with charts 
            </button>
          </div>

          <div style= {{justifyItems : 'center'}}>
          <h2 style={{marginTop : "40px"}}>Enter your own prompt:</h2>
          <textarea style = {{width: '600px', paddingLeft: '10px', paddingTop:'12px', fontSize:15}} value={prompt} onChange={handlePromptChange} />
          <button style = {{ position: "absolute", marginTop:"10px", marginLeft: '20px'}} onClick={() => generateInsights(prompt)}>Submit</button>
        </div>

          <div >
           
           <div style = {{borderStyle:'solid', borderColor:'black', width: '40%', justifyContent:'center', marginLeft:'30%', textAlign: 'center,', display:'flex', marginTop:30}}>
            <p style = {{paddingRight: 15, paddingLeft:15, fontSize:20}}>{insights}</p>
           </div>
        </div>  
        
        </div>
      ): null}
    </div>
  );
};

export default Home;
