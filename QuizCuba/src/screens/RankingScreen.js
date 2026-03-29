import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colores } from "../styles/colores";

export default function RankingScreen({ navigation }) {
  const [ranking, setRanking] = useState([]);
  const [partidaSeleccionada, setPartidaSeleccionada] = useState(null);

  useEffect(() => {
    async function cargar() {
      const raw = await AsyncStorage.getItem("ranking");
      if (raw) setRanking(JSON.parse(raw));
    }
    cargar();
  }, []);

  function medalla(idx) {
    if (idx === 0) return "🥇";
    if (idx === 1) return "🥈";
    if (idx === 2) return "🥉";
    return `#${idx + 1}`;
  }

  return (
    <SafeAreaView style={estilos.contenedor}>
      <StatusBar barStyle="light-content" backgroundColor={colores.fondo} />
      <View style={estilos.encabezado}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={estilos.volver}>← Volver</Text>
        </TouchableOpacity>
        <Text style={estilos.titulo}>🏆 Ranking</Text>
        <View style={{ width: 60 }} />
      </View>

      {ranking.length === 0 ? (
        <View style={estilos.vacio}>
          <Text style={estilos.vacioemoji}>🎮</Text>
          <Text style={estilos.vaciotexto}>
            Aún no hay partidas registradas.{"\n"}¡Juega tu primera ronda!
          </Text>
        </View>
      ) : (
        <FlatList
          data={ranking}
          keyExtractor={(_, idx) => idx.toString()}
          contentContainerStyle={{ padding: 20 }}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={estilos.fila}
              onPress={() => setPartidaSeleccionada(item)}
            >
              <Text style={estilos.posicion}>{medalla(index)}</Text>
              <View style={estilos.info}>
                <Text style={estilos.puntaje}>
                  {item.correctas}/{item.total} correctas
                </Text>
                <Text style={estilos.subtexto}>
                  {item.categoria} · {item.fecha}
                </Text>
              </View>
              <View style={estilos.derechaFila}>
                <Text
                  style={[
                    estilos.porcentaje,
                    { color: item.porcentaje >= 60 ? colores.correcto : colores.incorrecto },
                  ]}
                >
                  {item.porcentaje}%
                </Text>
                <Text style={estilos.verDetalle}>Ver detalle →</Text>
              </View>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      )}

      <Modal
        visible={partidaSeleccionada !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setPartidaSeleccionada(null)}
      >
        <View style={estilos.modalFondo}>
          <View style={estilos.modalContenido}>
            <View style={estilos.modalEncabezado}>
              <Text style={estilos.modalTitulo}>Detalle de partida</Text>
              <TouchableOpacity onPress={() => setPartidaSeleccionada(null)}>
                <Text style={estilos.modalCerrar}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {partidaSeleccionada?.detalle?.map((item, idx) => (
                <View
                  key={idx}
                  style={[
                    estilos.preguntaFila,
                    { borderLeftColor: item.acerto ? colores.correcto : colores.incorrecto },
                  ]}
                >
                  <Text style={estilos.preguntaNumero}>Pregunta {idx + 1}</Text>
                  <Text style={estilos.preguntaTexto}>{item.pregunta}</Text>
                  <Text style={[estilos.respuestaTexto, { color: item.acerto ? colores.correcto : colores.incorrecto }]}>
                    {item.acerto ? "✓" : "✗"} Tu respuesta: {item.respondida}
                  </Text>
                  {!item.acerto && (
                    <Text style={estilos.correctaTexto}>
                      ✓ Correcta: {item.correcta}
                    </Text>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: colores.fondo },
  encabezado: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  volver: { color: colores.primario, fontSize: 15, width: 60 },
  titulo: { fontSize: 20, color: colores.texto, fontWeight: "bold" },
  fila: { flexDirection: "row", alignItems: "center", backgroundColor: colores.fondoTarjeta, borderRadius: 12, padding: 16 },
  posicion: { fontSize: 20, width: 40, textAlign: "center" },
  info: { flex: 1, marginLeft: 12 },
  puntaje: { fontSize: 15, color: colores.texto, fontWeight: "500" },
  subtexto: { fontSize: 12, color: colores.textoSecundario, marginTop: 2 },
  derechaFila: { alignItems: "flex-end" },
  porcentaje: { fontSize: 18, fontWeight: "bold" },
  verDetalle: { fontSize: 11, color: colores.textoSecundario, marginTop: 2 },
  vacio: { flex: 1, alignItems: "center", justifyContent: "center" },
  vacioemoji: { fontSize: 56, marginBottom: 16 },
  vaciotexto: { fontSize: 16, color: colores.textoSecundario, textAlign: "center", lineHeight: 24 },
  modalFondo: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "flex-end" },
  modalContenido: { backgroundColor: colores.fondoTarjeta, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, maxHeight: "85%" },
  modalEncabezado: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitulo: { fontSize: 18, color: colores.texto, fontWeight: "bold" },
  modalCerrar: { fontSize: 18, color: colores.textoSecundario, padding: 4 },
  preguntaFila: { borderLeftWidth: 3, paddingLeft: 12, marginBottom: 20 },
  preguntaNumero: { fontSize: 11, color: colores.textoSecundario, marginBottom: 4 },
  preguntaTexto: { fontSize: 14, color: colores.texto, marginBottom: 6, lineHeight: 20 },
  respuestaTexto: { fontSize: 13, fontWeight: "500" },
  correctaTexto: { fontSize: 13, color: colores.correcto, marginTop: 4 },
});