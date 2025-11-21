import Link from "next/link";

interface ChannelInfoProps {
  channelId: string;
  channelName?: string;
}

const ChannelInfo = ({ channelId, channelName }: ChannelInfoProps) => {
  return (
    <div className="mx-4 rounded-xl bg-linear-to-r from-purple-50 to-pink-50 p-3 shadow md:mx-0 md:rounded-xl md:p-4 dark:from-purple-900/20 dark:to-pink-900/20">
      <div className="text-center">
        {channelName && (
          <h3 className="mb-1.5 text-base font-semibold text-gray-800 md:mb-2 md:text-lg dark:text-gray-200">
            {channelName}
          </h3>
        )}
        <p className="text-xs text-gray-600 md:text-sm dark:text-gray-400">
          Channel ID:{" "}
          <Link
            href={`https://www.youtube.com/channel/${channelId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-[11px] font-semibold break-all text-purple-600 hover:underline md:text-sm dark:text-purple-400"
          >
            {channelId}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ChannelInfo;
