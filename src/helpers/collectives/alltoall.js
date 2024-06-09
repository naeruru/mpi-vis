import { bruck } from "./alltoall/bruck"
import { spreadout } from "./alltoall/spreadout"

export default {
    // bruck uniform
    '0': bruck,
    // radix r bruck uniform
    '1': bruck,
    // spread out
    '2': spreadout,
}
