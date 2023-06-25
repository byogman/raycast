import { Action, ActionPanel, Icon, List } from "@raycast/api";
import { useState, useEffect } from "react";
import { useFetch } from "@raycast/utils";
import { abbreviateNames, displayCollaborations } from "./utils";

const API_PATH = 'https://inspirehep.net/api/literature?fields=titles,collaborations,authors.full_name,citation_count&size=9';

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [indexOffset, setIndexOffset] = useState(0);
  const { isLoading, data } = useFetch(`${API_PATH}&sort=mostrecent&page=${pageNumber}&q=${searchText}`, {
    // to make sure the screen isn't flickering when the searchText changes
    keepPreviousData: true,
  });

  function showCitations(item) {
    return () => {
      setSearchText(`refersto:recid:${item.id}`);
    };
  }

  useEffect(() => {
    setPageNumber(1);
    setIndexOffset(0);
    console.log(searchText);
  }, [searchText]);

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
          actions={
            <ActionPanel title="Inspire HEP Search">
              <Action
                title="Show citations"
                shortcut={{ modifiers: ["cmd"], key: "]" }}
                icon={Icon.ArrowRightCircle}
                onAction={showCitations(item)}
              />
              <ActionPanel.Section title="Navigation">
                <Action
                  title="Next Page"
                  shortcut={{ modifiers: ["cmd"], key: "arrowRight" }}
                  onAction={() => {
                    setPageNumber(pageNumber + 1);
                  }}
                />
                <Action
                  title="Previous Page"
                  shortcut={{ modifiers: ["cmd"], key: "arrowLeft" }}
                  onAction={() => {
                    if (pageNumber > 1) {
                      setPageNumber(pageNumber - 1);
                    }
                  }}
                />
              </ActionPanel.Section>
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
};