import raw from 'data/7.6.1/masteries';
import globals from 'services/globals';
import ddragon, { DataTargets } from 'services/ddragon';
import transform from 'transformers/masteries';

export default {
    data: transform(raw),

    loadLiveData() {
        return ddragon.fetchData(globals.version, DataTargets.MASTERIES)
            .then(rawdata => transform(rawdata))
            .then(data => this.data = data)
    },

    reset(tree) {
        tree.points = 0;
        tree.talents.forEach(t => t.points = 0);
    },

    available(talent, tree) {
        let reqs = [0, 5, 6, 11, 12, 17];
        return tree.points >= reqs[talent.tier];
    },

    tierIndex(talent, talents) {
        return talents
            .filter(t => t.tier == talent.tier)
            .indexOf(talent);
    },

    addPoints(masteries, { tree, mastery, points }) {
        let changed = false;

        if(!this.available(mastery, tree)) return changed;

        let tierPoints = tree.talents
            .filter(t => t.tier == mastery.tier && t.points > 0)
            .reduce((points, t) => points + t.points, 0);

        // Add while points are freely available (and the tier does not go above the max)
        while(masteries.points < 30 && tree.points < 18 && mastery.points < mastery.ranks && points > 0 && tierPoints < mastery.ranks) {
            mastery.points += 1;
            tree.points += 1;
            masteries.points += 1;
            tierPoints += 1;
            points -= 1;
            changed = true;
        }

        let tier = tree.talents
            .filter(t => t.tier == mastery.tier && t.id != mastery.id && t.points > 0);
        tierPoints = tier.reduce((points, t) => points + t.points, 0);

        // If the tier is at the max, or no points are available elsewhere - pull from the current tier.
        while(points > 0 && tierPoints > 0) {
            tier[0].points -= 1;
            mastery.points += 1;
            points -= 1;

            tier = tier.filter(t => t.points > 0);
            tierPoints = tier.reduce((points, mastery) => points + mastery.points, 0);
            changed = true;
        }

        return changed;
    },
    
    removePoints(masteries, { tree, mastery, points }) {
        let higherClaimedTalents = tree.talents
            .filter(t => t.tier > mastery.tier)
            .filter(t => t.points > 0);

        let canAdd = mastery.points > 0 && higherClaimedTalents.length == 0;

        if(canAdd) {
            masteries.points -= points;
            tree.points -= points;
            mastery.points -= points;
        }

        return canAdd && points > 0;
    }
}