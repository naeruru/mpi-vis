import collectives from "../../../data/collectives.js"



export function bruck(data, k, step, options, data_moved, undo=false) {
    return new Promise((resolve, reject) => {

        const state = {
            done: false,
            k: k,
            data_moved: data_moved,
            data_pending: 0,
            step: null
        }

        // calculate max comm steps
        let w = Math.log(options.num_processes) / Math.log(options.radix)
        // fixes: log_3(9) = 2.0000000000000004
        if (Math.floor(w) !== Math.floor(w-.0000001) || Math.floor(w) !== Math.floor(w+.0000001)) w = Math.round(w)
        w = Math.ceil(w)
        let rw = options.radix**w
        if (Math.floor(rw) !== Math.floor(rw-.0000001) || Math.floor(rw) !== Math.floor(rw+.0000001)) rw = Math.round(rw)

        let max_comm_steps
        if ((options.num_processes === rw)) { // (w % 1 === 0) fixes rounding issues
            // k = w(r-1)
            max_comm_steps = w * (options.radix - 1) - 1
        } else {
            // k = w(r - 1) - floor((r**(w) - P) / (r**(w-1)))
            max_comm_steps = w * (options.radix - 1) - Math.floor((rw - options.num_processes) / (options.radix**(w-1))) - 1
        }
        
        // final comm step k was reached and completed
        if (step.substep === 2 && k >= max_comm_steps) {
            step.id = 2
        }

        if (!undo) {
            resolve(forward(data, k, step, options, state))
        } else {
            resolve(backward(data, k, step, options, state))
        }
    })
}

