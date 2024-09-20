import React, { useEffect, useState } from "react";
import BarChart from "./BloodAvailability";
import Bot from "./Bot";
import Appointment from "./Appointment";
import DoctorReviews from "./DoctorReviews";
import Emergency from "./Emergency";
import Banner from "./Banner";
import Search from "./Search";
import "./../css/responsive.css";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Swal from 'sweetalert2';

function Home() {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [searchResultsTable, setSearchResultsTable] = useState([]);

  const [doctorReviews, setDoctorReviews] = useState([]);



  useEffect(() => {
    fetch("http://localhost:5206/api/Feedback_Cr/GetReviewDetails")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        return response.json();
      })
      .then((data) => {
        // Filter reviews to only include those with "Available" status
        const availableReviews = data.filter((review) => review.status === "Available");
        console.log(availableReviews)
        setDoctorReviews(availableReviews);
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  }, []);

  const handleInputChange = (e) => {
    const searchTerm = e.target.value;
    setSearchTerm(searchTerm);

    if (searchTerm.trim() === "") {
      setSearchResults([]);
    } else {
      const results = services
        .filter((service) =>
          service.hsServices.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .reduce((uniqueResults, service) => {
          // Check if the service is already in uniqueResults
          if (
            !uniqueResults.some(
              (result) => result.hsServices === service.hsServices
            )
          ) {
            // If not, add it to uniqueResults
            uniqueResults.push(service);
          }
          return uniqueResults;
        }, []);

      setSearchResults(results);
    }
  };

  const handleServiceSelect = (selectedService) => {
    setSelectedService(selectedService);
    setSearchTerm(selectedService.hsServices); // Populate search bar
    setSearchResults([]); // Clear search results
    handleSearch(); // Automatically trigger search
  };

  const handleSearch = async () => {
    if (selectedService && !userLocation) {
      Swal.fire('Error', "Enable location first!", 'error');
      return;
    }

    if (selectedService && userLocation) {
      try {
        setLoading(true);

        setSearchResults([]);
        setSearchResultsTable([]);

        const response = await fetch(
          "http://localhost:5206/api/HospitalServices/Search",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userLatitude: userLocation.latitude,
              userLongitude: userLocation.longitude,
              service: selectedService.hsServices,
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Handle the response data as needed
          setSearchResultsTable(data);
          setLoading(false);
        } else {
          setLoading(false);
          console.error("Error fetching nearest hospital from API");
          // Show an error message
          setSearchResultsTable([]);
          setSearchResults([{ hsServices: "Error fetching data" }]);
        }
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    }
  };

  const SearchResultList = ({ results }) => (
    <ul className="list-group list-group-flush">
      {results.map((service, index) => (
        <li
          className="list-group-item"
          key={index}
          onClick={() => handleServiceSelect(service)}
        >
          {service.hsServices}
        </li>
      ))}
    </ul>
  );

  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(
          "http://localhost:5206/api/HospitalServices"
        );

        if (response.ok) {
          const data = await response.json();
          setServices(data); // Assuming the API response is an array of services
        } else {
          console.error("Error fetching services from API");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchServices();
  }, []);

  const SearchResultsTable = ({ results }) => (
    <div className="row mt-3">
      {results.map((result, index) => (
        <div
          key={index}
          className={`col-lg-${results.length === 1 ? "12" : "6"} col-md-${results.length === 1 ? "12" : "6"}`}
        >
          <div
            className="service-item bg-white rounded d-flex flex-column align-items-center justify-content-center text-center"
            style={{ marginTop: "20px" }}
          >
            <div className="service-icon mb-4 bg-dblue">
              <i className="fa fa-2x fa fa-hospital-o text-white" />
            </div>
            <h3 className="mb-3 tex-dblue">{result.hName}</h3>
            <h5 className="m-0 tex-dblue">{result.hAddress}</h5>

            <h5>
              <a href={`tel:${result.eC_Number1}`} style={{color:'red'}}>
                {result.eC_Number1}
              </a>
            </h5>
            <h5>
              <a href={`tel:${result.eC_Number2}`} style={{color:'red'}}>
                {result.eC_Number2}
              </a>
            </h5>
            <br />
            <h4 className="m-0" style={{ color: "red" }}>
              Distance: {result.distanceInKm.toFixed(2)} km
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
  

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const position = await getCurrentLocation();
        setUserLocation(position.coords);
      } catch (error) {
        console.error("Error getting user location:", error);
      }
    };

    fetchLocation();
  }, []);

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject("Geolocation not available");
      }
    });
  };

  /// appountment end

  const servicess = [
    {
      iconClass: "fa fa-hospital-o",
      title: "Find Nearest Hospital",
      description:
        "Find the nearest hospital offering services you want for your loved ones.",
    },
    {
      iconClass: "fa fa-tint",
      title: "Blood Availability Prediction",
      description:
        "Need blood urgently but don't know where to go? Not to worry, our AI powered blood availability prediction has got you covered.",
    },
    {
      iconClass: "fa fa-2x fa-stethoscope",
      title: "Appointment",
      description:
        "Need to have a checkup? Our Insanely Fast Appointment feature allows you to schedule appointments with the best hospitals in your city.",
    },
    {
      iconClass: "fa fa-comments",
      title: "Chatbot",
      description:
        "Feeling ill? Don't worry, our chatbot has got you covered. Find out symptoms and possible ways to cure it.",
    },
    {
      iconClass: "fa fa-flag-checkered",
      title: "Medical Portfolio",
      description:
        "Review your overall medical history in a beautiful and attractive medical portfolio.",
    },
    {
      iconClass: "fa fa-video-camera",
      title: "Video Appointment",
      description:
        "Have an appointment but cant't make it to the hospital? Don't worry, our portal provides Video Calling feature which allows you to connect with your doctor within seconds.",
    },
  ];

  const options = {
    loop: true,
    margin: 10,
    autoplay: true, // Add autoplay
    autoplayTimeout: 3000, // Set autoplay timeout in milliseconds
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 2,
      },
      1000: {
        items: 3,
      },
    },
  };

  return (
    <div>
      <div>
        <Bot />
      </div>
      <Banner />

      <div id="service-section">

        <div className="container-fluid py-5">
          <div className="container">
            <div className="text-center mx-auto mb-5" style={{ maxWidth: 500 }}>
              <h5 className="d-inline-block text-dblue text-uppercase border-bottom border-5">
                Our
              </h5>
              <h1 className="display-4 text-dblue">Excellent Services</h1>
            </div>
            <OwlCarousel className="owl-theme" {...options}>
              {servicess.map((servicess, index) => (
                <div key={index} className="item">
                  <div className="service-item bg-light rounded d-flex flex-column align-items-center justify-content-center text-center">
                    <div className="service-icon mb-4">
                      <i
                        className={servicess.iconClass}
                        style={{ fontSize: "39px", color: "#011430" }}
                      />
                    </div>
                    <h4 className="mb-3 text-white">{servicess.title}</h4>
                    <p className="m-0 text-white">{servicess.description}</p>
                  </div>
                </div>
              ))}
            </OwlCarousel>
          </div>
        </div>
        </div>
        <div id="blood-section">
        <BarChart />
        <br />
        <br />
        </div>

        <div className="container-fluid bg-dblue py-5" id="near-section">
      <div className="text-center mx-auto mb-5" style={{ maxWidth: 500 }}>
        <h5 className="d-inline-block text-uppercase border-bottom border-5 text-white">
          Find
        </h5>
        <h1 className="display-4 text-white">
          Nearest Hospital With The Service You Wish To Avail
        </h1>
      </div>
      <div className="container py-5">
        <form>
        <div className="mx-auto" style={{ width: "100%", maxWidth: 600 }}>
          <div className="input-group">
            <input
              type="text"
              className="form-control border-primary w-75"
              placeholder="Search..."
              value={searchTerm}
              required
              onChange={handleInputChange}
            />
            <button
              type="button"
              className="btn btn-dark border-0 w-25"
              disabled={loading}
              onClick={() => {
                if (searchTerm !== "") {
                  handleSearch();
                }
                else if (searchTerm === "") {
                  Swal.fire('Error', "Search box can not be empty!", 'error');
                }
              }}
              >

{loading ? "Searching..." : "Search"}
            </button>
          </div>
          <div className="mt-3">
            {searchTerm !== "" && searchResults.length > 0 && (
              <div className="card">
                <div className="card-body p-0">
                  <SearchResultList results={searchResults} />
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="mt-9" style={{ display: "flex" }}>
          {searchResultsTable.length > 0 && (
            <SearchResultsTable results={searchResultsTable} />
          )}
        </div>
        </form>
      </div>
    </div>

        <div>
          <div className="container-fluid py-5 bg-white">
            <div className="container">
              <div
                className="text-center mx-auto mb-5"
                style={{ maxWidth: 500 }}
              >
                <h5 className="d-inline-block text-dblue text-uppercase border-bottom border-5">
                  Distinguish
                </h5>
                <h1 className="display-4 text-dblue">Doctors Rating</h1>
              </div>

              {/* <Search results={Search} /> */}

              <DoctorReviews reviews={doctorReviews} />
            </div>
          </div>
        </div>

        <div
          className="container-fluid bg-dblue py-5"
          id="appointment-section"
        >

              <Appointment />
            </div>


        <Emergency />

    </div>
  );
}

export default Home;
