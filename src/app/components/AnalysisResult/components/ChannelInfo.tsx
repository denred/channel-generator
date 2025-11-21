import Link from "next/link";

interface ChannelInfoProps {
  channelId: string;
  channelName?: string;
}

const ChannelInfo = ({ channelId, channelName }: ChannelInfoProps) => {
  return (
    <div className="rounded-xl bg-linear-to-r from-purple-50 to-pink-50 p-4 shadow dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="text-center">
        {channelName && (
          <h3 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
            {channelName}
          </h3>
        )}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Channel ID:{" "}
          <Link
            href={`https://www.youtube.com/channel/${channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono font-semibold text-purple-600 hover:underline dark:text-purple-400"
          >
            {channelId}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChannelInfo;
