#Ejecutar modelo
import os
import subprocess
from flask import Flask, send_from_directory,jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Habilitar CORS para todas las rutas

@app.route('/ejecutar_script', methods=['GET'])
def ejecutar_script():
    try:
        command = 'python rnn_gan.py ' #introducir comando ejecución

        process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

        archivos = os.listdir('results\model-p\generated_data\out-results')

        while True:
            output = process.stdout.readline().decode()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
                if 'Epoch finalized' in output:
                    ultimo_archivo = archivos[-1]
                    ruta_archivo = os.path.join('results\model', ultimo_archivo)
                    return jsonify({'success': True}, ultimo_archivo)

                    #return f'ultimo_archivo', 200 #send_from_directory('results\model-p\generated_data\out-results', ultimo_archivo, as_attachment=True)

    except Exception as e:
        return f'Error al ejecutar el script: {str(e)}'

if __name__ == '__main__':
    app.run(port=8000)
