import React, { useState, useEffect, useCallback } from "react";
//import { Bar } from "react-chartjs-2";
import { ComposedChart, XAxis, YAxis, Tooltip, Legend, Area, BarChart, Heatmap } from 'recharts';

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

 
  //const [loading, setLoading] = useState(false);

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
  
  const handleHeatmapClick = () => {
      
    const processedData = csvData.map((row) => ({
    x: row[0],
    y: row[1],
    value: row[2],
    }));
    setHeatmapData(processedData);
  };

    const generateInsights  = async (promptText) => {
      setPrompt(promptText);
      try {
        const response = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            {"role": "system", "content": "You are a helpful data assistant that analyzes datasets and answers related questions"},
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

    const promptOptions = [
      "What are the trends in sales over the past year?",
      "What are the top selling products?",
      "What are the factors affecting sales?",
    ];


  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1 style={{ marginBottom: "20px" }}>CSV Data Insights Generator</h1>
      <input type="file" onChange={handleFileUpload} />
      {csvData.length ? (
        <div>
          <h2 style={{ marginTop: "40px", marginBottom: "10px" }}>Quantitative Analysis:</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <button
              onClick={() => generateInsights("What is the total number of rows and columns in the dataset: \n")}
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
               What is the size of the dataset
            </button>
            <button
              onClick={() => generateInsights("Are there any NULL values in the dataset: \n")}
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
              Are there any NULL values  
            </button>
          </div>
          

        <h2 style={{ marginTop: "40px", marginBottom: "10px" }}>Qualitative Analysis:</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <button
              onClick={() => generateInsights("Can you provide a quick summary of the data: \n")}
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
               Provide a quick summary of the data
            </button>
            <button
              onClick={() => generateInsights("Are there any similar columns in the dataset: \n")}
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
              Are there any similar columns in the dataset  
            </button>
          </div>
          

        <h2 style={{ marginTop: "40px", marginBottom: "10px" }}>Representational Analysis:</h2>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
            <button
              onClick={handleHeatmapClick}
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
               Generate a similarity heatmap for the dataset 
            </button>
            <button
              onClick={{}}
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
              Plot a line graph between the 2 least similar columns 
            </button>
          </div>

          <div style= {{justifyItems : 'center'}}>
          <h2 style={{marginTop : "40px"}}>Enter your own prompt:</h2>
          <textarea style = {{width: '700px', paddingLeft: '10px', paddingTop:'10px'}} value={prompt} onChange={handlePromptChange} />
          <button style = {{ position: "absolute", marginTop:"10px", marginLeft: '20px'}} onClick={() => generateInsights(prompt)}>Submit</button>
        </div>

          <div>
          <h1 style = {{marginTop : "60px"}}>Generated Insights:</h1>
          <p style = {{paddingLeft : "400px", paddingRight : "400px"}}>{insights}</p>
        </div>  
        
        </div>
      ): null}
    </div>
  );
};

export default Home;
