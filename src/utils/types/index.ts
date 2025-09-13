// Representa un punto en el plano 2D
export interface Point {
  x: number;  // Coordenada X del punto
  y: number;  // Coordenada Y del punto
}

// Configuración para inicializar el plano cartesiano
export interface PlanoConfig {
  maxX: number;     
  maxY: number;     
  minX?: number;    
  minY?: number;    
  padding?: number; 
}

// Configuración para dibujar una recta (restricción)
export interface RectaConfig{
  puntos: Point[];  
   color?: string;   
  grosor?: number;  
}

// Configuración para dibujar un punto en el gráfico
export interface PuntoConfig {
    puntos: Point[];    
}