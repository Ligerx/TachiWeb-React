// @flow
import React from "react";
import List from "@material-ui/core/List";
import Grid from "@material-ui/core/Grid";
import ResponsiveGrid from "components/ResponsiveGrid";
import Paper from "@material-ui/core/Paper";
import ChapterListItem from "components/MangaInfo/ChapterListItem";
import type { ChapterType, MangaType } from "types";
import { makeStyles } from "@material-ui/styles";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

// TODO: I've made ResponsiveGrid maxWidth="xs". What happens when the chapter title is too long?

// Since I want this to fill the remaining vertical screen space, I'm relying on flexbox.
// The parent of this component should use something like this:
// parent: {
//   height: "100%",
//   display: "flex",
//   flexDirection: "column"
// }

type Props = {
  mangaInfo: MangaType,
  chapters: Array<ChapterType>,
  toggleRead: Function
};

const useStyles = makeStyles({
  list: {
    paddingTop: 0,
    paddingBottom: 0
  },
  virtualizedListParent: { flexGrow: 1 }
});

const MangaInfoChapterList = ({ mangaInfo, chapters, toggleRead }: Props) => {
  const classes = useStyles();

  return (
    <ResponsiveGrid
      maxWidth="xs"
      parentProps={{ className: classes.virtualizedListParent }}
    >
      <Grid item xs={12}>
        {/* itemSize is hard coded using what I saw in the inspector */}
        <AutoSizer>
          {({ height, width }) => (
            <FixedSizeList
              height={height}
              width={width}
              itemSize={65}
              itemCount={chapters.length}
              itemData={chapters}
              itemKey={(index, data) => data[index].id}
            >
              {({ index, style, data }) => (
                <ChapterListItem
                  style={style}
                  chapter={data[index]}
                  mangaInfo={mangaInfo}
                  toggleRead={toggleRead}
                />
              )}
            </FixedSizeList>
          )}
        </AutoSizer>
      </Grid>
    </ResponsiveGrid>
  );
};

export default MangaInfoChapterList;
