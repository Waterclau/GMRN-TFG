#Connection with database
import mysql.connector
import pandas as pd
from mysql.connector import Error
connection = mysql.connector.connect(host='',
                                         database='',
                                         user='',
                                         password='')
df = pd.read_sql_query('',connection)
df.head()
#Compresion methods
#Midi to WAV
import midi2audio
from midi2audio import FluidSynth

def midi_to_wav(midi_file):
    output_wav = midi_file.replace(".mid", ".wav")
    FluidSynth().midi_to_audio(midi_file, output_wav)
    return output_wav
#Midi to MP3
import midi2audio
from midi2audio import FluidSynth
from pydub import AudioSegment
import os

def midi_to_mp3(midi_file):
    output_mp3 = midi_file.replace(".mid", ".mp3")
    # Convertir MIDI a audio WAV
    wav_file = output_mp3.replace(".mp3", ".wav")
    FluidSynth().midi_to_audio(midi_file, wav_file)

    # Convertir audio WAV a MP3
    audio = AudioSegment.from_wav(wav_file)
    audio.export(output_mp3, format="mp3")

    # Eliminar archivo WAV temporal
    os.remove(wav_file)

    return output_mp3
#Midi to FLAC
import midi2audio
from midi2audio import FluidSynth
from pydub import AudioSegment
import os

def midi_to_flac(midi_file):
    output_flac = midi_file.replace(".mid", ".flac")
    # Convertir MIDI a audio WAV
    wav_file = output_flac.replace(".flac", ".wav")
    FluidSynth().midi_to_audio(midi_file, wav_file)

    # Convertir audio WAV a FLAC
    audio = AudioSegment.from_wav(wav_file)
    audio.export(output_flac, format="flac")

    # Eliminar archivo WAV temporal
    os.remove(wav_file)

    return output_flac

#Rutas API

from flask import Flask, jsonify, request , send_file
from flask_cors import CORS
import mysql.connector
from flask_httpauth import HTTPBasicAuth
from midi2audio import FluidSynth
import os
from tempfile import NamedTemporaryFile  
import subprocess
import tensorflow as tf



connection = mysql.connector.connect(
    host='',
    database='',
    user='',
    password=''
)

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas
auth = HTTPBasicAuth()

# Auth
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    nombre = data.get('nombre')
    password = data.get('pass')

    cursor = connection.cursor()
    query = "SELECT COUNT(*) FROM clientes WHERE nombre = %s AND pass = %s"
    cursor.execute(query, (nombre, password))
    result = cursor.fetchone()

    if result[0] > 0:
        return jsonify({'success': True})
    else:
        return jsonify({'success': False})
#Register
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    nombre = data.get('nombre')
    password = data.get('pass')

    cursor = connection.cursor()

    # Verificar si ya existe un elemento con el mismo nombre o contraseña
    query = "SELECT COUNT(*) FROM clientes WHERE nombre = %s OR pass = %s"
    cursor.execute(query, (nombre, password))
    result = cursor.fetchone()

    if result[0] > 0:
        # Ya existe un elemento con el mismo nombre o contraseña, devuelve un error
        return jsonify({'success': False, 'message': 'Nombre o contraseña ya existente'})

    # No existe un elemento con el mismo nombre o contraseña, agregar una nueva fila
    insert_query = "INSERT INTO clientes (nombre, pass) VALUES (%s, %s)"
    cursor.execute(insert_query, (nombre, password))
    connection.commit()

    return jsonify({'success': True, 'message': 'Elemento agregado correctamente'})

#Canciones
@app.route('/canciones', methods=['POST'])
def get_canciones():
    data = request.get_json()
    nombre = data.get('nombre')

    cursor = connection.cursor()

    # Obtener todas las canciones que coinciden con el nombre proporcionado
    query = "SELECT * FROM canciones WHERE nombre LIKE %s"
    cursor.execute(query, ('%' + nombre + '%',))
    result = cursor.fetchall()

    canciones = []
    for row in result:
        cancion = {
            'nombre': row[0],
            'titulo': row[1],
            'id': row[2],
            #'duracion': row[3]
        }
        canciones.append(cancion)

    return jsonify({'success': True},canciones)

# Ruta para manejar la inserción de canciones
@app.route('/insertar_cancion', methods=['POST'])
def insertar_cancion():
    # Obtener los datos de la canción desde la solicitud POST
    data = request.get_json()
    print(data)
    nombre = data.get('nombre')
    titulo = data.get('titulo')
    idd = data.get('id')

    # Establecer la conexión a la base de datos
    cursor = connection.cursor()

    # Ejecutar la consulta de inserción
    query = "INSERT INTO canciones (nombre, titulo, id) VALUES (%s, %s, %s)"
    cursor.execute(query, (nombre, titulo, idd))
    connection.commit()

    return jsonify({'success': True, 'message': 'Cancion agregada correctamente'})

@app.route('/convert_wav', methods=['POST'])
def convert_wav():
    if 'file' not in request.files:
        return "No se encontró el archivo MIDI", 400
    
    midi = request.files['file']
    midi.save('temp.mid')

    wav_file = midi_to_wav('temp.mid')

    # Eliminar archivo MIDI temporal
    os.remove('temp.mid')

    return send_file(wav_file, as_attachment=True), 200

@app.route('/convert_mp3', methods=['POST'])
def convert_mp3():
    if 'file' not in request.files:
        return "No se encontró el archivo MIDI", 400
    
    midi = request.files['file']
    midi.save('temp.mid')

    mp3_file = midi_to_mp3('temp.mid')

    # Eliminar archivo MIDI temporal
    os.remove('temp.mid')

    return send_file(mp3_file, as_attachment=True), 200

@app.route('/convert_flac', methods=['POST'])
def convert_flac():
    if 'file' not in request.files:
        return "No se encontró el archivo MIDI", 400
    
    midi = request.files['file']
    midi.save('temp.mid')

    flac_file = midi_to_flac('temp.mid')

    # Eliminar archivo MIDI temporal
    os.remove('temp.mid')

    return send_file(flac_file, as_attachment=True), 200

@app.route('/ejecutar-python')
def ejecutar_python():
    python_script_path = 'tensors.py'  # Ruta completa al script Python
    subprocess.run(['python', python_script_path], check=True)
    return jsonify({'message': 'Comando Python ejecutado correctamente'})
   

if __name__ == '__main__':
    app.run()
