import random
import time
import requests
import json

from multiprocessing import Process, Value
from flask import Flask, request, make_response, json

# Define shared variables between process
SEND = Value("b", False)
INTERVAL = Value("i", 5)
FIWARE_API_KEY = "v2jggokgpepnvsb2uv4s40d59ov"
DEVICE_ID = "device001"

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    print(f"request: {request.json}")
    return make_response(json.dumps({"on": "method executed"}), 200)

@app.route("/device1", methods=["POST"])
def device1():
    global SEND

    data = request.json

    if "start" in data:
        start_command = data["start"]
        if "type" in start_command and start_command["type"] == "command":
            if "value" in start_command and isinstance(start_command["value"], dict):
                fiware_api_key = start_command["value"].get("FIWARE_API_KEY")
                device_id = start_command["value"].get("DEVICE_ID")

                if fiware_api_key and device_id:
                    update_sensor_params(fiware_api_key, device_id)
                    start_data_sending()
                    return make_response(json.dumps({"status": "Data sending started"}), 200)

    elif "stop" in data:
        stop_command = data["stop"]
        if "type" in stop_command and stop_command["type"] == "command":
            if "value" in stop_command and not stop_command["value"]:
                stop_data_sending()
                return make_response(json.dumps({"status": "Data sending stopped"}), 200)

    return make_response(json.dumps({"error": "Invalid command"}), 400)

def update_sensor_params(api_key, device_id):
    global FIWARE_API_KEY, DEVICE_ID
    FIWARE_API_KEY = api_key
    DEVICE_ID = device_id

def start_data_sending():
    global SEND
    SEND.value = True

def stop_data_sending():
    global SEND
    SEND.value = False

def sendData():
    while True:
        if SEND.value:
            humidity = random.randint(0, 100)
            temperature = random.randint(10, 40)

            url = f"http://fiware-iot-agent-json:7896/iot/json?k={FIWARE_API_KEY}&i={DEVICE_ID}"

            payload = json.dumps({"temperature": f"{temperature}", "humidity": f"{humidity}"})
            headers = {"Content-Type": "application/json"}

            requests.request("POST", url, headers=headers, data=payload)

        time.sleep(INTERVAL.value)

p = Process(target=sendData)
p.start()

if __name__ == "__main__":
    sendData()
