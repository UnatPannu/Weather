import './styles/description.css';
 
function Description() {
    return (
      <div className="description-container">
        <div className="feature-box">
          <h3>📍 Smart Location</h3>
          <p>Automatically detects your location or lets you search manually — perfect if location access is blocked.</p>
        </div>
        <div className="feature-box">
          <h3>📊 Interactive Forecasts</h3>
          <p>See real-time updates and 7-day forecasts with clean, interactive charts for temperature and trends.</p>
        </div>
        <div className="feature-box">
          <h3>🌦️ All-in-One View</h3>
          <p>Detailed weather info including humidity, wind speed, and daily breakdowns — all in one sleek interface.</p>
        </div>
      </div>
    );
  }
  
export default Description;