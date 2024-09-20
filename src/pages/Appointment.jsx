import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import img1 from "./../assets/image-removebg-preview.png";
import "./../css/img.css";
import SweetAlert from "react-bootstrap-sweetalert";
import Swal from 'sweetalert2';

function Appointment() {
  const [dobPickerOpen, setDobPickerOpen] = useState(false);
  const [apptDatePickerOpen, setApptDatePickerOpen] = useState(false);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleDOBChange = (date) => {
    setFormData((prevFormData) => ({ ...prevFormData, APatientDOB: date }));
    setDobPickerOpen(false);
    // Reset available times
    setAvailableTimes([]);
  };

  const handleApptDateChange = async (date) => {
    setFormData((prevFormData) => ({ ...prevFormData, ADate: date }));
    setApptDatePickerOpen(false);
    // Reset available times
    setAvailableTimes([]);

    if (formData.adId && date) {
      // Fetch available appointment times based on doctor ID and date
      try {
        const response = await fetch(
          `http://localhost:5206/api/Doctors_Cr/returntime?DoctorId=${
            formData.adId
          }&AppointmentDate=${date.toISOString().split("T")[0]}`
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
        console.error(
          "An error occurred while fetching available times:",
          error
        );
        setAvailableTimes([]);
      }
    }
  };

  const [formData, setFormData] = useState({
    APatientName: "",
    APatientDOB: "",
    ADate: "",
    ATime: "",
    adId: "",
    AType: "",
    AMobile: "",
    AEmail: "",
    AReason: "",
  });

  const [doctorsA, setDoctorsA] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDoctorsA = async (dhId) => {
    try {
      const response = await fetch(
        `http://localhost:5206/api/Doctors_Cr/ByHospitalId/${dhId}`
      );
      if (response.ok) {
        const doctorList = await response.json();
        setDoctorsA(doctorList);

        // Update the selected doctor ID in the state if the list is not empty
        if (doctorList.length > 0) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            adId: doctorList[0].dId,
          }));
        } else {
          // Handle the case where no doctors are found for the selected hospital
          setDoctorsA([]);
        }
      } else {
        console.error(
          "Failed to fetch doctors:",
          response.status,
          response.statusText
        );
      }
    } catch (error) {
      console.error("An error occurred while fetching doctors:", error);
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
    const fetchHospitalsA = async () => {
      try {
        const response = await fetch("http://localhost:5206/api/Hospital_Cr");
        if (response.ok) {
          const hospitalList = await response.json();
          setHospitals(hospitalList);
        } else {
          console.error(
            "Failed to fetch hospitals:",
            response.status,
            response.statusText
          );
        }
      } catch (error) {
        console.error("An error occurred while fetching hospitals:", error);
      }
    };

    fetchHospitalsA();
  }, []);

  const handleSubmitA = async (e) => {
    e.preventDefault();
    const requiredFields = [
      { name: "APatientName", label: "Your Name" },
      { name: "APatientDOB", label: "Date Of Birth" },
      { name: "ahId", label: "Hospital" },
      { name: "adId", label: "Doctor" },
      { name: "ADate", label: "Appointment Date" },
      { name: "ATime", label: "Appointment Time" },
      { name: "AType", label: "Appointment Type" },
      { name: "AMobile", label: "Contact No." },
      { name: "AEmail", label: "Your Email" },
      { name: "AReason", label: "Appointment Reason" },
    ];

    const emptyFields = requiredFields.filter((field) => !formData[field.name]);

    if (emptyFields.length > 0) {
      // If any required field is empty, display a SweetAlert
      setShowAlert(true);
      setAlertMessage(
        `Please fill out the following fields: ${emptyFields
          .map((field) => field.label)
          .join(", ")}`
      );
      return; // Prevent form submission
    }

    try {
      setLoading(true);
      const formattedData = {
        ...formData,
        APatientDOB: formatDate(formData.APatientDOB),
        ADate: formatDate(formData.ADate),
        ATime: formatTime(formData.ATime),
      };

      const response = await fetch("http://localhost:5206/api/appointment_cr", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        setFormData({
          APatientName: "",
          APatientDOB: "",
          ADate: "",
          ATime: "",
          adId: "",
          AType: "",
          AMobile: "",
          AEmail: "",
          AReason: "",
        });
        setLoading(false);
        // alert("Appointment request succesfull");
        Swal.fire('Success', "Appointment request succesfull!", 'success');
        // Add any additional actions you want to perform after successful submission
      } else {
        Swal.fire('Error', "Failed to create appointment!", 'error');
        console.error(
          "Failed to create appointment:",
          response.status,
          response.statusText
        );
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred during form submission:", error);
      setLoading(false);
    }
  };

  const handleInputChangeA = async (e) => {
    const { name, value } = e.target;

    // Convert date and time values to the desired format
    const formattedValue =
      name === "APatientDOB" || name === "ADate" ? formatDate(value) : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: formattedValue,
    }));

    if (name === "ahId") {
      setDoctorsA([]); // Clear the existing doctorsA list
      if (value) {
        try {
          const response = await fetch(
            `http://localhost:5206/api/Doctors_Cr/ByHospitalId/${value}`
          );

          if (response.ok) {
            const doctorList = await response.json();
            const availableDoctors = doctorList.filter(
              (doctor) => doctor.dAvailablityStatus === "Available"
            );
            setDoctorsA(availableDoctors);
            // setDoctorsA(doctorList);

            // Update the selected doctor ID in the state if the list is not empty
            if (doctorList.length > 0) {
              setFormData((prevFormData) => ({
                ...prevFormData,
                adId: doctorList[0].dId,
              }));
            } else {
              // Handle the case where no doctors are found for the selected hospital
              setDoctorsA([]);
              setFormData((prevFormData) => ({
                ...prevFormData,
                adId: "", // Set adId to an empty string if no doctors are found
              }));
            }
            // Reset available times whenever the hospital selection changes
            setAvailableTimes([]);
          } else {
            console.error(
              "Failed to fetch doctors:",
              response.status,
              response.statusText
            );
          }
        } catch (error) {
          console.error("An error occurred while fetching doctors:", error);
        }
      }
    }

    if (name === "adId") {
      // Reset available times whenever the doctor selection changes
      setAvailableTimes([]);
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    if (name === "ATime") {
      handleTimeChange(value);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Format as 'yyyy-mm-dd'
  };
  const handleTimeChange = (time) => {
    const formattedTime = `${time}:00.0000000`;
  };

  const formatTime = (timeString) => {
    // Extract the time part without AM/PM
    const timePart = timeString.split(" ")[0];
    // Split hours and minutes
    const [hours, minutes] = timePart.split(":");
    // Format the time as HH:mm:ss
    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}:00`;
  };

  return (
    <div className="container-fluid bg-dblue ">
      <div className="container">
        <div className="row gx-5">
          <div className="col-md-6 mb-5 mb-lg-0">
            <div className="row">
              <div className="col-md-12">
                <div className="mb-4">
                  <h5 className="d-inline-block text-primary text-uppercase border-bottom border-5">
                    Schedule
                  </h5>
                  <h1 className="display-4 text-white">An Appointment</h1>
                </div>
                <p className="text-white mb-5 ft16">
                  Make an appointment with the hospital of your choice in your
                  comfortable time
                </p>
              </div>
            </div>
            <div className="container">
              <div className="row">
                <div className="col-md-12 img-container">
                  <img src={img1} alt="Hospital" className="img-fluid" />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="bg-white text-center rounded p-5">
              <h1 className="mb-4 text-dblue">Book An Appointment</h1>
              <form onSubmit={handleSubmitA}>
                <div className="row g-3">
                  <div className="col-12">
                    <input
                      type="text"
                      required
                      className="form-control bg-white pla  border-1"
                      placeholder="Your Name"
                      style={{ height: 55}}
                      name="APatientName"
                      value={formData.APatientName}
                      onChange={handleInputChangeA}
                      maxLength={25}
                      minLength={3}
                    />
                  </div>
                  {/* <div className="col-12">
                  <TimePicker onChange={onChangeTime} value={valueTime} />
                  </div> */}
                  <div className="col-12">
                    <DatePicker
                      selected={formData.APatientDOB}
                      className="form-control bg-white pla border-1"
                      onChange={handleDOBChange}
                      style={{border:'1px solid #011430 !important' }}
                      placeholderText="Date Of Birth (mm/dd/yyyy)"
                      dateFormat="MM/dd/yyyy"
                      peekNextMonth
                      showMonthDropdown
                      showYearDropdown
                      required
                      dropdownMode="select"
                      maxDate={new Date()} // Set minDate to current date
                    />
                  </div>
                  <div className="col-12">
                    <select
                      className="form-select bg-white pla border-1"
                      style={{ height: 55}}
                      name="ahId"
                      required
                      value={formData.ahId}
                      onChange={handleInputChangeA}
                    >
                      <option disabled selected>
                        Select Hospital
                      </option>
                      {hospitals.map((hospital) => (
                        <option key={hospital.hId} value={hospital.hId}>
                          {hospital.hName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <select
                      className="form-select bg-white pla border-1"
                      style={{ height: 55}}
                      name="adId"
                      required
                      value={formData.adId || ""}
                      onChange={handleInputChangeA}
                    >
                      <option disabled selected>
                        Select Doctor
                      </option>
                      {doctorsA.map((doctor) => (
                        <option key={doctor.dId} value={doctor.dId}>
                          {doctor.dName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12">
                    <DatePicker
                      selected={formData.ADate}
                      onChange={handleApptDateChange}
                      className="form-control bg-white pla border-1"
                      placeholderText="Select Appointment Date (mm/dd/yyyy)"
                      dateFormat="MM/dd/yyyy"
                      required
                      peekNextMonth
                      showMonthDropdown
                      style={{border:'1px solid #011430 !important' }}
                      showYearDropdown
                      dropdownMode="select"
                      minDate={new Date()}
                    />
                  </div>
                  <div className="col-12">
                    {formData.adId && formData.ADate && (
                      <select
                        className="form-select bg-white pla border-1"
                        style={{ height: 55}}
                        name="ATime"
                        required
                        value={formData.ATime}
                        onChange={handleInputChangeA}
                      >
                        <option disabled value="">
                          Select Time
                        </option>
                        {availableTimes.map((time, index) => (
                          <option key={index} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className="col-12">
                    <select
                      className="form-control bg-white pla border-1"
                      style={{ height: 55}}
                      name="AType"
                      required
                      value={formData.AType}
                      onChange={handleInputChangeA}
                    >
                      <option value="">Select Appointment Type</option>
                      <option value="Physical">Physical</option>
                      <option value="Online">Online</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <input
                      type="tel"
                      className="form-control bg-white pla border-1"
                      placeholder="Contact No."
                      style={{ height: 55}}
                      name="AMobile"
                      required
                      pattern="^03[0-9]{9}$"
                      value={formData.AMobile}
                      onChange={handleInputChangeA}
                      maxLength={11}
                      minLength={11}
                    />
                  </div>
                  <div className="col-12">
                    <input
                      type="email"
                      className="form-control bg-white pla border-1"
                      placeholder="Your Email"
                      style={{ height: 55}}
                      name="AEmail"
                      required
                      pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                      value={formData.AEmail}
                      onChange={handleInputChangeA}
                      // maxLength={30}
                      // minLength={12}
                    />
                  </div>
                  <div className="col-12">
                    <textarea
                      className="form-control bg-white pla border-1"
                      placeholder="Appointment Reason"
                      style={{ height: 100}}
                      name="AReason"
                      required
                      value={formData.AReason}
                      onChange={handleInputChangeA}
                      maxLength={50}
                      minLength={5}
                    ></textarea>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary btn-hov w-100 py-3 text-white"
                      type="submit"
                    >
                      {loading ? "Sending..." : "Make an Appointment"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <SweetAlert
            show={showAlert}
            title="Required Fields"
            onConfirm={() => setShowAlert(false)}
          >
            {alertMessage}
          </SweetAlert>
        </div>
      </div>
    </div>
  );
}

export default Appointment;
