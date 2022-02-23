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
const tools: any = {
    'minecraft:netherite_pickaxe': ['diamond_pick_diggable', 'iron_pick_diggable', 'stone_pick_diggable', 'wood_pick_diggable', 'gold_pick_diggable'],
    'minecraft:diamond_pickaxe': ['diamond_pick_diggable', 'iron_pick_diggable', 'stone_pick_diggable', 'wood_pick_diggable', 'gold_pick_diggable'],
    'minecraft:iron_pickaxe': ['iron_pick_diggable', 'stone_pick_diggable', 'wood_pick_diggable', 'gold_pick_diggable'],
    'minecraft:stone_pickaxe': ['stone_pick_diggable', 'wood_pick_diggable', 'gold_pick_diggable'],
    'minecraft:gloden_pickaxe': ['gold_pick_diggable', 'wood_pick_diggable'],
    'minecraft:wooden_pickaxe': ['wood_pick_diggable'],

    'minecraft:wooden_axe': ['log', 'acacia', 'birch', 'dark_oak', 'jungle', 'oak', 'spruce'],
    'minecraft:stone_axe': ['log', 'acacia', 'birch', 'dark_oak', 'jungle', 'oak', 'spruce'],
    'minecraft:iron_axe': ['log', 'acacia', 'birch', 'dark_oak', 'jungle', 'oak', 'spruce'],
    'minecraft:diamond_axe': ['log', 'acacia', 'birch', 'dark_oak', 'jungle', 'oak', 'spruce'],
    'minecraft:golden_axe': ['log', 'acacia', 'birch', 'dark_oak', 'jungle', 'oak', 'spruce'],
    'minecraft:netherite_axe': ['log', 'acacia', 'birch', 'dark_oak', 'jungle', 'oak', 'spruce']
}

events.blockBreak.subscribe(e => {
    let block = e.brokenBlockPermutation
    let item = (<mc.EntityInventoryComponent>(e.player.getComponent("minecraft:inventory"))).container.getItem(e.player.selectedSlot);
    // console.error(item.id)
    if (item != null && e.player.isSneaking && tools[item.id] != null) {
        //是个工具和是个指定方块
        //递归查方块，破坏
        let tagList = tools[item.id];
        let blockTags = block.getTags();
        let f = false;
        for (let i = 0; i < tagList.length; i++) {
            if (blockTags.indexOf(tagList[i]) != -1) {
                f = true;
                break;
            }
        }
        if (f) {
            let count = destoryBlock(e.block, e.brokenBlockPermutation.type.id);
            //not support on Release
            let dur = <mc.ItemDurabilityComponent>item.getComponent("minecraft:durability")
            if (dur != null) {
                dur.damage -= count;
            }
        }
    }

})
function destoryBlock(block: mc.Block, id: String): number {
    let count = 0;
    let dim = block.dimension;

    //方块循环的节点栈
    let blockStack: mc.BlockLocation[] = [block.location];
    //查询过的方块
    let blockChecked: mc.Block[] = [block];
    let firstBlock = true
    while (blockStack.length > 0) {
        let l = blockStack.pop()
        let b = dim.getBlock(l)
        //如果它没被检查过
        if (blockChecked.indexOf(b) == -1 || firstBlock) {
            //指定它被检查过了
            blockChecked.push(b)
            if (b.id == id || firstBlock) {
                //是规定的ID，则破坏，并加入它周围的方块
                count ++
                firstBlock = false;
                dim.runCommand(`setblock ${l.x} ${l.y} ${l.z} air 0 destroy`);
                blockStack.push(l.offset(0, 1, 0))
                blockStack.push(l.offset(0, -1, 0))
                blockStack.push(l.offset(1, 0, 0))
                blockStack.push(l.offset(-1, 0, 0))
                blockStack.push(l.offset(0, 0, 1))
                blockStack.push(l.offset(0, 0, -1))
            }
        }
    }
    //不包含第一个方块
    return count - 1;
}