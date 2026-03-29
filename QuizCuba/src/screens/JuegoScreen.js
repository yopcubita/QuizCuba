import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { colores } from "../styles/colores";
import { preguntas } from "../data/preguntas";
import { Audio } from 'expo-av';

const TIEMPO_POR_PREGUNTA = 30;
const PREGUNTAS_POR_RONDA = 10;

function mezclar(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function JuegoScreen({ navigation, route }) {
  const { categoria, label } = route.params;

  const [ronda] = useState(() => {
    const pool =
      categoria === "todas"
        ? mezclar(preguntas)
        : mezclar(preguntas.filter((p) => p.categoria === categoria));
    return pool.slice(0, PREGUNTAS_POR_RONDA);
  });

  const [indice, setIndice] = useState(0);
  const [seleccionada, setSeleccionada] = useState(null);
  const [correctas, setCorrectas] = useState(0);
  const [mostrarDato, setMostrarDato] = useState(false);
  const [tiempo, setTiempo] = useState(TIEMPO_POR_PREGUNTA);
  const [bloqueado, setBloqueado] = useState(false);
  const intervaloRef = useRef(null);
  const [respuestas, setRespuestas] = useState({});
  const preguntaActual = ronda[indice];
  useEffect(() => {
    setTiempo(TIEMPO_POR_PREGUNTA);
    setBloqueado(false);
    setSeleccionada(null);
    setMostrarDato(false);

    intervaloRef.current = setInterval(() => {
      setTiempo((t) => {
        if (t <= 1) {
          clearInterval(intervaloRef.current);
          elegirOpcion(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(intervaloRef.current);
  }, [indice]);

  function elegirOpcion(idx) {
  if (bloqueado) return;
  clearInterval(intervaloRef.current);
  setBloqueado(true);
  setSeleccionada(idx);
  setRespuestas((r) => ({ ...r, [indice]: idx }));
  setMostrarDato(true);
  if (idx === preguntaActual.correcta) {
    setCorrectas((c) => c + 1);
    reproducirSonido('correcto');
  } else {
    reproducirSonido('incorrecto');
  }
}
function siguiente() {
  if (indice + 1 >= ronda.length) {
    navigation.replace("Resultado", {
      correctas,
      total: ronda.length,
      categoria: label,
      detalle: ronda.map((p, i) => ({
        pregunta: p.pregunta,
        correcta: p.opciones[p.correcta],
        respondida: respuestas[i] !== undefined ? p.opciones[respuestas[i]] : "Sin responder",
        acerto: respuestas[i] === p.correcta,
      })),
    });
    return;
  }
  setIndice((i) => i + 1);
}

  function colorBoton(idx) {
    if (!bloqueado) return colores.fondoOpcion;
    if (idx === preguntaActual.correcta) return colores.correcto;
    if (idx === seleccionada) return colores.incorrecto;
    return colores.fondoOpcion;
  }

  const letras = ["A", "B", "C", "D"];
async function reproducirSonido(tipo) {
  try {
    const archivos = {
      correcto: require('../../assets/sounds/correcto.wav'),
      incorrecto: require('../../assets/sounds/incorrecto.wav'),
    };
    const { sound } = await Audio.Sound.createAsync(archivos[tipo]);
    await sound.playAsync();
    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.didJustFinish) sound.unloadAsync();
    });
  } catch (e) {
    console.log('Error sonido:', e);
  }
}
  return (
    <SafeAreaView style={estilos.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor={colores.fondo} />

      <View style={estilos.encabezado}>
        <Text style={estilos.progreso}>
          {indice + 1} / {ronda.length}
        </Text>
        <Text style={estilos.temporizador}>{tiempo}s</Text>
        <Text style={estilos.puntaje}>✓ {correctas}</Text>
      </View>

      <View style={estilos.barraFondo}>
        <View
          style={[
            estilos.barraRelleno,
            {
              width: `${(tiempo / TIEMPO_POR_PREGUNTA) * 100}%`,
              backgroundColor:
                tiempo > 10 ? colores.primario : colores.incorrecto,
            },
          ]}
        />
      </View>

      <Text style={estilos.categoria}>{label}</Text>

      <View style={estilos.tarjetaPregunta}>
        <Text style={estilos.textoPregunta}>{preguntaActual.pregunta}</Text>
      </View>

      <View style={estilos.opciones}>
        {preguntaActual.opciones.map((opcion, idx) => (
          <TouchableOpacity
            key={idx}
            style={[estilos.botonOpcion, { backgroundColor: colorBoton(idx) }]}
            onPress={() => elegirOpcion(idx)}
            disabled={false}
          >
            <Text style={estilos.letra}>{letras[idx]}</Text>
            <Text style={estilos.textoOpcion}>{opcion}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {mostrarDato && (
        <View style={estilos.dato}>
          <Text style={estilos.datotitulo}>💡 ¿Sabías que...?</Text>
          <Text style={estilos.datoTexto}>{preguntaActual.dato}</Text>
          <TouchableOpacity style={estilos.botonSiguiente} onPress={siguiente}>
            <Text style={estilos.textoSiguiente}>
              {indice + 1 >= ronda.length ? "Ver resultado →" : "Siguiente →"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    paddingHorizontal: 20,
  },
  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 10,
  },
  progreso: { fontSize: 14, color: colores.textoSecundario },
  temporizador: { fontSize: 14, color: colores.amarillo, fontWeight: "bold" },
  puntaje: { fontSize: 14, color: colores.correcto, fontWeight: "bold" },
  barraFondo: {
    height: 4,
    backgroundColor: colores.borde,
    borderRadius: 2,
    marginBottom: 12,
  },
  barraRelleno: {
    height: 4,
    borderRadius: 2,
  },
  categoria: {
    fontSize: 12,
    color: colores.primario,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  tarjetaPregunta: {
    backgroundColor: colores.fondoTarjeta,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colores.borde,
    minHeight: 100,
    justifyContent: "center",
  },
  textoPregunta: {
    fontSize: 18,
    color: colores.texto,
    lineHeight: 26,
    fontWeight: "500",
  },
  opciones: { gap: 10 },
  botonOpcion: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  letra: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    textAlign: "center",
    lineHeight: 28,
    color: colores.texto,
    fontWeight: "bold",
    fontSize: 13,
    marginRight: 12,
  },
  textoOpcion: {
    flex: 1,
    fontSize: 15,
    color: colores.texto,
  },
  dato: {
    backgroundColor: colores.fondoTarjeta,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: colores.primario,
  },
  datotitulo: {
    fontSize: 13,
    color: colores.primario,
    fontWeight: "bold",
    marginBottom: 6,
  },
  datoTexto: {
    fontSize: 13,
    color: colores.textoSecundario,
    lineHeight: 20,
    marginBottom: 12,
  },
  botonSiguiente: {
    alignSelf: "flex-end",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colores.primario,
    borderRadius: 20,
  },
  textoSiguiente: {
    color: colores.fondo,
    fontWeight: "bold",
    fontSize: 14,
  },
});