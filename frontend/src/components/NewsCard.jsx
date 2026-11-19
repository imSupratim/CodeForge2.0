import { ExternalLink, MessageCircle, Heart } from "lucide-react"

export default function NewsCard({ article }) {
  return (
    <div className="bg-[#161b22] border border-gray-800 rounded-2xl overflow-hidden hover:border-blue-500 transition">

      {/* Cover Image */}
      {article.cover_image && (
        <img
          src={article.cover_image}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="p-5">

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {article.tag_list.map(tag => (
            <span
              key={tag}
              className="text-xs bg-[#0d1117] border border-gray-700 text-blue-400 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-3">
          {article.description}
        </p>

        {/* Author */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={article.user.profile_image_90}
            alt={article.user.name}
            className="w-8 h-8 rounded-full"
          />
          <div className="text-sm">
            <p className="text-gray-300 font-medium">
              {article.user.name}
            </p>
            <p className="text-gray-500 text-xs">
              {article.readable_publish_date} • {article.reading_time_minutes} min read
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm">

          <div className="flex gap-4 text-gray-400">
            <span className="flex items-center gap-1">
              <Heart size={14} />
              {article.public_reactions_count}
            </span>

            <span className="flex items-center gap-1">
              <MessageCircle size={14} />
              {article.comments_count}
            </span>
          </div>

          <a
            href={article.url}
            target="_blank"
            rel="noreferrer"
            className="text-blue-400 flex items-center gap-1 hover:underline"
          >
            Read <ExternalLink size={14} />
          </a>

        </div>
      </div>
    </div>
  )
}
