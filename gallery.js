function shuffleArray(array) {
    for (var i = array.length - 1; i >= 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}


const images = [
    { src: 'assets/f1.png', description: 'A Simple Fractal Pattern with Lines of Decreasing Length' },
    { src: 'assets/gr1.jpeg', description: 'A Visualizer of Gravitational Interactions Between 2 Moving Objects with Positive Equal Mass' },
    { src: 'assets/gr2.jpeg', description: 'A Visualizer of Gravitational Interactions Between 4 Moving Objects with Positive Equal Mass' },
    { src: 'assets/gr3.jpeg', description: 'A Visualizer of Gravitational Interactions Between 2 Moving Objects with Negative Equal Mass' },
    { src: 'assets/gr4.jpeg', description: 'A Visualizer of Gravitational Interactions Between 4 Moving Objects with Negative Equal Mass' },
    { src: 'assets/gr5.jpeg', description: 'A Colored Visualizer of Gravitational Interactions of 1 Stationary Object with Positive Mass' },
    { src: 'assets/gr6.jpeg', description: 'A Visualizer of Gravitational Interactions Between 2 Stationary Objects with Negative Equal Mass' },
    { src: 'assets/grad.png', description: 'A Generated Color Gradient Across Multiple Set Colors' },
    { src: 'assets/hill1.png', description: 'A Generated Koch Curve with Custom Angle' },
    { src: 'assets/hill2.png', description: 'A Generated Koch Curve with Custom Angle' },
    { src: 'assets/julia1.png', description: 'An Image of a Section of a Julia Set' },
    { src: 'assets/julia2.png', description: 'A Colored Image of a Section of a Julia Set' },
    { src: 'assets/julia3.png', description: 'A Colored Image of a Section of a Julia Set' },
    { src: 'assets/mandelbrot.png', description: 'An Image of the Mandelbrot Set' },
    { src: 'assets/mb1.jpeg', description: 'A Colored Image of a Section of the Mandelbrot Set' },
    { src: 'assets/mb2.jpeg', description: 'A Colored Image of a Section of the Mandelbrot Set' },
    { src: 'assets/mb3.jpeg', description: 'A Colored Image of a Section of the Mandelbrot Set' },
    { src: 'assets/mb4.jpeg', description: 'A Colored Image of a Section of the Mandelbrot Set' },
    { src: 'assets/phy1.png', description: 'A Colored Image Demonstrating Phyllotaxis' },
    { src: 'assets/pr1.png', description: 'A Generated Image of a Smooth Hilly Terrain made from Perlin Noise' },
    { src: 'assets/pt1.jpeg', description: 'A Visualizer of Gravitational Interactions Between 8 Stationary Objects with Negative Equal Mass' },
    { src: 'assets/pt2.jpeg', description: 'A Visualizer of Gravitational Interactions Between 9 Stationary Objects, 8 with Negative Equal Mass and 1 with Positive Mass' },
    { src: 'assets/pt3.jpeg', description: 'A Visualizer of Gravitational Interactions Between 4 Stationary Objects with Negative Equal Mass' },
    { src: 'assets/pt4.jpeg', description: 'A Visualizer of Gravitational Interactions Between 9 Stationary Objects, 8 with Negative Equal Mass and 1 with Positive Mass' },
    { src: 'assets/pt5.jpeg', description: 'A Visualizer of Gravitational Interactions Between 32 Stationary Objects, 24 with Negative Equal Mass and 8 with Equal Positive Mass' },
    { src: 'assets/pt6.jpeg', description: 'A Visualizer of Gravitational Interactions Between 31 Stationary Objects with Negative Equal Mass' },
    { src: 'assets/pt7.jpeg', description: 'A Visualizer of Gravitational Interactions Between 46 Stationary Objects with Negative Equal Mass' },
    { src: 'assets/pyt1.png', description: 'A Simple Fractal Pattern Based on the Squares of the Side Lengths of a Right Angle Triangle' },
    { src: 'assets/pyt2.png', description: 'A Simple Fractal Pattern Based on the Squares of the Side Lengths of a Right Angle Triangle' },
    { src: 'assets/sl1.png', description: 'A Representation of a Slope Field of a Differential Equation Traced by Moving Particles' },
    { src: 'assets/sq1.png', description: 'A Simple Fractal Pattern of Inlaied Squares' },
    { src: 'assets/tp0.jpeg', description: 'A Generated Image of a Topographical Map of Perlin Noise Based Terrain' },
    { src: 'assets/tp1.png', description: 'A Generated Image of a Topographical Map of Perlin Noise Based Terrain' },
    { src: 'assets/tp2.png', description: 'A Generated Image of a Topographical Map of Perlin Noise Based Terrain' },
    { src: 'assets/tr1.png', description: 'A Simple Fractal Pattern with Lines of Decreasing Length and Varying Angle' },
    { src: 'assets/tr2.png', description: 'A Simple Fractal Pattern with Lines of Decreasing Length and Varying Angle' },
    { src: 'assets/tri1.png', description: 'A Generated Image of the Sierpinski Triangle' },
];

shuffleArray(images);

let currentIndex = 0;

const imageElement = document.getElementById('carousel-image');
const nextbutton = document.getElementById('arrow_right');
const prevbutton = document.getElementById('arrow_left');

const descriptionElement = document.getElementById('carousel-description');


imageElement.src = images[currentIndex].src;
descriptionElement.textContent = images[currentIndex].description;



nextbutton.addEventListener('click', () => {
    console.log(currentIndex);

    currentIndex = (currentIndex + 1) % images.length;
    imageElement.src = images[currentIndex].src;
    descriptionElement.textContent = images[currentIndex].description;
}
);

prevbutton.addEventListener('click', () => {
    console.log("prev",currentIndex);

    currentIndex = (currentIndex - 1 + images.length) % images.length;

    console.log("after",currentIndex);

    imageElement.src = images[currentIndex].src;
    descriptionElement.textContent = images[currentIndex].description;
}
);

