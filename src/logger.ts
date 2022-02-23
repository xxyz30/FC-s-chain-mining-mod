import { Dimension, world } from "mojang-minecraft";

export function log(str: any) {
    console.log(str)
    world.getDimension("overworld").runCommand(`tellraw @p {"rawtext":[{"text": "${str}"}]}`)
}