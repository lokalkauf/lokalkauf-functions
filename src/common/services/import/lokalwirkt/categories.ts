import * as fs from 'fs';
const CATEGORIES_FILE = '/tmp/lokalkauf/categories.json';

interface CategoryCluster {
    key:string,
    osm_names:string[]
}

class Categories {
    Clusters: CategoryCluster[] = [];
    
    constructor(clusters:CategoryCluster[]) {
        this.Clusters = clusters;
    }

    findCluster = (clusterName: string) => {
       return this.Clusters.find(c => c.key === clusterName) as CategoryCluster;
    }

    find = (catName: string) => {
        for(const cluster of this.Clusters) {
            if (cluster.osm_names.indexOf(catName) > -1)
                return cluster
        }

        return null;
    }

    exists = (catName: string) => {
        const cluster = this.find(catName);

        return !(!cluster);
    }

    add = (catName: string) => {
        if(!this.exists(catName)) {

           const clusterName = this.getStaticCat(catName);
           const cluster = this.findCluster(clusterName);

            // update cluster
            if (cluster) {
                if (cluster.osm_names.indexOf(catName) < 0)
                    cluster.osm_names.push(catName);
            } else {
                this.Clusters.push({
                    key: clusterName,
                    osm_names: [catName]
                });
            }
        }
    };

    getStaticCat = (catName: string) => {
        for(const key in CATEGORIES) {
            if((CATEGORIES[key] as string[]).indexOf(catName) > -1) {
                return key;                 
            } 
        }
        
        return 'UNDEFINED';
    }

    getStats = () => {
        return {
            cluster: this.Clusters.length,
            osm_categories: this.Clusters.map(c => c.osm_names.length)
                                         .reduce((sum, current) => sum + current, 0)
        }
    }
}

export function loadCategories() : Categories {
    let clusters:CategoryCluster[] = [];

    if (fs.existsSync(CATEGORIES_FILE)) {
        const file_content = fs.readFileSync(CATEGORIES_FILE, {encoding:'utf8'});
        if (file_content)
            clusters = JSON.parse(file_content) as CategoryCluster[];
    }

    return new Categories(clusters);
}

export function saveCategories(categories: Categories) {
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories.Clusters), {encoding:'utf8'});
}

export function syncCategories(categoryNames:string[]) {
    const categories = loadCategories();

    categoryNames.forEach(cn => {
        if(!categories.exists(cn)) {
            categories.add(cn);
        }
    });

    saveCategories(categories);

    return categories.getStats();
}

const CATEGORIES: any = {
    "blumengarten" : ["florist", "garden_centre", "garden_furniture"],
    "gastronomie" : ["pub", "cafe", "restaurant", "fast_food", "bakery", "biergarten", "caterer", "bar"],
    "fashion" : ["clothes", "fashion_accessories", "bag"],
    "buchhandlung" : ["books"],
    "handwerk" : ["doityourself", "electrician", "carpenter", "metal_construction", "plumber"],
    "homedecor" : ["furniture", "interior_decoration", "garden_furniture", "carpet"],
    "lebensmittel" : ["beverages","supermarket", "confectionery"],
    "sonstiges" : ["baby_goods", "shoes", "car_parts", 
    "optician", "houseware", "jewelry", "tailor", 
    "antiques", "art", "mobile_phone", "hairdresser",
    "beauty", "electronics", "travel_agency", "gift", 
    "musical_instrument", "computer", "tobacco", "butcher", 
    "hunting", "perfumery", "alcohol", "erotic", "variety_store", "sports", 
    "seafood", "photo", "pet", "video_games", "atm", 
    "library", "dry_cleaning", "Wäscherei", "hearing_aids", 
    "massage", "charity", "kiosk", "copyshop", "kitchen", "outdoor", "frame",
    "internet_cafe", "tattoo", "tea", "trade",
    "dance", "paint", "bed", "second_hand", "bicycle", "e-cigarette", "nutrition_supplements", "tyres"]
};
