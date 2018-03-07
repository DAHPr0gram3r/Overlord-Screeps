Creep.prototype.harassRoom = function () {
    if (this.room.name !== this.memory.targetRoom) return this.shibMove(new RoomPosition(25, 25, this.memory.targetRoom), {range: 23});
    let sentence = ['Area', 'Denial', 'In', 'Progress'];
    let word = Game.time % sentence.length;
    this.say(sentence[word], true);
    let creeps = this.pos.findClosestByRange(this.room.creeps, {filter: (e) => (e.getActiveBodyparts(ATTACK) >= 1 || e.getActiveBodyparts(RANGED_ATTACK) >= 1) && _.includes(FRIENDLIES, e.owner['username']) === false});
    let hostile = this.pos.findClosestByRange(this.room.creeps, {filter: (c) => !_.includes(FRIENDLIES, c.owner.username)});
    if (creeps) {
        return this.fightRanged(creeps);
    }
    if (hostile) {
        return this.fightRanged(hostile);
    }
};