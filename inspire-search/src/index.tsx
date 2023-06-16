import { ActionPanel, List, Action } from "@raycast/api";
import { useState, useEffect } from "react";
import { useFetch } from "@raycast/utils";

export default function Command() {
  const [searchText, setSearchText] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [indexOffset, setIndexOffset] = useState(0);
  const { isLoading, data } = useFetch(`https://inspirehep.net/api/literature?fields=titles,authors.full_name,citation_count&sort=mostrecent&size=9&page=${pageNumber}&q=${searchText}`, {
    // to make sure the screen isn't flickering when the searchText changes
    keepPreviousData: true,
  }, [pageNumber]);

  useEffect(() => {
    setPageNumber(1);
    setIndexOffset(0);
  }, [searchText]);

  useEffect(() => {
    setIndexOffset((pageNumber - 1) * 9);
  }, [pageNumber]);

  return (
    <List isLoading={isLoading} onSearchTextChange={setSearchText} throttle>
      {(data && data.hits && Array.isArray(data.hits.hits) ? data.hits.hits : []).map((item, index) => (
        <List.Item 
          key={item.id} 
          title={`${index + 1 + indexOffset}. ${item.metadata.titles[0].title}`} 
          subtitle={item.metadata.authors.map(obj => obj.full_name).join(', ')}
          accessories={[{text: `${item.metadata.citation_count}`},  {text:`(${item.created.slice(0,4)})`}]}
          actions={
            <ActionPanel title="Inspire HEP Search">
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