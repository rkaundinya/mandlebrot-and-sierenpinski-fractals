import {tiny, defs} from './assignment-3-resources.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Shape, Shader,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

const Main_Scene = defs.Transforms_Sandbox =
class Transforms_Sandbox extends Transforms_Sandbox_Base
{     
  constructor() {
    super(); 

    this.audio = new Audio('assets/continuum.mp3');
    this.audio.loop = true;

    //TOGGLE BETWEEN FRACTALS
    this.view_mandelbrot = true;
    this.just_toggled = false;

    //SIERENPINSKI PROPERTIES
    this.box_matrices = [];
    this.box_stack = [];
    this.box_centers = [[0, 0]];
    this.depth = 1

    //MANDELBROT PROPERTIES
    this.complex_boundaries = [-2, 2, -2, 2]; //left right down up
    this.resolution = 100;
    this.max_iterations = 1000;
    this.initialize_mandelbrot();
    //this.reset_mandelbrot();
    
  }

  //SIERENPINSKI FUNCTIONS
  generateSierenpinskiBoxes(model_transform, depth) {
    var box_matrices = Object.create(null)

    box_matrices[8] = [model_transform, null];

    let box_1 = model_transform.times( Mat4.translation([ -2,2, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );
    let box_2 = model_transform.times( Mat4.translation([ 0,2, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );
    let box_3 = model_transform.times( Mat4.translation([ 2,2, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );
    let box_4 = model_transform.times( Mat4.translation([ -2,0, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );
    let box_5 = model_transform.times( Mat4.translation([ 2,0, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );
    let box_6 = model_transform.times( Mat4.translation([ -2,-2, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );
    let box_7 = model_transform.times( Mat4.translation([ 0,-2, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );
    let box_8 = model_transform.times( Mat4.translation([ 2,-2, 0 ]) )
                               .times( Mat4.scale ([ 1/3, 1/3, 1 ]) );

    box_matrices[0] = [box_1, null];
    box_matrices[1] = [box_2, null];
    box_matrices[2] = [box_3, null];
    box_matrices[3] = [box_4, null];
    box_matrices[4] = [box_5, null];
    box_matrices[5] = [box_6, null];
    box_matrices[6] = [box_7, null];
    box_matrices[7] = [box_8, null];

    depth--
    if (depth <= 0) {
      return box_matrices
    } else {
      box_matrices[0] = [box_1, this.generateSierenpinskiBoxes(box_1, depth)];
      box_matrices[1] = [box_2, this.generateSierenpinskiBoxes(box_2, depth)];
      box_matrices[2] = [box_3, this.generateSierenpinskiBoxes(box_3, depth)];
      box_matrices[3] = [box_4, this.generateSierenpinskiBoxes(box_4, depth)];
      box_matrices[4] = [box_5, this.generateSierenpinskiBoxes(box_5, depth)];
      box_matrices[5] = [box_6, this.generateSierenpinskiBoxes(box_6, depth)];
      box_matrices[6] = [box_7, this.generateSierenpinskiBoxes(box_7, depth)];
      box_matrices[7] = [box_8, this.generateSierenpinskiBoxes(box_8, depth)];
      return box_matrices
    }
  }

  drawSierenpinskiBoxes(context, program_state, box_matrices) {
    let color = Color.of(5, 5, 5, 1);
    let self = this
    for (var key in box_matrices) {
       self.shapes.square.draw(context, program_state, box_matrices[key][0], self.materials.plastic.override(color));
       if (box_matrices[key][1] != null) {
          this.drawSierenpinskiBoxes(context, program_state, box_matrices[key][1]);
       }
    }
  }

  colliderDetection(x, y, s) {
    if (this.depth >= 1) {
    let scaling = (1/3)**this.depth
    let curr_box_center = this.box_centers[this.box_centers.length-1].slice()
    let new_box_center = curr_box_center.slice()
    let boxX = curr_box_center[0]
    let boxY = curr_box_center[1]
                               //console.log(this.box_centers)

                               //console.log(new_box_center)



    if(x - s > (boxX - (27 * scaling * 3)) && x + s < (boxX - (13 * scaling * 3))
    && y - s > (boxY + (10 * scaling * 3)) && y + s < (boxY + (30 * scaling * 3))) {
          console.log("goal0!")

          this.depth++
          new_box_center[0] = boxX - (20 * scaling * 3)
          new_box_center[1] = boxY + (20 * scaling * 3)
          this.box_centers.push(new_box_center)

          this.box_stack.push(0)
    } else if(x - s > (boxX - (13 * scaling * 3)) && x + s < (boxX + (13 * scaling * 3))
           && y - s > (boxY + (10 * scaling * 3)) && y + s < (boxY + (30 * scaling * 3))) {
           console.log("goal1!")

          this.depth++
          new_box_center[1] = boxY + (20 * scaling * 3)
          this.box_centers.push(new_box_center)

          this.box_stack.push(1)
    } else if(x - s > (boxX + (13 * scaling * 3)) && x + s < (boxX + (27 * scaling * 3))
           && y - s > (boxY + (10 * scaling * 3)) && y + s < (boxY + (30 * scaling * 3))) {
                 console.log("goal2!")

          this.depth++
          new_box_center[0] = boxX + (20 * scaling * 3)
          new_box_center[1] = boxY + (20 * scaling * 3)
          this.box_centers.push(new_box_center)

          this.box_stack.push(2)
    } else if(x - s > (boxX - (27 * scaling * 3)) && x + s < (boxX - (13 * scaling * 3))
           && y - s > (boxY - (10 * scaling * 3)) && y + s < (boxY + (10 * scaling * 3))) {
                 console.log("goal3!")

          this.depth++
          new_box_center[0] = boxX - (20 * scaling * 3)

          this.box_centers.push(new_box_center)

          this.box_stack.push(3)
    } else if(x - s > (boxX + (13 * scaling * 3)) && x + s < (boxX + (27 * scaling * 3))
           && y - s > (boxY - (10 * scaling * 3)) && y + s < (boxY + (10 * scaling * 3))) {
                 console.log("goal4!")

          this.depth++
          new_box_center[0] = boxX + (20 * scaling * 3)
          this.box_centers.push(new_box_center)

          this.box_stack.push(4)
    } else if(x - s > (boxX - (27 * scaling * 3)) && x + s < (boxX - (13 * scaling * 3))
           && y - s > (boxY - (30 * scaling * 3)) && y + s < (boxY - (10 * scaling * 3))) {
                 console.log("goal5!")

          this.depth++
          new_box_center[0] = boxX - (20 * scaling * 3)
          new_box_center[1] = boxY - (20 * scaling * 3)
          this.box_centers.push(new_box_center)

          this.box_stack.push(5)
    } else if(x - s > (boxX - (13 * scaling * 3)) && x + s < (boxX + (13 * scaling * 3))
           && y - s > (boxY - (30 * scaling * 3)) && y + s < (boxY - (10 * scaling * 3))) {
                 console.log("goal6!")

          this.depth++
          new_box_center[1] = boxY - (20 * scaling * 3)
          this.box_centers.push(new_box_center)

          this.box_stack.push(6)
    } else if(x - s > (boxX + (13 * scaling * 3)) && x + s < (boxX + (27 * scaling * 3))
           && y - s > (boxY - (30 * scaling * 3)) && y + s < (boxY - (10 * scaling * 3))) {
                 console.log("goal7!")

          this.depth++
          new_box_center[0] = boxX + (20 * scaling * 3)
          new_box_center[1] = boxY - (20 * scaling * 3)
          this.box_centers.push(new_box_center)

          this.box_stack.push(7)
    } else if(x - s < (boxX - (27 * scaling * 3)) && x + s > (boxX + (27 * scaling * 3))
           && y - s < (boxY - (30 * scaling * 3)) && y + s > (boxY + (30 * scaling * 3))) {

             if (this.depth > 1) {
                 console.log("zoom out!")

           this.depth--
           this.box_centers.pop()

           this.box_stack.pop()
             }
    }
    }
  }

  //MANDELBROT FUNCTIONS

  initialize_mandelbrot() {
    this.mandelbrot = [];
    for(let i = -1 * this.resolution; i <= this.resolution; i++) {
      let arr = [];
      for(let j = -1 * this.resolution; j <= this.resolution; j++) {
        let complex = this.world_to_complex(i,j);
        let iterations = this.calc_mandelbrot(complex[0], complex[1], this.max_iterations);
        let shade = 1 - iterations/this.max_iterations;
        arr.push(shade);
      }
      this.mandelbrot.push(arr);
    }
  }

  reset_mandelbrot() {
    for(let i = -1 * this.resolution; i <= this.resolution; i++) {
      for(let j = -1 * this.resolution; j <= this.resolution; j++) {
        let complex = this.world_to_complex(i,j);
        let iterations = this.calc_mandelbrot(complex[0], complex[1], this.max_iterations);
        let shade = 1 - iterations/this.max_iterations;
        this.mandelbrot[i+this.resolution][j+this.resolution] = shade;
      }
    }
  }

  reset_complex_boundaries(s, x, y) {
    let l = this.complex_boundaries[0];
    let r = this.complex_boundaries[1];
    let d = this.complex_boundaries[2];
    let u = this.complex_boundaries[3];
    let length = s * (r - l)/100;
    let origin_x = x*length/100 + (r + l)/2;
    let origin_y = y*length/100 + (u + d)/2;

    this.complex_boundaries = [origin_x - length, origin_x + length, origin_y - length, origin_y + length];

  }

  world_to_complex(x, y) {
    let l = this.complex_boundaries[0];
    let r = this.complex_boundaries[1];
    let d = this.complex_boundaries[2];
    let u = this.complex_boundaries[3];

    let length = (r - l)/2;
    let origin_x = (r + l)/2;
    let origin_y = (u + d)/2;

    return [origin_x + x * (length/this.resolution), origin_y + y * (length/this.resolution)];
  }

  calc_mandelbrot(c_real, c_imag, max_iterations) {
    let iterations = 0;
    let real = 0;
    let imag = 0;

    while (real**2 + imag**2 <= 4 && iterations < max_iterations) {
        let temp_real = real**2 - imag**2 + c_real;
        imag = 2 * real * imag + c_imag;
        real = temp_real;
        iterations = iterations + 1;
    }

    return iterations;
  }

  make_control_panel()
  {                                 
    this.key_triggered_button("Toggle Mandelbrot/Serpinski",[" "],() => {
      this.view_mandelbrot = !this.view_mandelbrot;
      this.just_toggled = true;
    }); 
    this.key_triggered_button("Mute Audio", ["m"], () => this.audio.muted = !this.audio.muted); 
  }

  display( context, program_state ) {                                                
      super.display(context, program_state); 

      if (this.audio.paused) {
          let promise = this.audio.play();
          if (promise !== undefined) {
            promise.then(_ => {}).catch(error => {});
          }
      }

      if (this.view_mandelbrot) {

        if(this.just_toggled) {
          program_state.set_camera( Mat4.scale([2, 2, 2]) );
          this.complex_boundaries = [-2, 2, -2, 2];
          this.reset_mandelbrot();
          this.just_toggled = false;
        }

        let s = 100*program_state.camera_transform[0][0]; //0-100
        let x = program_state.camera_transform[0][3]; 
        let y = program_state.camera_transform[1][3];

        if(x - s < -55 || x + s > 55 || y - s < -55 || y + s > 55 ||
          x - s > -35 || x + s < 35 || y - s > -35 || y + s < 35) {
          program_state.set_camera( Mat4.scale([2, 2, 2]) );
          this.reset_complex_boundaries(s, x, y);
          this.reset_mandelbrot();
        }

        let resolution = this.resolution;
        for(let i = -1 * resolution; i <= resolution; i++) {
          for(let j = -1 * resolution; j <= resolution; j++) {
            let model_transform = Mat4.scale([50/resolution,50/resolution,0]).times(Mat4.translation([2*i,2*j,0]));
            let shade = 1-this.mandelbrot[i+resolution][j+resolution];

            if (shade > 0.05) {
              let color = Color.of(5*shade, 5*shade,5*shade, 1);
              this.shapes.square.draw(context, program_state, model_transform, this.materials.plastic.override(color));
            }
          }
        }
      } else {

        if(this.just_toggled) {
          //TODO: reset program to initial conditions
          program_state.set_camera( Mat4.scale([2, 2, 2]) );
          this.just_toggled = false;
        }

        let s = 100*program_state.camera_transform[0][0]; //0-100
        let x = program_state.camera_transform[0][3]; 
        let y = program_state.camera_transform[1][3];

        this.colliderDetection(x, y, s);

        let model_transform = Mat4.identity();
        model_transform = model_transform.times( Mat4.scale ([ 10, 10, 1 ]) )

        let color = Color.of(5, 5, 5, 1);
        this.shapes.square.draw( context, program_state, model_transform, this.materials.plastic.override( color ) );

        this.box_matrices = this.generateSierenpinskiBoxes(model_transform, this.depth+2);

        let tempStack = this.box_stack.slice();
        let render_boxes = this.box_matrices;
        while (tempStack.length) {
          let boxNum = tempStack.shift()
          render_boxes = render_boxes[boxNum][1];
        }

        this.drawSierenpinskiBoxes(context, program_state, render_boxes);
      }
  }                      
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }