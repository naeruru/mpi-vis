/*
 * Object of Collectives
 * simply add a new one to append to front page list and generate a route
*/
export default {
    "alltoall": {
        // used for routing, and other in place variables
        "id": "alltoall",
        // used for display name
        "name": "All to All",
        // route specific page text
        body: `
        <code>MPI_Alltoall</code> is a widely used collective routine
        that facilitates uniform data exchange between every pair of
        processes. The standard implementation of MPI_Alltoall in
        MPI libraries (e.g., <a href="https://www.mpich.org/" target="_blank">MPICH</a>, 
        <a href="https://www.open-mpi.org/" target="_blank">Open-MPI</a>) uses a combination of
        techniques, such as the spread-out algorithm and the Bruck
        algorithm. The spread-out algorithm has a linear complexity in
        process count P, whereas the Bruck algorithm has a logarithmic
        complexity in P. The Bruck algorithm transfers more data
        with fewer communication steps than linear algorithms, and
        is thus better suited for relatively small sized (i.e., latency-dominated) 
        messages. The spread-out performs better for large-sized 
        messages (bandwidth-dominated). Despite the fact that MPI
        libraries implement MPI_Alltoall using multiple algorithms,
        the difference may not be apparent as implementations dynamically 
        choose the underlying algorithm to use depending upon
        process count and message size, based on rules in a pre-defined
        configuration file.

        <br><br>

        The visualization tool provided here will help you understand these two 
        <code>MPI_Alltoall</code> algorithms better by displaying them step by step,
        and providing information on these steps along the way. You can also customize the 
        input parameters to try out different sizes of data and processes. If you are unsure why a step happened,
        be sure to check out the information panel provided with the step text.
        `,
        // listed algorithms
        "algorithms": [
            {
                // used for routing, and other in place variables
                "id": "bruck",
                // used for display name
                "name": "Bruck",
                // enabled options
                options: {
                    num_processes: true,
                    block_size: true,
                    radix: true,
                    binary: true,
                },
                // graph data
                "data": [[2, 1], [4, 2], [8, 3], [16, 4], [32, 5]],
                // whether or not the algorithm has multiple schemes
                "scheme": ["Uniform", "Nonuniform"],
                // step info menu text (html syntax)
                // you can append customized info to these in the algorithm steps (./helpers/collectives/)
                "info": {
                    // 'initial' is required
                    "initial": `
                        Initial data state has been initialized. Bruck's algorithm, in its original form, requires three phases: 
                        <br>
                        - Initial data rotation phase<br>
                        - Communication phase (containing log<sup>P</sup><sub>2</sub> steps)<br>
                        - Final data rotation phase<br>
                        
                    `,
                    "rotationphase": `

                        The initial rotation phase performs a local
                        copy and moves the data up by <code>p</code> (the rank of the process)
                        data-blocks from the send buffer <code>S</code> to the receive buffer R.
                        After that, the data-block to be sent to itself is at the top of
                        the receive buffer <code>R</code>. This formula is as follows:
                        <br><br>
                        <center><code>S[i] = S[i+p] (p: rank)</code></center>
                    `,
                    "commstep": `
                        In each communication step <code>k</code>, process <code>i</code> sends to rank (<code>i + 2<sup>k</sup></code>) all the data blocks whose <code>k</code>th bit is 1, 
                        receives data from rank (<code>i − 2<sup>k</sup></code>), and stores the incoming data into blocks whose <code>k</code>th bit is 1 (that is, 
                        overwriting the data that was just sent).
                    `,
                    "final": `
                        All processes have received the correct data. However, it was not in the right order. Thus, a local inverse shift of data blocks from R to R:
                        <br><br>
                        <code>Reverse: R[i] = R[p - i] % P</code>.
                    `
                }
            },
            {
                "id": "spreadout",
                "name": "Spread Out",
                options: {
                    num_processes: true,
                    block_size: true,
                    radix: false,
                    binary: false,
                },
                "data": [[2, 1], [4, 3], [8, 7], [16, 15], [32, 31]],
                "receive_buffer": true,
                "info": {
                    "initial": `
                        Initial data state has been initialized. Spread-out is a general implementation of the all-to-all communication, 
                        which divides communication into <code>n = P - 1</code> communication steps. Each step exchanges one data-block 
                        between two processes using non-blocking point-to-point communication functions.
                    `,
                    "commstep": `
                        In each communication step <code>k</code>, process <code>p</code> will send its data block to 
                        <code>(rank + k) % P</code>, where P is the total number of processes.
                        Thus, each process will send to a unique process and avoid congestion.
                    `,
                    "final": `
                        All processes have received the correct data and are already in the correct order, since 
                        data blocks were sent into the correct location.
                    `
                }
            }
        ]
    }
}