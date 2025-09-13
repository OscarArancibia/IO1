export class PuntoRegion {
    constructor(plano, config = {}) {
    
        const defaultConfig = {
            color: '#1E66CAFF',
            puntos: [],
            grosor: 2,
            radioPunto: 5,
            colorEtiqueta: '#1BD69BFF',
            fuenteEtiqueta: '12px Arial'
        };

        
        this.config = { ...defaultConfig, ...config };

    
        this.plano = plano;
        this.color = this.config.color;
        this.puntos = this.config.puntos;
        this.grosor = this.config.grosor;
        this.radioPunto = this.config.radioPunto;
        this.colorEtiqueta = this.config.colorEtiqueta;
        this.fuenteEtiqueta = this.config.fuenteEtiqueta;
        
        if (this.plano) {
            this.contexto = this.plano.getContext();
            this.limites = this.plano.getLimites();
        } else {
            console.warn('Recta necesita un plano');
            this.contexto = null;
            this.limites = null;
        }
    }

    // Dibuja los puntos 
    dibujar() {
        if (!this.contexto || !Array.isArray(this.puntos) || !this.limites) return;

        this.contexto.save();
        
        for (let i = 0; i < this.puntos.length; i++) {
            const punto = this.puntos[i];
            
           
            if (this.puntoDentroDelPlano(punto)) {
                this.dibujarPunto(punto);
                this.dibujarEtiqueta(punto, i);
            }
        }
        this.sombrear();
        this.contexto.restore();
    }

    // Método para sombrear el área dentro de los puntos
    sombrear(configSombrear = {}) {
        if (!this.contexto || this.puntos.length < 3 || !this.limites) return;
        
        
        const defaultConfig = {
            color: 'rgba(30, 102, 202, 0.3)', 
            patron: null,
        };
        
        const config = { ...defaultConfig, ...configSombrear };
        
        this.contexto.save();
        
    
        this.contexto.beginPath();
        
        const primerPunto = this.plano.CoordenadasACanvas(this.puntos[0].x, this.puntos[0].y);
        this.contexto.moveTo(primerPunto.x, primerPunto.y);
        
        for (let i = 1; i < this.puntos.length; i++) {
            const punto = this.puntos[i];
            const puntoCanvas = this.plano.CoordenadasACanvas(punto.x, punto.y);
            this.contexto.lineTo(puntoCanvas.x, puntoCanvas.y);
        }
    
        this.contexto.closePath();
        if (config.patron) {
            this.contexto.fillStyle = config.patron;
        } else {
            this.contexto.fillStyle = config.color;
        }
        
        // Rellenar el área
        this.contexto.fill();
        this.contexto.restore();
        return this;
    }

    // Dibujar un punto en las coordenadas 
    dibujarPunto(puntoMat) {
        const puntoCanvas = this.plano.CoordenadasACanvas(puntoMat.x, puntoMat.y);
        
        this.contexto.fillStyle = this.color;
        this.contexto.beginPath();
        this.contexto.arc(puntoCanvas.x, puntoCanvas.y, this.radioPunto, 0, Math.PI * 2);
        this.contexto.fill();
    }

    // Dibujar etiqueta 
    dibujarEtiqueta(puntoMat, indice) {
        const puntoCanvas = this.plano.CoordenadasACanvas(puntoMat.x, puntoMat.y);
        const letra = String.fromCharCode(65 + indice); 
        const texto = `${letra} (${Math.round(puntoMat.x * 100) / 100},${Math.round(puntoMat.y * 100) / 100})`;
        
        this.contexto.fillStyle = this.colorEtiqueta;
        this.contexto.font = this.fuenteEtiqueta;
        this.contexto.textBaseline = 'bottom';
        
        this.contexto.fillText(texto, puntoCanvas.x + 10, puntoCanvas.y - 5);
    }

    puntoDentroDelPlano(punto) {
        return punto.x >= this.limites.minX && punto.x <= this.limites.maxX &&
               punto.y >= this.limites.minY && punto.y <= this.limites.maxY;
    }

    actualizarConfig(nuevaConfig) {
        this.config = { ...this.config, ...nuevaConfig };
        this.color = this.config.color;
        this.puntos = this.config.puntos;
        this.grosor = this.config.grosor;
        this.radioPunto = this.config.radioPunto;
        this.colorEtiqueta = this.config.colorEtiqueta;
        this.fuenteEtiqueta = this.config.fuenteEtiqueta;
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