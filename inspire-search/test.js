async function fetchInspireHepData(query) {
  try {
    const response = await fetch(`https://inspirehep.net/api/literature?fields=titles,collaborations,authors.full_name,citation_count,arxiv_eprints&sort=mostrecent&size=10&page=1&q=${query}`);
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

let results;

let n = 0;

function abbreviateNames(names) {
  return names.map(({ full_name }) => {
    const [last, first = ""] = full_name.split(", ");
    const abbreviatedFirst = first ? `${first.charAt(0)}. ` : "";
    return `${abbreviatedFirst}${last}`;
  }).join(", ");
}


fetchInspireHepData("2103.05419")
	.then(data => {
		results = data;
   	})
  	.catch(error => console.error(error));
	
setTimeout(function(){
  // console.log(results.hits.hits[0].metadata.authors[0]);
	// console.log(abbreviateNames([results.hits.hits[0].metadata.authors]));
  console.log(abbreviateNames(results.hits.hits[0].metadata.authors));
	// console.log(results.hits.hits[n].metadata.titles[0].title);
	// // console.log(results.hits.hits[n].metadata.arxiv_eprints[0].value);
    // console.log(results.hits.hits[n].metadata.authors);
  //   console.log(results.hits.hits[n].metadata.authors);
  //   console.log(results.hits.hits[n].metadata.collaborations.map(obj => obj.value).join(', '));
  //   console.log(results.hits.hits[n].metadata.citation_count);
  //   console.log(results.hits.hits[n].created.slice(0,4));
  //   console.log(results.hits.hits[n].links.bibtex);
  //   console.log(results.hits.hits[n].id);
  //   console.log(results.hits.hits[n].links.citations);
}, 3000);

