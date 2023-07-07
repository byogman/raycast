import { Action, ActionPanel, Icon, List, popToRoot, showHUD } from "@raycast/api";
import { useState, useEffect } from "react";
import { useFetch } from "@raycast/utils";
import { abbreviateNames, displayCollaborations } from "./utils";

const API_PATH = 'https://inspirehep.net/api/literature?fields=titles,collaborations,authors.full_name,citation_count,dois,arxiv_eprints&size=9';

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [startingPage, setStartingPage] = useState(1);
  const [memory, _setMemory] = useState([]);
  const [bibtexUrl, setBibtexUrl] = useState("");
  const { isLoading, data } = useFetch(`${API_PATH}&sort=mostrecent&page=${pageNumber}&q=${searchText}`, {
    execute: !!searchText,
    // to make sure the screen isn't flickering when the searchText changes
    keepPreviousData: true,
  });

  const { _isLoadingBibtexRecord, _bibtexRecord } = useFetch(bibtexUrl, {
    execute: !!bibtexUrl,
    onData: ((_bibtexRecord) => { 
      console.log(_bibtexRecord);  // edit this to copy to clipboard
      showHUD("🟢 Copied to Clipboard");   // optmistic update? progress indicator using isLoadingBibtexRecord? speed-up? 
      popToRoot({ clearSearchBar: true });
     }),
  });

  // resets page number after new search

  useEffect(() => {
    setPageNumber(startingPage);
    setStartingPage(1);
  }, [searchText]);

  function selectUrl(item) {
    if (item.metadata.arxiv_eprints) {
      return `https://arxiv.org/pdf/${item.metadata.arxiv_eprints[0].value}`
    } else if (item.metadata.dois) {
      return `https://doi.org/${item.metadata.dois[0].value}`
    } else {
      return `https://inspirehep.net/literature/${item.id}`
    }
  };

  function memorizePreviousSearch() {
    memory.push({ query: searchText, page: pageNumber });
  };

  function showCitations(item) {
    return () => {
      memorizePreviousSearch();
      setSearchText(`refersto:recid:${item.id}`);
    };
  };

  function showReferences(item) {
    return () => {
      memorizePreviousSearch();
      setSearchText(`citedby:recid:${item.id}`);
    };
  };

  function goBack() {
    const previousSearch = memory.pop();
    setStartingPage(previousSearch.page);
    setSearchText(previousSearch.query);
  };

  function listActions(item) {
    return (
      <ActionPanel title="Inspire HEP Search">
        <Action.OpenInBrowser
          url={selectUrl(item)}
          shortcut={{ modifiers: ["cmd"], key: "o" }}
          icon={Icon.Globe}
        />
        <Action
          title="Copy BibTeX to Clipboard"
          shortcut={{ modifiers: ["cmd"], key: "b" }}
          icon={Icon.Clipboard}
          onAction={() => {
            setBibtexUrl(item.links.bibtex);
          }}
        />
        <Action
          title="Show Citations"
          shortcut={{ modifiers: ["cmd"], key: "]" }}
          icon={Icon.ArrowRightCircle}
          onAction={showCitations(item)}
        />
        <Action
          title="Show References"
          shortcut={{ modifiers: ["cmd"], key: "[" }}
          icon={Icon.ArrowLeftCircle}
          onAction={showReferences(item)}
        />
        <ActionPanel.Section title="Navigation">
          <Action
            title="Next Page"
            shortcut={{ modifiers: ["cmd"], key: "arrowRight" }}
            icon={Icon.ChevronRight}
            onAction={() => {
              if (pageNumber < Math.ceil(data.hits.total / 9)) {
                setPageNumber(pageNumber + 1);
              }
            }}
          />
          <Action
            title="Previous Page"
            shortcut={{ modifiers: ["cmd"], key: "arrowLeft" }}
            icon={Icon.ChevronLeft}
            onAction={() => {
              if (pageNumber > 1) {
                setPageNumber(pageNumber - 1);
              }
            }}
          />
          <Action
            title="Go Back"
            shortcut={{ modifiers: ["cmd"], key: "delete" }}
            icon={Icon.Undo}
            onAction={() => {
              if (memory.length > 0) {
                goBack();
              } else {
                setSearchText("");
              }
            }}
          />
        </ActionPanel.Section>
      </ActionPanel>
    )
  };

  return (
    <List isLoading={isLoading}
      searchBarPlaceholder={`Search InspireHEP...`}
      searchText={searchText}
      onSearchTextChange={setSearchText}
      throttle>
      {(searchText && data && data.hits && Array.isArray(data.hits.hits) ? data.hits.hits : []).map((item, index) => (
        <List.Item
          key={item.id}
          title={`${index + 9 * pageNumber - 8}. ${item.metadata.titles[0].title}`}
          subtitle={item.metadata.authors ? abbreviateNames(item.metadata.authors) : displayCollaborations(item.metadata.collaborations)}
          accessories={[{ text: `${item.metadata.citation_count}` }, { text: `(${item.created.slice(0, 4)}) ` }]}
          actions={listActions(item)}
        />
      ))}
    </List>
  );
};