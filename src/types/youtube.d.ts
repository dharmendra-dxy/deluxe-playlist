declare namespace YT {
  class Player {
    constructor(
      element: string | HTMLElement,
      options: PlayerOptions
    );

    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    seekTo(seconds: number, allowSeekAhead: boolean): void;

    nextVideo(): void;
    previousVideo(): void;
    playVideoAt(index: number): void;

    loadPlaylist(options: {
      list: string;
      listType?: "playlist" | "user_uploads";
      index?: number;
      startSeconds?: number;
    }): void;

    getPlaylist(): string[];
    getPlaylistIndex(): number;

    getCurrentTime(): number;
    getDuration(): number;
    getPlayerState(): number;

    getVideoData(): {
      video_id: string;
      title: string;
      author: string;
    };

    getVideoUrl(): string;

    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    setVolume(volume: number): void;
    getVolume(): number;

    destroy(): void;
  }

  interface PlayerOptions {
    width?: number | string;
    height?: number | string;
    videoId?: string;

    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      disablekb?: 0 | 1;
      fs?: 0 | 1;
      iv_load_policy?: 1 | 3;
      loop?: 0 | 1;
      modestbranding?: 0 | 1;
      playsinline?: 0 | 1;
      rel?: 0 | 1;
      origin?: string;
      list?: string;
      listType?: "playlist" | "user_uploads";
    };

    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: PlayerStateChangeEvent) => void;
      onError?: (event: PlayerErrorEvent) => void;
      onAutoplayBlocked?: (event: PlayerEvent) => void;
    };
  }

  interface PlayerEvent {
    target: Player;
  }

  interface PlayerStateChangeEvent extends PlayerEvent {
    data: number;
  }

  interface PlayerErrorEvent extends PlayerEvent {
    data: number;
  }

  namespace PlayerState {
    const UNSTARTED: number;
    const ENDED: number;
    const PLAYING: number;
    const PAUSED: number;
    const BUFFERING: number;
    const CUED: number;
  }
}

interface Window {
  YT: typeof YT;
  onYouTubeIframeAPIReady: () => void;
}
