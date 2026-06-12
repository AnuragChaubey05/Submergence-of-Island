# Submergence of Island (Lakshadweep) - Climate Predictive Dashboard

This project is an interactive web dashboard designed to visualize and predict glacier melting (sea ice extent anomalies) and its impact on global sea-level rise, with a focus on the flood/submergence risks for the Lakshadweep islands.

---

## Features
* **Yearly Predictions**: Select a year (2024–2028) and predict polar glacier melting and sea-level rise.
* **Dynamic Chart Explanations**: Text descriptions below the charts update automatically to explain trends based on the year you select.
* **Interactive Dashboard**: Plots showing global temperature correlations, sea ice shrinkage, and submergence maps for Lakshadweep.
* **Insights Page**: Brief explanations of the science behind glacier melting, ocean thermal expansion, atoll vulnerability, and the machine learning model details.
* **Modern UI**: Dark-mode theme with glassmorphism layout, clean typography (Outfit & Inter fonts), and smooth transitions.

---

## Machine Learning Models

### 1. Glacier Melt Model (Linear Regression)
* **Algorithm**: Ordinary Least Squares (OLS) Linear Regression.
* **Details**: Trained on satellite sea ice datasets (September minimums). The model shows a downward trend of **-0.568 million km²** of sea ice lost per year ($R^2 = 0.568$).
* **Metric**: Calculates melting by comparing the predicted September extent against the 1979 baseline record.

### 2. Sea Level Rise Model (LSTM)
* **Algorithm**: Long Short-Term Memory (LSTM) Recurrent Neural Network.
* **Details**: Trained on monthly satellite altimetry data from 1992 to 2026 to learn seasonal sea-level anomalies and forecast the trend up to 2028.

---

## Project Structure
```text
├── Submergence of Island/
│   ├── api/
│   │   └── glacier.py          # Serverless function for Vercel
│   ├── Models/
│   │   ├── LSTM/               # LSTM training code and sea level data
│   │   └── Linear Regression/  # Linear regression training code and ice data
│   ├── main.py                 # Local Python backend (Eel)
│   ├── model_pickle            # Trained linear regression model weights
│   ├── requirements.txt        # Python dependencies for local & Vercel run
│   └── web/                    # HTML/CSS/JS frontend files
└── README.md
```

---

## Running Locally

1. **Install dependencies**:
   Run this command inside the `Submergence of Island/` directory:
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the app**:
   ```bash
   python main.py
   ```
   *This starts the local backend and automatically opens the dashboard in a new browser window.*