function backward(data, k, step, options, state) {

    let bitstring = new Array(Math.ceil(Math.log2(options.num_processes))).join("0")
    bitstring = bitstring.substring(0, bitstring.length-k) + '1' + bitstring.substring(bitstring.length-k)
    const commStepInfo = `
        <br><br> 
        For <strong><code>k = ${k}</code></strong>, 
        process <code>i</code> sends all data blocks whose binary value bit ${k} is 
        <code>1</code> (ex: <code>${bitstring}</code>) 
        to process <code>i + ${2**k}</code>.
    `
    switch(step.id) {
        case 0:
            break
        case 1:
            switch(step.substep) {
                case 0:
                    // back to initial state
                    data.map((p) => {
                        for (let i = p.id * options.block_size; i > 0; i--) {
                            p.blocks.unshift(p.blocks.pop())
                        }
                        return p
                    })
                    state.step = {
                        id: 0,
                        substep: 0,
                        text: "Initial state",
                        subtext: collectives.alltoall.algorithms[0].info.initial
                    }
                    // return state
                    break
                case 1:
                    // unmark

                    
                    data.map((p, p_i) => {
                        // let sendTo = p_i + 2 ** k
                        const z = (k % (options.radix - 1)) + 1
                        const x = Math.ceil((k + 1) / (options.radix - 1))
                        let sendTo = p_i + z * options.radix ** (x - 1)
                        if (sendTo > data.length - 1) {
                            sendTo = sendTo - data.length
                        }
    
                        //adj matrix update
                        data[p_i].statuses[sendTo].status = 0
    
                        for (let i = 0; i < p.blocks.length; i++) {
                            //let blockid = p.id.toString() + p.blocks[i].color.toString()
                            // get binary for kth bit
                            const blockid = Math.floor(i / options.block_size)
                            const blockbid = ('000000000' + Number(blockid).toString(options.radix)).slice(-10)
                            const kb = ('000000000' + Number(k + 1).toString(options.radix)).slice(-10)
                            // check if bit index is equal to the iterating (1 ≤ 𝑧 < 𝑟)
                            // z = (k % (options.radix - 1)) + 1
                            if (blockbid[blockbid.length - Math.ceil((k + 1) / (options.radix - 1))] == (k % (options.radix - 1)) + 1) {
                                p.blocks[i].status = 0
                            }
                        }
                        return p
                    })
                    state.data_pending = 0

                    if (k === 0) {
                        state.step = {
                            id: 1,
                            substep: 0,
                            text: "First Rotation",
                            subtext: collectives.alltoall.algorithms[0].info.rotationphase
                        }
                    } else {
                        k -= 1
                        // todo: put this into a function (it is used 3 times with little logic change)
                        data.map((p, p_i) => {
                            // let sendTo = p_i + 2 ** k
                            const z = (k % (options.radix - 1)) + 1
                            const x = Math.ceil((k + 1) / (options.radix - 1))
                            let sendTo = p_i + z * options.radix ** (x - 1)
                            if (sendTo > data.length - 1) {
                                sendTo = sendTo - data.length
                            }
        
                            //adj matrix update
                            data[p_i].statuses[sendTo].status = 1
        
                            for (let i = 0; i < p.blocks.length; i++) {
                                //let blockid = p.id.toString() + p.blocks[i].color.toString()
                                // get binary for kth bit
                                const blockid = Math.floor(i / options.block_size)
                                const blockbid = ('000000000' + Number(blockid).toString(options.radix)).slice(-10)
                                const kb = ('000000000' + Number(k + 1).toString(options.radix)).slice(-10)
                                // check if bit index is equal to the iterating (1 ≤ 𝑧 < 𝑟)
                                // z = (k % (options.radix - 1)) + 1
                                if (blockbid[blockbid.length - Math.ceil((k + 1) / (options.radix - 1))] == (k % (options.radix - 1)) + 1) {
                                    p.blocks[i].status = 2
                                }
                            }
                            return p
                        })
                        state.step = {
                            id: 1,
                            substep: 2,
                            text: `Communication Step k = ${k}`,
                            subtext: collectives.alltoall.algorithms[0].info.commstep + commStepInfo
                        }
                    }
                    // return state
                    break
                case 2:
                    // unmove back to marked
                    let current
                    let next
                    const data_copy = JSON.parse(JSON.stringify(data))
                    for (let i = 0; i < data.length; i++) {
                        current = data_copy[i].blocks.filter((element, index) => {
                            return element.status === 2 // changed
                        })
    
                        const z = (k % (options.radix - 1)) + 1
                        const x = Math.ceil((k + 1) / (options.radix - 1))
                        let sendTo = i + z * options.radix ** (x - 1)
                        sendTo = i - (sendTo - i)
                        if (sendTo < 0) {
                            sendTo = data.length + sendTo
                        }
                        
                        
                        next = data[sendTo].blocks.filter((element, index) => {
                            return element.status === 2
                        })
    
                        current.forEach((object, index) => {
                            next[index].id = object.id
                            next[index].color = object.color
                            next[index].status = 1
                        })
    
                        state.data_moved -= current.length / options.block_size
                        state.data_pending += current.length / options.block_size
    
                        //adj matrix update
                        data[sendTo].statuses[i].status = 2
    
                    }
                    state.step = {
                        id: 1,
                        substep: 1,
                        text: `Communication Step k = ${k}`,
                        subtext: collectives.alltoall.algorithms[0].info.commstep + commStepInfo
                    }
                    
                    break
            }
            break
        case 2:
            // same as 1:2
            let current
            let next
            const data_copy = JSON.parse(JSON.stringify(data))
            for (let i = 0; i < data.length; i++) {
                current = data_copy[i].blocks.filter((element, index) => {
                    return element.status === 2 // changed
                })

                const z = (k % (options.radix - 1)) + 1
                const x = Math.ceil((k + 1) / (options.radix - 1))
                let sendTo = i + z * options.radix ** (x - 1)
                sendTo = i - (sendTo - i)
                if (sendTo < 0) {
                    sendTo = data.length + sendTo
                }
                
                
                next = data[sendTo].blocks.filter((element, index) => {
                    return element.status === 2
                })

                current.forEach((object, index) => {
                    next[index].id = object.id
                    next[index].color = object.color
                    next[index].status = 1
                })

                state.data_moved -= current.length / options.block_size
                state.data_pending += current.length / options.block_size

                //adj matrix update
                data[sendTo].statuses[i].status = 2

            }
            state.step = {
                id: 1,
                substep: 1,
                text: `Communication Step k = ${k}`,
                subtext: collectives.alltoall.algorithms[0].info.commstep + commStepInfo
            }
            break
    }

    state.k = k
    return state
}

