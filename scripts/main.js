/**
 * @author xxyz30
 * Use MIT License
 * https://github.com/xxyz30/FC-s-chain-mining-mod
 */

import * as mc from "mojang-minecraft";
var world = mc.world;
var dimention = world.getDimension("overworld");
var events = world.events;

//一个数据存储对象。
//本来不应该有这个定义的，但是mojang那边block tag混乱，只能这么搞

//(itemName -> Items can be destroyed by the block tag list)
const tools = {
    'minecraft:netherite_pickaxe': ['diamond_pick_diggable','iron_pick_diggable','stone_pick_diggable','wood_pick_diggable','gold_pick_diggable'],
    'minecraft:diamond_pickaxe': ['diamond_pick_diggable','iron_pick_diggable','stone_pick_diggable','wood_pick_diggable','gold_pick_diggable'],
    'minecraft:iron_pickaxe': ['iron_pick_diggable','stone_pick_diggable','wood_pick_diggable','gold_pick_diggable'],
    'minecraft:stone_pickaxe': ['stone_pick_diggable','wood_pick_diggable','gold_pick_diggable'],
    'minecraft:gloden_pickaxe': ['gold_pick_diggable','wood_pick_diggable'],
    'minecraft:wooden_pickaxe': ['wood_pick_diggable'],
    
    'minecraft:wooden_axe': ['log','acacia','birch','dark_oak','jungle','oak','spruce'],
    'minecraft:stone_axe': ['log','acacia','birch','dark_oak','jungle','oak','spruce'],
    'minecraft:iron_axe': ['log','acacia','birch','dark_oak','jungle','oak','spruce'],
    'minecraft:diamond_axe': ['log','acacia','birch','dark_oak','jungle','oak','spruce'],
    'minecraft:golden_axe': ['log','acacia','birch','dark_oak','jungle','oak','spruce'],
    'minecraft:netherite_axe': ['log','acacia','birch','dark_oak','jungle','oak','spruce']
}

events.beforeItemUseOn.subscribe(e => {
    let block = e.source.dimension.getBlock(e.blockLocation);
    let item = e.item;
    if (e.source.isSneaking && tools[item.id] !== undefined) {
        //是个工具和是个指定方块
        //递归查方块，破坏
        let tagList = tools[item.id];
        let blockTags = block.getTags();
        let f = false;
        for(let i = 0; i < tagList.length;i++){
            if(blockTags.indexOf(tagList[i]) != -1){
                f = true;
                break;
            }
        }

        if(f) destoryBlock(e.blockLocation, e.source.dimension, block.id);
    }

})
function destoryBlock(l, dim, id) {
    let block = dim.getBlock(l);
    if (block.id == id) {
        let near = [
            new mc.BlockLocation(l.x, l.y + 1, l.z),
            new mc.BlockLocation(l.x, l.y - 1, l.z),
            new mc.BlockLocation(l.x + 1, l.y, l.z),
            new mc.BlockLocation(l.x - 1, l.y, l.z),
            new mc.BlockLocation(l.x, l.y, l.z + 1),
            new mc.BlockLocation(l.x, l.y, l.z - 1)
        ]
        //issue: fortune
        dim.runCommand(`setblock ${l.x} ${l.y} ${l.z} air 0 destroy`);
        //issue: durability 
        near.forEach(i => {
            destoryBlock(i, dim, id);
        })
    }
}