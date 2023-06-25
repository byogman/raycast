async function fetchInspireHepData(query) {
  try {
    const response = await fetch(`https://inspirehep.net/api/literature?fields=titles,collaborations,authors.full_name,citation_count,arxiv_eprints&sort=mostrecent&size=10&page=1&q=${query}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

let results;

let n = 6;

fetchInspireHepData("refersto:recid:1367306")
	.then(data => {
		results = data;
   	})
  	.catch(error => console.error(error));
	
setTimeout(function(){
  console.log(results.hits.total);
	// console.log(results.hits.hits[n]);
	// console.log(results.hits.hits[n].metadata.titles[0].title);
	// // console.log(results.hits.hits[n].metadata.arxiv_eprints[0].value);
  //   // console.log(results.hits.hits[n].metadata.authors.map(obj => obj.full_name).join(', '));
  //   console.log(results.hits.hits[n].metadata.authors);
  //   console.log(results.hits.hits[n].metadata.collaborations.map(obj => obj.value).join(', '));
  //   console.log(results.hits.hits[n].metadata.citation_count);
  //   console.log(results.hits.hits[n].created.slice(0,4));
  //   console.log(results.hits.hits[n].links.bibtex);
  //   console.log(results.hits.hits[n].id);
  //   console.log(results.hits.hits[n].links.citations);
}, 3000);

