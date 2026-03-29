import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colores } from "../styles/colores";
import * as Clipboard from 'expo-clipboard';
import { Alert } from 'react-native';
import { Audio } from 'expo-av';

export default function ResultadoScreen({ navigation, route }) {
  const { correctas, total, categoria, detalle } = route.params;
  const porcentaje = Math.round((correctas / total) * 100);
  const [guardado, setGuardado] = useState(false);

  function mensaje() {
    if (porcentaje === 100) return "¡Perfecto! Eres un experto 🏆";
    if (porcentaje >= 80) return "¡Excelente resultado! 🌟";
    if (porcentaje >= 60) return "¡Buen trabajo! Sigue practicando 💪";
    if (porcentaje >= 40) return "Puedes mejorar, ¡inténtalo de nuevo! 📚";
    return "Sigue estudiando, ¡tú puedes! 🇨🇺";
  }

  useEffect(() => {
    async function guardarPuntaje() {
      try {
        const entrada = {
          correctas,
          total,
          porcentaje,
          categoria,
          detalle,
          fecha: new Date().toLocaleDateString("es-CU"),
        };
        const raw = await AsyncStorage.getItem("ranking");
        const lista = raw ? JSON.parse(raw) : [];
        lista.unshift(entrada);
        const top20 = lista.slice(0, 20);
        await AsyncStorage.setItem("ranking", JSON.stringify(top20));
        setGuardado(true);
      } catch (e) {
        console.log("Error guardando puntaje:", e);
      }
    }
    guardarPuntaje();
  }, []);
  useEffect(() => {
  async function reproducirVictoria() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/victoria.wav')
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) sound.unloadAsync();
      });
    } catch (e) {
      console.log('Error sonido victoria:', e);
    }
  }
  reproducirVictoria();
}, []);

  function compartirWhatsApp() {
  const estrellas = porcentaje === 100 ? "🏆🏆🏆" : porcentaje >= 80 ? "⭐⭐⭐" : porcentaje >= 60 ? "⭐⭐" : "⭐";
  const texto = `${estrellas} ¡Jugué Quiz Cuba!\n\n📊 Resultado: ${correctas}/${total} correctas\n💯 Porcentaje: ${porcentaje}%\n📚 Categoría: ${categoria}\n\n¿Puedes superarme? 🇨🇺`;
  Clipboard.setStringAsync(texto).then(() => {
    Alert.alert(
      "¡Listo!",
      "El resultado fue copiado. Ahora pégalo en WhatsApp.",
      [{ text: "OK" }]
    );
  });
}
  return (
    <SafeAreaView style={estilos.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor={colores.fondo} />
      <View style={estilos.cuerpo}>
        <Text style={estilos.emoji}>
          {porcentaje === 100 ? "🏆" : porcentaje >= 60 ? "🌟" : "📚"}
        </Text>
        <Text style={estilos.mensaje}>{mensaje()}</Text>
        <View style={estilos.tarjeta}>
          <Text style={estilos.etiqueta}>Resultado</Text>
          <Text style={estilos.puntajeGrande}>
            {correctas}
            <Text style={estilos.puntajeDenominador}>/{total}</Text>
          </Text>
          <View style={estilos.barraFondo}>
            <View
              style={[
                estilos.barraRelleno,
                {
                  width: `${porcentaje}%`,
                  backgroundColor:
                    porcentaje >= 60 ? colores.correcto : colores.incorrecto,
                },
              ]}
            />
          </View>
          <Text style={estilos.porcentaje}>{porcentaje}% correcto</Text>
          <Text style={estilos.categoria}>{categoria}</Text>
          {guardado && (
            <Text style={estilos.guardadoTag}>✓ Guardado en el ranking</Text>
          )}
        </View>
      </View>
      <View style={estilos.botones}>
        <TouchableOpacity
          style={[estilos.boton, { backgroundColor: colores.primario }]}
          onPress={() => navigation.replace("Juego", route.params)}
        >
          <Text style={estilos.textoBoton}>Jugar de nuevo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.boton, { backgroundColor: colores.fondoTarjeta }]}
          onPress={() => navigation.navigate("Ranking")}
        >
          <Text style={[estilos.textoBoton, { color: colores.amarillo }]}>
            🏆  Ver ranking
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[estilos.boton, { backgroundColor: "#25D366" }]}
           onPress={compartirWhatsApp}
           >
  <Text style={estilos.textoBoton}>📲 Compartir por WhatsApp</Text>
</TouchableOpacity>
        <TouchableOpacity
        
          style={estilos.botonTexto}
          onPress={() => navigation.navigate("Inicio")}
        >
          <Text style={estilos.textoInicio}>← Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo, paddingHorizontal: 24 },
  cuerpo: { flex: 1, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 72, marginBottom: 16 },
  mensaje: { fontSize: 20, color: colores.texto, fontWeight: "bold", textAlign: "center", marginBottom: 28, lineHeight: 28 },
  tarjeta: { backgroundColor: colores.fondoTarjeta, borderRadius: 20, padding: 28, width: "100%", alignItems: "center", borderWidth: 1, borderColor: colores.borde },
  etiqueta: { fontSize: 12, color: colores.textoSecundario, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 },
  puntajeGrande: { fontSize: 64, fontWeight: "bold", color: colores.texto },
  puntajeDenominador: { fontSize: 36, color: colores.textoSecundario },
  barraFondo: { width: "100%", height: 8, backgroundColor: colores.borde, borderRadius: 4, marginVertical: 12 },
  barraRelleno: { height: 8, borderRadius: 4 },
  porcentaje: { fontSize: 16, color: colores.textoSecundario, marginBottom: 6 },
  categoria: { fontSize: 13, color: colores.primario },
  guardadoTag: { marginTop: 12, fontSize: 12, color: colores.correcto },
  botones: { paddingBottom: 24, gap: 12 },
  boton: { borderRadius: 14, paddingVertical: 16, alignItems: "center" },
  textoBoton: { fontSize: 16, fontWeight: "bold", color: colores.fondo },
  botonTexto: { alignItems: "center", paddingVertical: 10 },
  textoInicio: { color: colores.textoSecundario, fontSize: 14 },
});