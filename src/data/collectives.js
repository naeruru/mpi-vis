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
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto
            beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
            odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit,
            sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat
            voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit
            laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui
            in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat
            quo voluptas nulla pariatur?
        `,
        // listed algorithms
        "algorithms": [
            {
                // used for routing, and other in place variables
                "id": "bruck",
                // used for display name
                "name": "Bruck",
                // graph data
                "data": [[2, 1], [4, 2], [8, 3], [16, 4], [32, 5]],
                // whether or not the algorithm has multiple schemes
                "scheme": ["Uniform", "Nonuniform"],
                // step info menu text (html syntax)
                "info": {
                    // 'initial' is required
                    "initial": `
                        Initial data seteup.
                    `,
                    "rotationphase": `
                        <code>S[i] = S[i+p] (p: rank)</code>
                    `,
                    "commstep": `
                        In each communication step k, process i sends to rank (<code>i + 2<sup>k</sup></code>) all the data blocks whose kth bit is 1, 
                        receives data from rank (<code>i − 2<sup>k</sup></code>), and stores the incoming data into blocks whose kth bit is 1 (that is, 
                        overwriting the data that was just sent).
                    `,
                    "final": `
                        <code>Reverse: S[i] = S[p - i] (p: rank)</code>
                    `
                }
            },
            {
                "id": "spreadout",
                "name": "Spread Out",
                "data": [[2, 1], [4, 3], [8, 7], [16, 15], [32, 31]],
                "receive_buffer": true,
                "info": {
                    "initial": `
                        Initial data seteup.
                    `,
                    "commstep": `
                        In each communication step k, process p sends to <code>(rank + k) % P</code>, where P is the total number of processes. 
                        The algorithm takes <code>P - 1</code> communication steps.
                    `,
                    "final": `
                        Algorithm has finished.
                    `
                }
            }
        ]
    }
}