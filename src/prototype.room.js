/**
 * Created by rober on 7/5/2017.
 */
'use strict';

Room.prototype.getConstructionSites = function () {
    if (!this.constructionSites) {
        this.constructionSites = JSON.parse(JSON.stringify(this.find(FIND_CONSTRUCTION_SITES)));
    }
    return this.constructionSites;
};

Room.prototype.getDroppedResources = function () {
    if (!this.droppedResources) {
        this.droppedResources = this.find(FIND_DROPPED_RESOURCES);
    }
    return this.droppedResources;
};

Room.prototype.getAssignedCreeps = function () {
    return _.filter(Game.creeps, (c) => c.memory.overlord === this.name);
};

Room.prototype.getCreepsInRoom = function () {
    return _.filter(Game.creeps, (c) => c.pos.roomName === this.name);
};

Room.prototype.getExtensionCount = function () {
    let level = this.controller.level;
    if (level === 1) {
        return RCL_1_EXTENSIONS;
    } else if (level === 2) {
        return RCL_2_EXTENSIONS
    } else if (level === 3) {
        return RCL_3_EXTENSIONS
    } else if (level === 4) {
        return RCL_4_EXTENSIONS
    } else if (level === 5) {
        return RCL_5_EXTENSIONS
    } else if (level === 6) {
        return RCL_6_EXTENSIONS
    } else if (level === 7) {
        return RCL_7_EXTENSIONS
    } else if (level === 8) {
        return RCL_8_EXTENSIONS
    }
};

