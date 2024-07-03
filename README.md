# A Visual Guide to MPI All-to-all

The standard implementation of `MPI_Alltoall` in MPI libraries (e.g., MPICH, Open-MPI) uses a combination of techniques, such as the spread-out and Bruck algorithms. 
The spread-out algorithm uses a linear number iterations, in process count $P$, while the Bruck algorithm is logarithmic.
The Bruck algorithm transfers more data overall, but with fewer communication steps, and is thus better suited for smaller sized (latency-dominated) messages. MPI implementations dynamically choose the underlying algorithm to use depending upon process count and message size. 

We have created an easy-to-use, parameterized, interactive web-based visualization that shows the implementation details of both the linear-step spread-out algorithm and the log-step Bruck algorithm, along with the decision tree used to choose between these two algorithms. Our tool visually illustrates and animates the two algorithms, pointing out key differences such as number of iterations, communication pattern and whether they are in-place.


## Getting Started
### Requirements
- NodeJS 18.4.0

### Running the Project
Use `npm install` to download dependencies. Then, run the application with `npm run dev`. The website preview will be served at http://localhost:3000/.


### Building the Project
Build the project with `npm run build`. Files will be compiled to `dist/`.

## License
This project is licensed under the MIT License - see the [LICENSE.txt](LICENSE.txt) file for details.