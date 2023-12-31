from flask import Flask, request, jsonify
from flask_cors import CORS
from json import loads
import rainbow as rb
import pandas as pd
from pandas import DataFrame
import numpy as np
from scipy.integrate import simpson
from scipy.integrate import trapezoid
from scipy.interpolate import UnivariateSpline

# Create the app instance
app = Flask(__name__)
CORS(app)

defaultFilename = "../assests/data/001-D3F-A1-5068080-0015-4.D"
# Extract the file from the directory
datadir = rb.read(defaultFilename)
datafile = datadir.get_file("MSD1.MS")
well_data = datafile.data.T

# Well data information that uses the path to the well we are looking for


@app.route('/well')
def well():
    # Extract the requested masses from the file
    df = DataFrame(well_data, columns=datafile.xlabels.tolist(),
                   index=datafile.ylabels.tolist())
    df = df.query("260 < index < 340")

    # Create the json object that will return the result from the data frame
    result = df.to_json(orient="split")
    parsed = loads(result)
    wellData = {
        "columns": parsed['columns'],
        "index": parsed['index'],
        "values": parsed['data']
    }

    return jsonify(wellData)

# Route that will perform baseline correction


@app.route('/baselineCorrection', methods=['POST'])
def baselineCorrection():
    try:
        # Retreive data from the POST request
        data = request.get_json()
        # update the arrays to numpy so operation can be easier
        x_data = np.array(data.get("xData"))
        y_data = np.array(data.get("yData"))
        baseline_time_ranges = data.get("baselineTimeRange")
        # perform deafault baseline correction here
        noise_mask = np.zeros_like(x_data, dtype=bool)
        for noise_region in baseline_time_ranges:
            noise_start, noise_end = noise_region["noise_start"], noise_region["noise_end"]           
            noise_mask |= (x_data >= noise_start) & (x_data <= noise_end)
            noise_x = x_data[noise_mask]
            noise = y_data[noise_mask]
            spline = UnivariateSpline(noise_x, noise, k=1, s=1)
            baseline = spline(x_data)
        # extract the time region
        if "regionTime" in data:
            region_time = data.get("regionTime")
            min_time, max_time = region_time["min_time"], region_time["max_time"]
        else:
            min_time, max_time = baseline_time_ranges[0]["noise_start"], baseline_time_ranges[0]["noise_end"] 
        time_indices = [i for i, time in enumerate(
            x_data) if min_time <= time <= max_time]
        selected_times = x_data[time_indices]
        updated_y_data = y_data - baseline
        corrected_baseline = baseline[time_indices]
        # Return baseline as a response from the POST request
        response = {"baseline": corrected_baseline.tolist(),
                    "times": selected_times.tolist(), 
                    "values": updated_y_data.tolist()}
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)})

# Route that gives the path and channel that we need to process


@app.route('/area', methods=['POST'])
def area():
    try:
        # Retrieve data from the POST request
        data = request.get_json()
        # update the arrays to numpy so operation can be easier
        x_data = data.get("xData")
        y_data = data.get("yData")
        range = data.get("range")
        # area that will get return to client 
        area = []
        # retreive slicing indecies from range 
        for peak in range:
            peak_start, peak_end = peak["leftside"], peak["rightside"] 
            # slice the x,y data axis given the peak start and end index
            xDataRange = x_data[peak_start:peak_end]
            yDataRange = y_data[peak_start:peak_end]
            # calulate the area given the updated axis
            peak_area = trapezoid(
                y=yDataRange,
                x=xDataRange
            )
            print("the peak area:", peak_area)
            area.append(peak_area)
        response = {"area": area}
        return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    app.run(debug=True, port=7000)
