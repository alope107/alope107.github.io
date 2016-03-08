var start = function() {// Matter.js - http://brm.io/matter-js/

var countElement = document.getElementsByClassName("fCount")[0];
// Matter module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Common = Matter.Common,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
	Events = Matter.Events;

var can_width = 195*2;
var can_height = 325*2;
var count = 55;


//var can_height = 600;
//var can_width = 800;
// create a Matter.js engine
var engine = Engine.create(document.body, {
  render: {
    options: {
      showAngleIndicator: true,
      wireframes: true,
	  height:can_height,
	  width: can_width
    }
  }
});

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

var offset = 10,
    options = { 
        isStatic: true,
        render: {
            visible: false,
        }
    };

engine.world.bodies = [];

// these static walls will not be rendered in this sprites example, see options
World.add(engine.world, [
	Bodies.rectangle(can_width/2, -offset, can_width + .5 + 2 * offset, 50.5, options), //ceiling
    Bodies.rectangle(can_width/2, can_height + offset, can_width + .5 + 2 * offset, 50.5, options), //floor
    Bodies.rectangle(can_width + offset, can_height/2, 50.5, can_height + .5 + 2 * offset, options), //right
    Bodies.rectangle(-offset, can_height/2, 50.5, can_height + .5 + 2 * offset, options) //left
    /*Bodies.rectangle(400, -offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(400, 600 + offset, 800.5 + 2 * offset, 50.5, options),
    Bodies.rectangle(800 + offset, 300, 50.5, 600.5 + 2 * offset, options),
    Bodies.rectangle(-offset, 300, 50.5, 600.5 + 2 * offset, options)*/
]);

var stack = Composites.stack(20, 20, 6, 3, 0, 0, function(x, y) {
    
        return Bodies.circle(x, y, (can_width)/12 - 2, {
            density: 0.001,
            frictionAir: 0.006,
            restitution: 0.3,
            friction: 0.001
        });
});

World.add(engine.world, stack);

var renderOptions = engine.render.options;
renderOptions.background = 'background.png';
renderOptions.showAngleIndicator = false;
renderOptions.wireframes = false;

Events.on(engine, 'tick', function(event) {
  countElement.textContent = count;
  count +=1;
  });
  
  
// run the engine
Engine.run(engine);
}