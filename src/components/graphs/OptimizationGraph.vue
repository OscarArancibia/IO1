<template>
  <div class="graph-container">
    <h2>GRAFICA</h2>
    
    <!-- Dibujo Plano -->
    <canvas 
      ref="canvas" 
      width="800" 
      height="600" 
      class="plano-canvas"
    ></canvas>
    
    <!-- Controles para probar diferentes configuraciones -->
    <div class="controls">
      <div class="control-group">
        <label>Max X:</label>
        <input v-model.number="config.maxX" type="number" @change="actualizarPlano">
      </div>
      <div class="control-group">
        <label>Max Y:</label>
        <input v-model.number="config.maxY" type="number" @change="actualizarPlano">
      </div>
      <button @click="redibujar" class="btn-redibujar">Redibujar</button>
    </div>

  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { PlanoCartesiano } from '../../utils/graphs/PlanoCartesiano.js';
import { Recta } from '../../utils/graphs/Recta.js';
import { PuntoRegion } from '../../utils/graphs/PuntoRegion.js';

export default defineComponent({
  name: 'OptimizationGraph',
  setup() {
    const canvas = ref(null);
    let plano = null;
    let recta = null; // ← Declarar recta
    let Region = null; // ← Declarar Region
    
    const config = ref({
      minX: 0,
      maxX: 40,
      minY: 0,
      maxY: 40,
      padding: 50
    });

    const inicializarPlano = () => {
      if (!canvas.value) return;

      try { 
        plano = new PlanoCartesiano(canvas.value, config.value); 
        plano.dibujarPlano();
        
        recta = new Recta(plano, {
          color: 'black',
          grosor: 2,
          puntos: [
            { x: 10, y: 0 },  
            { x: 0, y: 20 }, 
            { x: 10, y: 0 },  
            { x: 10, y: 40 }, 
            { x: 0, y: 20 },  
            { x: 40, y: 20 }, 
          ]
        });
        recta.dibujar();
       
        Region = new PuntoRegion(plano, {
          puntos: [
            { x: 0, y: 0 },
            { x: 10, y: 0 },
            { x: 0, y: 20 }
          ],
        }); 
        Region.dibujar();
        
      } catch (error) {
        console.error('Error:', error);
      }
    };

    onMounted(() => {
      console.log('Componente montado');
      setTimeout(inicializarPlano, 100);
    });

    return {
      canvas,
      config
    };
  }
});
</script>

<style scoped>
.graph-container {
  font-family: 'Arial', sans-serif;
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h2 {
  color: #2c3e50;
  text-align: center;
  margin-bottom: 20px;
}

.plano-canvas {
  display: block;
  margin: 0 auto;
  border: 2px solid #3498db;
  border-radius: 8px;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.controls {
  display: flex;
  gap: 15px;
  justify-content: center;
  align-items: center;
  margin: 20px 0;
  padding: 15px;
  background: white;
  border-radius: 8px;
  flex-wrap: wrap;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.control-group label {
  font-weight: bold;
  color: #2c3e50;
  font-size: 12px;
}

.control-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80px;
  text-align: center;
}

.btn-redibujar {
  padding: 10px 20px;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-redibujar:hover {
  background: #2980b9;
}

.info-panel {
  background: white;
  padding: 15px;
  border-radius: 8px;
  border-left: 4px solid #2ecc71;
  margin-top: 15px;
}

.info-panel h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
}

.info-panel p {
  margin: 5px 0;
  color: #555;
  font-size: 14px;
}
</style>