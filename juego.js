// Crear la aplicación de Pixi.js
const app = new PIXI.Application({
  width: 1280,
  height: 720,
  backgroundColor: 0x1099bb
});

// Agregar el canvas al documento HTML
document.body.appendChild(app.view);

// Cargar las imágenes
PIXI.Loader.shared.add("jugador", "/assets/jugador.png");
PIXI.Loader.shared.add("pelota", "/assets/pelota.png");
PIXI.Loader.shared.add("arco", "/assets/arco.png");
PIXI.Loader.shared.load(iniciarJuego);

// Variables globales
let jugador,
    pelota,
    arcoIzquierdo,
    arcoDerecho,
    goles = 0,
    tiempo = 0;

    

// Función para configurar el juego
function iniciarJuego() {
  // Crear el jugador
  jugador = new PIXI.Sprite(PIXI.Loader.shared.resources.jugador.texture);
  jugador.x = 100;
  jugador.y = 100;
  jugador.vx = 0;
  jugador.vy = 0;
  app.stage.addChild(jugador);

  // Crear la pelota
  pelota = new PIXI.Sprite(PIXI.Loader.shared.resources.pelota.texture);
  pelota.anchor.set(0.5);
  pelota.x = app.renderer.width / 2;
  pelota.y = app.renderer.height / 2;
  pelota.vx = 0;
  pelota.vy = 0;
  pelota.interactive = true;
  pelota.buttonMode = true;
  pelota.on('pointerdown', () => {
    pelota.vx = 2;
    pelota.vy = 2;
  });
  app.stage.addChild(pelota);

  // Crear los arcos
  arcoIzquierdo = new PIXI.Sprite(PIXI.Loader.shared.resources.arco.texture);
  arcoIzquierdo.x = 0;
  arcoIzquierdo.y = app.renderer.height/2 - arcoIzquierdo.height/2;
  app.stage.addChild(arcoIzquierdo);

  arcoDerecho = new PIXI.Sprite(PIXI.Loader.shared.resources.arco.texture);
  arcoDerecho.x = app.renderer.width - arcoDerecho.width;
  arcoDerecho.y = app.renderer.height/2 - arcoDerecho.height/2;
  app.stage.addChild(arcoDerecho);

  // Crear el marcador
  const marcador = document.createElement("div");
  marcador.id = "marcador";
  marcador.innerHTML = "Goles: " + goles + " | Tiempo: " + tiempo;
  document.body.appendChild(marcador);

  // Configurar las teclas de movimiento
  const izquierda = keyboard("ArrowLeft"),
        arriba = keyboard("ArrowUp"),
        derecha = keyboard("ArrowRight"),
        abajo = keyboard("ArrowDown"),
        patear = keyboard("KeyX");

  // Mover el jugador
  izquierda.press = function() {
    jugador.vx = -5;
  };
  izquierda.release = function() {
    if (!derecha.isDown) {
      jugador.vx = 0;
    }
  };

  arriba.press = function() {
    jugador.vy = -5;
  };
  arriba.release = function() {
    if (!abajo.isDown) {
      jugador.vy = 0;
    }
  };

  derecha.press = function() {
    jugador.vx = 5;
  };
  derecha.release = function() {
    if (!izquierda.isDown) {
      jugador.vx = 0;
    }
  };

  abajo.press = function() {
    jugador.vy = 5;
  };
  abajo.release = function() {
    if (!arriba.isDown) {
      jugador.vy = 0;
    }
  };

  // Patear la pelota
  patear.press = function() {
    if (pelota.vx === 0 && pelota.vy === 0) {
      const direccionX = jugador.x < app.renderer.width / 2 ? 1 : -1;
      pelota.vx = direccionX * 5;
      pelota.vy = Math.random() * 4 - 2;
    }
  };

  // Actualizar el juego en cada tick del bucle de juego
  app.ticker.add(() => {
    // Mover el jugador
    jugador.x += jugador.vx;
    jugador.y += jugador.vy;

    // Mover la pelota
    pelota.x += pelota.vx;
    pelota.y += pelota.vy;

    // Aplicar fricción a la pelota
    const friccion = 0.99;
    pelota.vx *= friccion;
    pelota.vy *= friccion;

    // Verificar si la pelota choca con los bordes de la pantalla
    if (pelota.x < 0) {
      pelota.x = 0;
      pelota.vx = -pelota.vx;
    } else if (pelota.x > app.renderer.width) {
      pelota.x = app.renderer.width;
      pelota.vx = -pelota.vx;
    }
    if (pelota.y < 0) {
      pelota.y = 0;
      pelota.vy = -pelota.vy;
    } else if (pelota.y > app.renderer.height) {
      pelota.y = app.renderer.height;
      pelota.vy = -pelota.vy;
    }

    // Verificar si la pelota choca con los arcos
    if (colision(pelota, arcoIzquierdo)) {
      goles++;
      reiniciarPelota();
    } else if (colision(pelota, arcoDerecho)) {
      goles++;
      reiniciarPelota();
    }

    // Actualizar el marcador
    tiempo++;
    marcador.innerHTML = "Goles: " + goles + " | Tiempo: " + tiempo;
  });
}

// Función para reiniciar la posición y velocidad de la pelota
function reiniciarPelota() {
  pelota.x = app.renderer.width / 2;
  pelota.y = app.renderer.height / 2;
  pelota.vx = 0;
  pelota.vy = 0;
}

// Función para detectar colisiones entre dos objetos
function colision(objeto1, objeto2) {
  const bounds1 = objeto1.getBounds();
  const bounds2 = objeto2.getBounds();
  return bounds1.x + bounds1.width > bounds2.x &&
         bounds1.x < bounds2.x + bounds2.width &&
         bounds1.y + bounds1.height > bounds2.y &&
         bounds1.y < bounds2.y + bounds2.height;
}

// Función para crear un objeto que maneje el estado de una tecla
function keyboard(tecla) {
  const estado = {
    tecla: tecla,
    presionada: false,
    releaseCallbacks: [],
    press: function() {
      this.presionada = true;
    },
    release: function() {
      this.presionada = false;
      for (const callback of this.releaseCallbacks) {
        callback();
      }
    },
    agregarCallbackAlLiberar: function(callback) {
      this.releaseCallbacks.push(callback);
    }
  };
  window.addEventListener("keydown", function(event) {
    if (event.code === estado.tecla) {
      estado.press();
    }
  });
  window.addEventListener("keyup", function(event) {
    if (event.code === estado.tecla) {
      estado.release();
    }
  });
  return estado;
}
