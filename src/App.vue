<template>
 <div id = "app">
   <header class="app-header">
    <h1> GRAFICA LINEAL </h1>
    <p> Visualizador interactivo del plano cartesiano</p>>
   </header>

   <main class = "app-header">
    <OptimizationGraph/>
   </main>
   <footer class = "app-footer">
    <p> </p>
   </footer>
   </div>
</template>

<script>
 

import { defineComponent } from 'vue';
import OptimizationGraph from './components/graphs/OptimizationGraph.vue';

export default defineComponent({
  name: 'App',
  components: {
    OptimizationGraph
  }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 20px;
  text-align: center;
  color: white;
}

.app-header h1 {
  margin-bottom: 10px;
  font-size: 2rem;
}

.app-main {
  flex: 1;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.app-footer {
  background: rgba(0, 0, 0, 0.2);
  color: white;
  text-align: center;
  padding: 15px;
  margin-top: auto;
}
</style>
