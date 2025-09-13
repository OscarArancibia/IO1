export class PlanoCartesiano {
  constructor(canvas, config) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.config = {
      minX: config.minX || 0,
      minY: config.minY || 0,
      maxX: config.maxX,
      maxY: config.maxY,
      padding: config.padding || 40
    };

    this.scale = 1;
    this.offset = { x: 0, y: 0 };
    this.origen = { x: 0, y: 0 };

    this.calcularEscalaYOffset();
  }

  calcularEscalaYOffset() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    
    // Calcula el rango en X e Y
    const rangeX = this.config.maxX - this.config.minX;
    const rangeY = this.config.maxY - this.config.minY;
    
    // Calcula la escala para que quepa perfectamente considerando el padding
    const scaleX = (width - 2 * this.config.padding) / rangeX;
    const scaleY = (height - 2 * this.config.padding) / rangeY;
    
    // Usa la escala más pequeña para mantener proporciones
    this.scale = Math.min(scaleX, scaleY);
    
    // Calcula el offset para centrar el plano
    this.offset.x = this.config.padding;
    this.offset.y = height - this.config.padding;
    
    // Calcula la posición del origen (0,0) en coordenadas canvas
    this.origen.x = this.offset.x - (this.config.minX * this.scale);
    this.origen.y = this.offset.y + (this.config.minY * this.scale);
  }

  CoordenadasACanvas(x, y) {
    return {
      x: this.origen.x + (x * this.scale),
      y: this.origen.y - (y * this.scale) 
    };
  }

  canvasACoordenadas(canvasX, canvasY) {
    return {
      x: (canvasX - this.origen.x) / this.scale,
      y: (this.origen.y - canvasY) / this.scale
    };
  }

  dibujarPlano() {
    this.limpiar();
    this.dibujarCuadricula();
    this.dibujarEjes();
    this.dibujarMarcas();
    this.dibujarEtiquetasEjes();
  }

  limpiar() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

 dibujarCuadricula() {
  this.ctx.lineWidth = 1;

  // Líneas verticales
  for (let x = Math.ceil(this.config.minX); x <= this.config.maxX; x++) {
    if (x === 0) continue;

    const start = this.CoordenadasACanvas(x, this.config.minY);
    const end = this.CoordenadasACanvas(x, this.config.maxY);
    
    // Determinar estilo según si es múltiplo de 10
    if (x % 10 === 0) {
      this.ctx.strokeStyle = '#d0d0d0'; // ← Color más oscuro
      this.ctx.lineWidth = 2;           // ← Línea más gruesa
    } else {
      this.ctx.strokeStyle = '#f0f0f0'; // ← Color normal
      this.ctx.lineWidth = 1;           // ← Grosor normal
    }

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }

  // Líneas horizontales
  for (let y = Math.ceil(this.config.minY); y <= this.config.maxY; y++) {
    if (y === 0) continue;

    const start = this.CoordenadasACanvas(this.config.minX, y);
    const end = this.CoordenadasACanvas(this.config.maxX, y);
    
    // Determinar estilo según si es múltiplo de 10
    if (y % 10 === 0) {
      this.ctx.strokeStyle = '#d0d0d0'; // ← Color más oscuro
      this.ctx.lineWidth = 2;           // ← Línea más gruesa
    } else {
      this.ctx.strokeStyle = '#f0f0f0'; // ← Color normal
      this.ctx.lineWidth = 1;           // ← Grosor normal
    }

    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();
  }

  // Restaurar valores por defecto
  this.ctx.strokeStyle = '#f0f0f0';
  this.ctx.lineWidth = 1;
}

  dibujarEjes() {
    this.ctx.strokeStyle = '#22689EC9';
    this.ctx.lineWidth = 2;

    // Eje X
    const xStart = this.CoordenadasACanvas(this.config.minX, 0);
    const xEnd = this.CoordenadasACanvas(this.config.maxX, 0);
  
    this.ctx.beginPath();
    this.ctx.moveTo(xStart.x, xStart.y);
    this.ctx.lineTo(xEnd.x, xEnd.y);
    this.ctx.stroke();

    // Eje Y
    const yStart = this.CoordenadasACanvas(0, this.config.minY);//aqui
    const yEnd = this.CoordenadasACanvas(0, this.config.maxY);//aqui
  
    this.ctx.beginPath();
    this.ctx.moveTo(yStart.x, yStart.y);
    this.ctx.lineTo(yEnd.x, yEnd.y);
    this.ctx.stroke();
  }

  // Dibuja marcas en los ejes
  dibujarMarcas() {
   this.ctx.strokeStyle = '#22689EC9';
    this.ctx.fillStyle = '#0E0E0EFF';
    this.ctx.font = '10px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Marcas en eje X
    for (let x = Math.ceil(this.config.minX); x <= this.config.maxX; x++) {
      if (x === 0) continue;

      const point = this.CoordenadasACanvas(x, 0);
      const esMultiploDe10= (x % 10 === 0);
    
      // Marca
      this.ctx.beginPath();
      if(esMultiploDe10){
        this.ctx.moveTo(point.x, point.y - 8);
      this.ctx.lineTo(point.x, point.y + 8);
      }
       this.ctx.stroke();
     
      // Número
      if(esMultiploDe10){
      this.ctx.fillText(x.toString(), point.x, point.y + 15);
      }
     }

      // Marcas en eje Y
      for (let y = Math.ceil(this.config.minY); y <= this.config.maxY; y++) {
      if (y === 0) continue;

      const point = this.CoordenadasACanvas(0, y);
      const esMultiploDe10 = (y % 10 === 0);
  
      
      // Marca
      this.ctx.beginPath();
      if(esMultiploDe10){
        this.ctx.moveTo(point.x - 8, point.y);
        this.ctx.lineTo(point.x + 8, point.y);
      }
      this.ctx.stroke();
      // Número
      if(esMultiploDe10){
      this.ctx.textAlign = 'right';
      this.ctx.fillText(y.toString(), point.x - 18, point.y);
      this.ctx.textAlign = 'center';
      }
    }
  }

  // Dibuja etiquetas de los ejes
  dibujarEtiquetasEjes() {
    this.ctx.fillStyle = '#000000';
    this.ctx.font = '14px Arial';
    this.ctx.textAlign = 'center';

    const xLabelPos = this.CoordenadasACanvas(this.config.maxX + 1, -0.5);
    this.ctx.fillText('X₁', xLabelPos.x, xLabelPos.y);

    const yLabelPos = this.CoordenadasACanvas(1, this.config.maxY + 1);
    this.ctx.textAlign = 'right';
    this.ctx.fillText('X₂', yLabelPos.x, yLabelPos.y);
  }

  getContext() {
    return this.ctx;
  }

  getLimites() {
    return { ...this.config };
  }

  getScale() {
    return this.scale;
  }

  getOffset() {
    return { ...this.offset };
  }

  getOrigin() {
    return { ...this.origen };
  }

  // Métodos para actualizar configuración
  actualizarConfig(config) {
    this.config = { ...this.config, ...config };
    this.calcularEscalaYOffset();
    this.dibujarPlano();
  }
}
