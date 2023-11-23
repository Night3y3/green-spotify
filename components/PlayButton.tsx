import { FaPlay } from 'react-icons/fa';

const PlayButton = () => {
    return (
        <button
            className="
            rounded-full
            bg-green-500
            p-4
            transition
            opacity-0
            flex
            item-center
            hover:opacity-100
            drop-shadow-md
            translate
            translate-y-1/4
             group-hover:opacity-100
             group-hover:translate-y-0
             hover:scale-110
            "
        >
            <FaPlay className=" text-black text-2xl" />
        </button>
    );
}

export default PlayButton;