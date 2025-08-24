import { IconLogout } from "../../../assets/icons/icons";

export default function UserProfile({
  userName = "Usuario",
  userStatus = "activo",
  avatarSrc = null,
  avatarColor = "bg-amber-200",
  onLogout = () => {},
  showLogout = true,
  className = ""
}) {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map(word => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "activo":
      case "online":
        return "text-green-400";
      case "ausente":
      case "away":
        return "text-yellow-400";
      case "ocupado":
      case "busy":
        return "text-red-400";
      case "desconectado":
      case "offline":
        return "text-gray-400";
      default:
        return "text-gray-300";
    }
  };

  return (
    <div className={`flex gap-3 items-center text-white justify-between pt-2 border-t border-[#585870] ${className}`}>
      <div className="flex gap-3 items-center flex-1 min-w-0">
        {/* Avatar */}
        <div className={`min-w-[50px] h-[50px] rounded-full flex items-center justify-center ${avatarColor} overflow-hidden`}>
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={`Avatar de ${userName}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-black font-bold text-lg">
              {getInitials(userName)}
            </span>
          )}
        </div>

        {/* User info */}
        <div className="flex flex-col min-w-0 flex-1">
          <p className="font-semibold truncate" title={userName}>
            {userName}
          </p>
          <p className={`text-sm ${getStatusColor(userStatus)} capitalize`}>
            {userStatus}
          </p>
        </div>
      </div>

      {/* Logout button */}
      {showLogout && (
        <button
          onClick={onLogout}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
          title="Cerrar sesión"
        >
          <IconLogout className="group-hover:text-red-400 transition-colors" />
        </button>
      )}
    </div>
  );
}