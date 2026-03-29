import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { colores } from "../styles/colores";

export default function InicioScreen({ navigation }) {
  const categorias = [
    { id: "todas", label: "Todas las categorías", emoji: "🇨🇺" },
    { id: "historia", label: "Historia de Cuba", emoji: "📜" },
    { id: "geografia", label: "Geografía cubana", emoji: "🗺️" },
    { id: "cultura", label: "Cultura y tradiciones", emoji: "🎶" },
    { id: "musica", label: "Música cubana", emoji: "🎶" },
    { id: "deportes", label: "Deportes en Cuba", emoji: "🥊" },
    { id: "personalidades", label: "Personalidades cubanas", emoji: "⭐" },
  ];

  return (
    <SafeAreaView style={estilos.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor={colores.fondo} />
      <View style={estilos.encabezado}>
        <Text style={estilos.titulo}>Quiz Cuba</Text>
        <Text style={estilos.subtitulo}>¿Cuánto sabes de tu isla?</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={estilos.etiqueta}>Elige una categoría</Text>
        {categorias.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={estilos.botonCategoria}
            onPress={() =>
              navigation.navigate("Juego", { categoria: cat.id, label: cat.label })
            }
          >
            <Text style={estilos.emoji}>{cat.emoji}</Text>
            <Text style={estilos.textoBoton}>{cat.label}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity
          style={estilos.botonRanking}
          onPress={() => navigation.navigate("Ranking")}
        >
          <Text style={estilos.textoRanking}>🏆  Ver ranking</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: colores.fondo,
    paddingHorizontal: 24,
  },
  encabezado: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 32,
  },
  titulo: {
    fontSize: 42,
    fontWeight: "bold",
    color: colores.primario,
    letterSpacing: 2,
  },
  subtitulo: {
    fontSize: 16,
    color: colores.textoSecundario,
    marginTop: 8,
  },
  cuerpo: {
    flex: 1,
  },
  etiqueta: {
    fontSize: 13,
    color: colores.textoSecundario,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  botonCategoria: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colores.fondoTarjeta,
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colores.borde,
  },
  emoji: {
    fontSize: 24,
    marginRight: 14,
  },
  textoBoton: {
    fontSize: 17,
    color: colores.texto,
    fontWeight: "500",
  },
  botonRanking: {
    alignItems: "center",
    paddingVertical: 18,
    marginBottom: 16,
  },
  textoRanking: {
    fontSize: 16,
    color: colores.amarillo,
    fontWeight: "600",
  },
});