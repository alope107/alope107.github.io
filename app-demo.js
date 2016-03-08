var start = function() {// Matter.js - http://brm.io/matter-js/

var countElement = document.getElementsByClassName("fCountL")[0];
var countElementR = document.getElementsByClassName("fCountR")[0];
var verbL = document.getElementsByClassName("verbL")[0];
var verbR = document.getElementsByClassName("verbR")[0];
// Matter module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Common = Matter.Common,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint,
	Events = Matter.Events
	Composite = Matter.Composite;

var can_width = 317;
var can_height = 522;

var targ_dim = can_height / 15;
var targ_x1 = can_width/2 - targ_dim;
var targ_y1 = can_height/5 - targ_dim;
var targ_x2 =  targ_x1 + 2 * targ_dim;
var targ_y2 =  targ_y1 + 2 * targ_dim;

var count = 0;
var countR = 0;
var buffer_size = 60;

// create a Matter.js engine
var engine = Engine.create(document.body, {
  render: {
    options: {
      showAngleIndicator: true,
      wireframes: true,
	  height:can_height,
	  width: can_width*2 + buffer_size
    }
  }
});

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine, {
  constraint: {
    render: {
      visible: false
    }
  }
});
World.add(engine.world, mouseConstraint);

var offset = 10,
    options = { 
        isStatic: true,
        render: {
            visible: false,
        }
    },
	options2 = { 
        isStatic: true,
        render: {
                strokeStyle: '#ffffff',
                sprite: {
                    texture: 'http://brm.io/matter-js-demo-master/img/box.png'
                },
				visible: false
		},
		collisionFilter: {
				category: 0x0100,
		}
    };
	

engine.world.bodies = [];

// these static walls will not be rendered in this sprites example, see options
World.add(engine.world, [
	Bodies.rectangle(can_width/2, -offset, can_width * 8 + .5 + 2 * offset, 50.5, options), //ceiling
    Bodies.rectangle(can_width/2, can_height + offset, can_width *8 + .5 + 2 * offset, 50.5, options), //floor
    Bodies.rectangle(can_width + offset, can_height/2, 50.5, can_height + .5 + 2 * offset, options), //right
    Bodies.rectangle(-offset, can_height/2, 50.5, can_height + .5 + 2 * offset, options), //left
	Bodies.rectangle(can_width + offset + can_width + buffer_size, can_height/2, 50.5, can_height + .5 + 2 * offset, options), //right
    Bodies.rectangle(-offset + can_width + buffer_size, can_height/2, 50.5, can_height + .5 + 2 * offset, options), //left
	Bodies.circle(targ_x1 + targ_dim/2, targ_y1 + targ_dim/2, .001,  options2)
]);

var radius = (can_width)/12 - 2;

var ballOpts = {
            density: 0.001,
            frictionAir: 0.006,
            restitution: 0.3,
            friction: 0.001
        };

var stack = Composites.stack(20, can_height/2, 6, 3, 0, 0, function(x, y) {
    
        return Bodies.circle(x, y, radius, ballOpts);
});

var balls = stack.bodies;
console.log(balls)

World.add(engine.world, stack);

var renderOptions = engine.render.options;
renderOptions.background = 'background.png';
renderOptions.showAngleIndicator = false;
renderOptions.wireframes = false;

var slow_ratio = 180;

Events.on(engine, 'tick', function(event) {
  countElement.textContent = Math.abs(count);
  countElementR.textContent = Math.abs(countR);
  
  if (count < 0) {
	verbL.textContent = "recieved";
	verbR.textContent = "given";
	
  }
  else {
	verbL.textContent = "given";
	verbR.textContent = "recieved";
  }
  
  var selected = mouseConstraint.body;
  if (selected) {
	selected.tapped = true;
  }
  for (var i = 0; i < balls.length; i++) {
	var ball = balls[i];
	var x_pos = ball.position.x;
	var y_pos = ball.position.y;
	var thresh = .6 * can_height;
	if(x_pos > targ_x1 && x_pos < targ_x2 && y_pos > targ_y1 && y_pos < targ_y2 && ball.tapped) {
		var velocity = ball.velocity;
		Composite.remove(stack, ball);
		var obj = Bodies.circle(x_pos+can_width+buffer_size, y_pos, radius, ballOpts);
		obj.force = {x:velocity.x / slow_ratio,y: velocity.y/slow_ratio};
		console.log(obj);
		Composite.add(stack, obj);
		count +=1;
		countR -=1;
	}
	if(x_pos > targ_x1 + can_width + buffer_size && x_pos < targ_x2 + can_width + buffer_size && y_pos > targ_y1 && y_pos < targ_y2 && ball.tapped) {
		var velocity = ball.velocity;
		Composite.remove(stack, ball);
		var obj = Bodies.circle(x_pos-can_width-buffer_size, y_pos, radius, ballOpts);
		obj.force = {x:velocity.x / slow_ratio,y: velocity.y/slow_ratio};
		console.log(obj);
		Composite.add(stack, obj);
		count -=1;
		countR +=1;
	}
  }
  });
  
  
// run the engine
Engine.run(engine);
}