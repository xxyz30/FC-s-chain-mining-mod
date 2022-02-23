import { world } from "mojang-minecraft";
export function log(str) {
    console.log(str);
    world.getDimension("overworld").runCommand(`tellraw @p {"rawtext":[{"text": "${str}"}]}`);
}
