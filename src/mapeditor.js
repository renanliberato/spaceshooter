import { Wall } from './entities/wall';

export const initMapEditor = (cancellationToken, height, mapId) => {
    const width = height * 9 / 16;
    /*const canvasEl = document.getElementById('arena');
    canvasEl.style.backgroundColor = '#000';
    canvasEl.setAttribute('height', height);
    canvasEl.setAttribute('width', width);*/

    Physics({
        // set the timestep
        timestep: 1000.0 / 160,
        // maximum number of iterations per step
        maxIPF: 16,
        // set the integrator (may also be set with world.add())
        integrator: 'verlet'
    }, function(world) {
        // subscribe to the ticker
        Physics.util.ticker.on(function( time ){
            world.step( time );
        });
        // start the ticker
        Physics.util.ticker.start();

        var ball = Physics.body('circle', {
            x: 50, // x-coordinate
            y: 30, // y-coordinate
            vx: 0.2, // velocity in x-direction
            vy: 0.01, // velocity in y-direction
            radius: 20
        });
        // add the circle to the world
        world.add( ball );

        // add some gravity
        /*var gravity = Physics.behavior('constant-acceleration', {
            acc: { x : 0, y: 0.0004 } // this is the default
        });
        world.add( gravity );*/

        var renderer = Physics.renderer('canvas', {
            el: 'editor-container',
            width: 500,
            height: height,
            meta: false, // don't display meta data
            styles: {
                // set colors for the circle bodies
                'circle' : {
                    strokeStyle: 'hsla(60, 37%, 17%, 1)',
                    lineWidth: 1,
                    fillStyle: 'hsla(60, 37%, 57%, 0.8)',
                    angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
                },
                'rectangle' : {
                    strokeStyle: 'hsla(60, 37%, 17%, 1)',
                    lineWidth: 1,
                    fillStyle: 'hsla(60, 37%, 57%, 0.8)',
                    angleIndicator: 'hsla(60, 37%, 17%, 0.4)'
                }
            }
        });
        // add the renderer
        world.add( renderer );

        world.on('step', function(){
            // Note: equivalent to just calling world.render() after world.step()
            world.render();
        });
    });

    /*const canvas = new fabric.Canvas('arena');
    //canvas.selection = true;
    canvas.backgroundColor = "#000";

    const game = {
        mapId: mapId,
        canvas: canvas,
        visibleArea: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 0,
        },
        map: {
            height: 1000,
            width: 1000,
        },
        entities: [],
        instantiateEntity: (entity) => {
            game.entities.push(entity);
            game.canvas.add(entity.object);
        },
        destroyEntity: (entity) => {
            entity.destroyed = true;
            game.entities = game.entities.filter(e => e.id != entity.id);
            game.canvas.remove(entity.object);
        },
        height: height,
        width: width,
        sizeFromHeight: (unit) => unit * height / 100,
        sizeFromWidth: (unit) => unit * width / 100,
        paddingH: 10,
        paddingV: 10
    };

    window.game = game;

    var wallCoordsStart = null;

    var wantToMove = false;

    window.onkeydown = (e) => {
        if (e.key == 'Shift') {
            wantToMove = true;
        }
    }

    window.onkeyup = (e) => {
        if (e.key == 'Shift') {
            wantToMove = false;
        }
    }

    var isMoving = false;

    canvas.on('mouse:down', function(options) {
        if (wantToMove)
        {
            isMoving = true;
            canvas.selectable = false;
            return;
        }

        wallCoordsStart = {
            x: game.visibleArea.x + options.pointer.x,
            y: game.visibleArea.y + options.pointer.y,
        };
    });

    canvas.on('mouse:move', function(ev) {
        if (isMoving) {
            game.visibleArea.x -= ev.e.movementX;
            game.visibleArea.x2 -= ev.e.movementX;
            game.visibleArea.y -= ev.e.movementY;
            game.visibleArea.y2 -= ev.e.movementY;
        }
    });

    canvas.on('mouse:up', function(options) {
        isMoving = false;
        canvas.selectable = true;
        if (!wallCoordsStart)
            return;

        var wall = new Wall(game, wallCoordsStart.x, wallCoordsStart.y);
        wall.object.width = game.visibleArea.x + options.pointer.x - wallCoordsStart.x;
        wall.object.height = game.visibleArea.y + options.pointer.y - wallCoordsStart.y;
        wall.object.selectable = true;

        wall.object.on('selected', function(ev) {
            wall.destroy();
        });
        game.instantiateEntity(wall);
        wallCoordsStart = null;
    });


    [...Array(10).keys()].forEach(x => {

        var wall = new Wall(game, 0, x * 100);
        wall.object.width = game.map.width;
        wall.object.height = 0.5;
        wall.object.selectable = false;
        wall.object.fill = "#ffffff33"

        game.instantiateEntity(wall);

        var wall = new Wall(game, x * 100, 0);
        wall.object.width = 0.5;
        wall.object.height = game.map.width;
        wall.object.selectable = false;
        wall.object.fill = "#ffffff33"

        game.instantiateEntity(wall);
    });

    game.time = 0;
    var lastUpdate = Date.now();

    game.visibleArea = {
        x: 0,
        x2: game.canvas.getWidth(),
        y: 0,
        y2: game.canvas.getHeight(),
    }*/

    const render = () => {
        if (cancellationToken.isCancelled)
            return;

        /*var now = Date.now();
        var dt = (now - lastUpdate) / 1000; // toSeconds
        lastUpdate = now;
        game.time += dt;

        game.entities.forEach(e => {
            e.update();
        });

        game.canvas.renderAll();*/
        window.requestAnimationFrame(render);
    };

    window.requestAnimationFrame(render);
}