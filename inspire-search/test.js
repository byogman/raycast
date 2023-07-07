// async function fetchInspireHepData(query) {
//   try {
//     const response = await fetch(`https://inspirehep.net/api/literature?fields=titles,collaborations,authors.full_name,citation_count,arxiv_eprints,dois&sort=mostrecent&size=10&page=1&q=${query}`);
//     return response.json();
//   } catch (error) {
//     console.error(error);
//   }
// }

async function bibtex() {
  try {
    const response = await fetch(`https://inspirehep.net/api/literature/2054164?format=bibtex`);
    const body = await response.text(); // Extract the body of the response
    return body;
  } catch (error) {
    console.error(error);
  }
}

let result = bibtex();

setTimeout(function () {
  result.then((body) => console.log(body)); // Log the body of the response
}, 1000);
// let n = 0;

// function abbreviateNames(names) {
//   return names.map(({ full_name }) => {
//     const [last, first = ""] = full_name.split(", ");
//     const abbreviatedFirst = first ? `${first.charAt(0)}. ` : "";
//     return `${abbreviatedFirst}${last}`;
//   }).join(", ");
// }


// fetchInspireHepData("hep-th/0605061")
// 	.then(data => {
// 		results = data;
//    	})
//   	.catch(error => console.error(error));
	
// setTimeout(function(){
//   console.log(result);
	// console.log(abbreviateNames([results.hits.hits[0].metadata.authors]));
  // console.log(abbreviateNames(results.hits.hits[0].metadata.authors));
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
// }, 5000);

