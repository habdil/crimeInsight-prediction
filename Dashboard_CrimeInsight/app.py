from flask import Flask, jsonify, render_template
from flask_cors import CORS
from joblib import load
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load model and related components
# model = load('model/crime_prediction_model.joblib')
# scaler = load('model/feature_scaler.joblib')

model = load('/home/alhwyji/mysite/crimeInsight-prediction/Dashboard_CrimeInsight/model/crime_prediction_model.joblib')

scaler = load('/home/alhwyji/mysite/crimeInsight-prediction/Dashboard_CrimeInsight/model/feature_scaler.joblib')
# Load feature names
with open('model/feature_names.txt', 'r') as f:
    feature_names = f.read().splitlines()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['GET'])
def predict():
    try:
        predictions = {}
        regions = ['JAKARTA BARAT', 'JAKARTA PUSAT', 'JAKARTA SELATAN', 'JAKARTA TIMUR', 'JAKARTA UTARA']
        
        for region in regions:
            features = extract_features(2024, region)
            feature_df = pd.DataFrame([features], columns=feature_names)
            scaled_features = scaler.transform(feature_df)
            prediction = model.predict(scaled_features)[0]
            predictions[region] = float(prediction)

        return jsonify({'2024': predictions})
    except Exception as e:
        app.logger.error(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 400

def extract_features(year, region):
    time = (year * 12) + 6  # Menggunakan bulan Juni sebagai representasi tahun
    
    kepadatan_penduduk = {
        'JAKARTA BARAT': 19516,
        'JAKARTA PUSAT': 18993,
        'JAKARTA SELATAN': 15472,
        'JAKARTA TIMUR': 15166,
        'JAKARTA UTARA': 11519
    }.get(region, 0)
    
    pengangguran_persen = {
        'JAKARTA BARAT': 6.39,
        'JAKARTA PUSAT': 6.42,
        'JAKARTA SELATAN': 5.37,
        'JAKARTA TIMUR': 7.24,
        'JAKARTA UTARA': 7.05
    }.get(region, 0)
    
    is_weekend = 0  # Mengasumsikan hari kerja
    
    # Placeholder untuk crime lag values - ini harus diupdate dengan data historis yang sesuai
    crime_lag_1 = 100 + (year - 2023) * 5  
    crime_lag_2 = 95 + (year - 2023) * 4
    crime_lag_3 = 105 + (year - 2023) * 3
    
    return [time, kepadatan_penduduk, pengangguran_persen, is_weekend, crime_lag_1, crime_lag_2, crime_lag_3]

if __name__ == '__main__':
    app.run(debug=True)