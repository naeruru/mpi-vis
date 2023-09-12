import collectives from "../../../data/collectives.js"

export function bruck(data, k, step, num_processes, block_size, data_moved, undo=false) {
    return new Promise((resolve, reject) => {

        const toReturn = {
            done: false,
            k: k,
            data_moved: data_moved,
            data_pending: 0,
            step: null
        }

        // final comm step k was reached and completed
        if (step.substep === 2 && k === Math.ceil(Math.log2(num_processes)) - 1) {
            step.id = 2
        }

        switch(step.id) {
            case 0: // rotation phase
                data.map((p) => {
                    for (let i = 0; i < p.id * block_size; i++) {
                        p.blocks.push(p.blocks.shift())
                    }
                    return p
                })
                toReturn.step = {
                    id: 1,
                    substep: 0,
                    text: "First Rotation",
                    subtext: collectives.alltoall.algorithms[0].info.rotationphase
                }
                resolve(toReturn)
                break
            case 1: // COMM STEP

                // increment to next k 
                if (step.substep === 2) {
                    k = k + 1
                    toReturn.k = k
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


                let bitstring = new Array(Math.ceil(Math.log2(num_processes))).join("0")
                bitstring = bitstring.substring(0, bitstring.length-k) + '1' + bitstring.substring(bitstring.length-k)
                const commStepInfo = `
                    <br><br> For <strong><code>k = ${k}</code></strong>, process <code>i</code> sends all data blocks whose binary value bit ${k} is <code>1</code> (ex: <code>${bitstring}</code>) to process <code>i + ${2**k}</code>.
                `
                
                if (step.substep === 0) {
                    // MARK ONLY
                    data.map((p, p_i) => {
                        let sendTo = p_i + 2 ** k
                        if (sendTo > data.length - 1) {
                            sendTo = sendTo - data.length
                        }

                        //adj matrix update
                        data[p_i].statuses[sendTo].status = 1

                        for (let i = 0; i < p.blocks.length; i++) {
                            //let blockid = p.id.toString() + p.blocks[i].color.toString()
                            // get binary for kth bit
                            const blockid = Math.floor(i / block_size)
                            const blockbid = ('000000000' + Number(blockid).toString(2)).slice(-10)
                            if (blockbid[blockbid.length - (k + 1)] === '1') {
                                p.blocks[i].status = 1
                                toReturn.data_pending += 1
                            }
                        }
                        return p
                    })

                    toReturn.data_pending /= block_size

                    toReturn.step = {
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

                        let sendTo = i + 2 ** k
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

                        toReturn.data_moved += current.length / block_size
                        toReturn.data_pending += current.length / block_size

                        //adj matrix update
                        data[sendTo].statuses[i].status = 2

                    }

                    toReturn.step = {
                        id: 1,
                        substep: 2, // curr k is done
                        text: `Communication Step k = ${k}`,
                        subtext: collectives.alltoall.algorithms[0].info.commstep + commStepInfo
                    }
                }

                resolve(toReturn)

                break
            case 2:

                data.map((p) => {
                    p.blocks.sort((a, b) => (a.id > b.id) ? 1 : -1)
                    p.blocks.map(block => block.status = 0)
                    return p
                })

                toReturn.done = true
                toReturn.step = {
                    id: 3,
                    substep: 0, // curr k is done
                    text: `Final Rotation`,
                    subtext: collectives.alltoall.algorithms[0].info.final
                }

                resolve(toReturn)
                break
            default:
                break
        }

        // resolve(data)
    })
}