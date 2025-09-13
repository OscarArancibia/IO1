export class Recta {
    constructor(plano, config = {}) {
        const defaultConfig = {
            color: '#ff0000',
            puntos: [],
            grosor: 2
        };

        this.config = { ...defaultConfig, ...config };

 
        this.plano = plano;
        this.color = this.config.color;
        this.puntos = this.config.puntos;
        this.grosor = this.config.grosor;
        
        // Validar que tenemos un plano
        if (this.plano) {
            this.contexto = this.plano.getContext();
            this.limites = this.plano.getLimites();
        } else {
            console.warn('Recta necesita un plano');
            this.contexto = null;
            this.limites = null;
        }
    }

    // Método para dibujar todas las rectas del array
    dibujar() {
        if (!this.contexto || !Array.isArray(this.puntos) || !this.limites) return;

        this.contexto.save();
        
        this.contexto.strokeStyle = this.color;
        this.contexto.lineWidth = this.grosor;
        this.contexto.setLineDash([]);

    
        for (let i = 0; i < this.puntos.length; i += 2) {
            if (i + 1 >= this.puntos.length) break;

            const punto1 = this.puntos[i];
            const punto2 = this.puntos[i + 1];

            
            const puntosCorte = this.calcularPuntosCorte(punto1, punto2);
            
            if (puntosCorte.length === 2) {
                this.dibujarSegmento(puntosCorte[0], puntosCorte[1]);
            } else {
                const p1Dentro = this.puntoDentroDelPlano(punto1);
                const p2Dentro = this.puntoDentroDelPlano(punto2);
                
                if (p1Dentro && p2Dentro) {
                    this.dibujarSegmento(punto1, punto2);
                }
            }
        }

        this.contexto.restore();
    }

    // Dibujar un segmento entre dos puntos matemáticos
    dibujarSegmento(p1Mat, p2Mat) {
        const p1Canvas = this.plano.CoordenadasACanvas(p1Mat.x, p1Mat.y);
        const p2Canvas = this.plano.CoordenadasACanvas(p2Mat.x, p2Mat.y);
        
        this.contexto.beginPath();
        this.contexto.moveTo(p1Canvas.x, p1Canvas.y);
        this.contexto.lineTo(p2Canvas.x, p2Canvas.y);
        this.contexto.stroke();
    }

    // Calcular dónde la recta corta los límites del plano
    calcularPuntosCorte(p1, p2) {
        const puntosCorte = [];
        
    
        const { minX, maxX, minY, maxY } = this.limites;

        
        const intersecciones = [
            this.calcularInterseccionConBordeVertical(p1, p2, minX), 
            this.calcularInterseccionConBordeVertical(p1, p2, maxX), 
            this.calcularInterseccionConBordeHorizontal(p1, p2, minY),
            this.calcularInterseccionConBordeHorizontal(p1, p2, maxY) 
        ];

        intersecciones.forEach(interseccion => {
            if (interseccion && this.puntoDentroDelPlano(interseccion)) {
                puntosCorte.push(interseccion);
            }
        });

        return this.filtrarPuntosUnicos(puntosCorte);
    }

    // Calcular intersección con borde vertical (x)
    calcularInterseccionConBordeVertical(p1, p2, xBorde) {
        if (p1.x === p2.x) {
            if (p1.x === xBorde) {
                return {
                    x: xBorde,
                    y: Math.max(Math.min(p1.y, p2.y), this.limites.minY)
                };
            }
            return null;
        }

        // Pendiente
        const m = (p2.y - p1.y) / (p2.x - p1.x);

        const y = p1.y + m * (xBorde - p1.x);
        
        return { x: xBorde, y: y };
    }



    // Calcular intersección con borde horizontal (y)
    calcularInterseccionConBordeHorizontal(p1, p2, yBorde) {
        // Recta horizontal
        if (p1.y === p2.y) {
            if (p1.y === yBorde) {
                // La recta coincide con el borde horizontal
                return {
                    x: Math.max(Math.min(p1.x, p2.x), this.limites.minX),
                    y: yBorde
                };
            }
            return null;
        }

        // Pendiente
        const m = (p2.y - p1.y) / (p2.x - p1.x);
        
        
        const x = p1.x + (yBorde - p1.y) / m;
        
        return { x: x, y: yBorde };
    }


    puntoDentroDelPlano(punto) {
        return punto.x >= this.limites.minX && punto.x <= this.limites.maxX &&
               punto.y >= this.limites.minY && punto.y <= this.limites.maxY;
    }


    filtrarPuntosUnicos(puntos) {
        const unicos = [];
        const visto = new Set();

        for (const punto of puntos) {
            const clave = `${punto.x.toFixed(6)},${punto.y.toFixed(6)}`;
            if (!visto.has(clave)) {
                visto.add(clave);
                unicos.push(punto);
            }
        }
        return unicos;
    }

    // Métodos de actualización
    actualizarConfig(nuevaConfig) {
        this.config = { ...this.config, ...nuevaConfig };
        this.color = this.config.color;
        this.puntos = this.config.puntos;
        this.grosor = this.config.grosor;
        return this;
    }

    agregarPuntos(nuevosPuntos) {
        this.puntos = [...this.puntos, ...nuevosPuntos];
        this.config.puntos = this.puntos;
        return this;
    }

    limpiarPuntos() {
        this.puntos = [];
        this.config.puntos = [];
        return this;
    }

    cambiarColor(nuevoColor) {
        this.color = nuevoColor;
        this.config.color = nuevoColor;
        return this;
    }
}