import collectives from "../../data/collectives.json";

export default {
    // bruck uniform
    '0': function(data, k, step, num_processes, block_size) {
        return new Promise((resolve, reject) => {

            const toReturn = {
                done: false,
                k: k,
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
                                }
                            }
                            return p
                        })

                        toReturn.step = {
                            id: 1,
                            substep: 1,
                            text: `Communication Step k = ${k}`,
                            subtext: collectives.alltoall.algorithms[0].info.commstep
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

                            //adj matrix update
                            data[sendTo].statuses[i].status = 2

                        }

                        toReturn.step = {
                            id: 1,
                            substep: 2, // curr k is done
                            text: `Communication Step k = ${k}`,
                            subtext: collectives.alltoall.algorithms[0].info.commstep
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
    },
    // spread out
    '1': function(data, k, step, num_processes, block_size) {
        return new Promise((resolve, reject) => {

            const toReturn = {
                done: false,
                k: k,
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

            switch(step.id) {
                case 0: // COMM STEP

                    // increment to next k 
                    if (step.substep === 2) {
                        k = k + 1
                        toReturn.k = k
                        step.substep = 0
                    }

                    if (step.substep === 0) {

                        // mark only
                        data.map(p => {
                            let index = ((p.id + k + 1) % data.length) * block_size

                            const blocksToMark = p.blocks.filter((element) => {
                                return element.color === p.blocks.at(index).color
                            })
                            blocksToMark.map(block => block.status = 1)
                            p.statuses.at((p.id + k) % data.length - data.length + 1).status = 1
                            return p
                        })

                        toReturn.step = {
                            id: 0,
                            substep: 1,
                            text: `Communication Step k = ${k}`,
                            subtext: collectives.alltoall.algorithms[1].info.commstep
                        }
                        
                    } else {
                        // move marked
                        data.map(p => {
                            const markedBlocks = p.blocks.filter(block => block.status === 1)

                            markedBlocks.forEach((block, i) => {
                                p.receive_buffer[(block.color * block_size) + i] = JSON.parse(JSON.stringify(block))
                                block.status = 2
                            })

                            return p
                        })
                        

                        toReturn.step = {
                            id: 0,
                            substep: 2,
                            text: `Communication Step k = ${k}`,
                            subtext: collectives.alltoall.algorithms[1].info.commstep
                        }
                    }

                    
                    resolve(toReturn)
                    break
                case 1:
                    // final step
                    data.map(p => {
                        const markedBlocks = p.blocks.filter(block => block.color === block.id)

                        markedBlocks.forEach((block, i) => {
                            p.receive_buffer[(block.color * block_size) + i] = JSON.parse(JSON.stringify(block))
                            block.status = 2
                        })

                        return p
                    })


                    toReturn.done = true
                    toReturn.step = {
                        id: 3,
                        substep: 0, // curr k is done
                        text: `Final Step`,
                        subtext: collectives.alltoall.algorithms[1].info.final
                    }
                    resolve(toReturn)
                    break
                default:
                    break
            }

            // resolve(data)
        })
    },
    // spread out OLD
    '2': function(data, k, step, num_processes, block_size) {
        return new Promise((resolve, reject) => {

            const toReturn = {
                done: false,
                k: k,
                step: null
            }


            // final comm step k was reached and completed
            if (step.substep === 2 && k === data.length - 2) {
                step.id = 1
            }

            

            switch(step.id) {
                case 0: // COMM STEP

                    // increment to next k 
                    if (step.substep === 2) {
                        k = k + 1
                        toReturn.k = k
                        step.substep = 0

                        // clean adj matrix and marked
                        data.map(p => {
                            p.statuses.map(thisStatus => {
                                if (thisStatus.status !== 0)
                                    thisStatus.status = 3
                                return thisStatus
                            })
                            p.blocks.map(block => { if (block.status === 1) block.status = 2 })
                            return p
                        })
                    }

                    if (step.substep === 0) {

                        // MARK ONLY
                        data.map(p => {
                            let index = (p.id + k + 1) % data.length * block_size

                            if (index < k * block_size)
                                index = (index * 0) + k * block_size

                            const blocksToMark = p.blocks.filter((element) => {
                                return element.color === p.blocks.at(index).color
                            })
                            blocksToMark.map(block => block.status = 1)
                            //p.blocks.at(index).status = 1
                            p.statuses.at((p.id + k) % data.length - data.length + 1).status = 1
                            return p
                        })


                        toReturn.step = {
                            id: 0,
                            substep: 1,
                            text: `Communication Step k = ${k}`,
                            subtext: collectives.alltoall.algorithms[1].info.commstep
                        }
                    } else {

                        // move marked
                        data.map(p => {
                            const toMove = p.blocks.splice(p.blocks.findIndex(block => block.status === 1 && block.id === p.id), block_size)

                            let insertAt = 0
                            // if wrapping around from 0, insert numbers in specific position
                            if (data[toMove[0].color].blocks[0].status === 2 && data[toMove[0].color].blocks[0].id === 0)
                                insertAt = ((k) - ((data.length - 1) - (toMove[0].id))) * block_size
                            

                            toMove.forEach((move, i) => {
                                data[move.color].blocks.splice(insertAt + i, 0, move)
                            })

                            p.statuses.at((p.id - k) % data.length - 1).status = 2

                            return p
                        })

                        toReturn.step = {
                            id: 0,
                            substep: 2,
                            text: `Communication Step k = ${k}`,
                            subtext: collectives.alltoall.algorithms[1].info.commstep
                        }
                    }

                    
                    resolve(toReturn)
                    break
                case 1:
                    // final step
                    data.map((p) => {
                        p.blocks.map(block => block.status = 0)

                        // adjust block that was never moved
                        // const unmoved = p.blocks[p.blocks.length - 1]
                        // p.blocks.splice(p.blocks.length - 1, 1)
                        // p.blocks.splice(unmoved.id, 0, unmoved)
                        for (let i = 0; i < block_size; i++) {
                            const unmoved = p.blocks[p.blocks.length - 1]
                            p.blocks.splice(p.blocks.length - 1, 1)
                            p.blocks.splice((unmoved.id * block_size), 0, unmoved)
                        }
                    })

                    toReturn.done = true
                    toReturn.step = {
                        id: 3,
                        substep: 0, // curr k is done
                        text: `Final Step`,
                        subtext: collectives.alltoall.algorithms[1].info.final
                    }
                    resolve(toReturn)
                    break
                default:
                    break
            }

            // resolve(data)
        })
    }
}