import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import "./../css/responsive.css";
import "@fortawesome/fontawesome-free/css/all.css";

const Emergency = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(2);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5206/api/Feedback_Cr/GetAllContact");
        if (!response.ok) {
          throw new Error("Failed to fetch contacts");
        }
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchData();
  }, []);

  const handleCall = (phoneNumber) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to the first page when search term changes
  };

  const filteredItems = searchResults.filter((result) =>
    result.hospitalName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="container-fluid py-5 d-flex flex-column align-items-center bg-white">
      <div className="row">
        <div className="col-md-12">
          <div className="text-center mx-auto mb-5" style={{ maxWidth: 500 }}>
            <h5 className="d-inline-block text-dblue text-uppercase border-bottom border-5">
              Find
            </h5>
            <h1 className="display-4 text-dblue">
              Search Emergency Contact Number
            </h1>
          </div>
        </div>
      </div>
      <br></br>
      <div
        className="input-group"
        style={{
          marginBottom: "30px",
          marginTop: "-30px",
          width: "100%",
          maxWidth: "600px",
        }}
      >
        <input
          type="text"
          className="form-control border-primary w-75"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleInputChange}
        />
      </div>

      <div className="card-body">
        {currentItems.length > 0 &&
          currentItems.map((result, index) => (
            <div key={index} className="card mb-4">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col-lg-6 col-md-6 col-sm-6 mb-3 mb-md-0">
                    <h3 className="mt-0 mb-1 text-blue">
                      <i className="fa-solid fa-house-medical mx-2"></i>
                      {result.hospitalName}
                    </h3>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <h5>
                      <span style={{ color: "red", fontSize:'15px',textWrap:"nowrap" }}>{result.email}</span>
                    </h5>
                  </div>
                  <div className="col-lg-3 col-md-3 col-sm-6">
                    <h5>
                    <a href={`tel:${result.eC_Number1}`} style={{color:'red'}}>{result.number1}</a>
                    </h5>
                    <h5>
                    <a href={`tel:${result.eC_Number1}`} style={{color:'red'}}>{result.number2}</a>
                    </h5>
                  </div>
                </div>
              </div>
            </div>
          ))}
        {currentItems.length === 0 && searchTerm !== "" && (
          <div className="alert alert-warning" role="alert">
            No results found matching the search term.
          </div>
        )}
      </div>

      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {Array.from(
            { length: Math.ceil(filteredItems.length / itemsPerPage) },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${pageNumber === currentPage ? "active" : ""}`}
            >
              <button
                className="page-link"
                onClick={() => paginate(pageNumber)}
              >
                {pageNumber}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Emergency;
