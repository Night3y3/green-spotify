import { Song } from "@/types";

import usePlayer from "./usePlayer";
import useAuthModal from "./useAuthModal";
import { useUser } from "./useUser";

const useOnPlay = (songs: Song[]) => {
  const player = usePlayer();
  const authModel = useAuthModal();
  const { user } = useUser();

  const onPlay = (id: string) => {
    // Check if user is logged in to play songs
    if (!user) {
      authModel.onOpen();
      return;
    }

    player.setId(id);
    player.setIds(songs.map((song) => song.id));
  };

  return onPlay;
};

export default useOnPlay;
