import collectives from "../../../data/collectives.js"

export function spreadout(data, k, step, num_processes, block_size, data_moved, undo=false) {
    return new Promise((resolve, reject) => {

        const state = {
            done: false,
            k: k,
            data_moved: data_moved,
            data_pending: 0,
            step: null
        }

        // clean marked
        if (step.substep === 2) {
            data.map(p => {
                p.blocks.map(block => { if (block.status === 1) block.status = 2 })
                p.receive_buffer.map(block => { if (block && block.status === 1) block.status = 0 })
                return p
            })

            // final comm step k was reached and completed (P - 1)
            if (k === data.length - 2)
                step.id = 1
        }

        if (!undo) {
            resolve(forward(data, k, step, num_processes, block_size, state))
        } else {
            resolve(backward(data, k, step, num_processes, block_size, state))
        }
    })
}


function backward(data, k, step, num_processes, block_size, state) {

    // console.log(`step.id: ${step.id}`)
    // console.log(`step.substep: ${step.substep}`)

    switch (step.id) {
        case 0:

            switch(step.substep) {
                case 1: // unmark
                    data.forEach((p, i) => p.blocks.forEach(block => {
                        if (k > 0) {
                            const markedBlocks = p.blocks.filter(block => block.status === 1)
                            markedBlocks.forEach((block, j) => {
                                const moveToBlock = ((block.id * block_size) + j) % (data.length * block_size)
                                const moveToProcess = (i + k) % (data.length)
                                data[moveToProcess].receive_buffer[moveToBlock].status = 1
                                // data[moveToProcess].receive_buffer[moveToBlock] = JSON.parse(JSON.stringify(block))
                            })
                        }
                        if (block.status === 1) block.status = 0
                    }))

                    state.step = {
                        id: 0,
                        substep: k === 0 ? 0 : 2,
                    }
                    if (k === 0) {
                        state.step.text = `Initial State`
                        state.step.subtext = collectives.alltoall.algorithms[1].info.initial
                    } else {
                        state.k -= 1
                        const commStepInfo = `
                            <br><br> For <strong><code>k = <a class="animate">${state.k}</a></code></strong>, process <code>p</code> sends to <code>(rank + <a class="animate">${k}</a>) % ${num_processes}</code>.
                        `
                        state.step.text = `Communication Step k = ${state.k}`
                        state.step.subtext = collectives.alltoall.algorithms[1].info.commstep + commStepInfo
                    }
                    return state
                    break

                case 2:
                    data.forEach((p, i) => {
                        let index = ((p.id + k + 1) % data.length) * block_size
                        const blocksToMark = p.blocks.filter((element) => {
                            return element.color === p.blocks.at(index).color
                        })
                        blocksToMark.map(block => {
                            block.status = 1
                            state.data_pending += 1
                        })
                        p.statuses.at((p.id + k) % data.length - data.length + 1).status = 1

                        const markedBlocks = p.blocks.filter(block => block.status === 1)
                        markedBlocks.forEach((block, j) => {
                            const moveToBlock = ((block.id * block_size) + j) % (data.length * block_size)
                            const moveToProcess = (i + k + 1) % (data.length)
                            data[moveToProcess].receive_buffer[moveToBlock] = null
                        })

                        state.data_moved -= markedBlocks.length / block_size
                    })

                    state.step = {
                        id: 0,
                        substep: 1,
                        text: step.text,
                        subtext: step.subtext
                    }

                    return state
                    break
            }

            break

        case 1:
            
            break

        default:
            break
    }
}

function forward(data, k, step, num_processes, block_size, state) {
    switch (step.id) {
        case 0: // COMM STEP

            // increment to next k 
            if (step.substep === 2) {
                k = k + 1
                state.k = k
                step.substep = 0
            }

            const commStepInfo = `
                <br><br> For <strong><code>k = <a class="animate">${k}</a></code></strong>, process <code>p</code> sends to <code>(rank + <a class="animate">${k}</a>) % ${num_processes}</code>.
            `

            if (step.substep === 0) {

                // mark only
                data.map(p => {
                    let index = ((p.id + k + 1) % data.length) * block_size

                    const blocksToMark = p.blocks.filter((element) => {
                        return element.color === p.blocks.at(index).color
                    })
                    blocksToMark.map(block => {
                        block.status = 1
                        state.data_pending += 1
                    })
                    p.statuses.at((p.id + k) % data.length - data.length + 1).status = 1
                    return p
                })

                state.data_pending /= block_size

                state.step = {
                    id: 0,
                    substep: 1,
                    text: `Communication Step k = ${k}`,
                    subtext: collectives.alltoall.algorithms[1].info.commstep + commStepInfo
                }

            } else {
                // move marked
                data.map((p, i) => {
                    const markedBlocks = p.blocks.filter(block => block.status === 1)

                    markedBlocks.forEach((block, j) => {
                        const moveToBlock = ((block.id * block_size) + j) % (data.length * block_size)
                        const moveToProcess = (i + k + 1) % (data.length)
                        data[moveToProcess].receive_buffer[moveToBlock] = JSON.parse(JSON.stringify(block))
                        block.status = 2
                    })

                    state.data_moved += markedBlocks.length / block_size
                    state.data_pending += markedBlocks.length / block_size

                    return p
                })


                state.step = {
                    id: 0,
                    substep: 2,
                    text: `Communication Step k = ${k}`,
                    subtext: collectives.alltoall.algorithms[1].info.commstep + commStepInfo
                }
            }


            return state
            break
        case 1:
            console.log('h')
            // final step
            data.map(p => {
                const markedBlocks = p.blocks.filter(block => block.color === block.id)

                markedBlocks.forEach((block, i) => {
                    p.receive_buffer[(block.color * block_size) + i] = JSON.parse(JSON.stringify(block))
                    block.status = 2
                })

                return p
            })


            state.done = true
            state.step = {
                id: 3,
                substep: 0, // curr k is done
                text: `Final Step`,
                subtext: collectives.alltoall.algorithms[1].info.final
            }
            return state
            break
        default:
            break
    }
}
