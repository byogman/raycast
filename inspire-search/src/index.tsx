import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { useFetch } from "@raycast/utils";
import { abbreviateNames, displayCollaborations, goBack } from "./utils";

const API_PATH = 'https://inspirehep.net/api/literature?fields=titles,collaborations,authors.full_name,citation_count&size=9';

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [indexOffset, setIndexOffset] = useState(0);
  const [resultsNumber, setResultsNumber] = useState(0);
  const [memory, setMemory] = useState([]);
  const [startingPage, setStartingPage] = useState(1);
  const { isLoading, data } = useFetch(`${API_PATH}&sort=mostrecent&page=${pageNumber}&q=${searchText}`, {
    // to make sure the screen isn't flickering when the searchText changes
    keepPreviousData: true,
  });

  // updates number of results when new data are fetched

  useEffect(() => {
    setResultsNumber(data.hits.total);
  }, [data]);

  // resets page number after new search

  useEffect(() => {
    setPageNumber(startingPage);
    setIndexOffset(0);
    setStartingPage(1);
  }, [searchText]);

  // updates numerical indices when page number changes

  useEffect(() => {
    setIndexOffset((pageNumber - 1) * 9);
  }, [pageNumber]);

  return (
    <List isLoading={isLoading} searchBarPlaceholder={`Search InspireHEP...`} searchText={searchText} onSearchTextChange={setSearchText} throttle>
      {(searchText && data && data.hits && Array.isArray(data.hits.hits) ? data.hits.hits : []).map((item, index) => (
        <List.Item
          key={item.id}
          title={`${index + 1 + indexOffset}. ${item.metadata.titles[0].title}`}
          subtitle={item.metadata.authors ? abbreviateNames(item.metadata.authors) : displayCollaborations(item.metadata.collaborations)}
          accessories={[{ text: `${item.metadata.citation_count}` }, { text: `(${item.created.slice(0, 4)})` }]}
          actions={listActions(item)}
        />
      ))}
    </List>
  );

  function listActions(item) {
    return (
      <ActionPanel title="Inspire HEP Search">
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
              if (pageNumber < Math.ceil(resultsNumber / 9)) {
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
              }
            }}
          />
        </ActionPanel.Section>
      </ActionPanel>
    )
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
};