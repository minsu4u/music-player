import React, { useImperativeHandle, useRef, forwardRef } from "react";
import "./ProgressArea.scss";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  nextMusic,
  playMusic,
  stopMusic,
} from "../../store/musicPlayerReducer";
import { useState } from "react";

function ProgressArea(props, ref) {
  const audio = useRef();
  const progressBar = useRef();
  const dispatch = useDispatch();
  const { playList, currentIndex } = useSelector(
    (state) => ({
      playList: state.playList,
      currentIndex: state.currentIndex,
    }),
    shallowEqual
  );
  const [currentTime, setCurrentTime] = useState("00:00");
  const [duration, setDuration] = useState("00:00");

  useImperativeHandle(ref, () => ({
    play: () => {
      audio.current.play();
    },
    pause: () => {
      audio.current.pause();
    },
    changeVolume: (volume) => {
      audio.current.volume = volume;
    },
  }));

  const onPlay = () => {
    dispatch(playMusic());
  };
  const onPause = () => {
    dispatch(stopMusic());
  };

  const onEnded = () => {
    dispatch(nextMusic());
  };

  const getTime = (time) => {
    const minute = `0${parseInt(time / 60, 10)}`;
    const seconds = `0${parseInt(time % 60)}`;
    return `${minute}:${seconds.slice(-2)}`;
  };

  const onClickProgress = (event) => {
    const progressBarWidth = event.currentTarget.clientWidth;
    const offsetX = event.nativeEvent.offsetX;
    const duration = audio.current.duration;
    audio.current.currentTime = (offsetX / progressBarWidth) * duration;
  };

  const onTimeUpdate = (event) => {
    if (event.target.readyState === 0) return;
    const currentTime = event.target.currentTime;
    const duration = event.target.duration;
    const progressBarWidth = (currentTime / duration) * 100;
    progressBar.current.style.width = `${progressBarWidth}%`;
    setCurrentTime(getTime(currentTime));
    setDuration(getTime(duration));
  };

  return (
    <div className="progress-area" onMouseDown={onClickProgress}>
      <div className="progress-bar" ref={progressBar}>
        <audio
          autoPlay
          onEnded={onEnded}
          onPlay={onPlay}
          onPause={onPause}
          onTimeUpdate={onTimeUpdate}
          src={playList[currentIndex].src}
          ref={audio}
        ></audio>
      </div>
      <div className="music-timer">
        <span>{currentTime}</span>
        <span>{duration}</span>
      </div>
    </div>
  );
}

export default forwardRef(ProgressArea);
