
var a = {
   "center": [0,0],
   "alpha" : Math.PI/4 +0.15,
   "beta" : (6*Math.PI)/4 - 0.05,
   "r_in" : 3,
   "r_out": 5
};

function go() {
   console.log("go");

   
   setup();
   console.log(g, a);

   // assume center is origin 
   
   // draw vert lines
   for(var x=-a.r_out; x<a.r_out; x++) {
      line([x,-a.r_out], [x,a.r_out]);
   }

   // draw hoz lines
   for(var y=-a.r_out; y<a.r_out; y++) {
      line([-a.r_out, y], [a.r_out, y]);
   }

   
      // draw the annulus subregion we are to find the points in
   annulus_region(a.center, a.alpha, a.beta, a.r_in, a.r_out-a.r_in, "rgb(230, 230, 230)");

   // draw hoz, vert and diagonal mirror lines
   g.ctx.save();
   g.ctx.strokeStyle = "rgb(50, 50, 175)";
   line([a.center[0]-a.r_out, a.center[1]], [a.center[0]+a.r_out, a.center[1]], 0.05);
   line([a.center[0], a.center[1]-a.r_out], [a.center[0], a.center[1]+a.r_out], 0.05);
   line([a.center[0]-a.r_out, a.center[1]-a.r_out], [a.center[0]+a.r_out, a.center[1]+a.r_out], 0.05);
   line([a.center[0]-a.r_out, a.center[1]+a.r_out], [a.center[0]+a.r_out, a.center[1]-a.r_out], 0.05);
   g.ctx.restore();

   // draw inner circle
   circle(a.center, a.r_in, "rgb(150, 250, 250)");
   // draw outer circle
   circle(a.center, a.r_out, "rgb(250, 150, 250)");

   // draw alpha line
   g.ctx.strokeStyle = "rgb(50, 250, 75)";
   lineAngle(a.center, a.alpha, a.r_out, 0.05);
   // draw beta line
   g.ctx.strokeStyle = "rgb(250, 150, 150)";
   lineAngle(a.center, a.beta, a.r_out, 0.05);

   // draw a dot in the center of our graph
   dot(a.center, "rgb(150, 150, 250)");


   var colors = ["rgb(150, 250, 200)", "rgb(250, 200, 150)"];

   // now do actual calculations split into symmetric sweeps
   // where mirror (verb) means taking points from a partition P(n) and mirroring them along a symmetry line of the plane (hoz, vert, 2 diags)
   
   // partition p is all the points in a sweep
   var p = [];
   var p_full = [];// true if we have ALL of the points in that sweep

   // where mirror lines are numbered from 0-7 with angle 0->0, angle pi/4-> 1 etc
   var mirror = [];
   for(var m=0; m<8; m++) {
      mirror.push( m * Math.PI/4 );
      p.push([]); // empty list of points
      p_full.push(false);
   }
   console.log("m:", mirror);
   // a "sweep" is a region that is between 2 mirror lines (so width Math.PI/4)
   
   
   
   var start = a.alpha; // start sweeping from here
   var m = Math.ceil( (4*start) / Math.PI ); // first mirror line after alpha
   var next_mirror = mirror[ m ];
   var end;
   var prev_start_angle = a.alpha; // keep track of this so we can know how much more calculation we need to do after a mirror of a partial sweep
   
   
   /* Whenever we obtain the points for a partition P(n), there are a few scenarios:
    * P(n-1) was empty, partial or full
    * for P(n) we need partial or full
    * So depending on how much we need and how much we could mirror, we choose between: mirror, mirror+subtract, mirror+add
    * Checking if prev_start_angle is a mirror line is fine despite floats, since if it were one they come from the same mirror line list.
    */
   
   while( next_mirror < a.beta ) { // keep sweeping/mirroring (at least 1 sweep)

      end = a.beta < next_mirror ? a.beta : next_mirror; // next end
      lineAngle(a.center, end, a.r_out, 0.05);
  
      console.log("processing sweep: ", start/Math.PI, end/Math.PI, "beta: ", a.beta/Math.PI);
      console.log("next_mirror: ", m);
      if( m > 1 && p_full[m-2] ) { // p==m-1 (it's trailing) and we need some part of it
         console.log("We can mirror");
         annulus_region(a.center, start, end, a.r_in, a.r_out-a.r_in, "rgba(230, 200, 10, 0.7)");
         p_full[m-1] = true;
      } else {
         console.log("We have to calc p" + (m-1));
         p[m-1] = calc(start, end);
         annulus_region(a.center, start, end, a.r_in, a.r_out-a.r_in, "rgba(100, 230, 200, 0.7)");
         // maybe not full??
         p_full[m-1] = true;
      }
      
      
      start = end; // continue from where we left off
      m++; // find next mirror line
      next_mirror = mirror[ m ]; // and its angle
   }
   console.log("swept all, rest:", end/Math.PI, "beta: ", a.beta/Math.PI)
   // process last bit
   annulus_region(a.center, end, a.beta, a.r_in, a.r_out-a.r_in, "rgba(100, 230, 200, 0.7)");
      // less than half a sweep: calc it
      
      // more than half a sweep
      // if we have the previous sweep, mirror that and subtract the part (beta, next sweep) remainder
   
   
 

   console.log("Done");
  
   
}

