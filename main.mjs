import fs from 'fs';

async function fetchAllPages(query, maxpages, searchYear, affiliation) {
    let fullQuery = `${query} AND PUB_YEAR:${searchYear}`;
    if (affiliation) fullQuery += ` AND AFF:${affiliation}`;
    try{
        const params = new URLSearchParams({
            query: fullQuery,
            format: 'json',
            pageSize: 25,
            resultType: 'core'
        });
        
        let url = `https://www.ebi.ac.uk/europepmc/webservices/rest/search?${params}`;
        const allItems = [];
        let pages = 0;
        
        while (url) {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            allItems.push(...data.resultList.result.map(filterResults));
            pages++;
            if(maxpages) {
                if(pages >= maxpages) break;
            }
            url = data.nextPageUrl; 
        }    
        
        return allItems;

    } catch (error){
        console.error('Failed:' , error.name);
        console.error(error.message);
        return [];
    }
}


function filterResults(item, url){
    const link = getLink(item, url);
    return {
        title: item.title,
        authors: item.authorString,
        journal: item.journalTitle,
        hasFullText: item.inPMC === 'Y' || item.hasPDF === 'Y',
        link: link?? "not found",
        //abstract: item.abstractText //uncomment if you want abstract in result
    };
}

function getLink(item, url){
    if(item.pmcid)
        return `https://europepmc.org/article/PMC/${item.pmcid}`;
    const urls = item.fullTextUrlList?.fullTextUrl;
    if(url?.length)
        return urls[0].url;
    if(item.doi)
        return `https://doi.org/${item.doi}`;
    return item.id? `https://europepmc.org/article/MED/${item.id}` : null;
}

function toCSV(items){
    if(items.length === 0) return '';
    const headers = Object.keys(items[0]);
    const rows = items.map(item => 
        headers.map(h => {
            const val = String(item[h] ?? '');
            return val.includes(',') || val.includes('"') || val.includes('\n') ?
            `"${val.replace(/"/g, '""')}"` : val;
        }).join(',')
    );
    return [headers.join(','), ...rows].join('\n');
}

async function main() {
    const result = await fetchAllPages('example', null, null, null); //change parameters to desired
    fs.writeFileSync('results.json', JSON.stringify(result, null, 2)); //json results w json formattin
    //fs.writeFileSync('results.csv', toCSV(result)); //all in csv file flattened
    //console.log(`Tot articles: ${result.length}`); //for n. of total articles
}

main();