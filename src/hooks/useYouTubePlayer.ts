"use client";

import { useEffect, useRef, useState } from "react";
import { loadYouTubeAPI, getYouTubeThumbnail } from "@/lib/youtube";

export type Track = {
  videoId: string;
  title: string;
  artist: string;
  thumbnail: string;
};

export type YouTubePlayerState = {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentTrack: Track | null;
  isReady: boolean;
  error: string | null;
};

export type YouTubePlayerControls = {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
};

const PLAYLIST_ID = process.env.NEXT_PUBLIC_YOUTUBE_PLAYLIST_ID ?? "";

export function useYouTubePlayer(
  playerElementId: string
): YouTubePlayerState & YouTubePlayerControls {
  const playerRef = useRef<YT.Player | null>(null);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const wasPlayingBeforeHiddenRef = useRef(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorCountRef = useRef(0);

  useEffect(() => {
    let mounted = true;

    function stopTimer() {
      if (progressTimerRef.current) {
        clearInterval(progressTimerRef.current);
        progressTimerRef.current = null;
      }
    }

    function updateTrackFromPlayer(player: YT.Player) {
      const data = player.getVideoData();
      if (!data.video_id) return;

      setCurrentTrack({
        videoId: data.video_id,
        title: data.title || "Unknown title",
        artist: data.author || "YouTube",
        thumbnail: getYouTubeThumbnail(data.video_id),
      });

      setDuration(player.getDuration());
      setCurrentTime(player.getCurrentTime());
    }

    function startTimer(player: YT.Player) {
      stopTimer();
      progressTimerRef.current = setInterval(() => {
        setCurrentTime(player.getCurrentTime());
        setDuration(player.getDuration());
        updateTrackFromPlayer(player);
      }, 500);
    }

    async function initializePlayer() {
      try {
        const YT = await loadYouTubeAPI();
        if (!mounted) return;

        playerRef.current = new YT.Player(playerElementId, {
          width: 200,
          height: 200,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            playsinline: 1,
            rel: 0,
            origin: window.location.origin,
            listType: "playlist",
            list: PLAYLIST_ID,
          },
          events: {
            onReady: (event) => {
              setIsReady(true);
              updateTrackFromPlayer(event.target);
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                setError(null);
                errorCountRef.current = 0;
                updateTrackFromPlayer(event.target);
                startTimer(event.target);
              }
              if (event.data === YT.PlayerState.PAUSED) {
                setIsPlaying(false);
                stopTimer();
              }
              if (event.data === YT.PlayerState.ENDED) {
                setIsPlaying(false);
                stopTimer();
              }
              if (event.data === YT.PlayerState.CUED) {
                updateTrackFromPlayer(event.target);
              }
            },
            onError: (event) => {
              console.error("YouTube player error:", event.data);
              errorCountRef.current += 1;
              
              if (errorCountRef.current > 5) {
                setError("Multiple tracks unavailable. Please check the playlist.");
                return;
              }
              
              if (event.data === 100 || event.data === 101 || event.data === 150) {
                setError("This track can't be played here. Skipping...");
                setTimeout(() => {
                  playerRef.current?.nextVideo();
                  setError(null);
                }, 1500);
              }
            },
            onAutoplayBlocked: () => {
              setIsPlaying(false);
            },
          },
        });
      } catch (err) {
        console.error("Failed to load YouTube API:", err);
        setError("Failed to load player.");
      }
    }

    initializePlayer();

    function handleVisibilityChange() {
      const player = playerRef.current;
      if (!player) return;

      if (document.hidden) {
        const playerState = player.getPlayerState();
        wasPlayingBeforeHiddenRef.current = playerState === YT.PlayerState.PLAYING;
      } else if (wasPlayingBeforeHiddenRef.current) {
        player.playVideo();
        wasPlayingBeforeHiddenRef.current = false;
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      mounted = false;
      stopTimer();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [playerElementId]);

  function play() {
    playerRef.current?.playVideo();
  }

  function pause() {
    playerRef.current?.pauseVideo();
  }

  function togglePlay() {
    const player = playerRef.current;
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  }

  function next() {
    playerRef.current?.nextVideo();
  }

  function previous() {
    playerRef.current?.previousVideo();
  }

  function seek(time: number) {
    const player = playerRef.current;
    if (!player) return;
    player.seekTo(time, true);
    setCurrentTime(time);
  }

  return {
    isPlaying,
    currentTime,
    duration,
    currentTrack,
    isReady,
    error,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
  };
}
