async function fetchInspireHepData(query) {
  try {
    const response = await fetch(`https://inspirehep.net/api/literature?fields=titles,collaborations,authors.full_name,citation_count,arxiv_eprints,publication_info,number_of_pages,abstracts,keywords,document_type&sort=mostrecent&size=9&page=1&q=${query}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

let results;

let n = 3;

fetchInspireHepData("a%20penco,%20r")
	.then(data => {
		results = data;
		// console.log(results);
   	})
  	.catch(error => console.error(error));
	
setTimeout(function(){
	console.log(results.hits.hits[n].metadata.publication_info[0].journal_title);
	// console.log(results.hits.hits[n].metadata.abstracts[0].value);
  console.log(results.hits.hits[n].metadata.keywords);
  console.log(results.hits.hits[n].metadata.number_of_pages);
	// console.log(results.hits.hits[n].metadata.arxiv_eprints[0].value);
  // console.log(results.hits.hits[n].metadata.document_type[0]);
    // console.log(results.hits.hits[n].metadata.authors.map(obj => obj.full_name).join(', '));
    // console.log(results.hits.hits[n].metadata.authors);
    // console.log(results.hits.hits[n].metadata.collaborations.map(obj => obj.value).join(', '));
    // console.log(results.hits.hits[n].metadata.citation_count);
    // console.log(results.hits.hits[n].created.slice(0,4));
    // console.log(results.hits.hits[n].links.bibtex);
    // console.log(results.hits.hits[n].id);
    // console.log(results.hits.hits[n].links.citations);
}, 5000);

// 