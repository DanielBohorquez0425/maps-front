import defaultImg from "../../../assets/images/default_img.webp";

const SearchHistoryItem = ({ item, onSelect, index }) => (
  <button
    key={`${item.name}-${item.formatted_address}-${index}`}
    onClick={() => onSelect(item)}
    className="flex items-center gap-2 w-full text-left hover:bg-white/5 p-2 rounded-md transition-colors group cursor-pointer"
  >
    <div className="relative">
      <img
        src={item.photos || defaultImg}
        alt={item.name}
        className="w-10 h-10 rounded-md object-cover border border-[#585870] group-hover:border-[#4C46CC] transition-colors"
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      {item.rating && (
        <div className="absolute -top-1 -right-1 bg-[#4C46CC] text-white text-xs rounded-full px-1 py-0.5 text-[10px] font-semibold">
          {item.rating}
        </div>
      )}
    </div>
    <div className="flex flex-col flex-1 min-w-0">
      <span className="text-sm font-semibold truncate">{item.name}</span>
      <span className="text-xs text-gray-400 line-clamp-1">
        {item.formatted_address}
      </span>
      {item.types && (
        <span className="text-xs text-[#9A9AA5] capitalize">
          {item.types.toLowerCase().replaceAll("_", " ")}
        </span>
      )}
    </div>
  </button>
);

export default function SearchHistory({ 
  searchHistory = [], 
  onSelectPlace = () => {},
  title = "Últimas búsquedas",
  maxItems = 5,
  className = ""
}) {
  if (searchHistory.length === 0) return null;

  const displayItems = searchHistory.slice(0, maxItems);

  return (
    <div className={`flex flex-col gap-2 rounded-xl border border-[#585870] bg-[#1b1b24] p-3 text-white w-full ${className}`}>
      <div className="flex items-center justify-between">
        <p className="font-bold text-sm">{title}</p>
        {searchHistory.length > maxItems && (
          <span className="text-xs text-gray-400">
            +{searchHistory.length - maxItems} más
          </span>
        )}
      </div>
      <div className="flex flex-col gap-1">
        {displayItems.map((item, idx) => (
          <SearchHistoryItem
            key={`${item.name}-${item.formatted_address}-${idx}`}
            item={item}
            onSelect={onSelectPlace}
            index={idx}
          />
        ))}
      </div>
    </div>
  );
}