import React, { useState } from "react";

const SearchResultList = ({ results }) => (
  <div>
    {results.map((result, index) => (
      <div key={index}>
        <p>{result.name}</p>
        <p>{result.comments}</p>
        <p>{result.rating}</p>
        <img src={`./assets/img/${result.image}`} alt={result.name} />
      </div>
    ))}
  </div>
);

const SearchResultsTable = ({ results }) => <table></table>;

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsTable, setSearchResultsTable] = useState([]);

  const doctorReviews = [
    // ... your doctorReviews data
    {
      name: "Dr.Hamza Ahmed",
      rating: "Dentist",
      comments:
        "Healers with a human touch, doctors weave empathy into the fabric of diagnosis and treatment.",
      image: "user.jpg",
    },
    {
      name: "Dr.Adnan Ali",
      rating: "Dermatoligist",
      comments:
        "Hospital and staff were extremely warm and quick in getting started with the procedures service.",
      image: "testimonial-3.jpg",
    },
    {
      name: "Dr.Ateeb Sheikh",
      rating: "Cardiologist",
      comments:
        "Hospital and staff were extremely warm and quick in getting started with the procedures service.",
      image: "testimonial-2.jpg",
    },
  ];

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setSearchResultsTable([]);
    } else {
      const results = doctorReviews.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResults(results);

      const tableResults = doctorReviews.filter((doctor) =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setSearchResultsTable(tableResults);
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ width: "100%", maxWidth: 600 }}>
        <div className="input-group">
          <input
            type="text"
            className="form-control border-primary w-75"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleInputChange}
          />
          <button
            type="button"
            className="btn btn-dark border-0 w-25"
            onClick={() => {}}
          >
            Search
          </button>
        </div>

        <div className="mt-3">
          {searchTerm !== "" && searchResults.length > 0 && (
            <div className="card">
              <ul className="list-group list-group-flush">
                {searchResults.map((result, index) => (
                  <li key={index} className="list-group-item">
                    <div className="d-flex">
                      <img
                        src={`./assets/img/${result.image}`}
                        alt={result.name}
                        className="mr-3 rounded-circle"
                        style={{ width: "50px", height: "50px" }}
                      />
                      <div>
                        <h5 className="mb-1">{result.name}</h5>
                        <p>{result.comments}</p>
                        <p>Speciality : {result.rating}</p>
                        <button className="btn btn-primary">
                          Book An Appointment
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* <div className="mt-3">
          {searchTerm !== "" && searchResults.length > 0 && (
            <div className="card">
              <div className="card-body p-0">
                <SearchResultList results={searchResults} />
              </div>
            </div>
          )}
        </div>
      </div> */}

        <div className="mt-9" style={{ display: "flex" }}>
          {searchTerm !== "" && searchResultsTable.length > 0 && (
            <SearchResultsTable results={searchResultsTable} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
