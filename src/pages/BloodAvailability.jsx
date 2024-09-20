import React, { useEffect, useRef, useState } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const { CanvasJSChart } = CanvasJSReact;

const BarChart = () => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5206/api/BloodRL/predict"
        );
        if (response.ok) {
          const data = await response.json();
          setChartData(data);
        } else {
          console.error(
            "Failed to fetch data:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("An error occurred while fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleBloodGroupChange = (event) => {
    setSelectedBloodGroup(event.target.value);
  };

  return (
    <div className="container" id="blood-section">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: 500 }}>
        <h5 className="d-inline-block text-uppercase border-bottom border-5 text-dblue">
          See
        </h5>
        <h3 className="display-4 text-dblue">Blood Availability Predictions</h3>
      </div>
      {chartData && (
        <div className="chart-container">
          <label
            htmlFor="bloodGroupSelect"
            className="display-4 text-dblue"
            style={{
              fontSize: "20px",
              marginBottom: "8px",
              display: "block",
              textAlign: "center",
            }}
          >
            Blood Group:
          </label>

          <div style={{ textAlign: "center" }}>
            <select
              id="bloodGroupSelect"
              onChange={handleBloodGroupChange}
              style={{
                padding: "8px",
                fontSize: "17px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                backgroundColor: "#f0f0f0",
                textAlign: "center",
              }}
              value={selectedBloodGroup || ""}
            >
              <option value="" disabled hidden>
                Select Blood Group
              </option>
              {Object.keys(chartData).map((bloodGroup) => (
                <option key={bloodGroup} value={bloodGroup}>
                  {bloodGroup}
                </option>
              ))}
            </select>
          </div>

          <br />

          {selectedBloodGroup && (
            <div className="hospital-chart text-dblue">
              <h3 style={{ textAlign: "center" }}>
                {selectedBloodGroup} Blood Group
              </h3>
              <br />
              <CanvasJSChart
                options={{
                  animationEnabled: true,
                  theme: "dark2",
                  title: {
                    text: "Blood Availability Prediction For The Next Two Days",
                  },
                  axisY: {
                    title: "Predicted Availability",
                    scaleBreaks: {
                      autoCalculate: true,
                      type: "wavy",
                      lineColor: "white",
                    },
                  },
                  data: [
                    {
                      type: "column",
                      indexLabel: "{y}%",
                      indexLabelFontColor: "white",
                      dataPoints: Object.values(
                        chartData[selectedBloodGroup]
                      ).map((item) => ({
                        label: item.hospitalName,
                        y: item.predictedAvailability,
                      })),
                    },
                  ],
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BarChart;
