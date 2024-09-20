import React, { useState, useEffect } from "react";
import SweetAlert from "react-bootstrap-sweetalert";
import "./../css/responsive.css";
import "@fortawesome/fontawesome-free/css/all.css";
import blankImage from './../assets/blank.png';

const generateStars = (rating) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <React.Fragment key={i}>
        <span className="fas fa-star"></span>
      </React.Fragment>
    );
  }

  if (halfStar) {
    stars.push(
      <React.Fragment key="half">
        <span className="fas fa-star-half-alt"></span>
      </React.Fragment>
    );
  }

  return stars;
};

const getStarColorClass = (rating) => {
  if (rating >= 1 && rating <= 2) {
    return "star-red";
  } else if (rating > 2 && rating <= 4) {
    return "star-orange";
  } else if (rating > 4 && rating <= 5) {
    return "star-gold";
  } else {
    return "star-gray";
  }
};

const DoctorReviews = ({ reviews }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [successAlert, setSuccessAlert] = useState(false);
  const [errorAlert, setErrorAlert] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [availableTimes, setAvailableTimes] = useState([]);
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const doctorsPerPage = 2;

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const fetchAvailableTimes = async (doctorId, date) => {
    try {
      const response = await fetch(
        `http://localhost:5206/api/Doctors_Cr/returntime?DoctorId=${doctorId}&AppointmentDate=${date}`
      );
      if (response.ok) {
        const times = await response.json();
        setAvailableTimes(times.map(formatTimeToAMPM));
      } else {
        console.error(
          "Failed to fetch available times:",
          response.status,
          response.statusText
        );
        setAvailableTimes([]);
      }
    } catch (error) {
      console.error("An error occurred while fetching available times:", error);
      setAvailableTimes([]);
    }
  };

  const formatTimeToAMPM = (timeString) => {
    const time = new Date(timeString);
    return time.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  useEffect(() => {
    if (selectedDoctor && appointmentDate) {
      fetchAvailableTimes(selectedDoctor.doctorid, appointmentDate);
    }
  }, [selectedDoctor, appointmentDate]);

  const filteredDoctors = reviews.filter((review) =>
    review.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = filteredDoctors.slice(
    indexOfFirstDoctor,
    indexOfLastDoctor
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const openModal = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as 'yyyy-mm-dd'
  };

  const formatTime = (timeString) => {
    // Extract the time part without AM/PM
    const timePart = timeString.split(" ")[0];
    // Split hours and minutes
    const [hours, minutes] = timePart.split(":");
    // Format the time as HH:mm:ss
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
  };

  const handleSubmit = async () => {
    const aPatientName = document.getElementById("patientName").value;
    const aType = document.getElementById("appointmentType").value;
    const aMobile = document.getElementById("mobile").value;
    const aEmail = document.getElementById("email").value;
    const aReason = document.getElementById("reason").value;

    // Check if any required field is empty
    if (!aPatientName || !aType || !aMobile || !aEmail || !aReason) {
      setFormValid(false);
      setErrorAlert(true); // Show error alert if any field is missing
      return;
    }

    // Phone number validation (must be 11 digits)
    if (!/^\d{11}$/.test(aMobile)) {
      setFormValid(false);
      setErrorAlert(true); // Show error alert if phone number is not 11 digits
      return;
    }

    // Email validation
    if (!/\S+@\S+\.\S+/.test(aEmail)) {
      setFormValid(false);
      setErrorAlert(true); // Show error alert if email is invalid
      return;
    }

    let aPatientDob = document.getElementById("patientDOB").value;
    if (aPatientDob) {
      aPatientDob = formatDate(aPatientDob);
    }

    let aDate = document.getElementById("appointmentDate").value;
    if (aDate) {
      aDate = formatDate(aDate);
    }

    let aTime = document.getElementById("appointmentTime").value;
    if (aTime) {
      aTime = formatTime(aTime);
    }

    try {
      const response = await fetch("http://localhost:5206/api/appointment_cr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          aPatientName,
          aPatientDob,
          aDate,
          aTime,
          aType,
          aMobile,
          aEmail,
          aReason,
          adId: selectedDoctor ? selectedDoctor.doctorid : null, // Check if selectedDoctor exists
          ahId: selectedDoctor ? selectedDoctor.hospitalid : null, // Check if selectedDoctor exists
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setSuccessAlert(true);
      } else {
        // Handle different types of errors
        if (response.status === 400) {
          throw new Error("Bad Request: Invalid data submitted.");
        } else if (response.status === 404) {
          throw new Error("Not Found: The requested resource was not found.");
        } else {
          throw new Error(`${response.status} - ${response.statusText}`);
        }
      }
    } catch (error) {
      setShowModal(false);
      setErrorAlert(true);
      console.error("An error occurred during form submission:", error);
    }
  };

  const [showModal1, setShowModal1] = useState(false);
  const openModal1 = async (doctorId) => {
    try {
      const response = await fetch(`http://localhost:5206/api/Feedback_Cr/Getreviewbyid?did=${doctorId}`);
      if (response.ok) {
        const data = await response.json();
        setDynamicReviews(data);
        setShowModal1(true);
      } else {
        console.error("Failed to fetch reviews:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while fetching reviews:", error);
    }
  };

  const closeModal1 = () => {
    setShowModal1(false);
  };

  // const reviewsstar = [
  //   {
  //     stars: 3,
  //     name: "Bob",
  //     reviewText:
  //       "Thompson Greenspon is so grateful to have worked with CPASiteSolutions on our",
  //   }
  // ];

  return (
    <div className="container-fluid py-5 d-flex flex-column align-items-center">
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
      {filteredDoctors.length === 0 && (
        <div className="alert alert-warning" role="alert">
          No results found matching the search term.
        </div>
      )}
      <div className="card-body">
        {currentDoctors.map((review, index) => (
          <div key={index} className="card mb-4 bg-dblue">
            <div className="card-body">
              <div className="row align-items-center">
                {/* Column for the image */}
                <div className="col-lg-2 col-md-3 col-sm-12 mb-3 mb-md-0">
                <img
                    className="img-fluid rounded-circle"
                    width="70"
                    style={{ height: "70px" }}
                    src={
                      review.image ? `http://localhost:5206/images_d/${review.image}` : blankImage
                    }
                    alt="Doctor"
                  />
                </div>
                {/* Column for the name */}
                <div className="col-lg-6 col-md-4 col-sm-6 ">
                  <h5 className="text-white">Dr. {review.name}</h5>

                  <p className="text-white">{review.d_Field}</p>
                  <p className="text-white">{review.hospitalName}</p>
                </div>
                {/* Column for the stars */}
                <div className="col-lg-4 col-md-4 col-sm-6 ">
                  <div className="star">
                    <h4 className="text-white">Rating</h4>
                    <span>{Math.floor(review.rating)} </span>
                    <span style={{ color: "gold" }}>
                       {generateStars(review.rating)}
                    </span>
                    <br></br>
                    <br/>
                    <button
                      id="modalOpen"
                      className="btn btn-primary bg-white text-dblue btn-block"
                     onClick={() => openModal1(review.doctorid)}

                    >
                      View Reviews
                    </button>

                  </div>
                  <br/>
                </div>
                {/* Column for the booking button */}
                <div className="border-top">
                  <div className="col-lg-12 col-md-12 col-sm-12 mt-3">
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-primary bg-white text-dblue"
                        onClick={() => openModal(review)}
                      >
                        Book An Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <nav aria-label="Page navigation example">
        <ul className="pagination">
          {Array.from(
            { length: Math.ceil(filteredDoctors.length / doctorsPerPage) },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <li
              key={pageNumber}
              className={`page-item ${
                pageNumber === currentPage ? "active" : ""
              }`}
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

      {/* Modal */}
      {showModal && selectedDoctor && (
        <div
          className="modal"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content text-dblue">
              <div className="modal-header">
                <h5 className="modal-title">Book Appointment</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              {!formValid && (
                <div className="alert alert-danger" role="alert">
                  All fields are required.
                </div>
              )}
              <div
                className="modal-body"
                style={{ maxHeight: "350px", overflowY: "auto" }}
              >
                <div>
                  <label>Hospital Name:</label>

                  <input
                    type="text"
                    className="form-control"
                    value={selectedDoctor.hospitalName}
                    readOnly
                  />
                </div>
                <div>
                  <label>Doctor:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={selectedDoctor.name}
                    readOnly
                  />
                </div>
                <div>
                  <label>Your Name:</label>
                  <input
                    id="patientName"
                    type="text"
                    className="form-control"
                    required
                    placeholder="John"
                    maxLength={25}
                    minLength={3}
                  />
                </div>
                <div>
                  <label>Date Of Birth:</label>
                  <input
                    id="patientDOB"
                    type="date"
                    className="form-control"
                    required
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <label>Select Appointment Date:</label>
                  <input
                    id="appointmentDate"
                    type="date"
                    className="form-control"
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    required
                    min={new Date().toISOString().split("T")[0]} // Set min attribute to today's date
                  />
                </div>
                <div>
                  <label>Appointment Time:</label>
                  <select
                    id="appointmentTime"
                    className="form-control"
                    required
                  >
                    <option value="">Select Time</option>
                    {availableTimes.map((time, index) => (
                      <option key={index} value={time}>
                        {time}
                      </option>
                    ))}

                    <option></option>
                  </select>
                </div>
                <div>
                  <label>Select Appointment Type:</label>
                  <select
                    id="appointmentType"
                    className="form-control"
                    required
                  >
                    <option value="">Select Appointment Type</option>
                    <option value="Physical">Physical</option>
                    <option value="Online">Online</option>
                  </select>
                </div>
                <div>
                  <label>Contact No.:</label>
                  <input
                    id="mobile"
                    type="tel"
                    placeholder="03xxxxxxxxxx"
                    className="form-control"
                    required
                    pattern="^03[0-9]{9}$"
                    maxLength={11}
                    minLength={11}
                  />
                </div>
                <div>
                  <label>Your Email:</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    required
                    placeholder="john@gmail.com"
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                  />
                </div>
                <div>
                  <label>Appointment Reason:</label>
                  <textarea
                    id="reason"
                    className="form-control"
                    rows="3"
                    required
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  Book Appointment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* End Modal */}
      {showModal1 && (
        <div
          className="modal-overlay"
          tabIndex="-1"
          role="dialog"
          style={{ display: "block" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
            closeModal1();
            }
            }}
        >
          <div className="modalre">
            <span className="close" id="modalClose" onClick={closeModal1}>
              &times;
            </span>
            <h2 className="text-dblue">Reviews</h2>
            {/* Reviews content */}
            <div className="row">
              {dynamicReviews.map((review, index) => (
                <div key={index} className="col-md-12">
                  <div className="review">
                    <div className="row">
                      <div>
                        <div className="stars">
                          {generateStars(review.stars)}
                        </div>
                        <div className="name"><h6 className="text-dblue">By:</h6> {review.name}</div>

                        <div className="review-text">
                        <h6 className="text-dblue">Comment:</h6> {review.reviewText}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Success Alert */}
      <SweetAlert
        show={successAlert}
        success
        title="Appointment Request Successful"
        onConfirm={() => {
          setSuccessAlert(false);
          setFormValid(true); // Reset form validity
        }}
      />
      {/* Error Alert */}
      <SweetAlert
        show={errorAlert}
        error
        title="Appointment Request Failed"
        text="Please try again later."
        onConfirm={() => setErrorAlert(false)}
      />
    </div>
  );
};

export default DoctorReviews;
