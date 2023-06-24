async function fetchInspireHepData(query) {
  try {
    const response = await fetch(`https://inspirehep.net/api/literature?fields=titles,authors.full_name,citation_count,arxiv_eprints&sort=mostrecent&size=10&page=1&q=${query}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

let results;

fetchInspireHepData("witten")
	.then(data => {
		results = data;
		// console.log(results);
   	})
  	.catch(error => console.error(error));
	
setTimeout(function(){
// 	console.log(results.hits.hits[1]);
	console.log(results.hits.hits[1].metadata.titles[0].title);
	console.log(results.hits.hits[1].metadata.arxiv_eprints[0].value);
    console.log(results.hits.hits[1].metadata.authors.map(obj => obj.full_name).join(', '));
    console.log(results.hits.hits[1].metadata.citation_count);
    console.log(results.hits.hits[1].created.slice(0,4));
    console.log(results.hits.hits[1].links.bibtex);
    console.log(results.hits.hits[1].id);
    console.log(results.hits.hits[1].links.citations);
}, 3000);

