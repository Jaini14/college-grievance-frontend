//  About.jsx
import { useNavigate } from "react-router-dom";
import "../styles/About.css";
import logo from "../assets/logo.png";

function About() {
    const navigate = useNavigate();

    return (
        <div className="abt-page-wrapper">
            {/* --- SIMPLE NAVIGATION --- */}
            <nav className="abt-navbar">
                <div style={{ display: "flex", alignItems: "center" }}>
                    <img src={logo} alt="img" style={{ width: '50px' }} />
                    <div className="dash-nav-logo">Grievance Portal | About</div>
                </div>
                <div className="dash-nav-links">
                    <button onClick={() => navigate("/login")} className="dash-nav-btn primary">Login</button>
                    <button onClick={() => navigate("/register")} className="dash-nav-btn primary">Get Started</button>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="abt-hero">
                <div className="abt-container">
                    <h1>About Our System</h1>
                    <p className="abt-subtitle">
                        Fostering a transparent, responsive, and respectful environment at L. D. College of Engineering.
                    </p>
                </div>
            </section>

            {/* --- MAIN CONTENT --- */}
            <section className="abt-content-section">
                <div className="abt-container">
                    <div className="abt-text-block">
                        <h2>Welcome to the Grievance Redressal System</h2>
                        <p>
                            This platform is designed to provide students, faculty, and staff with a
                            <strong> transparent, efficient, and accessible</strong> way to raise and
                            resolve grievances within the institution. Our goal is to ensure that
                            every concern—academic, administrative, or personal—is heard and
                            addressed in a timely and fair manner.
                        </p>
                        <p>
                            At L. D. College of Engineering, we believe that a positive and supportive
                            environment is essential for growth and excellence. This system empowers
                            users to submit complaints, track their status, and receive updates,
                            ensuring complete accountability throughout the resolution process.
                        </p>
                    </div>

                    {/* --- MISSION BOX --- */}
                    <div className="abt-mission-box">
                        <p>
                            The system is strictly managed by the administration, where issues are
                            carefully reviewed, assigned to the appropriate faculty, and monitored
                            until resolution. This maintains discipline and trust within our community.
                        </p>
                    </div>

                    {/* --- KEY FEATURES --- */}
                    <div className="abt-features-section">
                        <h2 className="abt-center-title">Key Features</h2>
                        <div className="abt-features-grid">
                            <div className="abt-feature-card">
                                <div className="abt-icon">📝</div>
                                <h4>Easy Submission</h4>
                                <p>Quickly file grievances with detailed descriptions and evidence.</p>
                            </div>
                            <div className="abt-feature-card">
                                <div className="abt-icon">📍</div>
                                <h4>Real-time Tracking</h4>
                                <p>Monitor exactly where your complaint stands in the resolution lifecycle.</p>
                            </div>
                            <div className="abt-feature-card">
                                <div className="abt-icon">🤝</div>
                                <h4>Expert Assignment</h4>
                                <p>Issues are routed to the specific faculty best suited to solve them.</p>
                            </div>
                            <div className="abt-feature-card">
                                <div className="abt-icon">🛡️</div>
                                <h4>Secure & Confidential</h4>
                                <p>Your data is protected and handled only by authorized personnel.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    );
}
export default About;