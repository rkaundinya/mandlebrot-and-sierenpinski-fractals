For our project, we visualized interactive fractals, in which
the user can explore the fractals through zooming into different
areas -- infinitely!!!

We split up our project into visualizing two specific fractals:
the Mandelbrot set and the Serpinski Carpet.

I) Mandelbrot set

	i) Overview of Mandelbrot

	The Mandelbrot set is a set of complex numbers c in which their 
	corresponding function:
		f_c: C -> C such that f_c(z) = z^2 + c,
	is bounded upon iteration.

	We visualize this set by plotting them onto the complex plane. In our
	application, numbers in this set are white.

	For the numbers that are not in the Mandelbrot set, we give them a
	shade (between white and black) based on how fast their corresponding
	f_c() functions grow.

	The complex_to_mandelbrot() function takes in a complex
	number c and determines the growth rate of f_c(), therefore determining
	the corresponding shade. Then we use the provided Square shape to draw
	a "pixel" onto the screen, as if plotting on the complex plane, with
	its calculated shade.

	ii) Advanced feature: infinite zoom

	The tricky part was determining how to zoom in infinitely to reveal the
	true beauty of the Mandelbrot set. We decided to take an approach inspired
	by Google Maps. When you zoom in enough, Google Maps re-renders the
	map to reveal a finer granularity of detail; when you zoom out, a lower 
	granularity.

	So when the camera zooms in to a certain point, we want the Mandelbrot set
	to be rendered with more precision without being too computationally expensive.

	Here is our implementation:

	Within our world view, the Mandelbrot is rendered on the region
	{(x,y) | -100 <= x,y <= 100}; we map certain region of the
	complex plane to this space. Initially, the complex plane region
	{ a + bi | -2 <= a,b <= 2} is mapped to this space.

	Initially, the camera is capturing {(x,y) | -50 <= x,y <= 50}. 
	Setting the camera plane to half the size of the rendered world
	view region gives the camera room to zoom in/out and move left/right.

	Once we zoom in/out to a certain point, we reset the camera so that it
	is capturing {(x,y) | -50 <= x,y <= 50} once again. At the same time,
	we change the mapping of the complex plane region to the world view
	region, such that it creates the illusion that we haven't moved the camera.
	Because a smaller region of the complex plane is mapped to the same world
	view region, the Mandelbrot is now rendered at a finer granularity. Now, you
	can keep zooming in!!!

		- For instance, suppose that initially, the complex plane region
		{ a + bi | -2 <= a,b <= 2} is mapped to the world view region.
		After zooming in by 2X, the camera is reset, and the new complex
		plane region { a + bi | -1 <= a,b <= 1} is now mapped to the 
		world view region. The opposite happens when zooming out.

		- In this simple case, the mapping is not too complicated, but
		in other cases it is more tricky, especially when you take into
		account translation of the camera. It took us a while of experimenting 
		with precise calculations to determine how to seamlessly remap the 
		complex plane to create our illusion. We also had to tweak for a while
		to determine, based on the camera matrix, when to rerender. Therefore,
		we think that the infinite zoom feature is advanced; both the "when"
		and "how" of rerendering are intricate problems.


	iii) Roles
	Shangyu and Tyler worked on the Mandelbrot visualization. Tyler worked on calculating
	and plotting the Mandelbrot set. Shangyu worked on the camerawork and the
	rerendering process.

	iv) Music: Recure by Tyler 
	 
	- 9 measure phrase decomposed into 5 and 4 measure phrases
	- 5/8 rhythmic structure superimposed into compound meter
	- self similar arpeggiation played by hand

II) Sierenpinski Carpet
	i) Overview of Sierenpinski Carpet
	
	The Sierepenpinski Carpet is a self-similar set of squares which is generated
	recursively. Starting with a solid square, subdivide this into 9 smaller
	congruent squares. Continue to subdivide each of these congruent squares into 9
	small congruent squares and continue this process infinitely. In each iteration,
	remove the center square from the set of 9 congruent squares. 

	A special property of this set is that in each iteration, the shaded area is
	8/9 the original area. Therefore for n iterations, the area of 	the carpet is
	(8/9)^n. This means that as n goes to infinity, the
	carpet approaches an area of 0. This of course has no meaning as
	there are still parts of the square which are filled in. So area is not
	a useful property for the Sierenpinski Carpet. 

	ii) Advanced Feature: infinite zoom via level of detail
	
	Similar to the Mandelbrot Set, the Sierenpinksi Carpet utilizes
	infinite zoom to draw increasing levels of detail as you zoom into the carpet. 		However, the method of implementation varied slightly. 
	We decided to take a level of detail approach to the carpet. When
	the camera zooms into a particular portion of the carpet, that
	portion is divided into further squares. However, the rest of the
	carpet is no longer drawn as it is no longer visible to the viewer.
	Therefore, it appears to the viewer that they are zooming the set
	infinitely when in reality they are zooming into one portion of the original set 	and seeing that original set redrawn given their current
	camera position and field of view of the carpet. 

	We implemented this by creating a data structure which stores the
	location of 9 congruent boxes at a depth level of 1. Depth level
	indicates the number of recursions taken. The display region of 
	each congruent square at depth level 1 is checked for. When the
	viewer is completely within the display region of a square, the code
	increases the overall depth of the Sierenpinksi Carpet and draws
	only the portion relevant to the viewer. 

	iii) Roles
	Ram and Marko worked on the Sierenpinski Carpet visualization. 
	Ram worked on calculating and plotting the Sierenpinski Carpet.
	Marko and Ram worked on designing the level of detail system.
	Marko worked on implementing camerawork and rerendering.


