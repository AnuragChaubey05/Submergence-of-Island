from http.server import BaseHTTPRequestHandler
import urllib.parse
import json
import numpy as np
import pickle
import os

# Get path to the pickled model (model_pickle is in the parent directory of api/)
model_path = os.path.join(os.path.dirname(__file__), '../model_pickle')
with open(model_path, 'rb') as f:
    loaded_data = pickle.load(f)

est = loaded_data['est']
mean_30y = loaded_data['mean_30y']
df_clean = loaded_data['df_clean']

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters (e.g. /api/glacier?year=2024)
        parsed_url = urllib.parse.urlparse(self.path)
        params = urllib.parse.parse_qs(parsed_url.query)
        
        try:
            year = int(params.get('year', [2024])[0])
        except (ValueError, TypeError):
            year = 2024

        # Run Prediction using our statsmodels OLS model
        X_sep = np.array([1, year, 9])
        AnomaliesSIE_sep = float(est.predict(X_sep)[0])
        extent_sep = (AnomaliesSIE_sep * mean_30y[8] / 100) + mean_30y[8]
        extent_sep = round(extent_sep, 3)

        extent_sep1979 = df_clean[df_clean.Year == 1979].reset_index().loc[8, 'Extent']
        loss_SIE = round(extent_sep1979 - extent_sep, 3)

        # Send response headers
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        # Send response JSON
        response_data = {'loss_SIE': loss_SIE}
        self.wfile.write(json.dumps(response_data).encode('utf-8'))
