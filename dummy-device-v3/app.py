import random
import time
import json
import requests

from multiprocessing import Process, Value
from flask import Flask, request, make_response, json

# Define shared variables between process
SEND = Value('b', False)
INTERVAL = Value('i', 5)
RFID_ACTIVATED = Value('b', False)

app = Flask(__name__)

@app.route("/", methods=['GET', 'POST'])
def index():
    print(f"request: {request.json}")
    return make_response(json.dumps({"on":"method executed"}), 200)

@app.route("/rfid", methods=['GET','POST'])
def rfid():
    if request.method == 'POST':
        data = request.json

        if "activate" in data:
            if RFID_ACTIVATED.value == False:
                RFID_ACTIVATED.value = True
                return make_response(json.dumps({'activate': 'RFID activated'}), 200)
        
        elif "disable" in data:
            SEND.value = False
            RFID_ACTIVATED.value = False
            return make_response(json.dumps({'disable': 'RFID deactivated'}), 200)

@app.route("/dht22", methods=['GET', 'POST'])
def dht22():
    if RFID_ACTIVATED.value == True:
        if request.method == 'POST':
            data = request.json

            if "start" in data:
                if SEND.value == False:
                    SEND.value = True
                    return make_response(json.dumps({'start': 'DHT22 started'}), 200)
                elif SEND.value == True:
                    return make_response(json.dumps({'start': 'DHT22 already started'}), 200)
                else:
                    return make_response(json.dumps({'error': 'Method not allowed'}), 405)
                
            elif "stop" in data:
                if SEND.value == True:
                    SEND.value = False
                    return make_response(json.dumps({'stop': 'DHT22 stopped'}), 200)
                elif SEND.value == False:
                    return make_response(json.dumps({'stop': 'DHT22 already stopped'}), 200)
                else:
                    return make_response(json.dumps({'error': 'Method not allowed'}), 405)
            elif "interval" in data:
                try:
                    INTERVAL.value = int(data['interval'])
                    return make_response(json.dumps({'interval': 'Interval changed'}), 200)
                except:
                    return make_response(json.dumps({'error': 'Method not allowed'}), 405)
                return make_response(json.dumps({'error': 'Invalid Interval'}), 405)
            else:
                return make_response(json.dumps({'error': 'Method not allowed'}), 405)            
    else:
        return make_response(json.dumps({'error': 'RFID is not activated'}), 200)

#Running from a thread.
def sendData():
    while True:
        if SEND.value:
            humidity = random.randint(0,100)
            temperature = random.randint(10,40)

            url = "http://fiware-iot-agent-json:7896/iot/json?k=4jggokgpepnvsb2uv4s40d59ov&i=device050"

            payload = json.dumps({
                "temperature": temperature,
                "humidity":  humidity
            })

            headers = {
                'fiware-service': 'openiot',
                'fiware-servicepath': '/',
                'Content-Type': 'application/json'  
            }
            try:
                response = requests.request("POST", url, headers=headers, data=payload)
            except:
                print("Error sending the message")
        
        time.sleep(INTERVAL.value)

p = Process(target=sendData).start()

if __name__ == "__main__":
    sendData()