function calc(start, end) {

   console.log("Calculating points in ", start, end);
   return [];
}

var g = {};
function setup() {
   var canvas = document.getElementById("canvas");
   g.width = canvas.width;
   g.height = canvas.height;
   g.ctx = canvas.getContext("2d");
   
   g.ctx.lineWidth = 0.003;
   
   g.ctx.translate( g.width/2, g.height/2 ); // put (0,0) in center of screen
   
   g.scale_x = g.width/(a.r_out*2);
   g.scale_y = g.height/(a.r_out*2);
   
   g.ctx.scale( g.scale_x, g.scale_y  ); // set 1 distance unit to N pixels so N_max is the entire canvas width
   // note: don't scale y as -y, while coords would be nicer, text would be upside down
}

function lineAngle(start, angle, length, lineWidth) {
   var xy = [Math.cos(angle), Math.sin(angle)];
   line(start, [ length * xy[0], length * xy[1] ], lineWidth);
}

// draw line (reverses y to translate math -> canvas
function line(from, to, lineWidth) {
   
   g.ctx.save();
   g.ctx.lineWidth = lineWidth ? lineWidth : 0.003;
   g.ctx.beginPath();
   g.ctx.moveTo(from[0], -from[1]);
   g.ctx.lineTo(to[0], -to[1]);
   g.ctx.stroke();
   g.ctx.closePath();
   g.ctx.restore();
   
}

function dot(p, color) {
   g.ctx.save(); // for color reset
   g.ctx.moveTo(p[0], -p[1]);
   g.ctx.fillStyle = color;
   g.ctx.arc(p[0], -p[1], 0.08, 0, Math.PI*2, true);
   g.ctx.closePath();
   g.ctx.fill();
   g.ctx.restore();
}

function circle(p, radius, color) {
   g.ctx.save(); // for color reset
   g.ctx.moveTo(p[0], -p[1]);
   g.ctx.fillStyle = color;
   g.ctx.arc(p[0], -p[1], radius, 0, Math.PI*2, true);
   g.ctx.stroke();
   g.ctx.restore();
}

// draw in ABCD order
function annulus_region(center, start_angle, end_angle, distance, width, color) {
   g.ctx.save();   
   
   //console.log("Annulus region", start_angle, end_angle);
   
   g.ctx.fillStyle = color;
   
   g.ctx.beginPath();
   // draw outer arc A->B
   g.ctx.arc(center[0], center[1], distance+width,  2*Math.PI - end_angle, -start_angle, false);
//   g.ctx.lineTo(a.r_in * Math.cos(a.beta), a.r_in * Math.sin(a.beta)); // connect, this is B->C, so arg is C
   // draw inner arc C->D
   g.ctx.arc(center[0], center[1], distance,  -start_angle,2*Math.PI -  end_angle, true);

   // connect D->A   
   g.ctx.closePath();
   g.ctx.fill();
   
   g.ctx.restore();
}