function forward(data, k, step, options, state) {
    switch(step.id) {
        case 0: // rotation phase
            data.map((p) => {
                for (let i = 0; i < p.id * options.block_size; i++) {
                    p.blocks.push(p.blocks.shift())
                }
                return p
            })
            state.step = {
                id: 1,
                substep: 0,
                text: "First Rotation",
                subtext: collectives.alltoall.algorithms[0].info.rotationphase
            }
            return state
            break
        case 1: // COMM STEP

            // increment to next k 
            if (step.substep === 2) {
                k = k + 1
                state.k = k
                step.substep = 0

                // clean marked

                // clean adj matrix and marked
                data.map(p => {
                    p.statuses.map(thisStatus => {
                        if (thisStatus.status !== 0)
                            thisStatus.status = 3
                        return thisStatus
                    })
                    p.blocks.map(block => block.status = 0)
                    return p
                })
            }


            let bitstring = new Array(Math.ceil(Math.log2(options.num_processes))).join("0")
            bitstring = bitstring.substring(0, bitstring.length-(Math.floor(k / ( options.radix - 1)))) + ((k % (options.radix - 1)) + 1).toString(options.radix) + bitstring.substring(bitstring.length-(Math.floor(k / ( options.radix - 1))))
            const commStepInfo = `
                <br><br> For <strong><code>k = <a class="animate">${k}</a></code></strong>, 
                process <code>i</code> sends all data blocks whose binary value bit 
                <a class="animate">${Math.floor(k / (options.radix - 1))}</a> is <code>1</code> (ex: <code><a class="animate">${bitstring}</a></code>) 
                to process <code>i + <a class="animate">${2**k}</a></code>.
            `
            
            if (step.substep === 0) {
                // MARK ONLY
                data.map((p, p_i) => {
                    // let sendTo = p_i + 2 ** k
                    const z = (k % (options.radix - 1)) + 1
                    const x = Math.ceil((k + 1) / (options.radix - 1))
                    let sendTo = p_i + z * options.radix ** (x - 1)
                    if (sendTo > data.length - 1) {
                        sendTo = sendTo - data.length
                    }

                    //adj matrix update
                    data[p_i].statuses[sendTo].status = 1

                    for (let i = 0; i < p.blocks.length; i++) {
                        //let blockid = p.id.toString() + p.blocks[i].color.toString()
                        // get binary for kth bit
                        const blockid = Math.floor(i / options.block_size)
                        const blockbid = ('000000000' + Number(blockid).toString(options.radix)).slice(-10)
                        const kb = ('000000000' + Number(k + 1).toString(options.radix)).slice(-10)
                        if (!bitstring)
                            bitstring = ('00000' + i.toString(options.radix)).slice(-Math.ceil(Math.log2(options.num_processes)))
                        // check if bit index is equal to the iterating (1 ≤ 𝑧 < 𝑟)
                        // z = (k % (options.radix - 1)) + 1
                        if (blockbid[blockbid.length - Math.ceil((k + 1) / (options.radix - 1))] == ((k % (options.radix - 1)) + 1).toString(options.radix)) {
                            p.blocks[i].status = 1
                            state.data_pending += 1
                        }
                    }
                    return p
                })

                state.data_pending /= options.block_size

                state.step = {
                    id: 1,
                    substep: 1,
                    text: `Communication Step k = ${k}`,
                    subtext: collectives.alltoall.algorithms[0].info.commstep + commStepInfo
                }
            } else {
                // MOVE MARKED
                let current
                let next
                const data_copy = JSON.parse(JSON.stringify(data))
                for (let i = 0; i < data.length; i++) {
                    current = data_copy[i].blocks.filter((element, index) => {
                        return element.status === 1
                    })

                    const z = (k % (options.radix - 1)) + 1
                    const x = Math.ceil((k + 1) / (options.radix - 1))
                    // console.log(`z = ${z}\nx = ${x}\nradix = ${options.radix}\neq = ${z * options.radix ** (x - 1)}`)
                    let sendTo = i + z * options.radix ** (x - 1)
                    if (sendTo > data.length - 1) {
                        sendTo = sendTo - data.length
                    }
                    next = data[sendTo].blocks.filter((element, index) => {
                        return element.status === 1
                    })

                    current.forEach((object, index) => {
                        next[index].id = object.id
                        next[index].color = object.color
                        next[index].status = 2
                    })

                    state.data_moved += current.length / options.block_size
                    state.data_pending += current.length / options.block_size

                    //adj matrix update
                    data[sendTo].statuses[i].status = 2

                }

                state.step = {
                    id: 1,
                    substep: 2, // curr k is done
                    text: `Communication Step k = ${k}`,
                    subtext: collectives.alltoall.algorithms[0].info.commstep + commStepInfo
                }
            }

            return state

            break
        case 2:

            data.map((p) => {
                p.blocks.sort((a, b) => (a.id > b.id) ? 1 : -1)
                p.blocks.map(block => block.status = 0)
                return p
            })

            state.done = true
            state.step = {
                id: 3,
                substep: 0, // curr k is done
                text: `Final Rotation`,
                subtext: collectives.alltoall.algorithms[0].info.final
            }

            return state
            break
        default:
            break
    }
}