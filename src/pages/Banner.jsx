import React, { Component } from "react";
//import Swiper from "swiper/bundle";
import "swiper/swiper-bundle.css";
import "./../css/responsive.css";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default class Banner extends Component {
  render() {
    const settings = {
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      dots: true,
      autoplay: true,
      speed: 100,
      autoplaySpeed: 3000,
      infinite: true,
    };
    return (
      <section className="slider_section">
        <Slider className="slider_area slick_slider_activation" {...settings}>
          <div className="single_slider d-flex align-items-center img1">
            <div className="container">
              <div className="row">
                <div className="col-xl-9 col-md-12">
                  <div className="single_slider_inner">
                    <div className="slider_text">
                      <h1>
                        <span>LifeLine </span>
                        <br />Connecting Health, Hope and Care
                      </h1>

                      <p>
                        We provide Video Calling feature which allows
                        you to connect with your doctor instantly.
                      </p>
                      <br/>
                      {/* <br/> */}
                      <Link
                        to="https://dlifeline.lawseer.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button
                          className="theme-btn"
                          data-animation="fadeInUp"
                          data-delay=".6s"
                        >
                          <span className="btn-text">Login Now!</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single_slider d-flex align-items-center img2">
            <div className="container">
              <div className="row">
                <div className="col-xl-9 col-md-12">
                  <div className="single_slider_inner">
                    <div className="slider_text">
                      <h1>
                        <span>LifeLine </span>
                        <br />Connecting Health, Hope and Care
                      </h1>
                      <p>
                        Find the nearest hospital offering services you want for
                        your loved ones.
                      </p>
                      <br/>
                      {/* <br/> */}
                      <Link
                        to="https://dlifeline.lawseer.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button
                          className="theme-btn"
                          data-animation="fadeInUp"
                          data-delay=".6s"
                        >
                          <span className="btn-text">Login Now!</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="single_slider d-flex align-items-center img3">
            <div className="container">
              <div className="row">
                <div className="col-xl-9 col-md-12">
                  <div className="single_slider_inner">
                    <div className="slider_text">
                      <h1>
                        <span>LifeLine </span>
                        <br />Connecting Health, Hope and Care
                      </h1>
                      <p>
                      Timely updated via texts and emails for appointments and medications.
                      </p><br/>
                      {/* <br/> */}
                      <Link
                        to="https://dlifeline.lawseer.co/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <button
                          className="theme-btn"
                          data-animation="fadeInUp"
                          data-delay=".6s"
                        >
                          <span className="btn-text">Login Now!</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Slider>
      </section>
    );
  }
}
