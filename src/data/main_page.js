export default {
    // modifies main page and header
    title: "MPI All to All Visualizer",
    // main page text
    body: `
        <p>
            Message passing interface (MPI) is a communication protocol standard designed to function on parallel computing architectures. 
            Within MPI, there are many different types of collective routines, such as <code>MPI_Alltoall</code>, that facilitates different ways to pass data between processes.
            You can find standard implementations of MPI collectives in libraries like <a href="https://www.mpich.org/" class="text-decoration-none" target="_blank">MPICH</a> and
            <a href="https://www.open-mpi.org/" class="text-decoration-none" target="_blank">Open-MPI</a>. This website was created to help people explore MPI collectives, 
            starting with <code>MPI_Alltoall</code>. With this website, we hope to provide an intuitive understanding of the actual implementation of collectives like <code>MPI_Alltoall</code>. 
            This interactive web based tool will help you visualize MPI algorithms step by step, and provide information as you go (at any pace you desire!).
            <strong>Click on a collective in the sidebar to get started.</strong>
        </p>
    `,
    // main page publication text
    publications: [
        {
            title: 'A Visual Guide to MPI All-to-all',
            author: 'N. Netterville, K. Fan, S. Kumar, and T. Gilray',
            link: 'https://ieeexplore.ieee.org/document/10056562'
        },
        {
            title: 'Optimizing the bruck algorithm for non-uniform all-to-all communication',
            author: 'K. Fan, T. Gilray, V. Pascucci, X. Huang, K. Micinski, and S. Kumar',
            link: 'https://dl.acm.org/doi/abs/10.1145/3502181.3531468'
        },
        {
            title: 'Efficient algorithms for all-to-all communications in multiport message-passing systems',
            author: 'J. Bruck, C.-T. Ho, S. Kipnis, E. Upfal, and D. Weathersby',
            link: 'https://ieeexplore.ieee.org/document/642949'
        },
        {
            title: 'Improving all-to-many personalized communication in two-phase i/o',
            author: 'Q. Kang, R. Ross, R. Latham, S. Lee, A. Agrawal, A. Choudhary, and W.-k. Liao',
            link: 'https://ieeexplore.ieee.org/document/9355310'
        },
        {
            title: 'Optimization of collective communication operations in mpich',
            author: 'R. Thakur, R. Rabenseifner, and W. Gropp',
            link: 'https://dl.acm.org/doi/10.1177/1094342005051521'
        },
        {
            title: 'Implementing a classic: Zero-copy all-to-all communication with mpi datatypes',
            author: 'J. L. Tr ̈aff, A. Rougier, and S. Hunold',
            link: 'https://dl.acm.org/doi/abs/10.1145/2597652.2597662'
        },
        {
            title: 'SLOAVx: Scalable LOgarithmic AlltoallV Algorithm for Hierarchical Multicore Systems',
            author: 'C. Xu, M. G. Venkata, R. L. Graham, Y. Wang, Z. Liu, and W. Yu',
            link: 'https://ieeexplore.ieee.org/document/6546114'
        }
    ]
}