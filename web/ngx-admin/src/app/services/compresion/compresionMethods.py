import os
from midi2audio import FluidSynth

def convertir_midi_a_mp3(ruta_archivo_midi, ruta_archivo_mp3):
    # Crear un objeto FluidSynth
    fluidsynth = FluidSynth()

    # Generar el archivo de audio WAV a partir del archivo MIDI
    nombre_archivo_wav = os.path.splitext(ruta_archivo_midi)[0] + ".wav"
    fluidsynth.midi_to_audio(ruta_archivo_midi, nombre_archivo_wav)

    # Convertir el archivo WAV a MP3 utilizando ffmpeg
    os.system(f'ffmpeg -i "{nombre_archivo_wav}" "{ruta_archivo_mp3}"')

    # Eliminar el archivo WAV
    os.remove(nombre_archivo_wav)

# Ejemplo de uso
#ruta_archivo_midi = "ruta/al/archivo.mid"
#ruta_archivo_mp3 = "ruta/al/archivo.mp3"

#convertir_midi_a_mp3(ruta_archivo_midi, ruta_archivo_mp3)
