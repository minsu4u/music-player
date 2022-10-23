import React, { useCallback } from "react";
import QueueMusic from "@mui/icons-material/QueueMusic";
import Close from "@mui/icons-material/Close";
import PlayListItem from "./PlayListItem";
import classNames from "classnames";
import SortableList from "@minsu4u/sortable";
import {
  setCurrentIndex,
  upDataPlayList,
} from "../../store/musicPlayerReducer";
import "./PlayList.scss";
import { useDispatch, useSelector } from "react-redux";
import { memo } from "react";

const PlayList = ({ showPlayList, setShowPlayList }) => {
  const playList = useSelector((state) => state.playList);
  const disPatch = useDispatch();
  const onClickClosePlayList = useCallback(() => {
    setShowPlayList(false);
  }, [setShowPlayList]);
  const onClickItem = useCallback(
    (index) => {
      disPatch(setCurrentIndex(index));
    },
    [disPatch]
  );
  const renderItem = useCallback(
    (item, index) => <PlayListItem item={item} index={index} />,
    []
  );
  const onDropItem = useCallback(
    (newPlayList) => disPatch(upDataPlayList(newPlayList)),
    [disPatch]
  );
  return (
    <div className={classNames("play-list", { show: showPlayList })}>
      <div className="header">
        <div className="row">
          <QueueMusic className="list" />
          <span>Play list</span>
        </div>
        <Close
          sx={{ fontSize: 22, cursor: "pointer" }}
          onClick={onClickClosePlayList}
        />
      </div>
      <SortableList
        data={playList}
        onDropItem={onDropItem}
        onClickItem={onClickItem}
        renderItem={renderItem}
      />
    </div>
  );
};

export default memo(PlayList);
