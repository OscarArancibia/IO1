export class Recta {
  constructor(plano, config) {
    this.plano = plano;
    this.config = {
      color: config.color || '#007bff',
      label: config.label || '',
      coeficienteX: config.coeficienteX || 0,
      coeficienteY: config.coeficienteY || 0,
      terminoIndependiente: config.terminoIndependiente
    };
  }

  dibujar(x,y) {
    // Si se proporciona x pero no y, asumir y=0
                if (x !== undefined && y === undefined) {
                    y = 0;
                }
                // Si se proporciona y pero no x, asumir x=0
                else if (y !== undefined && x === undefined) {
                    x = 0;
                }
                
                // Si se proporcionan ambos parámetros, actualizar la ecuación de la recta
                if (x !== undefined && y !== undefined) {
                    // Calcular nuevos coeficientes basados en los puntos proporcionados
                    // Esto es una simplificación para la demostración
                    this.config.coeficienteX = y;
                    this.config.coeficienteY = -x;
                    this.config.terminoIndependiente = y * x - x * y;
                }
                
                const ctx = this.plano.getContext();
                const { minX, maxX, minY, maxY } = this.getPlanoRange();

                // Calcular los puntos donde la recta intersecta los bordes del plano
                const puntos = this.calcularPuntosInterseccionBordes(minX, maxX, minY, maxY);

                if (puntos.length >= 2) {
                    // Ordenar puntos por X para dibujar de izquierda a derecha
                    puntos.sort((a, b) => a.x - b.x);
                    
                    const p1 = this.plano.CoordenadasACanvas(puntos[0].x, puntos[0].y);
                    const p2 = this.plano.CoordenadasACanvas(puntos[1].x, puntos[1].y);

                    ctx.strokeStyle = this.config.color;
                    ctx.lineWidth = 2;
                    ctx.setLineDash([]);

                    // Dibujar la línea que cruza todo el plano
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();

                    // Dibujar etiqueta
                    if (this.config.label) {
                        ctx.fillStyle = this.config.color;
                        ctx.font = '14px Arial';
                        const midX = (p1.x + p2.x) / 2;
                        const midY = (p1.y + p2.y) / 2;
                        ctx.fillText(this.config.label, midX + 10, midY - 10);
                    }
                }
   }


  getPlanoRange() {
    const limites = this.plano.getLimites();
    return {
      minX: limites.minX,
      maxX: limites.maxX,
      minY: limites.minY,
      maxY: limites.maxY
    };
  }

  calcularPuntosInterseccionBordes(minX, maxX, minY, maxY) {
    const { coeficienteX, coeficienteY, terminoIndependiente } = this.config;
    const puntos = [];

    // Calcular intersecciones con los 4 bordes del plano

    // Intersección con borde IZQUIERDO (x = minX)
    if (coeficienteY !== 0) {
      const yLeft = (terminoIndependiente - coeficienteX * minX) / coeficienteY;
      if (yLeft >= minY && yLeft <= maxY) {
        puntos.push({ x: minX, y: yLeft });
      }
    }

    // Intersección con borde DERECHO (x = maxX)
    if (coeficienteY !== 0) {
      const yRight = (terminoIndependiente - coeficienteX * maxX) / coeficienteY;
      if (yRight >= minY && yRight <= maxY) {
        puntos.push({ x: maxX, y: yRight });
      }
    }

    // Intersección con borde INFERIOR (y = minY)
    if (coeficienteX !== 0) {
      const xBottom = (terminoIndependiente - coeficienteY * minY) / coeficienteX;
      if (xBottom >= minX && xBottom <= maxX) {
        puntos.push({ x: xBottom, y: minY });
      }
    }

    // Intersección con borde SUPERIOR (y = maxY)
    if (coeficienteX !== 0) {
      const xTop = (terminoIndependiente - coeficienteY * maxY) / coeficienteX;
      if (xTop >= minX && xTop <= maxX) {
        puntos.push({ x: xTop, y: maxY });
      }
    }

    // Eliminar duplicados y asegurar 2 puntos exactos
    const puntosUnicos = puntos.filter((p, index, array) => 
      array.findIndex(pp => Math.abs(pp.x - p.x) < 0.001 && Math.abs(pp.y - p.y) < 0.001) === index
    );

    // Si tenemos más de 2 puntos, tomar los 2 más extremos
    if (puntosUnicos.length > 2) {
      puntosUnicos.sort((a, b) => a.x - b.x);
      return [puntosUnicos[0], puntosUnicos[puntosUnicos.length - 1]];
    }

    return puntosUnicos.slice(0, 2);
  }
}