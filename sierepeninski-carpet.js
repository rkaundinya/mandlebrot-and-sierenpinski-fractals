const Main_Scene = 
class Sierenpinski_Carpet extends Scene {

    // Note - when I say box cut-out I mean if the canvas is a black box, at depth 0 (no box fractals drawn), 
    // the whole black canvas sheet is colored blue like in the image you showed me. When a cut-out is drawn,
    // that area is now colored black
    constructor() {
        super(); 
        this.vertices = []; 
        this.indices = []; 
    }

    // This calculates the edge vertices of the new box cut-outs
    // **See note above constructor for meaning of box cut-out**
    // Takes in two vectors, uses a ratio to find a vertex point of a box cut-out for the fractal
    // Adds that vertex to an array of vertices
    // Returns the array of vertices
    // Don't ask exactly why this works - but the ratio we need for this is 1/3; I'll read up on why it works later
    // and comment that in here
    splitEdgeAndAdd (vector1, vector2, ratio) {
        let newVert = vector1 + ((vector2 - vector1) * ratio); 
        this.vertices.push(newVert); 
        return newVert; 
    }

    // This generates the vertices for the initial black box canvas of the fractal
    // Takes in 4 vertices to draw the full box - point1, point2, point3, and point4
    // Takes in a depth value which tells it how many box cut-outs to draw (basically the fractal level)
    // Begins recursive generation of box cut-out vertices for depth number of times
    // Return of void
    generateSierenpinskiCanvas(point1, point2, point3, point4, depth) {
        this.vertices.push(point1); 
        this.vertices.push(point2); 
        this.vertices.push(point3); 
        this.vertices.push(point4); 
        generateSierenpinskiCarpet(point1, point2, point3, point4, 0, 1, 2, 3, depth); 
    }

    generateSierenpinskiCarpet(point1, point2, point3, point4, index1, index2, index3, index4, depth) {
        if (depth == 0) {
            // First set of indices indicating first triangle to be drawn of box cut-out
            this.indices.push[index1];
            this.indices.push[index2]; 
            this.indices.push[index3]; 

            // Second set of indices indicating second triangle to be drawn of box cut-out
            this.indices.push[index1]; 
            this.indices.push[index3]; 
            this.indices.push[index4]; 

            return; 
        }

        // Decrease the count for the recursion
        depth--; 

        let indexStart = this.vertices.length; 
        let point5 = splitEdgeAndAdd(point1, point2, 1/3); 
        let point6 = splitEdgeAndAdd(point1, point2, 2/3); 
        let point7 = splitEdgeAndAdd(point2, point3, 1/3); 
        let point8 = splitEdgeAndAdd(point2, point3, 2/3); 
        let point9 = splitEdgeAndAdd(point3,point4, 1/3);
		let point10 = splitEdgeAndAdd(point3,point4, 2/3);
		let point11 = splitEdgeAndAdd(point4,point1, 1/3);
		let point12 = splitEdgeAndAdd(point4,point1, 2/3);
		let point13 = splitEdgeAndAdd(point12,point7, 1/3);
		let point14 = splitEdgeAndAdd(point12,point7, 2/3);
		let point15 = splitEdgeAndAdd(point8,point11, 1/3);
		let point16 = splitEdgeAndAdd(point8,point11, 2/3);
		let index5 = indexStart;
		let index6 = indexStart+1;
		let index7 = indexStart+2;
		let index8 = indexStart+3;
		let index9 = indexStart+4;
		let index10 = indexStart+5;
		let index11 = indexStart+6;
		let index12 = indexStart+7;
		let index13 = indexStart+8;
		let index14 = indexStart+9;
		let index15 = indexStart+10;
		let index16 = indexStart+11;
		
        // For each of the newly generated box cut-outs, recursively do the same process to calculate more 
        // box cut-outs according to the updated depth value. If depth is updated to 0 above, then this doesn't 
        // do anything
		generateSierpinskyCarpet(point1,point5,point13,point12,index1,index5,index13,index12,depth);
		generateSierpinskyCarpet(point5,point6,point14,point13,index5,index6,index14,index13,depth);
		generateSierpinskyCarpet(point6,point2,point7,point14,index6,index2,index7,index14,depth);
		generateSierpinskyCarpet(point14,point7,point8,point15,index14,index7,index8,index15,depth);
		generateSierpinskyCarpet(point15,point8,point3,point9,index15,index8,index3,index9,depth);
		generateSierpinskyCarpet(point16,point15,point9,point10,index16,index15,index9,index10,depth);
		generateSierpinskyCarpet(point11,point16,point10,point4,index11,index16,index10,index4,depth);
		generateSierpinskyCarpet(point12,point13,point16,point11,index12,index13,index16,index11,depth);

    }

};