Object.defineProperty(Room.prototype, 'sources', {
    get: function () {
        // If we dont have the value stored locally
        if (!this._sources) {
            // If we dont have the value stored in memory
            if (!this.memory.sourceIds) {
                // Find the sources and store their id's in memory,
                // NOT the full objects
                this.memory.sourceIds = this.find(FIND_SOURCES)
                    .map(source => source.id);
            }
            // Get the source objects from the id's in memory and store them locally
            this._sources = this.memory.sourceIds.map(id => Game.getObjectById(id));
        }
        // return the locally stored value
        return this._sources;
    },
    set: function (newValue) {
        // when storing in memory you will want to change the setter
        // to set the memory value as well as the local value
        this.memory.sources = newValue.map(source => source.id);
        this._sources = newValue;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'mineral', {
    get: function () {
        // If we dont have the value stored locally
        if (!this._mineral) {
            // If we dont have the value stored in memory
            if (!this.memory.mineralId) {
                // Find the sources and store their id's in memory,
                // NOT the full objects
                this.memory.mineralId = this.find(FIND_MINERALS)
                    .map(mineral => mineral.id);
            }
            // Get the source objects from the id's in memory and store them locally
            this._mineral = this.memory.mineralId.map(id => Game.getObjectById(id));
        }
        // return the locally stored value
        return this._mineral;
    },
    set: function (newValue) {
        // when storing in memory you will want to change the setter
        // to set the memory value as well as the local value
        this.memory.mineral = newValue.map(mineral => mineral.id);
        this._mineral = newValue;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'structures', {
    get: function () {
        if (!this._structures) {
            this._structures = this.find(FIND_STRUCTURES);
        }
        return this._structures;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'droppedResources', {
    get: function () {
        if (!this._droppedResources) {
            this._droppedResources = this.find(FIND_DROPPED_RESOURCES);
        }
        return this._droppedResources;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'droppedEnergy', {
    get: function () {
        if (!this._droppedEnergy) {
            this._droppedEnergy = this.find(FIND_DROPPED_RESOURCES, {filter: (r) => r.resourceType === RESOURCE_ENERGY});
        }
        return this._droppedEnergy;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'creeps', {
    get: function () {
        if (!this._creeps) {
            this._creeps = this.find(FIND_CREEPS);
        }
        return this._creeps;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'hostileCreeps', {
    get: function () {
        if (!this._Hostilecreeps) {
            this._Hostilecreeps = _.filter(this.creeps, (c) => (!c.my && (!_.includes(FRIENDLIES, c.owner.username) || _.includes(Memory._threatList, c.owner.username))));
        }
        return this._Hostilecreeps;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'friendlyCreeps', {
    get: function () {
        if (!this._friendlyCreeps) {
            this._friendlyCreeps = _.filter(this.creeps, (c) => _.includes(FRIENDLIES, c.owner.username) && !_.includes(Memory._threatList, c.owner.username));
        }
        return this._friendlyCreeps;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'constructionSites', {
    get: function () {
        if (!this._constructionSites) {
            this._constructionSites = this.find(FIND_CONSTRUCTION_SITES);
        }
        return this._constructionSites;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'tombstones', {
    get: function () {
        if (!this._tombstones) {
            this._tombstones = this.find(FIND_TOMBSTONES);
        }
        return this._tombstones;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'level', {
    get: function () {
        if (!this._level) {
            this._level = this.controller.level;
        }
        return this._level;
    },
    enumerable: false,
    configurable: true
});

Object.defineProperty(Room.prototype, 'energy', {
    get: function () {
        if (!this.controller || this.controller.owner.username !== USERNAME) {
            if (!this._energy) {
                this._energy = undefined;
            }
        } else {
            if (!this._energy) {
                this._energy = getRoomEnergy(this);
            }
        }
        return this._energy;
    },
    enumerable: false,
    configurable: true
});

function getRoomEnergy(room) {
    let energy = room.energyAvailable;
    if (room.storage) energy = room.storage.store[RESOURCE_ENERGY] + energy;
    if (room.terminal) energy = room.terminal.store[RESOURCE_ENERGY] + energy;
    return energy;
}

/**
 * Provides structure memory.
 */
Object.defineProperty(StructureLab.prototype, 'memory', {
    get: function () {
        if (Memory.structureMemory === undefined || !Memory.structureMemory) {
            Memory.structureMemory = {};
        }
        if (Memory.structureMemory[this.id] === undefined || !Memory.structureMemory[this.id]) {
            Memory.structureMemory[this.id] = {};
        }
        return Memory.structureMemory[this.id];
    },
    set: function (v) {
        return _.set(Memory, 'structureMemory.' + this.id, v);
    },
    configurable: true,
    enumerable: false,
});

Room.prototype.cacheRoomIntel = function (force = false) {
    if (Memory.roomCache && !force && Memory.roomCache[this.name] && Memory.roomCache[this.name].cached + 1501 > Game.time) return;
    urgentMilitary(this);
    let room = Game.rooms[this.name];
    let hostiles, nonCombats, sk, controller, claimValue, claimWorthy, needsCleaning, power, portal, user;
    if (room) {
        let cache = Memory.roomCache || {};
        let sources = room.sources;
        let structures = _.filter(room.structures, (e) => e.structureType !== STRUCTURE_WALL && e.structureType !== STRUCTURE_RAMPART && e.structureType !== STRUCTURE_ROAD && e.structureType !== STRUCTURE_CONTAINER && e.structureType !== STRUCTURE_CONTROLLER);
        let barriers, spawns;
        barriers = _.filter(room.structures, (e) => e.structureType === STRUCTURE_WALL || e.structureType === STRUCTURE_RAMPART).length > 7;
        spawns = _.filter(room.structures, (e) => e.structureType === STRUCTURE_SPAWN);
        hostiles = _.filter(room.creeps, (e) => (e.getActiveBodyparts(ATTACK) >= 1 || e.getActiveBodyparts(RANGED_ATTACK) >= 1) && !_.includes(FRIENDLIES, e.owner.username));
        nonCombats = _.filter(room.creeps, (e) => (!e.getActiveBodyparts(ATTACK) || !e.getActiveBodyparts(RANGED_ATTACK)) && !_.includes(FRIENDLIES, e.owner.username));
        if (_.filter(room.structures, (e) => e.structureType === STRUCTURE_KEEPER_LAIR).length > 0) sk = true;
        if (room.controller) {
            if (room.controller.owner) user = room.controller.owner.username; else if (room.controller.reservation) user = room.controller.reservation.username;
            controller = JSON.stringify(room.controller);
            // Handle claim targets
            let safemodeCooldown = this.controller.safeModeCooldown;
            if (sources.length > 1 && !user && !barriers && !safemodeCooldown && this.findClosestOwnedRoom(true) <= 10) {
                // All rooms start at 5000
                let baseScore = 5000;
                // Get source distance from controller
                let sourceDist = 0;
                for (let source in sources) {
                    let range = sources[source].pos.getRangeTo(room.controller);
                    sourceDist = sourceDist + range;
                }
                baseScore -= sourceDist;
                // Swamps suck
                let terrain = new Room.Terrain(this.name);
                let terrainScore = 0;
                for (let y = 0; y < 50; y++) {
                    for (let x = 0; x < 50; x++) {
                        let tile = terrain.get(x, y);
                        if (tile === TERRAIN_MASK_WALL) terrainScore += 0.5;
                        if (tile === TERRAIN_MASK_SWAMP) terrainScore += 1.5;
                    }
                }
                baseScore -= terrainScore;
                // If it's a new mineral add to the score
                if (!_.includes(Memory.ownedMineral, room.mineral[0].mineralType)) baseScore += 100;
                claimWorthy = baseScore > 0;
                claimValue = baseScore;
            } else {
                claimValue = undefined;
                claimWorthy = undefined;
            }
            // Handle abandoned rooms
            if (!user && structures.length > 2) {
                needsCleaning = true;
            }
        }
        // Get special rooms via name
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(room.name);
        let isHighway = (parsed[1] % 10 === 0) ||
            (parsed[2] % 10 === 0);
        // Store portal info
        portal = _.filter(room.structures, (e) => e.structureType === STRUCTURE_PORTAL);
        if (portal.length) {
            let portalArray = [];
            let destinationArray = [];
            for (let obj of portal) {
                if (obj.ticksToDecay && obj.ticksToDecay <= 500) continue;
                if (!_.includes(destinationArray, obj.destination)) destinationArray.push(obj.destination); else continue;
                let decayTick = obj.ticksToDecay + Game.time || 99999999999;
                portalArray.push({decayTick: decayTick, destination: obj.destination})
            }
            if (portalArray.length) portal = JSON.stringify(portalArray); else portal = undefined;
        } else {
            portal = undefined;
        }
        // Store power info
        power = _.filter(room.structures, (e) => e.structureType === STRUCTURE_POWER_BANK);
        if (power.length && power[0].ticksToDecay >= 2500) power = true; else power = undefined;
        if (!user && _.filter(room.hostileCreeps, (c) => c.owner.username !== 'Invader').length) user = _.filter(room.hostileCreeps, (c) => c.owner.username !== 'Invader')[0].owner.username;
        let potentialTarget;
        if (!user && nonCombats.length >= 2) potentialTarget = true;
        if (!user && spawns) needsCleaning = true;
        let key = room.name;
        if (Memory.roomCache && Memory.roomCache[key]) Memory.roomCache[key] = undefined;
        cache[key] = {
            cached: Game.time,
            name: room.name,
            sources: sources.length,
            controller: controller,
            hostiles: hostiles.length,
            sk: sk,
            claimValue: claimValue,
            claimWorthy: claimWorthy,
            needsCleaning: needsCleaning,
            potentialTarget: potentialTarget,
            user: user,
            portal: portal,
            power: power,
            isHighway: isHighway
        };
        Memory.roomCache = cache;
    }
};


Room.prototype.invaderCheck = function () {
    if (Memory.roomCache && Memory.roomCache[this.name] && Memory.roomCache[this.name].lastInvaderCheck + 5 > Game.time) return;
    if (_.filter(this.hostileCreeps, (c) => c.owner.username !== 'Source Keeper').length) {
        if (!Memory.roomCache) Memory.roomCache = {};
        if (!Memory.roomCache[this.name]) Memory.roomCache[this.name] = {};
        Memory.roomCache[this.name].lastInvaderCheck = Game.time;
        let sk;
        if (_.filter(this.structures, (e) => e.structureType === STRUCTURE_KEEPER_LAIR).length > 0) sk = true;
        let closestRoomRange = this.findClosestOwnedRoom(true);
        // No invader checks for hostile rooms
        if ((sk || (this.controller && this.controller.owner && !_.includes(FRIENDLIES, this.controller.owner.username)) || (this.controller && this.controller.reservation && !_.includes(FRIENDLIES, this.controller.reservation.username))) || closestRoomRange >= 5) {
            this.memory.numberOfHostiles = undefined;
            this.memory.responseNeeded = undefined;
            this.memory.alertEmail = undefined;
            this.memory.requestingSupport = undefined;
            this.memory.threatLevel = undefined;
            return;
        }
        let invader = _.filter(this.hostileCreeps, (c) => c.owner.username !== 'Source Keeper');
        if (invader.length > 0) {
            let armedInvader = _.filter(invader, (c) => c.getActiveBodyparts(ATTACK) >= 1 || c.getActiveBodyparts(RANGED_ATTACK) >= 1 || c.getActiveBodyparts(HEAL) >= 1 || c.getActiveBodyparts(WORK) >= 6)
            if (Game.time % 50 === 0) log.a('Response Requested in ' + this.name + '. ' + invader.length + ' hostiles detected.');
            this.memory.responseNeeded = true;
            this.memory.tickDetected = Game.time;
            if (!this.memory.numberOfHostiles || this.memory.numberOfHostiles < invader.length) {
                this.memory.numberOfHostiles = invader.length || 1;
            }
            // Determine threat
            if ((invader.length === 1 && (invader[0].owner.username === 'Invader' || !armedInvader.length)) || (this.controller && this.controller.safeMode)) {
                this.memory.threatLevel = 1;
                Memory.roomCache[this.name].threatLevel = 1;
            }
            if (invader.length > 1 && invader[0].owner.username === 'Invader') {
                this.memory.threatLevel = 2;
                Memory.roomCache[this.name].threatLevel = 2;
            }
            if (invader.length === 1 && invader[0].owner.username !== 'Invader') {
                this.memory.threatLevel = 3;
                this.memory.lastPlayerAttack = Game.time;
                Memory.roomCache[this.name].threatLevel = 3;
                let cache = Memory._badBoyList || {};
                let key = invader[0].owner.username;
                let multiple = 2;
                if (this.controller && this.controller.owner && _.includes(FRIENDLIES, this.controller.owner.username)) multiple = 10;
                else if (this.controller && this.controller.reservation && _.includes(FRIENDLIES, this.controller.reservation.username)) multiple = 2;
                else if (this.controller && this.controller.owner && !_.includes(FRIENDLIES, this.controller.owner.username)) multiple = 0;
                else if (this.controller && this.controller.reservation && !_.includes(FRIENDLIES, this.controller.reservation.username)) multiple = 0;
                let threatRating;
                let gained = invader.length * multiple;
                if (cache[key]) {
                    if (cache[key].lastAction + 50 > Game.time) return true;
                    threatRating = cache[key]['threatRating'] + gained;
                } else {
                    threatRating = gained;
                }
                cache[key] = {
                    threatRating: threatRating,
                    lastAction: Game.time,
                };
                Memory._badBoyList = cache;
                log.a(key + ' has gained ' + gained + ' and now has a threat rating of ' + threatRating + ' from an incident in ' + this.name);
                let roomHeat = this.memory.roomHeat || 0;
                this.memory.roomHeat = roomHeat + (invader.length * 5);
            }
            if (invader.length > 1 && invader[0].owner.username !== 'Invader') {
                this.memory.threatLevel = 4;
                this.memory.lastPlayerAttack = Game.time;
                Memory.roomCache[this.name].threatLevel = 4;
                let cache = Memory._badBoyList || {};
                let key = invader[0].owner.username;
                let multiple = 2;
                if (this.controller && this.controller.owner && _.includes(FRIENDLIES, this.controller.owner.username)) multiple = 10;
                else if (this.controller && this.controller.reservation && _.includes(FRIENDLIES, this.controller.reservation.username)) multiple = 2;
                else if (this.controller && this.controller.owner && !_.includes(FRIENDLIES, this.controller.owner.username)) multiple = 0;
                else if (this.controller && this.controller.reservation && !_.includes(FRIENDLIES, this.controller.reservation.username)) multiple = 0;
                let threatRating;
                let gained = invader.length * multiple;
                if (cache[key]) {
                    if (cache[key].lastAction + 50 > Game.time) return true;
                    threatRating = cache[key]['threatRating'] + gained;
                } else {
                    threatRating = gained;
                }
                cache[key] = {
                    threatRating: threatRating,
                    lastAction: Game.time,
                };
                Memory._badBoyList = cache;
                log.a(key + ' has gained ' + gained + ' and now has a threat rating of ' + threatRating + ' from an incident in ' + this.name);
                let roomHeat = this.memory.roomHeat || 0;
                this.memory.roomHeat = roomHeat + (invader.length * 5);
            }
            return invader.length > 0;
        }
    } else {
        let waitOut = 25;
        if (this.memory.threatLevel > 3) waitOut = 100;
        if (this.memory.tickDetected < Game.time - waitOut || !this.memory.responseNeeded) {
            if (Memory.roomCache[this.name]) Memory.roomCache[this.name].threatLevel = undefined;
            let roomHeat = (this.memory.roomHeat - 0.5) || 0;
            if (roomHeat <= 0) {
                this.memory.roomHeat = undefined;
            } else {
                this.memory.roomHeat = roomHeat;
            }
            this.memory.numberOfHostiles = undefined;
            this.memory.responseNeeded = undefined;
            this.memory.alertEmail = undefined;
            this.memory.requestingSupport = undefined;
            this.memory.threatLevel = undefined;
        }
        return false;
    }
};

function urgentMilitary(room) {
    let sendScout, ownerType;
    // Friendly rooms
    if (room.controller) ownerType = room.controller.owner || room.controller.reservation || undefined;
    if (ownerType && _.includes(FRIENDLIES, ownerType.username)) return;
    let range = room.findClosestOwnedRoom(true);
    // Operation cooldown per room
    if (Memory.roomCache[room.name] && !Memory.roomCache[room.name].manual && Memory.roomCache[room.name].lastOperation && Memory.roomCache[room.name].lastOperation + ATTACK_COOLDOWN > Game.time) {
        return
    }
    // Already a target or too far
    if (Memory.targetRooms[room.name] || range > 5) return;
    let otherCreeps = _.filter(room.creeps, (c) => !c.my && !_.includes(FRIENDLIES, c.owner.username) && c.owner.username !== 'Invader' && c.owner.username !== 'Source Keeper' && c.body.length > 1);
    let lootStructures = _.filter(room.structures, (s) => s.structureType === STRUCTURE_CONTAINER && s.structureType === STRUCTURE_TERMINAL && s.structureType === STRUCTURE_STORAGE && _.sum(s.store) > 0);
    if (room.controller) {
        // If neutral/hostile owned room
        if (room.controller.owner && !_.includes(FRIENDLIES, room.controller.owner.username) && (room.controller.level < 3 || !_.filter(room.structures, (s) => s.structureType === STRUCTURE_TOWER).length)) {
            sendScout = true;
        }
        // If unowned but lootable
        if (!room.controller.owner && lootStructures.length) {
            sendScout = true;
        }
    }
    // If other creeps and nearby
    if (otherCreeps.length && range <= LOCAL_SPHERE + 2) {
        sendScout = true;
    }
    if (sendScout) {
        let cache = Memory.targetRooms || {};
        let tick = Game.time;
        cache[room.name] = {
            tick: tick,
            type: 'scout',
        };
        Memory.targetRooms = cache;
    }
}

Room.prototype.handleNukeAttack = function () {
    let nukes = this.find(FIND_NUKES);
    if (nukes.length === 0) {
        return false;
    }

    let sorted = _.sortBy(nukes, function (object) {
        return object.timeToLand;
    });

    let findSaveableStructures = function (object) {
        if (object.structureType === STRUCTURE_ROAD) {
            return false;
        }
        if (object.structureType === STRUCTURE_RAMPART) {
            return false;
        }
        if (object.structureType === STRUCTURE_EXTENSION) {
            return false;
        }
        if (object.structureType === STRUCTURE_CONTROLLER) {
            return false;
        }
        return object.structureType !== STRUCTURE_WALL;

    };

    let isRampart = function (object) {
        return object.structureType === STRUCTURE_RAMPART;
    };

    for (let nuke of nukes) {
        if (nuke.timeToLand <= 200) {
            for (let c of nuke.room.creeps) {
                c.memory.fleeNukeTime = Game.time + nuke.timeToLand + 2;
                c.memory.fleeNukeRoom = nuke.room.name;
            }
        }
        let structures = nuke.pos.findInRange(FIND_MY_STRUCTURES, 4, {
            filter: findSaveableStructures
        });
        for (let structure of structures) {
            let lookConstructionSites = structure.pos.lookFor(LOOK_CONSTRUCTION_SITES);
            if (lookConstructionSites.length > 0) {
                continue;
            }
            let lookStructures = structure.pos.lookFor(LOOK_STRUCTURES);
            let lookRampart = _.findIndex(lookStructures, isRampart);
            if (lookRampart > -1) {
                continue;
            }
            structure.pos.createConstructionSite(STRUCTURE_RAMPART);
        }
    }

    return true;
};

Room.prototype.findClosestOwnedRoom = function (range = false, safePath = false) {
    let distance = 0;
    let closest;
    for (let key in Memory.ownedRooms) {
        let range = Game.map.findRoute(this, Memory.ownedRooms[key]).length;
        if (safePath) range = this.shibRoute(Memory.ownedRooms[key]).length - 1;
        if (!distance) {
            distance = range;
            closest = Memory.ownedRooms[key].name;
        } else if (range < distance) {
            distance = range;
            closest = Memory.ownedRooms[key].name;
        }
    }
    if (!range) return closest;
    return distance;
};